"use client";

import {
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  type BaseError,
} from "wagmi";
import type { Address } from "viem";

const erc20Abi = [
  { type: "function", name: "name", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "symbol", inputs: [], outputs: [{ type: "string" }], stateMutability: "view" },
  { type: "function", name: "decimals", inputs: [], outputs: [{ type: "uint8" }], stateMutability: "view" },
  { type: "function", name: "totalSupply", inputs: [], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "balanceOf", inputs: [{ type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "allowance", inputs: [{ type: "address" }, { type: "address" }], outputs: [{ type: "uint256" }], stateMutability: "view" },
  { type: "function", name: "approve", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
  { type: "function", name: "transfer", inputs: [{ type: "address" }, { type: "uint256" }], outputs: [{ type: "bool" }], stateMutability: "nonpayable" },
] as const;

export function useTokenInfo(token: Address) {
  const name = useReadContract({ address: token, abi: erc20Abi, functionName: "name" });
  const symbol = useReadContract({ address: token, abi: erc20Abi, functionName: "symbol" });
  const decimals = useReadContract({ address: token, abi: erc20Abi, functionName: "decimals" });
  const totalSupply = useReadContract({ address: token, abi: erc20Abi, functionName: "totalSupply" });

  return {
    name: name.data as string | undefined,
    symbol: symbol.data as string | undefined,
    decimals: decimals.data as number | undefined,
    totalSupply: totalSupply.data as bigint | undefined,
    isLoading: name.isLoading || symbol.isLoading || decimals.isLoading,
  };
}

export function useTokenBalance(token: Address, account: Address) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [account],
  });
}

export function useTokenAllowance(token: Address, owner: Address, spender: Address) {
  return useReadContract({
    address: token,
    abi: erc20Abi,
    functionName: "allowance",
    args: [owner, spender],
  });
}

export function useApprove(token: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const approve = (spender: Address, amount: bigint) =>
    writeContract({
      address: token,
      abi: erc20Abi,
      functionName: "approve",
      args: [spender, amount],
    });

  return {
    approve,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}

export function useTransfer(token: Address) {
  const { writeContract, data: hash, error, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({ hash });

  const transfer = (to: Address, amount: bigint) =>
    writeContract({
      address: token,
      abi: erc20Abi,
      functionName: "transfer",
      args: [to, amount],
    });

  return {
    transfer,
    hash,
    error: error as BaseError | null,
    isPending,
    isConfirming,
    isConfirmed,
  };
}
