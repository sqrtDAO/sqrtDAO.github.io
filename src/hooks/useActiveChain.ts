"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { ALL_MAINNET_CHAINS, DEFAULT_CHAIN } from "@/constants/ecosystems";
import { showToast } from "@/hooks/useToast";
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
  const { switchChainAsync } = useSwitchChain();
  const setChainParam = useSetChainParam();

  // MetaMask Connect and injected wallets switch without leaving the page. A
  // WalletConnect session can only move between the chains the wallet granted at
  // pairing, so if that request is refused the user has to switch in the wallet.
  const switchTo = async (id: number) => {
    try {
      await switchChainAsync({ chainId: id });
    } catch {
      showToast("network.switchFailed");
    }
  };

  // Line the wallet up with `?chain=` after connecting (see WalletChainSync).

  const wrongChain = walletChainId !== undefined && walletChainId !== chainId;
  return {
    chainId,
    wrongChain,
    switchToSelected: () => switchTo(chainId),
    select: (id: number) => {
      setChainParam(id);
      if (walletChainId !== undefined && walletChainId !== id) void switchTo(id);
    },
  };
};
