// CAMPAIGN: no-fee-november — delete with src/constants/campaigns.ts.
import { useSyncExternalStore } from "react";
import { isNoFeeNovemberActive } from "@/constants/campaigns";

const subscribe = () => () => {};

// Checked in the browser, never at build time (static export), so the UI turns off by itself after the window.
export const useNoFeeNovemberActive = () =>
  useSyncExternalStore(subscribe, () => isNoFeeNovemberActive(Date.now()), () => false);
