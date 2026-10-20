"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAccount, useAccountEffect, useSwitchChain } from "wagmi";
import { ALL_MAINNET_CHAINS, DEFAULT_CHAIN } from "@/constants/ecosystems";
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
  const { urlChainId, chainId: active } = useActiveChainId();
  const activeEcosystem = ecosystemOf(active);
  const chainId = activeEcosystem && isLive(activeEcosystem) ? active! : DEFAULT_CHAIN.id;
  const { chainId: walletChainId } = useAccount();
  const { switchChain } = useSwitchChain();
  const setChainParam = useSetChainParam();

  // Picked before connecting → move the wallet over once it connects.
  useAccountEffect({
    onConnect: ({ chainId: connected }) => {
      if (urlChainId && connected !== urlChainId) switchChain({ chainId: urlChainId });
    },
  });

  const wrongChain = walletChainId !== undefined && walletChainId !== chainId;
  return {
    chainId,
    wrongChain,
    switchToSelected: () => switchChain({ chainId }),
    select: (id: number) => {
      setChainParam(id);
      if (walletChainId !== undefined && walletChainId !== id) switchChain({ chainId: id });
    },
  };
};
