import { usePublicClient } from "wagmi";
import { useCallback, useEffect, useState, useRef } from "react";
import { formatUnits, zeroAddress, type Address } from "viem";
import { getDistributionV1FactoryContract } from "@/contracts/contracts";
import {
  distributionV1FactoryAbi,
  distributorV1Abi,
  tokenV1Abi,
  tokenV1FactoryAbi,
} from "@/contracts/abis";
import { getAddresses } from "@/contracts/contract-addresses";
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

type UseDistributionsParams = {
  page: number;
  pageSize: number;
  chainId?: number;
};

export function useDistributions({
  page,
  pageSize,
  chainId,
}: UseDistributionsParams) {
  const publicClient = usePublicClient(chainId ? { chainId } : undefined);

  const [distributions, setDistributions] = useState<Distribution[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  const hasNewDistribution = useRef(false);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    (async () => {
      if (!publicClient) return;
      setIsLoading(true);
      setError(undefined);
      try {
        const chain = chainId ?? publicClient.chain.id;
        const tokenFactory = getAddresses(chain).tokenFactory;
        const distributorFactory =
          getDistributionV1FactoryContract(publicClient);
        const length = Number(
          await distributorFactory.read.distributionListLength(),
        );
        setTotal(length);

        const offset = BigInt(Math.max(0, length - page * pageSize));
        const clampedSize = Math.min(pageSize, length - (page - 1) * pageSize);
        const items =
          length > 0 && clampedSize > 0
            ? [
                ...(await distributorFactory.read.getDistributionsInfo([
                  offset,
                  BigInt(clampedSize),
                ])),
              ].reverse()
            : [];

        const nowSec = Math.floor(Date.now() / 1000);
        // per row: name, symbol, tokenDecimals, participationSymbol,
        // participationDecimals, creatorOf, rewardOf(last), epochTotalParticipation(last)
        const metadata = await publicClient.multicall({
          contracts: items.flatMap((item) => {
            const currentEpoch = Math.floor(
              (nowSec - Number(item.info.startingTimestamp)) /
                Number(item.info.epochDuration),
            );
            const completed = getEpochsCompleted(
              currentEpoch,
              Number(item.info.numberOfEpochs),
            );
            const lastEpochIdx = BigInt(Math.max(0, completed - 1));
            return [
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
                address: item.info.distributionToken,
                abi: tokenV1Abi,
                functionName: "decimals" as const,
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
              {
                address: tokenFactory,
                abi: tokenV1FactoryAbi,
                functionName: "creatorOf" as const,
                args: [item.info.distributionToken] as const,
              },
              {
                address: item.addr,
                abi: distributorV1Abi,
                functionName: "rewardOf" as const,
                args: [lastEpochIdx] as const,
              },
              {
                address: item.addr,
                abi: distributorV1Abi,
                functionName: "epochTotalParticipation" as const,
                args: [lastEpochIdx] as const,
              },
            ];
          }),
        });

        const rows = items.map((item, i) => {
          const info = item.info;
          const m = metadata.slice(i * 8, i * 8 + 8);
          const currentEpoch = Math.floor(
            (nowSec - Number(info.startingTimestamp)) /
              Number(info.epochDuration),
          );
          const totalEpochs = Number(info.numberOfEpochs);
          const epochsCompleted = getEpochsCompleted(currentEpoch, totalEpochs);
          const tokenDecimals = Number(m[2]!.result) || 18;
          const participationTokenDecimals = Number(m[4]!.result) || 18;
          const native = (m[5]!.result as Address) !== zeroAddress;

          let lastClearPrice: number | null = null;
          if (epochsCompleted > 0) {
            const rewardHuman = Number(
              formatUnits(m[6]!.result as bigint, tokenDecimals),
            );
            const participationHuman = Number(
              formatUnits(m[7]!.result as bigint, participationTokenDecimals),
            );
            if (rewardHuman > 0 && participationHuman > 0) {
              lastClearPrice = rewardHuman / participationHuman;
            }
          }

          const startedAt = Number(info.startingTimestamp) * 1000;
          const finishedAt =
            (Number(info.startingTimestamp) +
              totalEpochs * Number(info.epochDuration)) *
            1000;

          return {
            address: item.addr,
            tokenAddress: info.distributionToken,
            tokenName: String(m[0]!.result),
            tokenSymbol: String(m[1]!.result),
            status: getStatus(currentEpoch, totalEpochs),
            totalParticipation: info.totalParticipation,
            participationTokenDecimals,
            participationTokenSymbol: String(m[3]!.result),
            startedAt,
            finishedAt,
            epochsCompleted,
            totalEpochs,
            native,
            lastClearPrice,
          } satisfies Distribution;
        });

        setDistributions(rows);
      } catch (e) {
        setError("Error while loading on-chain data");
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, [publicClient, fetchKey, page, pageSize, chainId]);

  useEffect(() => {
    if (!publicClient || !publicClient.chain) return;

    const unwatch = publicClient.watchContractEvent({
      address: getAddresses(publicClient.chain.id).distributorFactory,
      abi: distributionV1FactoryAbi,
      eventName: "NewDistributor",
      onLogs: () => {
        if (!hasNewDistribution.current) {
          hasNewDistribution.current = true;
          refetch();
        }
      },
    });

    return () => {
      unwatch();
      hasNewDistribution.current = false;
    };
  }, [refetch, publicClient]);

  return { distributions, isLoading, error, refetch, total, totalPages };
}
