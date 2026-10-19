import type { Chain } from "viem";
import { ECOSYSTEMS, type Ecosystem } from "@/constants/ecosystems";
import { isDeployed } from "@/contracts/contract-addresses";

export const ecosystemOf = (chainId?: number) =>
  ECOSYSTEMS.find((e) => e.chain?.id === chainId);

/** Integrated and deployed — selectable in the app. */
export const isLive = (e: Ecosystem) => !!e.chain && isDeployed(e.chain.id);

export const LIVE_CHAINS = ECOSYSTEMS.filter(isLive).map((e) => e.chain!) as [
  Chain,
  ...Chain[],
];

export const MAINNET_ECOSYSTEMS = ECOSYSTEMS.filter((e) => isLive(e) && !e.testnet);

export const chainToName = (chainId: number) =>
  ecosystemOf(chainId)?.chain?.name ?? "unknown";

/** URL-safe chain slug, e.g. 8453 → "base". */
export const chainToSlug = (chainId: number) =>
  ecosystemOf(chainId)?.slug ?? "unknown";

/** Reverse of chainToSlug for live chains; undefined otherwise. */
export const chainNameToId = (name?: string | null) => {
  const e = ECOSYSTEMS.find((e) => e.slug === name?.trim().toLowerCase());
  return e && isLive(e) ? e.chain!.id : undefined;
};

export const isTestnet = (chainId?: number) => !!ecosystemOf(chainId)?.testnet;

export const getExplorerUrl = (chainId: number) =>
  ecosystemOf(chainId)?.chain?.blockExplorers?.default.url;
