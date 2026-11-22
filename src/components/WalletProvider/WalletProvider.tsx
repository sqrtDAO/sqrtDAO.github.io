"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { useState, type ReactNode } from "react";
import { wagmiConfig } from "@/lib/wagmi/config";
import { debugEnabled } from "@/lib/wallet/debug";
import WalletToastWatcher from "@/components/WalletToastWatcher/WalletToastWatcher";
import WalletModal from "@/components/WalletModal/WalletModal";
import AccountModal from "@/components/AccountModal/AccountModal";
import WalletResync from "@/components/WalletResync/WalletResync";
import WalletDebug from "@/components/WalletDebug/WalletDebug";


/**
 * Wallet wiring for the whole app: wagmi (MetaMask Connect + WalletConnect +
 * injected, see `lib/wagmi/config.ts`), the two dialogs we own, and the resume
 * re-sync that keeps wagmi honest after the phone froze the tab.
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
        <WalletResync />
        <WalletToastWatcher />
        <WalletModal />
        <AccountModal />
        {debugEnabled ? <WalletDebug /> : null}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
