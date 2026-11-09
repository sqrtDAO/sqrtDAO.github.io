"use client";

import { useSyncExternalStore } from "react";
import { hasClarityConsent, subscribeToClarityConsent } from "@/utils/clarity";

export const useClarityConsent = () =>
  useSyncExternalStore(subscribeToClarityConsent, hasClarityConsent, () => false);
