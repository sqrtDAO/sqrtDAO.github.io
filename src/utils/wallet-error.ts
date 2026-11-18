type WalkableError = { walk?: (predicate: (e: unknown) => boolean) => unknown; name?: string };

export const isUserRejectedError = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;

  const withCode = error as { code?: number };
  if (withCode.code === 4001) return true;

  const walkable = error as WalkableError;
  if (typeof walkable.walk === "function") {
    const match = walkable.walk((e) => (e as { name?: string })?.name === "UserRejectedRequestError");
    if (match) return true;
  }

  return walkable.name === "UserRejectedRequestError";
};

/**
 * The wallet transport (WalletConnect / MetaMask Connect) gave up waiting for the
 * wallet to answer — the request may still have been executed, so retrying blindly
 * can duplicate it.
 */
export const isTransportTimeout = (error: unknown): boolean => {
  if (!error || typeof error !== "object") return false;
  const { shortMessage, details, message } = error as {
    shortMessage?: string;
    details?: string;
    message?: string;
  };
  return /timed out|RPCErr53/i.test([shortMessage, details, message].filter(Boolean).join(" "));
};

type ErrorLike = {
  shortMessage?: string;
  reason?: string;
  details?: string;
  metaMessages?: string[];
  message?: string;
  cause?: unknown;
};

/**
 * Human-readable summary of a viem/wagmi error. viem keeps the useful part (the
 * revert reason) in `reason` / `metaMessages` / the cause chain, not in
 * `shortMessage` ("The contract function X reverted."), so walk the chain and
 * prefer the explicit reason.
 */
export const describeError = (error: unknown): string => {
  if (!error || typeof error !== "object") return String(error);

  const parts: string[] = [];
  const seen = new Set<string>();
  let current: unknown = error;
  for (let depth = 0; current && typeof current === "object" && depth < 6; depth++) {
    const e = current as ErrorLike;
    for (const candidate of [e.reason, e.details, ...(e.metaMessages ?? []), e.shortMessage ?? e.message]) {
      const text = candidate?.trim();
      if (text && !seen.has(text)) {
        seen.add(text);
        parts.push(text);
      }
    }
    current = e.cause;
  }
  if (!parts.length) return "Unknown error";

  const joined = parts.join("\n");
  const reason =
    joined.match(/revert(?:ed)?\s+with\s+reason:?\s*([^\n]+)/i) ??
    joined.match(/\breason:?\s*([^\n]+)/i);
  if (reason?.[1]) return reason[1].trim().replace(/\.$/, "");

  const useful = parts.filter(
    (part) => !/^(request arguments|contract call|docs|version|details):/i.test(part),
  );
  return (useful[0] ?? parts[0]).split("\n")[0].slice(0, 300);
};
