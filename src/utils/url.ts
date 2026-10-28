/** Normalizes a user-entered link to an absolute http(s) URL. */
export const normalizeUrl = (value: string): string => {
  const v = value.trim();
  if (!v) return "";
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(v)) return v;
  // Leave known non-http schemes untouched so validation can reject them.
  if (/^(javascript|data|mailto|tel|ftp|file|blob):/i.test(v)) return v;
  return `https://${v}`;
};

/** True for an absolute http(s) URL with a dotted hostname. */
export const isValidHttpUrl = (value: string): boolean => {
  const normalized = normalizeUrl(value);
  if (!normalized) return false;
  try {
    const url = new URL(normalized);
    return (
      (url.protocol === "http:" || url.protocol === "https:") &&
      url.hostname.includes(".")
    );
  } catch {
    return false;
  }
};
