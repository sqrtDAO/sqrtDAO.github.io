import { UseInputReturn } from "@/hooks/useInput";
import { parseEther } from "viem";

// undefined means OK, returned string is error message
export type InputValidator = (value: string) => string | null;

export const validateAll = (...inputs: UseInputReturn[]): boolean => {
  let isValid = true;
  for (const input of inputs) if (!input.validate()) isValid = false;
  return isValid;
};

export const composeValidators =
  (...validators: InputValidator[]): InputValidator =>
  (v) =>
    validators.reduce<string | null>((err, validate) => err ?? validate(v), null);

export const requiredValidator = (name: string): InputValidator => {
  return (v: string): string | null => {
    if (v.trim() === "") return `${name} is Required`;
    return null;
  };
};

export const amountValidator: InputValidator = (
  value: string,
): string | null => {
  value = value.trim();
  if (value == "") return "Required";
  try {
    parseEther(value.replace(/,/g, ""));
    return null; // OK
  } catch {
    return "Invalid amount";
  }
};

export const nonZeroAmountValidator: InputValidator = (
  value: string,
): string | null => {
  if (value.trim() === "") return "Required";
  try {
    if (parseEther(value.replace(/,/g, "")) === 0n)
      return "Must be greater than 0";
    return null; // OK
  } catch {
    return "Invalid amount";
  }
};

export const addressValidator: InputValidator = (
  value: string,
): string | null => {
  value = value.trim();
  if (value == "") return "Required";
  if (!/^0x[0-9a-fA-F]{40}$/.test(value)) return "Invalid address";

  return null; //OK
};

export const positiveIntegerValidator: InputValidator = (
  value: string,
): string | null => {
  value = value.trim();
  if (value == "") return "Required";
  try {
    if (parseInt(value) < 1) throw "Should be positive";
    return null; // OK
  } catch {
    return "Invalid amount";
  }
};

export const positiveNumberValidator = (label: string): InputValidator => {
  return (v: string): string | null => {
    if (v.trim() === "") return `${label} is required`;
    const n = parseFloat(v.replace(/,/g, ""));
    if (isNaN(n) || n <= 0) return `${label} must be greater than 0`;
    return null; // OK
  };
};
