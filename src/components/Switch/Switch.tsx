"use client";

import "./Switch.css";

export interface SwitchProps {
  on?: boolean;
  active?: boolean;
  onChange?: (on: boolean) => void;
  className?: string;
}

/* Circuit switch icons recreated as inline SVG (Figma assets expire in 7 days) */
function CircuitClosed({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
      <path d="M1 12h2M7 12h10M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CircuitOpen({ className }: { className?: string }) {
  return (
    <svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="5" cy="12" r="2" fill="currentColor" />
      <circle cx="19" cy="12" r="2" fill="currentColor" />
      <path d="M1 12h2M21 12h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M7 12l9-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default function Switch({ on = true, active = true, onChange, className }: SwitchProps) {
  const label = on ? "On" : "Off";
  const labelClass = `sw-label${
    !active ? " sw-label--disabled" : on ? " sw-label--on" : " sw-label--off"
  }`;

  // Left slot = open-circuit icon, highlighted when the switch is OFF.
  const leftClass = [
    "sw-slot",
    !on && active ? "sw-slot--off-active" : "",
    !on && !active ? "sw-slot--off-inactive" : "",
  ].filter(Boolean).join(" ");

  // Right slot = closed-circuit icon, highlighted when the switch is ON.
  const rightClass = [
    "sw-slot",
    on && active ? "sw-slot--on-active" : "",
    on && !active ? "sw-slot--on-inactive" : "",
  ].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label={`Toggle: ${label}`}
      className={`sw-root${className ? ` ${className}` : ""}${!active ? " sw-root--inactive" : ""}`}
      onClick={() => active && onChange?.(!on)}
      disabled={!active}
    >
      <span className={labelClass}>{label}</span>
      <span className="sw-track">
        <span className={leftClass}>
          <CircuitOpen className="sw-icon" />
        </span>
        <span className={rightClass}>
          <CircuitClosed className="sw-icon" />
        </span>
      </span>
    </button>
  );
}
