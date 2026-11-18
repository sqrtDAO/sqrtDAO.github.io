"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import type { AppKitNetwork } from "@reown/appkit/networks";
import { metaMask } from "@wagmi/connectors";
import { base, sepolia } from "wagmi/chains";
import { fallback, http, type Transport } from "viem";
import { useState, type ReactNode } from "react";
import WalletToastWatcher from "@/components/WalletToastWatcher/WalletToastWatcher";
import WalletModal from "@/components/WalletModal/WalletModal";
import WalletChainSync from "@/components/WalletChainSync/WalletChainSync";
import { robinhood } from "@/constants/ecosystems";
import { SITE_NAME, SITE_URL } from "@/constants/site";
import { chainNameToId } from "@/utils/chain-utils";

// Base is the default network; Sepolia and Robinhood are selectable via the header
// network switch.
//
// Public RPCs rate-limit or reject specific calls — e.g. publicnode's free tier
// answers `eth_getTransactionReceipt` with "archive requests require a personal
// token", which made a *successful* token launch look like it failed. Use a
// `fallback` transport so one provider failing falls through to the next instead
// of breaking reads or dropping an already-mined transaction. A dedicated RPC
// can still be supplied via env and is tried first.
const rpcUrls: Record<number, string[]> = {
  [base.id]: [
    process.env.NEXT_PUBLIC_BASE_RPC_URL ?? "",
    "https://mainnet.base.org",
    "https://base.llamarpc.com",
    "https://base-rpc.publicnode.com",
    "https://base.drpc.org",
  ].filter(Boolean),
  [sepolia.id]: [
    process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? "",
    "https://ethereum-sepolia-rpc.publicnode.com",
    "https://sepolia.drpc.org",
    "https://rpc.sepolia.org",
  ].filter(Boolean),
  [robinhood.id]: [
    process.env.NEXT_PUBLIC_ROBINHOOD_RPC_URL ?? "",
    "https://rpc.mainnet.chain.robinhood.com",
  ].filter(Boolean),
};

const buildTransport = (urls: string[]): Transport =>
  fallback(
    urls.map((url) => http(url, { retryCount: 2 })),
    {
      // keep our order (dedicated first) rather than latency-ranking the public RPCs
      rank: false,
      retryCount: 2,
      // always try the next provider rather than surfacing a single provider's error
      shouldThrow: () => false,
    },
  );

const transports: Record<number, Transport> = Object.fromEntries(
  Object.entries(rpcUrls).map(([id, urls]) => [Number(id), buildTransport(urls)]),
);

const projectId = "af0315795cabd9f168cf79b92e96863a";

// MetaMask Connect forwards `chain.rpcUrls.default.http[0]` to the wallet as the
// endpoint it should broadcast through, so viem's defaults (thirdweb for Sepolia)
// leak into the wallet. Point every chain at the same endpoints the app reads
// from — a slow default RPC is what makes the wallet's send time out.
const withOurRpc = (network: AppKitNetwork): AppKitNetwork => {
  const urls = rpcUrls[Number(network.id)];
  return urls?.length
    ? { ...network, rpcUrls: { ...network.rpcUrls, default: { http: urls } } }
    : network;
};

const allNetworks = [base, sepolia, robinhood].map(withOurRpc);

// WalletConnect warns when metadata.url differs from the page origin, so follow
// the origin actually serving the app (localhost during device testing).
const appUrl = typeof window === "undefined" ? SITE_URL : window.location.origin;

// `?chain=` is the source of truth for the page.
const networkFromUrl = () => {
  if (typeof window === "undefined") return base;
  const chainId = chainNameToId(new URLSearchParams(window.location.search).get("chain"));
  return allNetworks.find((network) => network.id === chainId) ?? base;
};

const initialNetwork = networkFromUrl();
const initialCaipId = `eip155:${initialNetwork.id}`;

// The page's chain goes first. MetaMask Connect treats the first requested chain
// as the preferred one, and the WalletConnect proposal lists it first too.
const networks = [
  initialNetwork,
  ...allNetworks.filter((network) => network.id !== initialNetwork.id),
] as [AppKitNetwork, ...AppKitNetwork[]];

// MetaMask's own connector (MetaMask Connect, the same SDK Uniswap uses). It is
// not WalletConnect: it keeps a persistent multichain session over MetaMask's
// relay, so connecting survives a page load and `switchChain` never has to open
// the wallet app. Desktop extensions are served by the same connector through
// EIP-6963. `@reown/appkit` has no MetaMask SDK integration, so this connector
// is what the "MetaMask" entry in our own wallet modal talks to.
const metamaskConnector = metaMask({
  dapp: { name: SITE_NAME, url: appUrl, iconUrl: `${appUrl}/og.png` },
  analytics: { enabled: false },
});

const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  transports,
  ssr: true,
  connectors: [metamaskConnector],
});

type WcNamespaceOverride = {
  chains: Record<string, string[]>;
  defaultChain: string;
};

// AppKit sends WalletConnect only *optional* namespaces, so list every chain with
// the page's chain first — the same shape Uniswap's WalletConnect connector uses
// (`optionalChains: [activeChain, ...others]`). Wallets that grant several chains
// then switch locally in the client, without opening the wallet app.
const universalProviderConfigOverride: WcNamespaceOverride = {
  chains: { eip155: networks.map((network) => `eip155:${network.id}`) },
  defaultChain: initialCaipId,
};

// MetaMask's WalletConnect entry is deliberately hidden from the AppKit list: it
// goes through WalletConnect (whose deeplink lands on MetaMask's home screen),
// while the "MetaMask" entry in WalletModal uses MetaMask Connect instead.
const METAMASK_WALLET_ID = "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96";

const appKitOptions = {
  adapters: [wagmiAdapter],
  projectId,
  networks,
  defaultNetwork: initialNetwork,
  metadata: {
    name: SITE_NAME,
    description: "Fair-launch infrastructure for tokens.",
    url: appUrl,
    icons: [`${appUrl}/og.png`],
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#6366f1",
    "--w3m-border-radius-master": "2px",
  },
  features: {
    analytics: false,
    email: false,
    socials: false,
    swaps: false,
    onramp: false,
  },
  universalProviderConfigOverride,
  // both are read at runtime by AppKit 1.8 but missing from its option types
  excludeWalletIds: [METAMASK_WALLET_ID],
} satisfies Parameters<typeof createAppKit>[0] & {
  universalProviderConfigOverride: WcNamespaceOverride;
  excludeWalletIds: string[];
};

createAppKit(appKitOptions);

export default function WalletRoot({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletToastWatcher />
        <WalletChainSync />
        <WalletModal />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
