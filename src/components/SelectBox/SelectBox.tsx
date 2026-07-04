"use client";

import "./SelectBox.css";

export interface SelectBoxProps {
  label?: string;
  description?: string;
  selected?: boolean;
  disabled?: boolean;
  onChange?: (selected: boolean) => void;
  showSlot?: boolean;
  children?: React.ReactNode;
  className?: string;
}

function RadioIcon({ selected, disabled }: { selected: boolean; disabled: boolean }) {
  return selected ? (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="10" stroke="var(--sqrt-action-primary-rest)" strokeWidth="1.5" />
      <circle cx="11" cy="11" r="5" fill="var(--sqrt-action-primary-rest)" />
    </svg>
  ) : (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="10" stroke={disabled ? "var(--sqrt-text-tertiary)" : "var(--sqrt-border-default)"} strokeWidth="1.5" />
    </svg>
  );
}

export default function SelectBox({
  label = "Radio label",
  description = "Optional description",
  selected = false,
  disabled = false,
  onChange,
  showSlot = false,
  children,
  className,
}: SelectBoxProps) {
  return (
    <div
      className={`select-box${selected ? " is-selected" : ""}${disabled ? " is-disabled" : ""}${className ? ` ${className}` : ""}`}
    >
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-disabled={disabled}
        disabled={disabled}
        className="select-box__radio"
        onClick={() => onChange?.(!selected)}
      >
        <RadioIcon selected={selected} disabled={disabled} />
        <span className="select-box__radio-content">
          <span className="select-box__label">{label}</span>
          {description && (
            <span className="select-box__description">{description}</span>
          )}
        </span>
      </button>
      {showSlot && children && (
        <div className="select-box__slot">{children}</div>
      )}
    </div>
  );
}
