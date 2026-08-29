const UNITS = [
  { label: "day", seconds: 86400 },
  { label: "hour", seconds: 3600 },
  { label: "min", seconds: 60 },
] as const;

/** Formats a duration in seconds using the largest whole unit, e.g. "20 mins", "23 days". */
export const formatDuration = (totalSeconds: number): string => {
  if (totalSeconds <= 0) return "0 mins";
  for (const { label, seconds } of UNITS) {
    if (totalSeconds >= seconds) {
      const value = Math.round(totalSeconds / seconds);
      return `${value} ${label}${value === 1 ? "" : "s"}`;
    }
  }
  return `${Math.round(totalSeconds)} secs`;
};
