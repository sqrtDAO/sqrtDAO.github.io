"use client";

import { useEffect } from "react";
import { useAccount, useConnect, useConnectors, useDisconnect, useSwitchChain } from "wagmi";
import { useWalletDialog } from "@/hooks/useWalletDialog";
import { debugLog, describeWalletError } from "@/lib/wallet/debug";

/**
 * Traces every wallet transition into the console, which `next dev` forwards to
 * the terminal (`logging.browserToTerminal`) so .agents/debug-session.sh keeps a
 * copy. Only mounted when NEXT_PUBLIC_WALLET_DEBUG=1 — see WalletProvider.
 */
const WalletDebug = () => {
  const { address, chainId, connector, status } = useAccount();
  const { error: connectError } = useConnect();
  const { error: switchError } = useSwitchChain();
  const { error: disconnectError } = useDisconnect();
  const connectors = useConnectors();
  const dialog = useWalletDialog();

  useEffect(() => {
    debugLog("boot", {
      connectors: connectors.map((candidate) => `${candidate.type}:${candidate.id}`),
      chain: new URLSearchParams(window.location.search).get("chain"),
      origin: window.location.origin,
      mobile: /android|iphone|ipad|ipod/i.test(navigator.userAgent),
    });
  }, [connectors]);

  useEffect(() => {
    debugLog("account", {
      status,
      chainId,
      connector: connector?.id,
      address: address ? `${address.slice(0, 6)}…${address.slice(-4)}` : undefined,
    });
  }, [status, chainId, connector, address]);

  useEffect(() => {
    if (connectError) debugLog("connect:error", describeWalletError(connectError));
  }, [connectError]);

  useEffect(() => {
    if (switchError) debugLog("switch:error", describeWalletError(switchError));
  }, [switchError]);

  useEffect(() => {
    if (disconnectError) debugLog("disconnect:error", describeWalletError(disconnectError));
  }, [disconnectError]);

  useEffect(() => debugLog("dialog", dialog), [dialog]);

  useEffect(() => {
    const onVisibility = () => debugLog("visibility", document.visibilityState);
    const onError = (event: ErrorEvent) => debugLog("window:error", event.message);
    const onRejection = (event: PromiseRejectionEvent) =>
      debugLog("unhandledrejection", describeWalletError(event.reason));

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
};

export default WalletDebug;
