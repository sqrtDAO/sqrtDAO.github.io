"use client";

import { useState } from "react";
import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconBoltFilled, IconBoltOff, IconMenu, IconWallet, IconX } from "@tabler/icons-react";
import { useAccount, useSwitchChain } from "wagmi";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import NavLink from "@/components/NavLink/NavLink";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import { isTestnet } from "@/utils/chain-utils";
import { MAINNET_NAV } from "@/constants/links";

const DESKTOP_NAV = [MAINNET_NAV.launch, MAINNET_NAV.explore, MAINNET_NAV.blog, MAINNET_NAV.docs];

type NetworkSwitchProps = { mainnet: boolean; onToggle?: () => void };

// Figma "switch net" (14374:82709). Static chip when the chain is locked (details
// page) or only one chain is configured; otherwise a real switch.
const NetworkSwitch = ({ mainnet, onToggle }: NetworkSwitchProps) => {
  const className = `flex shrink-0 items-center gap-1 rounded-pill px-2 py-1.5 text-body leading-5.5 tracking-[0.01em] text-primary ${
    mainnet ? "bg-(--sqrt-state-live-bg)" : "bg-(--sqrt-state-danger-bg)"
  }`;
  const content = (
    <>
      {mainnet ? (
        <IconBoltFilled size={18} className="text-accent" />
      ) : (
        <IconBoltOff size={18} className="text-danger" />
      )}
      {mainnet ? "Mainnet" : "Testnet"}
    </>
  );
  if (!onToggle) return <span className={className}>{content}</span>;
  return (
    <button type="button" onClick={onToggle} className={className}>
      {content}
    </button>
  );
};

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
  /** Hide the Mainnet/Testnet switch (e.g. inside the distribution wizard). */
  showNetworkSwitch?: boolean;
  /** Lock the badge to a chain and make it non-clickable (distribution details). */
  lockedChainId?: number;
  /** Reflect this chain in the badge but keep it clickable (e.g. list scoped by ?chain=). */
  displayChainId?: number;
  /** Override what clicking the badge does (e.g. change the ?chain= URL param). */
  onNetworkToggle?: () => void;
};

const MainnetHeader = ({
  showNetworkSwitch = true,
  lockedChainId,
  displayChainId,
  onNetworkToggle,
}: MainnetHeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => setMenuOpen(false);

  const { chainId } = useAccount();
  const { chains, switchChain } = useSwitchChain();
  const effectiveChainId = lockedChainId ?? displayChainId ?? chainId;
  const connected = chainId !== undefined;
  const mainnet = effectiveChainId === undefined ? true : !isTestnet(effectiveChainId);

  const toggleNetwork = () => {
    const target = chains.find((c) => c.id !== chainId);
    if (target) switchChain({ chainId: target.id });
  };
  const onToggle =
    lockedChainId !== undefined
      ? undefined
      : onNetworkToggle
        ? onNetworkToggle
        : chains.length > 1
          ? toggleNetwork
          : undefined;

  return (
    <header className="relative z-40 w-full bg-surface">
      {/* Testnet ribbon: driven by the actually connected chain. */}
      {connected && !mainnet && <TestnetRibbon />}
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
          {showNetworkSwitch && <NetworkSwitch mainnet={mainnet} onToggle={onToggle} />}
          <WalletConnect>
            {({ label, onClick }) => (
              <Button variant="primary" size="m" onClick={onClick}>
                {label}
              </Button>
            )}
          </WalletConnect>
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
            onClick={() => setMenuOpen((open) => !open)}
          />
          <Link href="/" aria-label="sqrtDAO home">
            <Logo variant="sign" className="h-8.25 w-auto" />
          </Link>
          <WalletConnect>
            {({ label, onClick }) => (
              <IconButton variant="outline" size="m" aria-label={label} icon={<IconWallet size={24} />} onClick={onClick} />
            )}
          </WalletConnect>
        </div>

        {menuOpen && (
          <div className="absolute inset-x-0 top-full mt-1 px-4">
            <nav className="flex flex-col items-center gap-2 bg-raised py-1.5">
              {showNetworkSwitch && (
                <div className="flex h-12 items-center justify-center gap-4 px-4">
                  <span className="text-body leading-5.5 tracking-[0.01em] text-tertiary">Network state is</span>
                  <NetworkSwitch mainnet={mainnet} onToggle={onToggle} />
                </div>
              )}
              <NavLink {...MAINNET_NAV.launch} size="l" className="w-full" onClick={closeMenu} />
              <NavLink {...MAINNET_NAV.explore} size="l" className="w-full" onClick={closeMenu} />
              <NavLink {...MAINNET_NAV.blog} size="l" className="w-full" onClick={closeMenu} />
              <NavLink {...MAINNET_NAV.docs} size="l" className="w-full" onClick={closeMenu} />
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default MainnetHeader;
