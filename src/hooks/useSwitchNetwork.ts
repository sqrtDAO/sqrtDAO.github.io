"use client";

import { useCallback } from "react";
import { useAccount, useConnect, useDisconnect, useSwitchChain } from "wagmi";
import { showToast } from "@/hooks/useToast";
import { LIVE_CHAINS, chainToName } from "@/utils/chain-utils";
import { isTransportTimeout, isUserRejectedError } from "@/utils/wallet-error";
import { applyWalletState, readChainId, withTimeout } from "@/lib/wallet/chain-sync";
import { WALLET_KNOWN_CHAIN_IDS, addChain } from "@/lib/wallet/add-chain";
import { sessionPermitsChain } from "@/lib/wallet/session";
import { debugLog, describeWalletError } from "@/lib/wallet/debug";

// Long enough for the user to switch to the wallet app, approve, and come back.
// Timers are frozen while the tab is in the background, so on Android this fires
// after the user returns rather than while they are still deciding.
const SWITCH_TIMEOUT_MS = 25_000;
// The add-network sheet needs the user to read the details and approve.
const ADD_TIMEOUT_MS = 20_000;
// Re-creating a MetaMask Connect session: the wallet shows the connection sheet
// again (with the network list), so allow for a slow approval.
const RECONNECT_TIMEOUT_MS = 45_000;

/** `switched` = done; `refused` = the wallet said no; `timeout` = it never answered. */
export type SwitchResult = "switched" | "refused" | "timeout";

export type SwitchOutcome = {
  status: SwitchResult;
  /** What the wallet said, when it said something — surfaced in the account dialog. */
  detail?: string;
};

/** Long wallet errors are unusable in a dialog; keep the first line. */
const shortDetail = (error: unknown) => describeWalletError(error).split("\n")[0].slice(0, 220);

/**
 * One place for every chain switch.
 *
 * A WalletConnect switch only resolves when the wallet's `chainChanged` reaches
 * the tab. On Android the reply can land while Chrome is frozen, or never arrive
 * at all — the wallet does switch, the app just never hears about it. So after
 * the request settles (or times out) we ask the wallet for its chain and push
 * that into wagmi instead of trusting the event.
 */
export const useSwitchNetwork = () => {
  const { switchChainAsync } = useSwitchChain();
  const { connectAsync } = useConnect();
  const { disconnectAsync } = useDisconnect();
  const { connector } = useAccount();

  /** Re-create the session so a network added after connect is covered by it. */
  const reconnect = useCallback(
    async (chainId: number): Promise<boolean> => {
      if (!connector) return false;
      debugLog("session:reconnect", { chainId, connector: connector.id });
      try {
        await disconnectAsync();
        await withTimeout(connectAsync({ connector, chainId }), RECONNECT_TIMEOUT_MS);
        return true;
      } catch (error) {
        debugLog("session:reconnect-failed", describeWalletError(error));
        return false;
      }
    },
    [connectAsync, disconnectAsync, connector],
  );

  /** Ask wagmi for the switch and verify it against what the wallet reports. */
  const attempt = useCallback(
    async (chainId: number): Promise<SwitchOutcome> => {
      const request = switchChainAsync({ chainId });
      // The race below can leave this promise pending or rejecting on its own.
      request.catch(() => {});

      let resolved = false;
      let failure: unknown;
      try {
        await withTimeout(request, SWITCH_TIMEOUT_MS);
        resolved = true;
      } catch (error) {
        failure = error;
        debugLog("switch:attempt-failed", describeWalletError(error));
      }

      const actual = await readChainId(connector);
      debugLog("switch:settled", { requested: chainId, resolved, actual });

      if (actual === chainId) {
        if (connector) applyWalletState(connector, { chainId });
        return { status: "switched" };
      }

      // The wallet accepted it; wagmi is just catching up on the event.
      if (resolved) return { status: "switched" };

      return {
        status: isTransportTimeout(failure) ? "timeout" : "refused",
        detail: failure ? shortDetail(failure) : undefined,
      };
    },
    [switchChainAsync, connector],
  );

  return useCallback(
    async (chainId: number): Promise<SwitchOutcome> => {
      debugLog("switch:start", { chainId, connector: connector?.id });

      const chain = LIVE_CHAINS.find((candidate) => candidate.id === chainId);
      // Wallets only ship the majors, so a custom network (Robinhood) usually has
      // to be added before it can be switched to.
      const customNetwork = Boolean(chain && !WALLET_KNOWN_CHAIN_IDS.has(chainId));
      // MetaMask Connect cannot switch to a network MetaMask doesn't have, and it
      // only falls back to adding one when the wallet's error says "Unrecognized
      // chain ID" — its mobile app never says that, it just hangs. So there we
      // add first. WalletConnect and injected wallets add as part of the switch,
      // so those keep the cheaper order.
      const addFirst = customNetwork && connector?.type === "metaMask";

      let addError: string | undefined;

      if (addFirst && chain) {
        const added = await addChain(connector, chain, ADD_TIMEOUT_MS);
        if (added.ok) {
          // MetaMask Connect's session still lists only the networks the wallet
          // had at connect time, so requests on the new one fail inside the
          // wallet ("Request failed"). Re-create the session while we are here.
          if (!(await sessionPermitsChain(connector, chainId))) {
            const restored = await reconnect(chainId);
            if (!restored)
              return {
                status: "refused",
                detail: `${chain.name} was added, but the wallet needs to reconnect before it can use it.`,
              };
          }
        }
        if (!added.ok) {
          addError = added.error;
          // The user said no to the network — don't queue a switch behind it.
          if (isUserRejectedError(added.cause)) {
            debugLog("switch:outcome", { status: "refused", detail: addError });
            showToast("network.switchFailed");
            return { status: "refused", detail: addError };
          }
          // No answer at all: the switch would sit on the same dead transport for
          // another 25s, so report it now.
          if (isTransportTimeout(added.cause)) {
            debugLog("switch:outcome", { status: "timeout", detail: addError });
            showToast("network.walletTimeout");
            return { status: "timeout", detail: addError };
          }
        }
      }

      let outcome = await attempt(chainId);

      if (outcome.status !== "switched" && customNetwork && chain && !addFirst) {
        const added = await addChain(connector, chain, ADD_TIMEOUT_MS);
        if (added.ok) {
          const retry = await attempt(chainId);
          if (retry.status === "switched") outcome = retry;
          else addError = retry.detail ?? added.error;
        } else {
          addError = added.error;
        }
      }

      if (outcome.status !== "switched" && addError) outcome.detail ??= addError;
      debugLog("switch:outcome", outcome);

      if (outcome.status === "switched") {
        showToast("network.switched", { params: { chain: chainToName(chainId) } });
      } else if (outcome.status === "timeout") {
        // A silent wallet (MetaMask parked on its splash, or a frozen tab that
        // dropped the reply) needs different advice than a refusal.
        showToast("network.walletTimeout");
      } else {
        showToast("network.switchFailed");
      }

      return outcome;
    },
    [attempt, connector, reconnect],
  );
};
