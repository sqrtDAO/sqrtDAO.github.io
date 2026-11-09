"use client";

import { useEffect } from "react";
import { useClarityConsent } from "@/hooks/useClarityConsent";
import { trackClarityEvent } from "@/utils/clarity";

// Emits `<prefix>_<step>` whenever a wizard reaches a new step. Sessions that
// stop firing events show exactly where the user abandoned the flow.
export const useClarityStep = (prefix: string, step: string) => {
  const consented = useClarityConsent();

  useEffect(() => {
    if (consented) trackClarityEvent(`${prefix}_${step}`);
  }, [consented, prefix, step]);

  return consented;
};
