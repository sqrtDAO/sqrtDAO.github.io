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
