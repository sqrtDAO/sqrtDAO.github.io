"use client";

import { useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { IconMenu2, IconWallet, IconX } from "@tabler/icons-react";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import "./Header.css";

export interface HeaderProps {
  onLaunchClick?: () => void;
  onDistributeClick?: () => void;
  onAboutClick?: () => void;
  onConnectWallet?: () => void;
  className?: string;
}

export default function Header({
  onLaunchClick,
  onDistributeClick,
  onAboutClick,
  onConnectWallet,
  className,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (handler?: () => void) => () => {
    setMobileMenuOpen(false);
    handler?.();
  };

  return (
    <header className={`sqrt-header${className ? ` ${className}` : ""}`}>
      <div className="sqrt-header__inner">
        <Logo
          mono
          width={92}
          height={40}
          className="sqrt-header__logo sqrt-header__logo--desktop"
        />
        <nav className="sqrt-header__nav" aria-label="Primary">
          <Button variant="ghost" size="m" onClick={onLaunchClick}>
            Launch token
          </Button>
          <Button variant="ghost" size="m" onClick={onDistributeClick}>
            Distribute token
          </Button>
          <Button variant="ghost" size="m" onClick={onAboutClick}>
            About us
          </Button>
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
        <Logo
          variant="sign"
          mono
          width={43}
          height={33}
          className="sqrt-header__logo sqrt-header__logo--mobile"
        />
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
            <Button
              variant="ghost"
              size="l"
              fullWidth
              onClick={handleNavClick(onLaunchClick)}
            >
              Launch token
            </Button>
            <Button
              variant="ghost"
              size="l"
              fullWidth
              onClick={handleNavClick(onDistributeClick)}
            >
              Distribute token
            </Button>
            <Button
              variant="ghost"
              size="l"
              fullWidth
              onClick={handleNavClick(onAboutClick)}
            >
              About us
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
