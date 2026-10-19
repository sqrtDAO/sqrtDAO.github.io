"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconMenu, IconWallet, IconX } from "@tabler/icons-react";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import NavLink from "@/components/NavLink/NavLink";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import { MAINNET_NAV } from "@/constants/links";

const DESKTOP_NAV = [MAINNET_NAV.launch, MAINNET_NAV.explore, MAINNET_NAV.blog, MAINNET_NAV.docs];

type WalletRenderProps = { label: string; onClick: () => void };

const WalletConnect = ({ children }: { children: (p: WalletRenderProps) => React.ReactNode }) => (
  <ConnectButton.Custom>
    {({ account, chain, openAccountModal, openChainModal, openConnectModal, mounted }) => {
      const connected = mounted && account && chain;
      const props = !connected
        ? { label: "Connect wallet", onClick: openConnectModal }
        : chain.unsupported
          ? { label: "Switch network", onClick: openChainModal }
          : { label: account.displayName, onClick: openAccountModal };
      return <div className={mounted ? "" : "pointer-events-none opacity-0"}>{children(props)}</div>;
    }}
  </ConnectButton.Custom>
);

type MainnetHeaderProps = {
  /** Static pages (docs/blog/404): no wallet button and no testnet mode. */
  showWallet?: boolean;
  /** "Back to mainnet" keeps the user on this page (launch step 1, import). */
  ribbonStays?: boolean;
  /** Extra content rendered inside the mobile menu (e.g. the docs section links). */
  mobileMenuExtra?: React.ReactNode;
};

const MainnetHeader = ({
  showWallet = true,
  ribbonStays,
  mobileMenuExtra,
}: MainnetHeaderProps) => {
  const pathname = usePathname();
  // Open state is tied to the current path, so navigating closes the menu.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;
  const closeMenu = () => setOpenPath(null);

  return (
    <header className="relative z-40 w-full bg-surface">
      {/* Desktop — Figma 11289:96189 */}
      <div className="mx-auto hidden h-18 w-full max-w-325 grid-cols-[1fr_auto_1fr] items-center gap-4 xl:grid">
        <Link href="/" aria-label="sqrtDAO home" className="justify-self-start">
          <Logo className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-4">
          {DESKTOP_NAV.map((item) => (
            <NavLink key={item.href} {...item} />
          ))}
        </nav>
        <div className="flex items-center gap-4 justify-self-end">
          {showWallet && (
            <WalletConnect>
              {({ label, onClick }) => (
                <Button variant="primary" size="m" onClick={onClick}>
                  {label}
                </Button>
              )}
            </WalletConnect>
          )}
        </div>
      </div>

      {/* Mobile — Figma 11289:96555 */}
      <div className="xl:hidden">
        <div className="flex h-14 items-center justify-between px-4 py-2">
          <IconButton
            variant="ghost"
            size="m"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            icon={menuOpen ? <IconX size={24} /> : <IconMenu size={24} />}
            onClick={() => setOpenPath(menuOpen ? null : pathname)}
          />
          <Link href="/" aria-label="sqrtDAO home">
            <Logo variant="sign" className="h-8.25 w-auto" />
          </Link>
          {showWallet ? (
            <WalletConnect>
              {({ label, onClick }) => (
                <IconButton variant="outline" size="m" aria-label={label} icon={<IconWallet size={24} />} onClick={onClick} />
              )}
            </WalletConnect>
          ) : (
            <span aria-hidden className="w-10" />
          )}
        </div>

        {menuOpen && (
          <div className="absolute inset-x-0 top-full mt-1 px-4">
            <nav className="flex max-h-[calc(100dvh-4.5rem)] flex-col items-center gap-2 overflow-y-auto bg-raised py-1.5">
              {DESKTOP_NAV.map((item) => (
                <NavLink key={item.href} {...item} size="l" className="w-full" onClick={closeMenu} />
              ))}
              {mobileMenuExtra}
            </nav>
          </div>
        )}
      </div>

      {showWallet && (
        <Suspense>
          <TestnetRibbon stay={ribbonStays} />
        </Suspense>
      )}
    </header>
  );
};

export default MainnetHeader;
