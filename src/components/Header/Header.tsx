"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconMenu2, IconWallet, IconX } from "@tabler/icons-react";
import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import {
  DOCS_URL,
  DISTRIBUTION_LIST,
  TRY_TESTNET_HREF,
} from "@/constants/links";
import "./Header.css";

export interface HeaderProps {
  onConnectWallet?: () => void;
  className?: string;
}

export default function Header({ onConnectWallet, className }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`sqrt-header${className ? ` ${className}` : ""}`}>
      <div className="sqrt-header__inner">
        <Link href="/" className="sqrt-header__logo sqrt-header__logo--desktop">
          <Logo mono width={92} height={40} />
        </Link>
        <nav className="sqrt-header__nav" aria-label="Primary">
          <Link
            href={TRY_TESTNET_HREF}
            className="sqrt-btn sqrt-btn--ghost sqrt-btn--m"
          >
            <span className="sqrt-btn__label">Launch and distribute token</span>
          </Link>
          <Link
            href={DISTRIBUTION_LIST}
            className="sqrt-btn sqrt-btn--ghost sqrt-btn--m"
          >
            <span className="sqrt-btn__label">Distributions</span>
          </Link>
          <a
            href={DOCS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="sqrt-btn sqrt-btn--ghost sqrt-btn--m"
          >
            <span className="sqrt-btn__label">Documentation</span>
          </a>
        </nav>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {!connected ? (
                  <Button
                    variant="primary"
                    size="m"
                    onClick={() => {
                      onConnectWallet?.();
                      openConnectModal();
                    }}
                    className="sqrt-header__wallet-btn"
                  >
                    Connect wallet
                  </Button>
                ) : chain.unsupported ? (
                  <Button
                    variant="primary"
                    size="m"
                    onClick={openChainModal}
                    className="sqrt-header__wallet-btn"
                  >
                    Switch network
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="m"
                    onClick={openAccountModal}
                    className="sqrt-header__wallet-btn"
                  >
                    {account.displayName}
                  </Button>
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>

        <IconButton
          icon={
            mobileMenuOpen ? (
              <IconX size={24} strokeWidth={1.75} />
            ) : (
              <IconMenu2 size={24} strokeWidth={1.75} />
            )
          }
          variant="ghost"
          size="m"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
          className="sqrt-header__menu-btn"
          onClick={() => setMobileMenuOpen((open) => !open)}
        />
        <Link href="/" className="sqrt-header__logo sqrt-header__logo--mobile">
          <Logo variant="sign" mono width={43} height={33} />
        </Link>
        <ConnectButton.Custom>
          {({
            account,
            chain,
            openAccountModal,
            openChainModal,
            openConnectModal,
            authenticationStatus,
            mounted,
          }) => {
            const ready = mounted && authenticationStatus !== "loading";
            const connected =
              ready &&
              account &&
              chain &&
              (!authenticationStatus ||
                authenticationStatus === "authenticated");

            return (
              <div
                {...(!ready && {
                  "aria-hidden": true,
                  style: {
                    opacity: 0,
                    pointerEvents: "none",
                    userSelect: "none",
                  },
                })}
              >
                {!connected ? (
                  <IconButton
                    icon={<IconWallet size={24} strokeWidth={1.75} />}
                    variant="outline"
                    size="m"
                    aria-label="Connect wallet"
                    className="sqrt-header__wallet-icon-btn"
                    onClick={() => {
                      onConnectWallet?.();
                      openConnectModal();
                    }}
                  />
                ) : chain.unsupported ? (
                  <IconButton
                    icon={<IconWallet size={24} strokeWidth={1.75} />}
                    variant="outline"
                    size="m"
                    aria-label="Switch network"
                    className="sqrt-header__wallet-icon-btn"
                    onClick={openChainModal}
                  />
                ) : (
                  <IconButton
                    icon={<IconWallet size={24} strokeWidth={1.75} />}
                    variant="outline"
                    size="m"
                    aria-label="Open wallet menu"
                    className="sqrt-header__wallet-icon-btn"
                    onClick={openAccountModal}
                  />
                )}
              </div>
            );
          }}
        </ConnectButton.Custom>
      </div>

      {mobileMenuOpen && (
        <nav className="sqrt-header__mobile-menu" aria-label="Primary">
          <div className="sqrt-header__mobile-menu-inner">
            <Link
              href={TRY_TESTNET_HREF}
              onClick={closeMobileMenu}
              className="sqrt-btn sqrt-btn--ghost sqrt-btn--l sqrt-btn--full"
            >
              <span className="sqrt-btn__label">
                Launch and distribute token
              </span>
            </Link>
            <Link
              href={DISTRIBUTION_LIST}
              onClick={closeMobileMenu}
              className="sqrt-btn sqrt-btn--ghost sqrt-btn--l sqrt-btn--full"
            >
              <span className="sqrt-btn__label">Distributions</span>
            </Link>
            <a
              href={DOCS_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={closeMobileMenu}
              className="sqrt-btn sqrt-btn--ghost sqrt-btn--l sqrt-btn--full"
            >
              <span className="sqrt-btn__label">Documentation</span>
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
