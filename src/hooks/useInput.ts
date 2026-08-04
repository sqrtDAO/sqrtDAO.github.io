"use client";

import { noModifier } from "@/utils/modifier";
import { InputValidator } from "@/utils/validator";
import { useState, useCallback } from "react";

export type UseInputReturn = {
  value: string;
  onChange: (value: string) => void;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  /** Marks the input as valid (passes `is-valid` CSS class for success styling). */
  isGreenFlag: boolean;
  setGreenFlag: (v: boolean) => void;
  validate: () => boolean;
  reset: () => void;
};

export const useInput = (
  initialValue: string,
  modifier: (inp: string) => string = noModifier,
  validator: InputValidator = () => null,
): UseInputReturn => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);
  /** Marks input as valid for success styling (green border/checkmark). */
  const [valid, setValid] = useState(false);

  const onChange = useCallback(
    (v: string) => {
      setValid(false);
      setValue(modifier(v));
      setError(null);
    },
    [modifier],
  );

  const validate = useCallback(() => {
    const err = validator(value);
    setError(err);
    return err === null;
  }, [validator, value]);

  const resetError = useCallback(() => setError(null), []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  return {
    value,
    onChange,
    error,
    setError,
    clearError: resetError,
    isGreenFlag: valid,
    setGreenFlag: setValid,
    validate,
    reset,
  };
};
