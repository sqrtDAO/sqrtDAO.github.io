import { base, sepolia } from "viem/chains";

export const chainToName = (chainId: number): string => {
  switch (chainId) {
    case sepolia.id:
      return sepolia.name;
    case base.id:
      return base.name;
    default:
      return "unknown";
  }
};

/** URL-safe chain slug, e.g. 8453 → "base". */
export const chainToSlug = (chainId: number): string =>
  chainToName(chainId).toLowerCase().replace(/\s+/g, "-");

/** Reverse of chainToSlug; accepts "base", "Base", etc. Returns undefined for unknown. */
export const chainNameToId = (name?: string | null): number | undefined => {
  switch ((name ?? "").trim().toLowerCase().replace(/[\s_]+/g, "-")) {
    case "base":
      return base.id;
    case "sepolia":
      return sepolia.id;
    default:
      return undefined;
  }
};

export const isTestnet = (chainId: number): boolean => {
  switch (chainId) {
    case sepolia.id:
      return true;
    case base.id:
      return false;
    default:
      return false;
  }
};
