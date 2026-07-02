"use client";

import { useRef, forwardRef, useId } from "react";
import "./Input.css";

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  onPaste?: () => void;
  showPaste?: boolean;
  error?: boolean;
  errorMessage?: string;
  valid?: boolean;
  id?: string;
  disabled?: boolean;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  spellCheck?: boolean;
  autoComplete?: string;
  "aria-describedby"?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    placeholder,
    value,
    onChange,
    onPaste,
    showPaste = false,
    error = false,
    errorMessage,
    valid = false,
    id,
    disabled,
    onKeyDown,
    spellCheck,
    autoComplete,
    "aria-describedby": ariaDescribedBy,
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const fieldClass = [
    "sqrt-input__field",
    valid && !error ? "is-valid" : "",
    error ? "is-error" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="sqrt-input">
      {label && (
        <label className="sqrt-input__label" htmlFor={inputId}>
          {label}
        </label>
      )}
      <div className={fieldClass}>
        <input
          ref={ref}
          id={inputId}
          className="sqrt-input__el"
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          onKeyDown={onKeyDown}
          aria-invalid={error}
          aria-describedby={
            error && errorMessage
              ? errorId
              : ariaDescribedBy
          }
          spellCheck={spellCheck}
          autoComplete={autoComplete}
        />
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
      {error && errorMessage && (
        <p id={errorId} className="sqrt-input__error" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
});

export default Input;
