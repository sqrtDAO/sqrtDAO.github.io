"use client";

import { useWalletResync } from "@/hooks/useWalletResync";

// Mounted inside WagmiProvider (the hook reads the wagmi config), renders nothing.
const WalletResync = () => {
  useWalletResync();
  return null;
};

export default WalletResync;
