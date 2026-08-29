"use client";

import { useEffect, useRef } from "react";
import { useAccount, useConnect } from "wagmi";
import { showToast } from "@/hooks/useToast";

// Mounted once at the root (see RainbowKitRoot) so wallet connect/disconnect/
// connect-failed toasts fire app-wide regardless of which page is active.
export default function WalletToastWatcher() {
  const { isConnected, status } = useAccount();
  const { error: connectError } = useConnect();
  const wasConnected = useRef(isConnected);
  const wasReconnecting = useRef(status === "reconnecting" || status === "connecting");
  const lastConnectError = useRef(connectError);

  useEffect(() => {
    // On page load wagmi auto-reconnects; the transient "reconnecting" →
    // "connected" transition is not a user action, so suppress the toast.
    if (wasReconnecting.current && (status === "connected" || status === "disconnected")) {
      wasReconnecting.current = false;
      wasConnected.current = isConnected;
      return;
    }

    if (wasReconnecting.current) {
      wasConnected.current = isConnected;
      return;
    }

    if (isConnected && !wasConnected.current) {
      showToast("wallet.connected");
    } else if (!isConnected && wasConnected.current) {
      showToast("wallet.disconnected");
    }
    wasConnected.current = isConnected;
  }, [isConnected, status]);

  useEffect(() => {
    if (connectError && connectError !== lastConnectError.current) {
      if (!wasReconnecting.current) {
        showToast("wallet.connectFailed");
      }
    }
    lastConnectError.current = connectError;
  }, [connectError]);

  return null;
}
