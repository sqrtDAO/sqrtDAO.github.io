"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";
import { getTokenAvatar } from "@/utils/avatar-api";

const useTokenAvatar = (
  address: Address | undefined,
  chainId?: number,
): string | null => {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!address) return;
    let active = true;
    getTokenAvatar(address, chainId)
      .then((avatar) => {
        if (active) setUrl(avatar);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [address, chainId]);

  return url;
};

export default useTokenAvatar;