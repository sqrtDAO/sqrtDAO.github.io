"use client";

import { useId } from "react";
import { IconAlertSquare } from "@tabler/icons-react";
import type { UseInputReturn } from "@/hooks/useInput";

type TextAreaProps = {
  state: UseInputReturn;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

// Figma "text-area" (11610:109511): rest / focus / danger / read-only.
const TextArea = ({ state, label, placeholder, disabled }: TextAreaProps) => {
  const id = useId();
  const { value, onChange, error } = state;

  return (
    <div className="flex w-full flex-col gap-2">
      {label && (
        <label
          htmlFor={id}
          className={`text-body leading-5.5 tracking-[0.01em] ${disabled ? "text-disabled" : "text-primary"}`}
        >
          {label}
        </label>
      )}
      <textarea
        id={id}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={error !== null}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`field-sizing-content min-h-21 w-full resize-none rounded-m border bg-transparent px-3 py-3 text-body-s leading-5 tracking-[0.01em] text-primary outline-none placeholder:text-tertiary disabled:text-disabled ${
          error ? "border-danger" : "border-subtle focus:border-focus"
        }`}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="flex items-center gap-1.5 text-body-s leading-5 text-danger">
          <IconAlertSquare size={16} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
};

export default TextArea;
