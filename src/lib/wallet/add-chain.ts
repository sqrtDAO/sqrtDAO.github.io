import { numberToHex, type Chain } from "viem";
import type { Connector } from "wagmi";
import { withTimeout } from "@/lib/wallet/chain-sync";
import { debugLog, describeWalletError } from "@/lib/wallet/debug";

type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

/**
 * Chains every wallet ships with. A failed switch there is a rejection, not a
 * missing network — so we don't fire an "add network" prompt for them.
 */
export const WALLET_KNOWN_CHAIN_IDS = new Set([1, 10, 56, 100, 137, 324, 8453, 42161, 11155111]);

export type ChainAddPayload = {
  chainId: string;
  chainName: string;
  nativeCurrency: Chain["nativeCurrency"];
  rpcUrls: string[];
  blockExplorerUrls: string[];
};

/** Wallets validate this strictly: hex chain id, one RPC URL, no empty fields. */
export const chainAddPayload = (chain: Chain): ChainAddPayload => ({
  chainId: numberToHex(chain.id),
  chainName: chain.name,
  nativeCurrency: chain.nativeCurrency,
  rpcUrls: chain.rpcUrls.default.http.slice(0, 1),
  blockExplorerUrls: chain.blockExplorers?.default.url ? [chain.blockExplorers.default.url] : [],
});

/**
 * Ask the wallet to add a network.
 *
 * MetaMask Connect only falls back to this when the wallet's error message
 * contains the exact string "Unrecognized chain ID" — its mobile app answers
 * with a generic failure instead, so a chain MetaMask has never seen can never be
 * switched to from a MetaMask Connect session. Asking ourselves works the same
 * over the relay/bridge and gives us the error text when it doesn't.
 */
export const addChain = async (connector: Connector | undefined, chain: Chain, timeoutMs: number) => {
  if (!connector) return { ok: false as const, error: "no wallet connection" };

  const payload = chainAddPayload(chain);
  debugLog("chain:add", payload);

  try {
    const provider = (await connector.getProvider()) as Eip1193 | undefined;
    if (!provider) return { ok: false as const, error: "wallet provider unavailable" };

    await withTimeout(
      provider.request({ method: "wallet_addEthereumChain", params: [payload] }),
      timeoutMs,
    );
    return { ok: true as const };
  } catch (error) {
    const message = describeWalletError(error);
    debugLog("chain:add-failed", message);
    return { ok: false as const, error: message, cause: error };
  }
};
