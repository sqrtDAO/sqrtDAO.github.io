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
import { parseEther } from "viem";

export default function TokenLaunch(props: {
  onCancel: () => void;
  onFinish: (tokenDetails: TokenDetails) => void;
}) {
  const [name, setTokenName] = useState("");
  const [symbol, setTokenSymbol] = useState("");
  const [totalSupplyStr, setTotalSupplyStr] = useState("");

  const onContinueClick = () => {
    try {
      if (name === "") throw "Empty name";
      if (symbol === "") throw "Empty symbol";
      if (totalSupplyStr === "") throw "Empty total supply";
      const totalSupply = parseEther(totalSupplyStr);
      if (totalSupply <= 0) throw "total supply Can't be less than zero";
      props.onFinish({ name, symbol, decimals: 18, totalSupply });
    } catch (e) {
      console.log(`validation error: ${e}`);
      // TODO show validation error
    }
  };

  return (
    <div className="tl-backdrop">
      <div className="tl-chrome">
        <Header />
        <TestnetRibbon />
      </div>
      <div className="tl-scroll">
        <div className="tl-panel">
          <div>
            <IconButton
              variant="outline"
              size="m"
              icon={<IconChevronLeft size={24} strokeWidth={2} />}
              onClick={props.onCancel}
              aria-label="Go back"
            />
          </div>

          <div className="tl-content">
            <div className="tl-text">
              <h2 className="tl-title">Launch token</h2>
              <p className="tl-subtitle">
                Creating a new token is free and easy, but the actual fight is
                about its PRICE.
              </p>
            </div>

            <div className="tl-row">
              <TokenAvatar seed={symbol} />
              <div className="tl-form">
                <Input
                  label="Token Name"
                  placeholder="The full name, e.g. Dev Protocol."
                  value={name}
                  onChange={setTokenName}
                  spellCheck={false}
                  autoComplete="off"
                />
                <Input
                  label="Token symbol"
                  placeholder="The ticker, e.g. DEV."
                  value={symbol}
                  onChange={(v) => setTokenSymbol(v.toUpperCase())}
                  spellCheck={false}
                  autoComplete="off"
                />
                <Input
                  label="Total supply"
                  placeholder="How many tokens to create?"
                  value={totalSupplyStr}
                  onChange={(v) => setTotalSupplyStr(v.replace(/[^0-9]/g, ""))}
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>

            <div className="tl-footer">
              <Button variant="outline" size="m" onClick={props.onCancel}>
                Cancel
              </Button>
              <Button variant="primary" size="m" onClick={onContinueClick}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export type TokenDetails = {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
};
