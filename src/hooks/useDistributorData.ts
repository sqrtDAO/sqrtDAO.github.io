import { zeroAddress, type Address } from "viem";
import {
  getDistributorV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
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
    (async () => {
      if (!publicClient) return;
      setIsLoading(true);
      try {
        const distributor = getDistributorV1Contract(
          publicClient,
          contractAddress,
        );
        const info = await distributor.read.getContractInfo();
        setContractInfo(info);
        const now = BigInt(Math.floor(Date.now() / 1000));
        const currentEpoch =
          (now - info.startingTimestamp) /
          info.epochDuration;
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

        // currentEpoch keeps growing after the distribution ends, so the
        // window must be clamped to the real epochs or claims get skipped
        const total = info.numberOfEpochs;
        const lastClosed =
          currentEpoch < 0n
            ? -1n
            : currentEpoch < total
              ? currentEpoch
              : total - 1n;
        // future epochs can hold participation (multi-epoch participate),
        // so the window extends past the current epoch — clamped to the
        // real epoch count
        const windowEnd = lastClosed + 101n < total ? lastClosed + 101n : total;
        // once ended, scan all epochs for unclaimed rewards; while running
        // only the recent window can be claimable, so cap it for performance
        const fromEpoch =
          currentEpoch >= total
            ? 0n
            : lastClosed + 1n > 100n
              ? lastClosed + 1n - 100n
              : 0n;
        const epochInfos =
          windowEnd > fromEpoch
            ? await distributor.read.getEpochInfo([
                address ?? zeroAddress,
                {
                  from: fromEpoch,
                  length: windowEnd - fromEpoch,
                },
              ])
            : [];
        setEpochs(epochInfos);
        setEpochsFrom(fromEpoch);

        const ranges: Range[] = [];
        let currentRange: Range | null = null;
        let userRewardSum = BigInt(0);
        let nextClaimableAt: bigint | null = null;

        for (let i = 0; i < epochInfos.length; i++) {
          const epoch = epochInfos[i];
          const epochIndex = fromEpoch + BigInt(i);

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
            if (currentRange === null) {
              currentRange = {
                from: epochIndex,
                to: epochIndex,
              };
            } else {
              currentRange = {
                from: currentRange.from,
                to: epochIndex,
              };
            }
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

        if (currentRange !== null) ranges.push(currentRange);

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
