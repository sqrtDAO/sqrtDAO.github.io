"use client";

import { useEffect, useRef } from "react";
import { useAccount, useConnect } from "wagmi";
import { showToast } from "@/hooks/useToast";

// Mounted once at the root (see RainbowKitRoot) so wallet connect/disconnect/
// connect-failed toasts fire app-wide regardless of which page is active.
export default function WalletToastWatcher() {
  const { isConnected } = useAccount();
  const { error: connectError } = useConnect();
  const wasConnected = useRef(isConnected);
  const lastConnectError = useRef(connectError);

  useEffect(() => {
    if (isConnected && !wasConnected.current) {
      showToast("wallet.connected");
    } else if (!isConnected && wasConnected.current) {
      showToast("wallet.disconnected");
    }
    wasConnected.current = isConnected;
  }, [isConnected]);

  useEffect(() => {
    if (connectError && connectError !== lastConnectError.current) {
      showToast("wallet.connectFailed");
    }
    lastConnectError.current = connectError;
  }, [connectError]);

  return null;
}
