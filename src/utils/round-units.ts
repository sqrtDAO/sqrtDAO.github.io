import { formatUnits, parseUnits } from "viem";

export const roundUnits = (
  amount: bigint,
  units: number,
  maxLen: number = 7,
): string => {
  if (amount === 0n) return "0";
  const sn = maxLen - 4 > 0 ? "0." + "0".repeat(maxLen - 4) + "1" : "0";
  if (amount < parseUnits(sn, units)) return "<" + sn;

  const str = formatUnits(amount, units);
  const dot = str.indexOf(".");
  if (dot === -1) return str;
  const int = str.slice(0, dot);
  if (int.length >= maxLen) return int;
  // round (not truncate) so 99999.999… renders as 100000, never "99999.9"
  let rounded = Number(str).toFixed(maxLen - int.length - 1);
  if (rounded.includes(".")) {
    while (rounded.endsWith("0")) rounded = rounded.slice(0, -1);
    if (rounded.endsWith(".")) rounded = rounded.slice(0, -1);
  }
  return rounded;
};

export const roundEtherF = (f: number, precision?: number): string => {
  return f < 1 ? f.toPrecision(1) : f.toFixed(precision ?? 4);
};

/** bigint raw units -> plot-friendly number (charts can't plot bigints). */
export const unitsToNumber = (amount: bigint, units: number): number =>
  Number(formatUnits(amount, units));
