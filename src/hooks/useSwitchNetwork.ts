"use client";

import { useCallback } from "react";
import { useAccount, useSwitchChain } from "wagmi";
import { showToast } from "@/hooks/useToast";
import { chainToName } from "@/utils/chain-utils";
import { isTransportTimeout } from "@/utils/wallet-error";
import { applyWalletState, readChainId, withTimeout } from "@/lib/wallet/chain-sync";
import { debugLog, describeWalletError } from "@/lib/wallet/debug";

// Long enough for the user to switch to the wallet app, approve, and come back.
// Timers are frozen while the tab is in the background, so on Android this fires
// after the user returns rather than while they are still deciding.
const SWITCH_TIMEOUT_MS = 25_000;

/** `switched` = done; `refused` = the wallet said no; `timeout` = it never answered. */
export type SwitchResult = "switched" | "refused" | "timeout";

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
  const { connector } = useAccount();

  return useCallback(
    async (chainId: number) => {
      debugLog("switch:start", { chainId, connector: connector?.id });

      const attempt = switchChainAsync({ chainId });
      // The race below can leave this promise pending or rejecting on its own.
      attempt.catch(() => {});

      let resolved = false;
      let failure: unknown;
      try {
        await withTimeout(attempt, SWITCH_TIMEOUT_MS);
        resolved = true;
      } catch (error) {
        failure = error;
        debugLog("switch:attempt-failed", describeWalletError(error));
      }

      const actual = await readChainId(connector);
      debugLog("switch:settled", { requested: chainId, resolved, actual });

      if (actual === chainId) {
        if (connector) applyWalletState(connector, { chainId });
        showToast("network.switched", { params: { chain: chainToName(chainId) } });
        return "switched";
      }

      if (resolved) {
        // The wallet accepted it; wagmi is just catching up on the event.
        showToast("network.switched", { params: { chain: chainToName(chainId) } });
        return "switched";
      }

      // A silent wallet (MetaMask parked on its splash, or a frozen tab that
      // dropped the reply) needs different advice than a refusal.
      const timedOut = isTransportTimeout(failure);
      showToast(timedOut ? "network.walletTimeout" : "network.switchFailed");
      return timedOut ? "timeout" : "refused";
    },
    [switchChainAsync, connector],
  );
};
