import { formatUnits, parseUnits } from "viem";

export const roundUnits = (
  amount: bigint,
  units: number,
  maxLen: number = 7,
): string => {
  if (amount === 0n) return "0";
  const sn = maxLen - 4 > 0 ? "0." + "0".repeat(maxLen - 4) + "1" : "0";
  if (amount < parseUnits(sn, units)) return "<" + sn;

  let str = formatUnits(amount, units);
  if (str.indexOf(".") !== -1) {
    const leftSide = str.split(".")[0];
    if (leftSide.length >= maxLen) return leftSide;
    str = str.substring(0, maxLen);
    while (str.endsWith("0")) str = str.substring(0, str.length - 1);
    if (str.endsWith(".")) str = str.substring(0, str.length - 1);
  }
  return str;
};

export const roundEtherF = (f: number, precision?: number): string => {
  return f < 1 ? f.toPrecision(1) : f.toFixed(precision ?? 4);
};
