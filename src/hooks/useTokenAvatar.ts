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
    if (!address || !publicClient || publicClient.chain?.id !== chainId) {
      setUrl(null);
      return;
    }
    let active = true;
    setUrl(null);
    readTokenAvatar(publicClient, address)
      .then((avatar) => {
        if (active) setUrl(avatar);
      })
      .catch(() => {
        if (active) setUrl(null);
      });
    return () => {
      active = false;
    };
  }, [address, publicClient, chainId]);

  return url;
};

export default useTokenAvatar;
