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
