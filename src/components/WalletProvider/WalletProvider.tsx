"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useState, type ReactNode } from "react";
import { wagmiConfig } from "@/lib/wagmi/config";
import WalletToastWatcher from "@/components/WalletToastWatcher/WalletToastWatcher";
import WalletModal from "@/components/WalletModal/WalletModal";
import AccountModal from "@/components/AccountModal/AccountModal";

/**
 * Wallet wiring for the whole app: wagmi (MetaMask Connect + WalletConnect +
 * injected, see `lib/wagmi/config.ts`) and the two dialogs we own.
 *
 * Nothing in here switches chains on its own. Every wallet request can open the
 * wallet app on mobile, so an automatic switch right after connecting used to
 * bounce the user straight back into MetaMask before the session had settled.
 */
export default function WalletProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletToastWatcher />
        <WalletModal />
        <AccountModal />
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
