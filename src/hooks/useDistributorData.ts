import { zeroAddress, type Address } from "viem";
import {
  getDistributorV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import {
  MAX_RENDERED_EPOCHS,
  MIN_GRID_CAPACITY,
} from "@/lib/charts/blockLayout";
import { showToast } from "@/hooks/useToast";

export type DistributionState = "waiting" | "running" | "ended";

export type DistributorContractInfo = {
  distributionToken: Address;
  participationToken: Address;
  epochDuration: bigint;
  startingTimestamp: bigint;
  minParticipation: bigint;
  claimDelaySeconds: bigint;
  totalParticipation: bigint;
  remainingRewards: bigint;
  numberOfEpochs: bigint;
  totalDistributionAmount: bigint;
  creator: Address;
  shares: readonly {
    readonly shareBps: bigint;
    readonly hook: {
      readonly contractAddress: Address;
      readonly callData: `0x${string}`;
    };
  }[];
  totalUniqueParticipants: bigint;
};

export type EpochInfo = {
  userParticipationAmount: bigint;
  totalParticipationAmount: bigint;
  uniqueParticipants: bigint;
  claimed: boolean;
  rewardAmount: bigint;
};

// max epochs fetched per RPC call when scanning a full distribution
const CHUNK_SIZE = 2000n;
// chunks fetched in parallel per scan round
const CHUNK_BATCH = 10n;
// max epochs kept for the UI — the block chart renders at most
// MAX_RENDERED_EPOCHS blocks (desktop 135×5), everything older is cut
const UI_EPOCH_LIMIT = BigInt(MAX_RENDERED_EPOCHS);
// history kept behind the current epoch: it stays inside the last
// MIN_GRID_CAPACITY blocks so it remains visible on the smallest grid
const PAST_EPOCHS = UI_EPOCH_LIMIT - BigInt(MIN_GRID_CAPACITY);

export function useDistributorData(contractAddress: Address) {
  const publicClient = usePublicClient();
  const { address } = useAccount();

  const [contractInfo, setContractInfo] = useState<
    DistributorContractInfo | undefined
  >(undefined);
  const [currentEpoch, setCurrentEpoch] = useState<bigint | undefined>(
    undefined,
  );

  const [tokenName, setTokenName] = useState<string | undefined>(undefined);
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined);
  const [tokenDecimals, setTokenDecimals] = useState<number | undefined>(
    undefined,
  );
  const [participationTokenSymbol, setParticipationTokenSymbol] = useState<
    string | undefined
  >(undefined);
  const [participationTokenDecimals, setParticipationTokenDecimals] = useState<
    number | undefined
  >(undefined);

  const [epochs, setEpochs] = useState<readonly EpochInfo[] | undefined>(
    undefined,
  );
  const [epochsFrom, setEpochsFrom] = useState<bigint>(0n);

  const [claimData, setClaimData] = useState<ClaimData | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [distributionState, setDistributionState] = useState<
    DistributionState | undefined
  >(undefined);
  const [fetchKey, setFetchKey] = useState(0);
  const claimTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!publicClient) return;
      setIsLoading(true);
      try {
        const distributor = getDistributorV1Contract(
          publicClient,
          contractAddress,
        );
        const info = await distributor.read.getContractInfo();
        if (cancelled) return;
        setContractInfo(info);
        const now = BigInt(Math.floor(Date.now() / 1000));
        const currentEpoch =
          (now - info.startingTimestamp) / info.epochDuration;
        setCurrentEpoch(currentEpoch);

        setDistributionState(
          now < info.startingTimestamp
            ? "waiting"
            : currentEpoch >= info.numberOfEpochs
              ? "ended"
              : "running",
        );

        const token = getTokenV1Contract(publicClient, info.distributionToken);
        setTokenName(await token.read.name());
        setTokenSymbol(await token.read.symbol());
        setTokenDecimals(await token.read.decimals());

        const pToken = getTokenV1Contract(
          publicClient,
          info.participationToken,
        );
        setParticipationTokenSymbol(await pToken.read.symbol());
        setParticipationTokenDecimals(await pToken.read.decimals());
        if (cancelled) return;

        // currentEpoch keeps growing after the distribution ends, so the
        // window must be clamped to the real epochs or claims get skipped
        const total = info.numberOfEpochs;
        let fromEpoch: bigint;
        let windowEnd: bigint;
        if (total <= UI_EPOCH_LIMIT || currentEpoch >= total) {
          // everything fits the grid, or the distribution ended — scan
          // every epoch for unclaimed rewards
          fromEpoch = 0n;
          windowEnd = total;
        } else {
          // running/waiting: fill the block-chart grid around the current
          // epoch — PAST_EPOCHS of history, the rest current + future
          fromEpoch =
            currentEpoch > PAST_EPOCHS ? currentEpoch - PAST_EPOCHS : 0n;
          windowEnd = fromEpoch + UI_EPOCH_LIMIT;
          if (windowEnd > total) {
            // fewer future epochs remain — keep the grid full by reaching
            // further back into history instead
            windowEnd = total;
            fromEpoch = windowEnd - UI_EPOCH_LIMIT;
          }
        }

        // claim accumulators — a full scan spans many chunks, and ranges
        // must merge across chunk boundaries, so chunks process in order
        const ranges: Range[] = [];
        let currentRange: Range | null = null;
        let userRewardSum = ZERO_N;
        let nextClaimableAt: bigint | null = null;

        const processEpochs = (
          chunkFrom: bigint,
          chunkInfos: readonly EpochInfo[],
        ) => {
          for (let i = 0; i < chunkInfos.length; i++) {
            const epoch = chunkInfos[i];
            const epochIndex = chunkFrom + BigInt(i);

            const claimableAt =
              info.startingTimestamp +
              (epochIndex + 1n) * info.epochDuration +
              info.claimDelaySeconds;

            const isClaimable =
              !epoch.claimed &&
              epoch.rewardAmount > ZERO_N &&
              epoch.userParticipationAmount > ZERO_N &&
              now >= claimableAt;

            if (isClaimable) {
              currentRange = {
                from: currentRange === null ? epochIndex : currentRange.from,
                to: epochIndex,
              };
              userRewardSum +=
                (epoch.userParticipationAmount * epoch.rewardAmount) /
                epoch.totalParticipationAmount;
            } else {
              if (currentRange !== null) {
                ranges.push(currentRange);
                currentRange = null;
              }
              if (
                !epoch.claimed &&
                epoch.rewardAmount > ZERO_N &&
                epoch.userParticipationAmount > ZERO_N &&
                (nextClaimableAt === null || claimableAt < nextClaimableAt)
              ) {
                nextClaimableAt = claimableAt;
              }
            }
          }
        };

        const finalizeClaims = () => {
          if (currentRange !== null) {
            ranges.push(currentRange);
            currentRange = null;
          }
          setClaimData({
            ranges,
            claimableAmount: userRewardSum,
          });

          // refetch when the next claim window opens so the UI updates itself
          if (claimTimerRef.current) clearTimeout(claimTimerRef.current);
          if (nextClaimableAt !== null) {
            const delay = Number(nextClaimableAt) * 1000 - Date.now();
            if (delay > 0) {
              claimTimerRef.current = setTimeout(
                refetch,
                Math.min(delay, 2147483647),
              );
            }
          }
        };

        // the UI renders a bounded recent slice regardless of scan size
        const setUiEpochs = (infos: readonly EpochInfo[], from: bigint) => {
          const len = BigInt(infos.length);
          if (len > UI_EPOCH_LIMIT) {
            setEpochs(infos.slice(Number(len - UI_EPOCH_LIMIT)));
            setEpochsFrom(from + len - UI_EPOCH_LIMIT);
          } else {
            setEpochs(infos);
            setEpochsFrom(from);
          }
        };

        const length = windowEnd - fromEpoch;
        if (length <= CHUNK_SIZE) {
          const epochInfos =
            length > ZERO_N
              ? await distributor.read.getEpochInfo([
                  address ?? zeroAddress,
                  { from: fromEpoch, length },
                ])
              : [];
          if (cancelled) return;
          processEpochs(fromEpoch, epochInfos);
          setUiEpochs(epochInfos, fromEpoch);
          finalizeClaims();
        } else {
          // huge distribution (ended): paint the recent window immediately,
          // then scan everything in chunked batches for unclaimed rewards
          const uiFrom = windowEnd - UI_EPOCH_LIMIT;
          const uiInfos = await distributor.read.getEpochInfo([
            address ?? zeroAddress,
            { from: uiFrom, length: windowEnd - uiFrom },
          ]);
          if (cancelled) return;
          setUiEpochs(uiInfos, uiFrom);
          setIsLoading(false);

          const batchStep = CHUNK_SIZE * CHUNK_BATCH;
          for (
            let batchFrom = fromEpoch;
            batchFrom < windowEnd;
            batchFrom += batchStep
          ) {
            const batchEnd =
              batchFrom + batchStep < windowEnd
                ? batchFrom + batchStep
                : windowEnd;
            const reads: Promise<readonly EpochInfo[]>[] = [];
            for (let c = batchFrom; c < batchEnd; c += CHUNK_SIZE) {
              reads.push(
                distributor.read.getEpochInfo([
                  address ?? zeroAddress,
                  {
                    from: c,
                    length:
                      batchEnd - c < CHUNK_SIZE ? batchEnd - c : CHUNK_SIZE,
                  },
                ]),
              );
            }
            const results = await Promise.all(reads);
            if (cancelled) return;
            let c = batchFrom;
            for (const chunkInfos of results) {
              processEpochs(c, chunkInfos);
              c += BigInt(chunkInfos.length);
            }
          }
          if (cancelled) return;
          finalizeClaims();
        }
      } catch (e) {
        setError("Error while loading on-chain data");
        console.error(e);
        showToast("data.loadFailed", {
          id: `distributor-data-${contractAddress}`,
          action: { label: "Retry", onClick: refetch },
        });
      }
      setIsLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [contractAddress, publicClient, fetchKey, address, refetch]);

  return {
    state: distributionState,
    contractInfo: contractInfo as DistributorContractInfo | undefined,
    currentEpoch: currentEpoch as bigint | undefined,
    epochsInfo: epochs,
    epochsFrom,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    claimData,
    participationTokenSymbol,
    participationTokenDecimals,
    isLoading,
    error,
    refetch,
  };
}

export type ClaimData = {
  ranges: Range[];
  claimableAmount: bigint;
};

export type Range = {
  from: bigint;
  to: bigint;
};

const ZERO_N = BigInt(0);

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function () {
  return this.toString();
};
