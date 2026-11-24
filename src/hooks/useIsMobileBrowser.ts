"use client";

import { useSyncExternalStore } from "react";
import { isMobileBrowser } from "@/lib/wallet/detect";

const subscribe = () => () => {};

/** The user agent never changes while the page is open, so this is a constant. */
export const useIsMobileBrowser = () =>
  useSyncExternalStore(subscribe, isMobileBrowser, () => false);
