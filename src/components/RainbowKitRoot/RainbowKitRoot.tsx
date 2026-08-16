"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
// import { sepolia } from "wagmi/chains";
import { useState, type ReactNode } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import { defineChain } from "viem";

const sepolia = /*#__PURE__*/ defineChain({
  id: 11_155_111,
  name: "Sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: {
      http: [
        // NOTE: there is no failover, viem only uses first one
        "https://sepolia.drpc.org",
        "https://sepolia.gateway.tenderly.co",
        "https://ethereum-sepolia-rpc.publicnode.com",
      ],
    },
  },
  blockExplorers: {
    default: {
      name: "Etherscan",
      url: "https://sepolia.etherscan.io",
      apiUrl: "https://api-sepolia.etherscan.io/api",
    },
  },
  contracts: {
    multicall3: {
      address: "0xca11bde05977b3631167028862be2a173976ca11",
      blockCreated: 751532,
    },
    ensUniversalResolver: {
      address: "0xeeeeeeee14d718c2b47d9923deab1335e144eeee",
      blockCreated: 8_928_790,
    },
  },
  testnet: true,
});

const config = getDefaultConfig({
  appName: "sqrtDAO",
  projectId: "af0315795cabd9f168cf79b92e96863a",
  chains: [sepolia],
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
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
