"use client";

import { forwardRef, useId } from "react";
import type { UseInputReturn } from "@/hooks/useInput";
import "./Input.css";

export interface InputProps {
  state: UseInputReturn;
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  suffix?: string;
  onChange?: (value: string) => void;
  onPaste?: () => void;
  showPaste?: boolean;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  spellCheck?: boolean;
  autoComplete?: string;
  "aria-describedby"?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    state,
    label,
    placeholder,
    error: errorOverride,
    errorMessage: errorMessageOverride,
    suffix,
    onChange: onChangeOverride,
    onPaste,
    showPaste = false,
    disabled,
    onKeyDown,
    spellCheck = false,
    autoComplete="off",
    "aria-describedby": ariaDescribedBy,
  },
  ref,
) {
  const { value, onChange, error, isGreenFlag: valid } = state;
  const hasError = errorOverride ?? error !== null;
  const errorMessage = errorMessageOverride ?? error;
  const generatedId = useId();
  const errorId = `${generatedId}-error`;

  const fieldClass = [
    "sqrt-input__field",
    valid && !hasError ? "is-valid" : "",
    hasError ? "is-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="sqrt-input">
      {label && (
        <label className="sqrt-input__label" htmlFor={generatedId}>
          {label}
        </label>
      )}
      <div className="sqrt-input__field-wrap">
        <div className={fieldClass}>
          <input
            ref={ref}
            id={generatedId}
            className="sqrt-input__el"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => (onChangeOverride ?? onChange)(e.target.value)}
            disabled={disabled}
            onKeyDown={onKeyDown}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : ariaDescribedBy}
            spellCheck={spellCheck}
            autoComplete={autoComplete}
          />
          {suffix && <span className="sqrt-input__suffix">{suffix}</span>}
          {showPaste && onPaste && (
            <button
              className="sqrt-input__paste"
              type="button"
              onClick={onPaste}
              tabIndex={-1}
              aria-label="Paste from clipboard"
            >
              Paste
            </button>
          )}
        </div>
      </div>
      {hasError && errorMessage && (
        <p id={errorId} className="sqrt-input__error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Input;
