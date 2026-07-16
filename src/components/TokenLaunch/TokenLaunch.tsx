"use client";

import { useState } from "react";
import { IconChevronLeft } from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import { IconButton } from "@/components/IconButton/IconButton";
import { Button } from "@/components/Button/Button";
import "./TokenLaunch.css";

interface TokenLaunchProps {
  onClose: () => void;
  onDistribute: () => void;
}

export default function TokenLaunch({ onClose, onDistribute }: TokenLaunchProps) {
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");

  return (
    <div className="tl-backdrop">
      <div className="tl-chrome">
        <Header onDistributeClick={onDistribute} />
        <TestnetRibbon />
      </div>
      <div className="tl-scroll">
        <div className="tl-panel">
          <div>
            <IconButton
              variant="outline"
              size="m"
              icon={<IconChevronLeft size={24} strokeWidth={2} />}
              onClick={onClose}
              aria-label="Go back"
            />
          </div>

          <div className="tl-content">
            <div className="tl-text">
              <h2 className="tl-title">Launch token</h2>
              <p className="tl-subtitle">
                Creating a new token is free and easy, but the actual fight is about its PRICE.
              </p>
            </div>

            <div className="tl-row">
              <TokenAvatar seed={tokenSymbol || tokenName} />
              <div className="tl-form">
                <Input
                  label="Token Name"
                  placeholder="The full name, e.g. Dev Protocol."
                  value={tokenName}
                  onChange={setTokenName}
                  spellCheck={false}
                  autoComplete="off"
                />
                <Input
                  label="Token symbol"
                  placeholder="The ticker, e.g. DEV."
                  value={tokenSymbol}
                  onChange={(v) => setTokenSymbol(v.toUpperCase())}
                  spellCheck={false}
                  autoComplete="off"
                />
                <Input
                  label="Total supply"
                  placeholder="How many tokens to create?"
                  value={totalSupply}
                  onChange={(v) => setTotalSupply(v.replace(/[^0-9]/g, ""))}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="tl-footer">
              <Button variant="outline" size="m" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" size="m" onClick={onDistribute}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
