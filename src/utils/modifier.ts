export type InputModifier = (value: string) => string;

export const noModifier: InputModifier = (v) => v;
export const uppercaseModifier: InputModifier = (v) => v.toUpperCase();
export const numberOnlyModifier: InputModifier = (v) =>
  v.replace(/[^0-9]/g, "");
export const allowCharsModifier = (pattern: RegExp): InputModifier => (v) =>
  v.replace(pattern, "");
