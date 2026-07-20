"use client";

import { useRef, useState, useEffect, forwardRef, useId } from "react";
import { IconChevronDown } from "@tabler/icons-react";
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
  dropdown?: boolean;
  options?: string[];
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
    dropdown = false,
    options = [],
  },
  ref
) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const [menuOpen, setMenuOpen] = useState(false);
  const fieldWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    function handleClickOutside(e: MouseEvent) {
      if (fieldWrapRef.current && !fieldWrapRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

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
      <div className="sqrt-input__field-wrap" ref={fieldWrapRef}>
        <div className={fieldClass}>
          <input
            ref={ref}
            id={inputId}
            className="sqrt-input__el"
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onClick={dropdown ? () => setMenuOpen((o) => !o) : undefined}
            readOnly={dropdown}
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
          {dropdown ? (
            <button
              type="button"
              className="sqrt-input__dropdown-btn"
              onClick={() => setMenuOpen((o) => !o)}
              tabIndex={-1}
              aria-label="Toggle options"
              disabled={disabled}
            >
              <IconChevronDown size={16} strokeWidth={1.5} />
            </button>
          ) : (
            showPaste && onPaste && (
              <button
                className="sqrt-input__paste"
                type="button"
                onClick={onPaste}
                tabIndex={-1}
                aria-label="Paste from clipboard"
              >
                Paste
              </button>
            )
          )}
        </div>
        {dropdown && menuOpen && (
          <div className="sqrt-input__menu" role="listbox">
            {options.map((opt) => (
              <button
                key={opt}
                type="button"
                className="sqrt-input__menu-item"
                role="option"
                aria-selected={opt === value}
                onClick={() => {
                  onChange(opt);
                  setMenuOpen(false);
                }}
              >
                {opt}
              </button>
            ))}
          </div>
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
