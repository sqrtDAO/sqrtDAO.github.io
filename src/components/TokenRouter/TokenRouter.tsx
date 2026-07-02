"use client";

import { useState, useEffect, useRef } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import "./TokenRouter.css";

type Choice = "idle" | "no" | "yes";

interface TokenRouterProps {
  onClose?: () => void;
  onLaunch?: () => void;
  onDistribute?: () => void;
}

export default function TokenRouter({ onClose, onLaunch, onDistribute }: TokenRouterProps) {
  const [choice, setChoice] = useState<Choice>("idle");
  const backRef = useRef<HTMLButtonElement>(null);

  // Focus the back button on mount for keyboard accessibility
  useEffect(() => {
    backRef.current?.focus();
  }, []);

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const subtitle =
    choice === "yes"
      ? "It might be any token, a token of your project, or a personal one."
      : "It might be any token, a token of your project, or personal token.";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tr-title"
      className={`tr-backdrop${choice !== "idle" ? " has-choice" : ""}`}
    >
      <div className="tr-panel">

        {/* ── Back / close ── */}
        <div>
          <button ref={backRef} className="tr-back" onClick={onClose} aria-label="Go back">
            <IconChevronLeft size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Main content ── */}
        <div className="tr-content">

          {/* Text */}
          <div className="tr-text">
            <h2 id="tr-title" className="tr-title">Do you have a token?</h2>
            <p className="tr-subtitle">{subtitle}</p>
          </div>

          {/* No / Yes toggle */}
          <div className="tr-choices">
            <button
              className={`tr-choice${choice === "no" ? " is-selected" : ""}`}
              onClick={() => setChoice("no")}
              aria-pressed={choice === "no"}
            >
              No
            </button>
            <button
              className={`tr-choice${choice === "yes" ? " is-selected" : ""}`}
              onClick={() => setChoice("yes")}
              aria-pressed={choice === "yes"}
            >
              Yes
            </button>
          </div>

          {/* Conditional footer — key forces re-animation on switch */}
          {choice !== "idle" && (
            <div className="tr-footer" key={choice}>
              <p className="tr-instruction">
                {choice === "no"
                  ? "So, Let's create and launch one easily free."
                  : "Distribute the token you already have through the fair engine"}
              </p>
              <div className="tr-submit">
                <Button
                  variant="primary"
                  size="m"
                  onClick={choice === "no" ? onLaunch : onDistribute}
                >
                  {choice === "no" ? "Launch my token" : "Distribute token"}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
