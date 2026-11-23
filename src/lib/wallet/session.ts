import type { Connector } from "wagmi";
import { withTimeout } from "@/lib/wallet/chain-sync";
import { debugLog, describeWalletError } from "@/lib/wallet/debug";

type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

type SessionLike = { sessionScopes?: Record<string, unknown> };

/**
 * MetaMask Connect sessions are created with the networks the wallet had at
 * connect time (the permission carries a `restrictNetworkSwitching` caveat with
 * that chain list). A network added afterwards — Robinhood on MetaMask — is not
 * covered by the existing session, so `eth_sendTransaction` on it fails inside
 * the wallet with "Request failed" even though the wallet looks like it is on
 * that chain. Re-creating the session is the only way to cover it.
 *
 * `wallet_getSession` is answered from the SDK's cached session (no wallet round
 * trip when the cache is warm), so this is cheap to check.
 */
export const sessionPermitsChain = async (
  connector: Connector | undefined,
  chainId: number,
  timeoutMs = 5_000,
) => {
  if (!connector) return false;

  try {
    const provider = (await connector.getProvider()) as Eip1193 | undefined;
    if (!provider) return false;

    const session = (await withTimeout(
      provider.request({ method: "wallet_getSession" }),
      timeoutMs,
    )) as SessionLike | undefined;

    const permitted = Boolean(session?.sessionScopes?.[`eip155:${chainId}`]);
    debugLog("session:scope", { chainId, permitted });
    return permitted;
  } catch (error) {
    // No answer means "not covered" — the caller reconnects, which is safe.
    debugLog("session:read-failed", describeWalletError(error));
    return false;
  }
};
