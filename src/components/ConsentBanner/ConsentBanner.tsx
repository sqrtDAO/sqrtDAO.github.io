"use client";

import { useSyncExternalStore } from "react";
import { Button } from "@/components/Button/Button";
import {
  CLARITY_PROJECT_ID,
  getClarityConsent,
  setClarityConsent,
  subscribeToClarityConsent,
} from "@/utils/clarity";

const ConsentBanner = () => {
  // "unknown" only exists on the server/initial hydration, so the banner is not
  // baked into the static HTML and returning users never see it flash.
  const consent = useSyncExternalStore(
    subscribeToClarityConsent,
    getClarityConsent,
    () => "unknown",
  );

  if (!CLARITY_PROJECT_ID || consent === "unknown" || consent) return null;

  return (
    <div
      role="dialog"
      aria-label="Analytics consent"
      aria-live="polite"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-subtle bg-surface px-4 py-4 xl:px-8"
    >
      <div className="mx-auto flex w-full max-w-325 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-body-s leading-5 tracking-[0.01em] text-secondary">
          We use Microsoft Clarity for session replays and heatmaps. If you accept, a connected
          wallet address is linked to your session.{" "}
          <a
            href="https://privacy.microsoft.com/privacystatement"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2"
          >
            Microsoft privacy
          </a>
        </p>
        <div className="flex shrink-0 gap-2">
          <Button variant="ghost" size="s" onClick={() => setClarityConsent("denied")}>
            Decline
          </Button>
          <Button variant="primary" size="s" onClick={() => setClarityConsent("granted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ConsentBanner;
