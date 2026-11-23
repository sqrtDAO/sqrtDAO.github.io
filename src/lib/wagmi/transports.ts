import { fallback, http, type Transport } from "viem";
import { base, sepolia } from "viem/chains";
import { robinhood } from "@/constants/ecosystems";

// Public RPCs rate-limit or reject specific calls — e.g. publicnode's free tier
// answers `eth_getTransactionReceipt` with "archive requests require a personal
// token", which made a *successful* token launch look like it failed. Use a
// `fallback` transport so one provider failing falls through to the next
// instead of breaking reads or dropping an already-mined transaction. A
// dedicated RPC can still be supplied via env and is tried first.
export const RPC_URLS: Record<number, string[]> = {
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

export const transports: Record<number, Transport> = Object.fromEntries(
  Object.entries(RPC_URLS).map(([id, urls]) => [Number(id), buildTransport(urls)]),
);
