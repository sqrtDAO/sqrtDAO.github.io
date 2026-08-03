"use client";

import { useRef, useState, useEffect, forwardRef, useId } from "react";
import { IconChevronDown } from "@tabler/icons-react";
import type { UseInputReturn } from "@/hooks/useInput";
import "./DropDownInput.css";

export interface DropDownInputProps {
  state: UseInputReturn;
  options: string[];
  label?: string;
  placeholder?: string;
  error?: boolean;
  errorMessage?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
}

const DropDownInput = forwardRef<HTMLInputElement, DropDownInputProps>(
  function DropDownInput(
    {
      state,
      options,
      label,
      placeholder,
      error: errorOverride,
      errorMessage: errorMessageOverride,
      disabled,
      "aria-describedby": ariaDescribedBy,
    },
    ref,
  ) {
    const { value, onChange, error, isGreenFlag: valid } = state;
    const hasError = errorOverride ?? error !== null;
    const errorMessage = errorMessageOverride ?? error;
    const generatedId = useId();
    const errorId = `${generatedId}-error`;

    const [menuOpen, setMenuOpen] = useState(false);
    const fieldWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (!menuOpen) return;
      function handleClickOutside(e: MouseEvent) {
        if (
          fieldWrapRef.current &&
          !fieldWrapRef.current.contains(e.target as Node)
        ) {
          setMenuOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }, [menuOpen]);

    const fieldClass = [
      "sqrt-dropdown__field",
      valid && !hasError ? "is-valid" : "",
      hasError ? "is-error" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="sqrt-dropdown">
        {label && (
          <label className="sqrt-dropdown__label" htmlFor={generatedId}>
            {label}
          </label>
        )}
        <div className="sqrt-dropdown__field-wrap" ref={fieldWrapRef}>
          <div className={fieldClass}>
            <input
              ref={ref}
              id={generatedId}
              className="sqrt-dropdown__el"
              type="text"
              placeholder={placeholder}
              value={value}
              readOnly
              onClick={() => setMenuOpen((o) => !o)}
              disabled={disabled}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : ariaDescribedBy}
            />
            <button
              type="button"
              className="sqrt-dropdown__btn"
              onClick={() => setMenuOpen((o) => !o)}
              tabIndex={-1}
              aria-label="Toggle options"
              disabled={disabled}
            >
              <IconChevronDown size={16} strokeWidth={1.5} />
            </button>
          </div>
          {menuOpen && (
            <div className="sqrt-dropdown__menu" role="listbox">
              {options.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  className="sqrt-dropdown__menu-item"
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
        {hasError && errorMessage && (
          <p id={errorId} className="sqrt-dropdown__error" role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

export default DropDownInput;
