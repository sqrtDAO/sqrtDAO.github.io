"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import distributorAbi from "@/contracts/abi/DistributorV1.abi.json";
import type { Address } from "viem";
import type { Range } from "./useFactory";

export type EpochInfo = {
  userParticipationAmount: bigint;
  totalParticipationAmount: bigint;
  rewardAmount: bigint;
};

export type GetInfoResult = {
  distributionToken: Address;
  participationToken: Address;
  epochDuration: bigint;
  startingTimestamp: bigint;
  minParticipation: bigint;
  claimDelaySeconds: bigint;
  remainingRewards: bigint;
  epochs: readonly EpochInfo[];
};

export type DiscoverRewardsResult = {
  nextEpochToSearch: bigint;
  epochs: readonly bigint[];
};

// ── Read hooks ──────────────────────────────────────────────

export function useDistributorConstants(distributor: Address) {
  const config = { address: distributor, abi: distributorAbi } as const;

  const distributionToken = useReadContract({
    ...config,
    functionName: "DISTRIBUTION_TOKEN",
  });
  const participationToken = useReadContract({
    ...config,
    functionName: "PARTICIPATION_TOKEN",
  });
  const epochDuration = useReadContract({
    ...config,
    functionName: "EPOCH_DURATION",
  });
  const startingTimestamp = useReadContract({
    ...config,
    functionName: "STARTING_TIMESTAMP",
  });
  const minParticipation = useReadContract({
    ...config,
    functionName: "MIN_PARTICIPATION",
  });
  const claimDelaySeconds = useReadContract({
    ...config,
    functionName: "CLAIM_DELAY_SECONDS",
  });
  const protocolFeeBps = useReadContract({
    ...config,
    functionName: "PROTOCOL_FEE_BPS",
  });
  const protocolFeeReceiver = useReadContract({
    ...config,
    functionName: "PROTOCOL_FEE_RECEIVER",
  });
  const allowFutureEpochParticipation = useReadContract({
    ...config,
    functionName: "ALLOW_FUTURE_EPOCH_PARTICIPATION",
  });
  const allowlistSigner = useReadContract({
    ...config,
    functionName: "ALLOWLIST_SIGNER",
  });
  const allowlistDeadline = useReadContract({
    ...config,
    functionName: "ALLOWLIST_DEADLINE",
  });

  return {
    distributionToken,
    participationToken,
    epochDuration,
    startingTimestamp,
    minParticipation,
    claimDelaySeconds,
    protocolFeeBps,
    protocolFeeReceiver,
    allowFutureEpochParticipation,
    allowlistSigner,
    allowlistDeadline,
  };
}

export function useCurrentEpoch(distributor: Address) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "currentEpoch",
  });
}

export function useGetInfo(distributor: Address, user: Address, range: Range) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "getInfo",
    args: [user, range],
  });
}

export function useDiscoverRewards(
  distributor: Address,
  fromEpoch: bigint,
  numEpochs: bigint,
  user: Address,
  maxFound: bigint,
) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "discoverRewards",
    args: [fromEpoch, numEpochs, user, maxFound],
  });
}

export function useEpochUserParticipation(
  distributor: Address,
  epoch: bigint,
  user: Address,
) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "epochUserParticipation",
    args: [epoch, user],
  });
}

export function useEpochTotalParticipation(distributor: Address, epoch: bigint) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "epochTotalParticipation",
    args: [epoch],
  });
}

export function useRewardOf(distributor: Address, epoch: bigint) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "rewardOf",
    args: [epoch],
  });
}

export function useClaimFeeBps(distributor: Address, user: Address) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "claimFeeBps",
    args: [user],
  });
}

export function useNextDrainHookToCall(distributor: Address) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "nextDrainHookToCall",
  });
}

export function useDrainHook(distributor: Address) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "drainHook",
  });
}

export function useEmissionFunction(distributor: Address) {
  return useReadContract({
    address: distributor,
    abi: distributorAbi,
    functionName: "emissionFunction",
  });
}

// ── Write hooks ─────────────────────────────────────────────

export function useParticipate(distributor: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const participate = (
    amountPerEpoch: bigint,
    range: Range,
    recipient: Address,
    allowlistSignature: `0x${string}`,
  ) =>
    writeContract({
      address: distributor,
      abi: distributorAbi,
      functionName: "participate",
      args: [amountPerEpoch, range, recipient, allowlistSignature],
    });

  return {
    participate,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useClaim(distributor: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const claim = (range: Range) =>
    writeContract({
      address: distributor,
      abi: distributorAbi,
      functionName: "claim",
      args: [range],
    });

  return {
    claim,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useClaimFor(distributor: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const claimFor = (user: Address, range: Range) =>
    writeContract({
      address: distributor,
      abi: distributorAbi,
      functionName: "claimFor",
      args: [user, range],
    });

  return {
    claimFor,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useClaimMany(distributor: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const claimMany = (ranges: Range[]) =>
    writeContract({
      address: distributor,
      abi: distributorAbi,
      functionName: "claimMany",
      args: [ranges],
    });

  return {
    claimMany,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useCallDrainHook(distributor: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const callDrainHook = () =>
    writeContract({
      address: distributor,
      abi: distributorAbi,
      functionName: "callDrainHook",
    });

  return {
    callDrainHook,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useSetClaimFeeBps(distributor: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const setClaimFeeBps = (bps: bigint) =>
    writeContract({
      address: distributor,
      abi: distributorAbi,
      functionName: "setClaimFeeBps",
      args: [bps],
    });

  return {
    setClaimFeeBps,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
