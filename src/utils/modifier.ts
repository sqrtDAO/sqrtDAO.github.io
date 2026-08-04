export type InputModifier = (value: string) => string;

export const composeModifiers =
  (...modifiers: InputModifier[]): InputModifier =>
  (v) =>
    modifiers.reduce((acc, mod) => mod(acc), v);

export const noModifier: InputModifier = (v) => v;
export const uppercaseModifier: InputModifier = (v) => v.toUpperCase();
export const numberOnlyModifier: InputModifier = (v) =>
  v.replace(/[^0-9]/g, "");
export const allowCharsModifier = (pattern: RegExp): InputModifier => (v) =>
  v.replace(pattern, "");

export const decimalOnlyModifier: InputModifier = (v) => {
  const cleaned = v.replace(/[^0-9.]/g, "");
  const parts = cleaned.split(".");
  if (parts.length > 2) return parts[0] + "." + parts.slice(1).join("");
  return cleaned;
};

export const commaModifier: InputModifier = (v) => {
  const parts = v.split(".");
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return parts.length > 1 ? intPart + "." + parts[1] : intPart;
};
