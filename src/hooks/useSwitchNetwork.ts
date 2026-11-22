"use client";

import { useCallback } from "react";
import { useSwitchChain } from "wagmi";
import { showToast } from "@/hooks/useToast";
import { chainToName } from "@/utils/chain-utils";

/**
 * One place for every chain switch, so the toast copy and the error handling
 * are identical everywhere. Connectors already fall back to
 * `wallet_addEthereumChain` when the wallet doesn't know the chain yet.
 */
export const useSwitchNetwork = () => {
  const { switchChainAsync } = useSwitchChain();

  return useCallback(
    async (chainId: number) => {
      try {
        await switchChainAsync({ chainId });
        showToast("network.switched", { params: { chain: chainToName(chainId) } });
        return true;
      } catch {
        showToast("network.switchFailed");
        return false;
      }
    },
    [switchChainAsync],
  );
};
