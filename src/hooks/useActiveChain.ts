"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccount } from "wagmi";
import { ALL_MAINNET_CHAINS, DEFAULT_CHAIN } from "@/constants/ecosystems";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import { chainNameToId, chainToSlug, ecosystemOf, isLive } from "@/utils/chain-utils";

/** `?chain=` wins over the wallet — the URL is what the page shows. */
export const useActiveChainId = () => {
  const chainParam = useSearchParams().get("chain");
  const urlChainId = chainNameToId(chainParam);
  // The distribution list's "Show all" mode: all mainnet chains, regardless of
  // a testnet wallet. Header/ribbon/wizards treat it as the default mainnet.
  const showAll = chainParam === ALL_MAINNET_CHAINS;
  const { chainId: walletChainId } = useAccount();
  return {
    urlChainId,
    showAll,
    chainId: urlChainId ?? (showAll ? DEFAULT_CHAIN.id : walletChainId),
  };
};

/** Replaces `?chain=` on the current page, keeping other params. */
export const useSetChainParam = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  return (chainId: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("chain", chainToSlug(chainId));
    router.replace(`${pathname}?${params}`, { scroll: false });
  };
};

/** Ecosystem picker state for the launch / import screens. */
export const useSelectedChain = () => {
  const { chainId: active } = useActiveChainId();
  const activeEcosystem = ecosystemOf(active);
  const chainId = activeEcosystem && isLive(activeEcosystem) ? active! : DEFAULT_CHAIN.id;
  const { chainId: walletChainId } = useAccount();
  const switchTo = useSwitchNetwork();
  const setChainParam = useSetChainParam();

  // With a wallet connected, the page only moves once the wallet accepted the
  // switch — otherwise the picker claims a chain the wallet is not on and the
  // wizard's "Confirm" fails later. Disconnected users just pick the chain; the
  // connect modal requests it directly (see WalletModal `pageChainId`).
  const wrongChain = walletChainId !== undefined && walletChainId !== chainId;
  return {
    chainId,
    wrongChain,
    switchToSelected: () => switchTo(chainId),
    select: (id: number) => {
      if (walletChainId === undefined || walletChainId === id) {
        setChainParam(id);
        return;
      }
      void switchTo(id).then((result) => {
        if (result === "switched") setChainParam(id);
      });
    },
  };
};
