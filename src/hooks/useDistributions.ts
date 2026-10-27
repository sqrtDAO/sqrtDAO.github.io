import { useConfig } from "wagmi";
import { getPublicClient } from "wagmi/actions";
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
} from "@/lib/distributions";

export type ChainDistribution = Distribution & { chainId: number };

type Client = NonNullable<ReturnType<typeof getPublicClient>>;

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

const getCurrentEpoch = (
  info: { startingTimestamp: bigint; epochDuration: bigint },
  nowSec: number,
) =>
  Math.floor(
    (nowSec - Number(info.startingTimestamp)) / Number(info.epochDuration),
  );

const listChain = async (client: Client, chainId: number) => {
  const factory = getDistributionV1FactoryContract(client);
  const length = await factory.read.distributionListLength();
  const items =
    length > 0n ? await factory.read.getDistributionsInfo([0n, length]) : [];
  // newest first
  return [...items].reverse().map((item) => ({ ...item, chainId }));
};

type ListItem = Awaited<ReturnType<typeof listChain>>[number];

// per row: name, symbol, tokenDecimals, participationSymbol,
// participationDecimals, creatorOf, rewardOf(last), epochTotalParticipation(last)
const loadRows = async (
  client: Client,
  items: ListItem[],
  nowSec: number,
): Promise<ChainDistribution[]> => {
  if (items.length === 0) return [];
  const tokenFactory = getAddresses(client.chain.id).tokenFactory;
  const metadata = await client.multicall({
    contracts: items.flatMap((item) => {
      const completed = getEpochsCompleted(
        getCurrentEpoch(item.info, nowSec),
        Number(item.info.numberOfEpochs),
      );
      const lastEpochIdx = BigInt(Math.max(0, completed - 1));
      return [
        { address: item.info.distributionToken, abi: tokenV1Abi, functionName: "name" as const },
        { address: item.info.distributionToken, abi: tokenV1Abi, functionName: "symbol" as const },
        { address: item.info.distributionToken, abi: tokenV1Abi, functionName: "decimals" as const },
        { address: item.info.participationToken, abi: tokenV1Abi, functionName: "symbol" as const },
        { address: item.info.participationToken, abi: tokenV1Abi, functionName: "decimals" as const },
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

  return items.map((item, i) => {
    const info = item.info;
    const m = metadata.slice(i * 8, i * 8 + 8);
    const currentEpoch = getCurrentEpoch(info, nowSec);
    const totalEpochs = Number(info.numberOfEpochs);
    const epochsCompleted = getEpochsCompleted(currentEpoch, totalEpochs);
    const tokenDecimals =
      m[2]!.status === "success" ? Number(m[2]!.result) : 18;
    const participationTokenDecimals =
      m[4]!.status === "success" ? Number(m[4]!.result) : 18;
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
        lastClearPrice = participationHuman / rewardHuman;
      }
    }

    const startedAt = Number(info.startingTimestamp) * 1000;
    const finishedAt =
      (Number(info.startingTimestamp) +
        totalEpochs * Number(info.epochDuration)) *
      1000;

    return {
      chainId: item.chainId,
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
    };
  });
};

type UseDistributionsParams = {
  page: number;
  pageSize: number;
  /** One chain, or several merged newest-first ("Show all"). */
  chainIds: number[];
};

export function useDistributions({
  page,
  pageSize,
  chainIds,
}: UseDistributionsParams) {
  const config = useConfig();
  const chainKey = chainIds.join(",");

  const [distributions, setDistributions] = useState<ChainDistribution[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  const hasNewDistribution = useRef(false);
  const previousChainRef = useRef(chainKey);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  useEffect(() => {
    let active = true;
    const ids = chainKey.split(",").map(Number);
    if (previousChainRef.current !== chainKey) {
      previousChainRef.current = chainKey;
      setDistributions([]);
      setTotal(0);
    }
    (async () => {
      setIsLoading(true);
      setError(undefined);
      try {
        const clients = ids.map((chainId) => getPublicClient(config, { chainId })!);
        // ponytail: reads every distribution's info on each chain and pages
        // client-side; move to an indexer once lists reach thousands.
        const all = (
          await Promise.all(clients.map((c, i) => listChain(c, ids[i])))
        )
          .flat()
          .sort((a, b) =>
            Number(b.info.startingTimestamp - a.info.startingTimestamp),
          );
        if (active) setTotal(all.length);

        const pageItems = all.slice((page - 1) * pageSize, page * pageSize);
        const nowSec = Math.floor(Date.now() / 1000);
        const rows = (
          await Promise.all(
            clients.map((c, i) =>
              loadRows(
                c,
                pageItems.filter((item) => item.chainId === ids[i]),
                nowSec,
              ),
            ),
          )
        ).flat();
        // back to page order (addresses can repeat across chains)
        const key = (d: { chainId: number; addr?: string; address?: string }) =>
          `${d.chainId}:${d.addr ?? d.address}`;
        const byKey = new Map(rows.map((r) => [key(r), r]));

        if (!active) return;
        setDistributions(pageItems.map((item) => byKey.get(key(item))!));
      } catch (e) {
        if (!active) return;
        setError("Error while loading on-chain data");
        console.error(e);
      }
      if (!active) return;
      setIsLoading(false);
    })();
    return () => {
      active = false;
    };
  }, [config, fetchKey, page, pageSize, chainKey]);

  useEffect(() => {
    const unwatchAll = chainKey.split(",").map((id) => {
      const client = getPublicClient(config, { chainId: Number(id) })!;
      return client.watchContractEvent({
        address: getAddresses(client.chain.id).distributorFactory,
        abi: distributionV1FactoryAbi,
        eventName: "NewDistributor",
        onLogs: () => {
          if (!hasNewDistribution.current) {
            hasNewDistribution.current = true;
            refetch();
          }
        },
      });
    });

    return () => {
      unwatchAll.forEach((unwatch) => unwatch());
      hasNewDistribution.current = false;
    };
  }, [refetch, config, chainKey]);

  return { distributions, isLoading, error, refetch, total, totalPages };
}
