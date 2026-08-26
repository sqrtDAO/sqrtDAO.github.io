import { sepolia, baseSepolia } from "viem/chains";

const CHAIN_EXPLORER_URLS: Record<number, string | undefined> = {
  [sepolia.id]: sepolia.blockExplorers?.default.url,
  [baseSepolia.id]: baseSepolia.blockExplorers?.default.url,
};

export const getExplorerTxUrl = (chainId: number, hash: string) => {
  const base = CHAIN_EXPLORER_URLS[chainId];
  return base ? `${base}/tx/${hash}` : undefined;
};

export const viewTransactionAction = (chainId: number, hash: string) => {
  const url = getExplorerTxUrl(chainId, hash);
  return url ? { label: "View transaction", onClick: () => window.open(url, "_blank", "noopener,noreferrer") } : undefined;
};
