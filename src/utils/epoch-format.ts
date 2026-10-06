const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

/** "12 May, 12:32:45" (with time) or "12 May, 2026". */
export const formatEpochTimestamp = (
  timestamp: number,
  withTime: boolean,
): string => {
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  if (withTime) {
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${day} ${month}, ${time}`;
  }
  return `${day} ${month}, ${d.getFullYear()}`;
};

/** Clear price, trailing zeros stripped ("0.002"). Null → "—". */
export const formatPrice = (price: number | null): string =>
  price == null ? "—" : parseFloat(price.toFixed(4)).toString();
