"use client";

import {
  useReadContract,
  useWriteContract,
  useAccount,
  useChainId,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import { getAddresses } from "@/contracts/contract-addresses";
import factoryAbi from "@/contracts/abi/FactoryV1.abi.json";
import type { Address } from "viem";

export type DistributorConfig = {
  distributionToken: Address;
  participationToken: Address;
  epochDuration: bigint;
  startTimestamp: bigint;
  protocolFeeBps: bigint;
  protocolFeeReceiver: Address;
  minParticipation: bigint;
  claimDelaySeconds: bigint;
  allowFutureEpochParticipation: boolean;
  drainHookOnlyPassedEpochs: boolean;
  drainHook: { contractAddress: Address; callData: `0x${string}` };
  emissionFunction: { emissionContract: Address; curveConfig: `0x${string}` };
  allowlistSigner: Address;
  allowlistDeadline: bigint;
};

export type Range = { from: bigint; length: bigint };

export function useFactoryAddress() {
  const chainId = useChainId();
  return getAddresses(chainId).factory;
}

export function useOwner() {
  const factory = useFactoryAddress();
  return useReadContract({
    address: factory,
    abi: factoryAbi,
    functionName: "owner",
  });
}

export function useIsOwner() {
  const { address } = useAccount();
  const { data: owner } = useOwner();
  if (!address || !owner) return false;
  return address.toLowerCase() === (owner as Address).toLowerCase();
}

export function useCreateDistributor() {
  const factory = useFactoryAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const createDistributor = (
    config: DistributorConfig,
    participationAmountPerEpoch: bigint,
    participationRange: Range,
  ) =>
    writeContract({
      address: factory,
      abi: factoryAbi,
      functionName: "createDistributor",
      args: [config, participationAmountPerEpoch, participationRange],
    });

  return {
    createDistributor,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useSetProtocolFeeBps() {
  const factory = useFactoryAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const setFeeBps = (bps: bigint) =>
    writeContract({
      address: factory,
      abi: factoryAbi,
      functionName: "setProtocolFeeBps",
      args: [bps],
    });

  return { setFeeBps, hash, error: error as BaseError | null, isPending, isConfirming, isConfirmed };
}

export function useSetProtocolFeeReceiver() {
  const factory = useFactoryAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const setFeeReceiver = (receiver: Address) =>
    writeContract({
      address: factory,
      abi: factoryAbi,
      functionName: "setProtocolFeeReceiver",
      args: [receiver],
    });

  return { setFeeReceiver, hash, error: error as BaseError | null, isPending, isConfirming, isConfirmed };
}

export function useTransferOwnership() {
  const factory = useFactoryAddress();
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const transferOwnership = (newOwner: Address) =>
    writeContract({
      address: factory,
      abi: factoryAbi,
      functionName: "transferOwnership",
      args: [newOwner],
    });

  return { transferOwnership, hash, error: error as BaseError | null, isPending, isConfirming, isConfirmed };
}
