import { getExplorerUrl } from "@/utils/chain-utils";

export const getExplorerTxUrl = (chainId: number, hash: string) => {
  const url = getExplorerUrl(chainId);
  return url ? `${url}/tx/${hash}` : undefined;
};

export const viewTransactionAction = (chainId: number, hash: string) => {
  const url = getExplorerTxUrl(chainId, hash);
  return url ? { label: "View transaction", onClick: () => window.open(url, "_blank", "noopener,noreferrer") } : undefined;
};
