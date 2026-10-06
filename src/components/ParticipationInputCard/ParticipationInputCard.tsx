"use client";

import { useId, type ReactNode } from "react";
import type { UseInputReturn } from "@/hooks/useInput";
import { BODY_L, BODY_M, BODY_S } from "@/constants/typography";

type ParticipationInputCardProps = {
  state: UseInputReturn;
  label: string;
  unit: string;
  placeholder: string;
  /** Secondary line under a typed value (e.g. "~242"). */
  hint?: string;
  disabled?: boolean;
  /** Content under the value: wallet balance, epoch range. */
  slot?: ReactNode;
  /** "active": slot shows while focused or filled. "filled": only once a value is typed. */
  slotWhen?: "active" | "filled";
};

// Figma 9885:83637 — rest, hovered (border-strong), pressed/typing (border-focus), filled, disabled.
// The rest-state placeholder reads as primary text; it dims to tertiary once the card is focused.
const ParticipationInputCard = ({
  state,
  label,
  unit,
  placeholder,
  hint,
  disabled = false,
  slot,
  slotWhen = "active",
}: ParticipationInputCardProps) => {
  const id = useId();
  const filled = state.value !== "";
  const slotVisibility = filled
    ? "flex"
    : slotWhen === "active"
      ? "hidden group-focus-within:flex"
      : "hidden";

  return (
    <div
      className={`group flex w-full flex-col gap-3 rounded-m border border-subtle px-4 py-3 ${
        disabled
          ? ""
          : "hover:border-strong focus-within:border-focus focus-within:hover:border-focus"
      }`}
    >
      <label
        htmlFor={id}
        className={`flex flex-col gap-3 ${disabled ? "cursor-not-allowed" : "cursor-text"}`}
      >
        <span className={`${BODY_M} text-tertiary`}>{label}</span>
        <span className="flex flex-col gap-1">
          <span className="flex items-center gap-2">
            <input
              id={id}
              value={state.value}
              onChange={(e) => state.onChange(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              inputMode="decimal"
              autoComplete="off"
              className={`min-w-0 flex-1 bg-transparent ${BODY_L} text-primary outline-none placeholder:text-primary focus:placeholder:text-tertiary disabled:cursor-not-allowed disabled:placeholder:text-disabled`}
            />
            <span className={`${BODY_M} text-tertiary`}>{unit}</span>
          </span>
          {filled && hint && (
            <span className={`${BODY_S} text-secondary`}>{hint}</span>
          )}
        </span>
      </label>
      {slot && <div className={`w-full ${slotVisibility}`}>{slot}</div>}
    </div>
  );
};

export default ParticipationInputCard;
