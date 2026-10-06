"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, sepolia } from "wagmi/chains";
import { fallback, http, type Transport } from "viem";
import { useState, type ReactNode } from "react";
import WalletToastWatcher from "@/components/WalletToastWatcher/WalletToastWatcher";
import "@rainbow-me/rainbowkit/styles.css";

// Base is the default network; Sepolia is selectable via the header network switch.
//
// Public RPCs rate-limit or reject specific calls — e.g. publicnode's free tier
// answers `eth_getTransactionReceipt` with "archive requests require a personal
// token", which made a *successful* token launch look like it failed. Use a
// `fallback` transport so one provider failing falls through to the next instead
// of breaking reads or dropping an already-mined transaction. A dedicated RPC
// can still be supplied via env and is tried first.
const buildTransport = (dedicated: string | undefined, defaults: string[]): Transport =>
  fallback(
    [dedicated, ...defaults]
      .filter((url): url is string => Boolean(url))
      .map((url) => http(url, { retryCount: 2 })),
    {
      // keep our order (dedicated first) rather than latency-ranking the public RPCs
      rank: false,
      retryCount: 2,
      // always try the next provider rather than surfacing a single provider's error
      shouldThrow: () => false,
    },
  );

const transports = {
  [base.id]: buildTransport(process.env.NEXT_PUBLIC_BASE_RPC_URL, [
    "https://mainnet.base.org",
    "https://base.llamarpc.com",
    "https://base-rpc.publicnode.com",
    "https://base.drpc.org",
  ]),
  [sepolia.id]: buildTransport(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL, [
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://sepolia.drpc.org",
    "https://rpc.sepolia.org",
  ]),
};

const config = getDefaultConfig({
  appName: "sqrtDAO",
  projectId: "af0315795cabd9f168cf79b92e96863a",
  chains: [base, sepolia],
  transports,
  ssr: true,
});

export default function RainbowKitRoot({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#6366f1",
            borderRadius: "medium",
          })}
          modalSize="compact"
        >
          <WalletToastWatcher />
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
