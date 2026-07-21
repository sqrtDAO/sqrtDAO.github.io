"use client";

import { useState } from "react";
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
        <Logo mono width={92} height={40} className="sqrt-header__logo sqrt-header__logo--desktop" />
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
        <Button
          variant="primary"
          size="m"
          onClick={onConnectWallet}
          className="sqrt-header__wallet-btn"
        >
          Connect wallet
        </Button>

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
        <IconButton
          icon={<IconWallet size={24} strokeWidth={1.75} />}
          variant="outline"
          size="m"
          aria-label="Connect wallet"
          className="sqrt-header__wallet-icon-btn"
          onClick={onConnectWallet}
        />
      </div>

      {mobileMenuOpen && (
        <nav className="sqrt-header__mobile-menu" aria-label="Primary">
          <div className="sqrt-header__mobile-menu-inner">
            <Button variant="ghost" size="l" fullWidth onClick={handleNavClick(onLaunchClick)}>
              Launch token
            </Button>
            <Button variant="ghost" size="l" fullWidth onClick={handleNavClick(onDistributeClick)}>
              Distribute token
            </Button>
            <Button variant="ghost" size="l" fullWidth onClick={handleNavClick(onAboutClick)}>
              About us
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
