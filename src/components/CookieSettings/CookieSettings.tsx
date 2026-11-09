"use client";

import { resetClarityConsent } from "@/utils/clarity";

const CookieSettings = ({ className = "" }: { className?: string }) => (
  <button
    type="button"
    onClick={resetClarityConsent}
    className={`underline underline-offset-2 hover:text-secondary ${className}`}
  >
    Cookie settings
  </button>
);

export default CookieSettings;
