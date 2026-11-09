"use client";

import { useEffect, useRef } from "react";
import { useAccount } from "wagmi";
import { useClarityConsent } from "@/hooks/useClarityConsent";
import { identifyClarityUser, setClarityTags, trackClarityEvent } from "@/utils/clarity";

const ClarityWalletTracker = () => {
  const { address, isConnected, connector, chain } = useAccount();
  const consented = useClarityConsent();
  const trackedAddress = useRef<string | null>(null);

  useEffect(() => {
    if (!consented) return;

    if (!isConnected || !address) {
      if (trackedAddress.current) {
        trackedAddress.current = null;
        trackClarityEvent("wallet_disconnected");
      }
      return;
    }

    if (trackedAddress.current === address) return;
    trackedAddress.current = address;
    identifyClarityUser(address);
    setClarityTags({
      wallet: address,
      wallet_connector: connector?.name,
      wallet_chain: chain?.name,
      wallet_connected: "true",
    });
    trackClarityEvent("wallet_connected");
  }, [address, chain?.name, connector?.name, consented, isConnected]);

  return null;
};

export default ClarityWalletTracker;
