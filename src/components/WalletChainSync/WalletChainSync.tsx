"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAccount, useSwitchChain } from "wagmi";
import { DEFAULT_CHAIN } from "@/constants/ecosystems";
import { chainNameToId, ecosystemOf, isLive } from "@/utils/chain-utils";

// MetaMask Connect always adds Ethereum mainnet to the permission request as a
// bootstrap fallback and, when reconnecting, prefers its cached chain — which can
// leave the wallet on a chain this app has no contracts on. Line it up with
// `?chain=` once per connection. Injected wallets get the same treatment.
//
// WalletConnect is skipped: a session can only use the chains the wallet granted,
// so asking for another one is rejected before it reaches the wallet.
const WalletChainSync = () => {
  const pathname = usePathname();
  const { isConnected, chainId, connector } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const attempted = useRef<string | null>(null);

  useEffect(() => {
    if (!isConnected || chainId === undefined || !connector) return;
    if (connector.type === "walletConnect") return;

    const urlChainId = chainNameToId(new URLSearchParams(window.location.search).get("chain"));
    const ecosystem = ecosystemOf(chainId);
    const supported = Boolean(ecosystem && isLive(ecosystem));
    const target = urlChainId ?? (supported ? undefined : DEFAULT_CHAIN.id);
    if (target === undefined || target === chainId) return;

    const key = `${connector.id}:${chainId}->${target}`;
    if (attempted.current === key) return;
    attempted.current = key;
    switchChainAsync({ chainId: target }).catch(() => {});
  }, [pathname, isConnected, chainId, connector, switchChainAsync]);

  return null;
};

export default WalletChainSync;
