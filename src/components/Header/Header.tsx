"use client";

import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
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
  return (
    <header className={`sqrt-header${className ? ` ${className}` : ""}`}>
      <div className="sqrt-header__inner">
        <Logo mono width={92} height={40} className="sqrt-header__logo" />
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
      </div>
    </header>
  );
}
