import { defineChain, type Chain } from "viem";
import { base, sepolia } from "viem/chains";

export const robinhood = defineChain({
  id: 4663,
  name: "Robinhood",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: ["https://rpc.mainnet.chain.robinhood.com"] } },
  blockExplorers: {
    default: { name: "Blockscout", url: "https://robinhoodchain.blockscout.com" },
  },
});

export type Ecosystem = {
  slug: string;
  name: string;
  /** Unset = not integrated yet ("coming soon"). */
  chain?: Chain;
  testnet?: boolean;
  description?: string;
  /** Tailwind classes for the "on NETWORK" label (Figma 11597:109270). */
  label: string;
};

// Order = picker order in the wizards.
export const ECOSYSTEMS: Ecosystem[] = [
  {
    slug: "base",
    name: "Base",
    chain: base,
    description: "Low fees, built by Coinbase.",
    label: "bg-[#0000ff] text-white",
  },
  {
    slug: "sepolia",
    name: "Sepolia",
    chain: sepolia,
    testnet: true,
    description: "Practice with test funds, free.",
    label: "bg-[#8a92b2] text-black",
  },
  {
    slug: "robinhood",
    name: "Robinhood",
    chain: robinhood,
    description: "Robinhood's chain for tokenized assets.",
    label: "bg-[#cf0] text-black",
  },
  {
    slug: "hyperliquid",
    name: "Hyperliquid",
    label: "bg-[#97fce4] text-black",
  },
  {
    slug: "ethereum",
    name: "Ethereum",
    label: "bg-[#8a92b2] text-black",
  },
];

/** Where "Back to mainnet" lands. */
export const DEFAULT_CHAIN = base;
