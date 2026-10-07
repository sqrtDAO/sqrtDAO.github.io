"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { avatarImageCandidates } from "@/constants/avatar";

export type AvatarImage = {
  /** Current candidate URL, or null when there's nothing left to try. */
  src: string | null;
  /** Advance to the next gateway when the current one fails to load. */
  onError: () => void;
};

/**
 * Resolves a stored avatar value (e.g. `ipfs://<cid>`) to a fetchable URL,
 * walking the gateway list on load errors. Shared by every avatar surface so
 * an `ipfs://` value can never be handed straight to an <img>.
 */
export const useAvatarImage = (imageUrl?: string): AvatarImage => {
  const candidates = useMemo(() => avatarImageCandidates(imageUrl), [imageUrl]);
  const [idx, setIdx] = useState(0);

  useEffect(() => setIdx(0), [imageUrl]);

  const onError = useCallback(() => setIdx((i) => i + 1), []);

  return { src: candidates[idx] ?? null, onError };
};
