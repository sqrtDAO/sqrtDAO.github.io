"use client";

import { useCallback } from "react";
import { openWalletDialog } from "@/hooks/useWalletDialog";
import { trackClarityEvent } from "@/utils/clarity";

// The connect modal is the entry point of every wallet flow, so keep the click
// event next to it instead of repeating the call at each button.
export const useClarityConnectModal = () =>
  useCallback(() => {
    trackClarityEvent("wallet_connect_clicked");
    openWalletDialog("connect");
  }, []);
