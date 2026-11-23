// Wallet flow tracing for on-device debugging. On in development builds, when
// NEXT_PUBLIC_WALLET_DEBUG=1 was set at build time, or when the page is opened
// with `?walletdebug` (handy against a production build).
const query = typeof location === "undefined" ? "" : location.search;

const ENABLED =
  process.env.NEXT_PUBLIC_WALLET_DEBUG === "1" ||
  process.env.NODE_ENV !== "production" ||
  new URLSearchParams(query).has("walletdebug");

export const debugEnabled = ENABLED;

const stringify = (data: unknown) => {
  try {
    return JSON.stringify(data);
  } catch {
    return String(data);
  }
};

export const debugLog = (event: string, data?: unknown) => {
  if (!ENABLED) return;
  // One plain string keeps the line readable in the terminal and in the log
  // captured over the DevTools socket (.agents/console-log.mjs).
  console.log(data === undefined ? `[wallet] ${event}` : `[wallet] ${event} ${stringify(data)}`);
};

/** Wallet errors hide the useful part in `code` + nested `cause` chains. */
export const describeWalletError = (error: unknown): string => {
  if (!error) return "none";

  const parts: string[] = [];
  let current: unknown = error;

  for (let depth = 0; depth < 4 && current; depth += 1) {
    const candidate = current as {
      name?: string;
      code?: string | number;
      shortMessage?: string;
      message?: string;
      cause?: unknown;
    };
    const head = [candidate.name, candidate.code].filter(Boolean).join(" ");
    const body = candidate.shortMessage ?? candidate.message;
    if (head || body) parts.push([head, body].filter(Boolean).join(": "));
    current = candidate.cause;
  }

  return parts.length ? parts.join(" <- ") : String(error);
};
