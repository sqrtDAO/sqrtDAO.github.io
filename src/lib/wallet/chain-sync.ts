import type { Address } from "viem";
import type { Connector } from "wagmi";
import { debugLog, describeWalletError } from "@/lib/wallet/debug";

type Eip1193 = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

export const withTimeout = <T>(work: Promise<T>, ms: number) =>
  Promise.race<T>([
    work,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`timed out after ${ms}ms`)), ms);
    }),
  ]);

/**
 * Ask the connected wallet what chain it is on.
 *
 * Neither wallet we care about answers this by opening the app: WalletConnect
 * answers over the relay, and `eth_chainId` is one of MetaMask Connect's
 * SDK-handled methods. That makes it safe to call while resuming.
 */
export const readChainId = async (connector?: Connector): Promise<number | undefined> => {
  if (!connector) return undefined;
  try {
    const provider = (await connector.getProvider()) as Eip1193 | undefined;
    const chainId = await provider?.request({ method: "eth_chainId" });
    return typeof chainId === "string" ? Number.parseInt(chainId, 16) : undefined;
  } catch (error) {
    debugLog("chain:read-failed", describeWalletError(error));
    return undefined;
  }
};

export const readAccounts = async (connector?: Connector): Promise<readonly Address[] | undefined> => {
  if (!connector) return undefined;
  try {
    const accounts = await connector.getAccounts();
    return accounts.length ? (accounts as readonly Address[]) : undefined;
  } catch (error) {
    debugLog("accounts:read-failed", describeWalletError(error));
    return undefined;
  }
};

/**
 * Push what the wallet actually reports into wagmi. Connectors emit this
 * themselves, but a reply that landed while the tab was frozen (or a wallet that
 * switches without emitting `chainChanged`) never reaches the store, which is how
 * the UI ends up on a chain the wallet is not on.
 */
export const applyWalletState = (
  connector: Connector,
  patch: { chainId?: number; accounts?: readonly Address[] },
) => {
  if (patch.chainId === undefined && !patch.accounts?.length) return;
  debugLog("state:apply", patch);
  connector.emitter.emit("change", patch);
};
