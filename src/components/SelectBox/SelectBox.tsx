"use client";

import { BODY_M, BODY_S } from "@/constants/typography";

export type SelectBoxProps = {
  icon?: React.ReactNode;
  label: string;
  /** Rich variant only. */
  description?: string;
  variant?: "rich" | "minimal";
  selected?: boolean;
  disabled?: boolean;
  onSelect?: () => void;
};

// Figma 16802:109610 — rich (card) and minimal (pill) radio options.
const SelectBox = ({
  icon,
  label,
  description,
  variant = "rich",
  selected = false,
  disabled = false,
  onSelect,
}: SelectBoxProps) => {
  const rich = variant === "rich";
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`flex shrink-0 rounded-m border text-left transition-colors duration-200 ${
        rich ? "w-38.5 flex-col items-start gap-4 p-4" : "items-center gap-2 px-3 py-2"
      } ${
        disabled
          ? "cursor-not-allowed border-subtle text-disabled"
          : selected
            ? "border-action bg-surface text-primary"
            : "border-muted text-primary hover:bg-surface"
      }`}
    >
      <span className={`flex gap-2 ${rich ? "flex-col" : "items-center"}`}>
        <span className={disabled ? "opacity-50" : undefined}>{icon}</span>
        <span className={`${BODY_M} ${rich ? "" : "whitespace-nowrap"}`}>{label}</span>
      </span>
      {rich && description && (
        <span
          className={`h-10 ${BODY_S} ${disabled ? "text-disabled" : "text-secondary"}`}
        >
          {description}
        </span>
      )}
    </button>
  );
};

export default SelectBox;
