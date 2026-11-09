"use client";

import { useCallback } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { trackClarityEvent } from "@/utils/clarity";

// RainbowKit's connect modal is the entry point of every wallet flow, so keep
// the click event next to it instead of repeating the call at each button.
export const useClarityConnectModal = () => {
  const { openConnectModal } = useConnectModal();

  return useCallback(() => {
    trackClarityEvent("wallet_connect_clicked");
    openConnectModal?.();
  }, [openConnectModal]);
};
