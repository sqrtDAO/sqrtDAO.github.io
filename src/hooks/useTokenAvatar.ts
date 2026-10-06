"use client";

import { useEffect, useState } from "react";
import type { Address } from "viem";
import { usePublicClient } from "wagmi";
import { readTokenAvatar } from "@/utils/avatar-api";

const useTokenAvatar = (
  address: Address | undefined,
  chainId?: number,
): string | null => {
  const publicClient = usePublicClient(chainId ? { chainId } : undefined);
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!address || !publicClient) return;
    let active = true;
    readTokenAvatar(publicClient, address)
      .then((avatar) => {
        if (active) setUrl(avatar);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [address, publicClient]);

  return url;
};

export default useTokenAvatar;
