const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const formatDate = (timestampMs: number): string => {
  const d = new Date(timestampMs);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
};

/** "12:45, 21 June, 2026" — 24h time + formatDate's day/month/year. */
export const formatDateTime = (timestampMs: number): string => {
  const time = new Date(timestampMs).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${time}, ${formatDate(timestampMs)}`;
};
