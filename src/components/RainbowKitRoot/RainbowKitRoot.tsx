"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, sepolia } from "wagmi/chains";
import { http } from "viem";
import { useState, type ReactNode } from "react";
import WalletToastWatcher from "@/components/WalletToastWatcher/WalletToastWatcher";
import "@rainbow-me/rainbowkit/styles.css";

// Base is the default network; Sepolia is selectable via the header network switch.
// Public RPCs rate-limit hard (the default base.org/sepolia RPCs especially), so
// default to publicnode and allow a dedicated RPC via env for heavier use.
const transports = {
  [base.id]: http(
    process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "https://base-rpc.publicnode.com",
  ),
  [sepolia.id]: http(
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ??
      "https://ethereum-sepolia-rpc.publicnode.com",
  ),
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
