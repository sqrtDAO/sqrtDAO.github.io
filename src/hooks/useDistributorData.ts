import { zeroAddress, type Address } from "viem";
import {
  getDistributorV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { useCallback, useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";

export type DistributionState = "waiting" | "running" | "ended";

export type DistributorContractInfo = {
  distributionToken: Address;
  participationToken: Address;
  epochDuration: bigint;
  startingTimestamp: bigint;
  minParticipation: bigint;
  claimDelaySeconds: bigint;
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
  const [currentEpoch, setCurrentEpoch] = useState<number | undefined>(
    undefined,
  );

  const [tokenName, setTokenName] = useState<string | undefined>(undefined);
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined);
  const [participationTokenSymbol, setParticipationTokenSymbol] = useState<
    string | undefined
  >(undefined);
  const [participationTokenDecimals, setParticipationTokenDecimals] = useState<
    number | undefined
  >(undefined);

  const [epochs, setEpochs] = useState<readonly EpochInfo[] | undefined>(
    undefined,
  );

  const [claimData, setClaimData] = useState<ClaimData | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);
  const [distributionState, setDistributionState] = useState<
    DistributionState | undefined
  >(undefined);
  const [fetchKey, setFetchKey] = useState(0);

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
        const currentEpoch = Math.floor(
          (Date.now() / 1000 - Number(info.startingTimestamp)) /
            Number(info.epochDuration),
        );
        setCurrentEpoch(currentEpoch);

        setDistributionState(
          currentEpoch < 0
            ? "waiting"
            : currentEpoch > info.numberOfEpochs
              ? "ended"
              : "running",
        );

        const token = getTokenV1Contract(publicClient, info.distributionToken);
        setTokenName(await token.read.name());
        setTokenSymbol(await token.read.symbol());

        const pToken = getTokenV1Contract(
          publicClient,
          info.participationToken,
        );
        setParticipationTokenSymbol(await pToken.read.symbol());
        setParticipationTokenDecimals(await pToken.read.decimals());

        const fromEpoch = currentEpoch < 100 ? 0 : currentEpoch - 100;
        const epochInfos = await distributor.read.getEpochInfo([
          address ?? zeroAddress,
          {
            from: BigInt(fromEpoch),
            length: BigInt(currentEpoch + 100),
          },
        ]);
        console.log("epochInfos", epochInfos);
        setEpochs(epochInfos);

        const ranges: Range[] = [];
        let currentRange: Range | null = null;
        let userRewardSum = BigInt(0);

        for (let i = 0; i < epochInfos.length; i++) {
          const epoch = epochInfos[i];
          const epochIndex = fromEpoch + i;

          const isClaimable =
            !epoch.claimed &&
            epoch.rewardAmount > ZERO_N &&
            epoch.userParticipationAmount > ZERO_N &&
            epochIndex < currentEpoch;

          if (isClaimable) {
            if (currentRange === null) {
              currentRange = {
                from: BigInt(epochIndex),
                to: BigInt(epochIndex),
              };
            } else {
              currentRange = {
                from: currentRange.from,
                to: BigInt(epochIndex),
              };
            }
            userRewardSum +=
              (epoch.userParticipationAmount * epoch.rewardAmount) /
              epoch.totalParticipationAmount;
          } else if (currentRange !== null) {
            ranges.push(currentRange);
            currentRange = null;
          }
        }

        if (currentRange !== null) ranges.push(currentRange);

        console.log("claim data:", { ranges, userRewardSum });
        setClaimData({
          ranges,
          claimableAmount: userRewardSum,
        });
      } catch (e) {
        setError("Error while loading on-chain data");
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, [contractAddress, publicClient, fetchKey, address]);

  return {
    state: distributionState,
    contractInfo: contractInfo as DistributorContractInfo | undefined,
    currentEpoch: currentEpoch as number | undefined,
    epochsInfo: epochs,
    tokenName,
    tokenSymbol,
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
