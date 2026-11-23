"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount } from "wagmi";
import { applyWalletState, readAccounts, readChainId } from "@/lib/wallet/chain-sync";
import { debugLog } from "@/lib/wallet/debug";
import { chainNameToId, chainToSlug, ecosystemOf } from "@/utils/chain-utils";

/**
 * The wallet answers while the tab is in the background. HyperOS/Chrome freeze
 * the page a few seconds after it loses the screen, so those replies either land
 * late or never reach wagmi — which is why "I switched in the wallet but the app
 * still says Base". On every resume, ask the wallet what it actually reports and
 * fold that back into wagmi (and into `?chain=`, which is what the pages read).
 */
export const useWalletResync = () => {
  const { isConnected, chainId, connector, address } = useAccount();
  const router = useRouter();
  const pathname = usePathname();

  // Keep the page on the same chain as the wallet. `?chain=all` (the list's
  // "show every mainnet" filter) is a view setting, not a chain — leave it alone.
  const followWallet = useCallback(
    (walletChainId: number) => {
      if (typeof window === "undefined" || !ecosystemOf(walletChainId)) return;

      const params = new URLSearchParams(window.location.search);
      const current = params.get("chain");
      const currentIsChain = current === null || chainNameToId(current) !== undefined;
      const slug = chainToSlug(walletChainId);
      if (!currentIsChain || current === slug) return;

      params.set("chain", slug);
      debugLog("resync:url", slug);
      router.replace(`${pathname}?${params}`, { scroll: false });
    },
    [pathname, router],
  );

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

      const chainChanged = actualChain !== undefined && actualChain !== chainId;
      applyWalletState(connector, {
        chainId: chainChanged ? actualChain : undefined,
        accounts: accounts && accounts[0] !== address ? accounts : undefined,
      });

      if (actualChain !== undefined) followWallet(actualChain);
    };

    // `visibilitychange` is the one that fires when the app switcher returns to
    // Chrome; `focus` covers the desktop window / tab switching case.
    document.addEventListener("visibilitychange", sync);
    window.addEventListener("focus", sync);
    return () => {
      document.removeEventListener("visibilitychange", sync);
      window.removeEventListener("focus", sync);
    };
  }, [isConnected, connector, chainId, address, followWallet]);
};
