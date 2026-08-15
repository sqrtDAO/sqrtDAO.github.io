import { formatUnits } from "viem";
import { usePublicClient } from "wagmi";
import { useCallback, useEffect, useState } from "react";
import { getDistributionV1FactoryContract } from "@/contracts/contracts";
import { tokenV1Abi } from "@/contracts/abis";
import type {
  Distribution,
  DistributionStatus,
} from "@/lib/fixtures/distributions";

const getStatus = (
  currentEpoch: number,
  numberOfEpochs: number,
): DistributionStatus =>
  currentEpoch < 0
    ? "upcoming"
    : currentEpoch >= numberOfEpochs
      ? "ended"
      : "live";

const getEpochsCompleted = (currentEpoch: number, numberOfEpochs: number) =>
  Math.min(Math.max(currentEpoch, 0), numberOfEpochs);

export function useDistributions() {
  const publicClient = usePublicClient();

  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    (async () => {
      if (!publicClient) return;
      setIsLoading(true);
      setError(undefined);
      try {
        const distributorFactory = getDistributionV1FactoryContract(publicClient);
        const length = Number(await distributorFactory.read.distributionListLength());
        const items =
          length > 0
            ? await distributorFactory.read.getDistributionsInfo([0n, BigInt(length)])
            : [];

        const metadata = await publicClient.multicall({
          contracts: items.flatMap((item) => [
            {
              address: item.info.distributionToken,
              abi: tokenV1Abi,
              functionName: "name" as const,
            },
            {
              address: item.info.distributionToken,
              abi: tokenV1Abi,
              functionName: "symbol" as const,
            },
            {
              address: item.info.participationToken,
              abi: tokenV1Abi,
              functionName: "symbol" as const,
            },
            {
              address: item.info.participationToken,
              abi: tokenV1Abi,
              functionName: "decimals" as const,
            },
          ]),
        });

        const nowSec = Math.floor(Date.now() / 1000);
        const rows = items.map((item, i) => {
          const info = item.info;
          const metadataSlice = metadata.slice(i * 4, i * 4 + 4);
          const currentEpoch = Math.floor(
            (nowSec - Number(info.startingTimestamp)) /
              Number(info.epochDuration),
          );
          const totalEpochs = Number(info.numberOfEpochs);
          const startedAt = Number(info.startingTimestamp) * 1000;
          const finishedAt =
            (Number(info.startingTimestamp) +
              totalEpochs * Number(info.epochDuration)) *
            1000;

          return {
            address: item.addr,
            tokenName: String(metadataSlice[0]!.result),
            tokenSymbol: String(metadataSlice[1]!.result),
            status: getStatus(currentEpoch, totalEpochs),
            totalParticipation: Number(
              formatUnits(
                info.totalParticipation,
                Number(metadataSlice[3]!.result) || 18,
              ),
            ),
            participationTokenSymbol: String(metadataSlice[2]!.result),
            startedAt,
            finishedAt,
            epochsCompleted: getEpochsCompleted(currentEpoch, totalEpochs),
            totalEpochs,
          } satisfies Distribution;
        });

        setDistributions(rows);
      } catch (e) {
        setError("Error while loading on-chain data");
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, [publicClient, fetchKey]);

  return { distributions, isLoading, error, refetch };
}
