"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { IconMenu, IconWallet, IconX } from "@tabler/icons-react";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import NavLink from "@/components/NavLink/NavLink";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import { MAINNET_NAV } from "@/constants/links";
import { useIsMounted } from "@/hooks/useIsMounted";
import { openWalletDialog } from "@/hooks/useWalletDialog";
import { LIVE_CHAINS } from "@/utils/chain-utils";
import { trackClarityEvent } from "@/utils/clarity";

const DESKTOP_NAV = [MAINNET_NAV.launch, MAINNET_NAV.explore, MAINNET_NAV.blog, MAINNET_NAV.docs];

const SUPPORTED_CHAIN_IDS = new Set<number>(LIVE_CHAINS.map((chain) => chain.id));

const shortAddress = (address?: string) =>
  address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "";

type WalletRenderProps = { label: string; onClick: () => void };

const WalletConnect = ({ children }: { children: (p: WalletRenderProps) => React.ReactNode }) => {
  const { address, chainId, isConnected } = useAccount();
  // wagmi reconnects on the client, so render nothing chain-dependent until mounted.
  const mounted = useIsMounted();

  const connected = mounted && isConnected;
  const unsupported = connected && chainId !== undefined && !SUPPORTED_CHAIN_IDS.has(chainId);
  const props: WalletRenderProps = !connected
    ? {
        label: "Connect wallet",
        onClick: () => {
          trackClarityEvent("wallet_connect_clicked");
          openWalletDialog("connect");
        },
      }
    : unsupported
      ? { label: "Switch network", onClick: () => openWalletDialog("account") }
      : { label: shortAddress(address), onClick: () => openWalletDialog("account") };

  return <div className={mounted ? "" : "pointer-events-none opacity-0"}>{children(props)}</div>;
};

type MainnetHeaderProps = {
  /** Static pages (docs/blog/404): no wallet button and no testnet mode. */
  showWallet?: boolean;
  /** "Back to mainnet" keeps the user on this page (launch step 1, import). */
  ribbonStays?: boolean;
  /** Override the "Launch token" nav link (e.g. keep the list's chain filter). */
  launchHref?: string;
  /** Extra content rendered inside the mobile menu (e.g. the docs section links). */
  mobileMenuExtra?: React.ReactNode;
};

const MainnetHeader = ({
  showWallet = true,
  ribbonStays,
  launchHref,
  mobileMenuExtra,
}: MainnetHeaderProps) => {
  const pathname = usePathname();
  // Open state is tied to the current path, so navigating closes the menu.
  const [openPath, setOpenPath] = useState<string | null>(null);
  const menuOpen = openPath === pathname;
  const closeMenu = () => setOpenPath(null);
  const navItems = launchHref
    ? DESKTOP_NAV.map((item) =>
        item.href === MAINNET_NAV.launch.href ? { ...item, href: launchHref } : item,
      )
    : DESKTOP_NAV;

  return (
    <header className="relative z-40 w-full bg-surface">
      {/* Desktop — Figma 11289:96189 */}
      <div className="mx-auto hidden h-18 w-full max-w-325 grid-cols-[1fr_auto_1fr] items-center gap-4 xl:grid">
        <Link href="/" aria-label="sqrtDAO home" className="justify-self-start">
          <Logo className="h-10 w-auto" />
        </Link>
        <nav className="flex items-center gap-4">
          {navItems.map((item) => (
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
              {navItems.map((item) => (
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
