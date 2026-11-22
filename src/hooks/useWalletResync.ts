"use client";

import { useEffect } from "react";
import { useAccount } from "wagmi";
import { applyWalletState, readAccounts, readChainId } from "@/lib/wallet/chain-sync";
import { debugLog } from "@/lib/wallet/debug";

/**
 * The wallet answers while the tab is in the background. HyperOS/Chrome freeze
 * the page a few seconds after it loses the screen, so those replies either land
 * late or never reach wagmi — which is why "I switched in the wallet but the app
 * still says Base". On every resume, ask the wallet what it actually reports and
 * fold that back into wagmi.
 */
export const useWalletResync = () => {
  const { isConnected, chainId, connector, address } = useAccount();

  useEffect(() => {
    if (!isConnected || !connector) return;

    const sync = async () => {
      if (document.visibilityState !== "visible") return;

      const [actualChain, accounts] = await Promise.all([
        readChainId(connector),
        readAccounts(connector),
      ]);
      debugLog("resync", {
        wagmiChain: chainId,
        walletChain: actualChain,
        wagmiAccount: address,
        walletAccount: accounts?.[0],
      });

      applyWalletState(connector, {
        chainId: actualChain !== undefined && actualChain !== chainId ? actualChain : undefined,
        accounts: accounts && accounts[0] !== address ? accounts : undefined,
      });
    };

    // `visibilitychange` is the one that fires when the app switcher returns to
    // Chrome; `focus` covers the desktop window / tab switching case.
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, [isConnected, connector, chainId, address]);
};
