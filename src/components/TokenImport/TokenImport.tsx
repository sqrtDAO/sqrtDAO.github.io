"use client";

import { useState, useRef, useEffect } from "react";
import { IconChevronLeft, IconCoin } from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import Input from "@/components/Input/Input";
import "./TokenImport.css";

type ImportStep = "idle" | "loading" | "valid" | "invalid";

interface TokenData {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: string;
  balance: string;
}

export interface TokenImportProps {
  onBack?: () => void;
  onConfirm?: (token: TokenData) => void;
}

const MOCK_TOKEN: TokenData = {
  name: "Token name",
  symbol: "Symbol",
  decimals: 18,
  totalSupply: "123,231",
  balance: "123,231",
};

// Treat any non-empty string as valid for demo; real impl would call on-chain
function validateAddress(addr: string): boolean {
  return addr.trim().length >= 10;
}

export default function TokenImport({ onBack, onConfirm }: TokenImportProps) {
  const [address, setAddress] = useState("");
  const [step, setStep] = useState<ImportStep>("idle");
  const [token, setToken] = useState<TokenData | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    backRef.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onBack?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onBack]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setAddress(text.trim());
      setStep("idle");
      inputRef.current?.focus();
    } catch {
      inputRef.current?.focus();
    }
  };

  const handleImport = async () => {
    const trimmed = address.trim();
    if (!trimmed || step === "loading") return;
    setStep("loading");
    // Simulate async address lookup (800ms)
    await new Promise<void>((r) => setTimeout(r, 800));
    if (validateAddress(trimmed)) {
      setToken(MOCK_TOKEN);
      setStep("valid");
    } else {
      setToken(null);
      setStep("invalid");
    }
  };

  const hasResult = step === "valid" || step === "invalid";

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="ti-title"
      className="ti-backdrop"
    >
      <div className="ti-panel">

        {/* ── Back ── */}
        <div>
          <button
            ref={backRef}
            className="ti-back"
            onClick={onBack}
            aria-label="Go back"
          >
            <IconChevronLeft size={24} strokeWidth={1.5} />
          </button>
        </div>

        {/* ── Main content ── */}
        <div className="ti-content">

          {/* Heading */}
          <div className="ti-text">
            <h2 id="ti-title" className="ti-title">Import Existing Token</h2>
            <p className="ti-subtitle">
              Paste the contract address of the token you want to distribute.
            </p>
          </div>

          {/* Form */}
          <div className="ti-form">

            {/* Address row: input + action button */}
            <div className="ti-address-row">
              <div className="ti-input-group">
                <Input
                  ref={inputRef}
                  id="ti-address-input"
                  label="Token contract address"
                  placeholder="e.g. 1FfmbHfnpaZjKFvyi1okTjJJusN455paPH"
                  value={address}
                  onChange={(val) => {
                    setAddress(val);
                    if (hasResult) setStep("idle");
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !hasResult) handleImport();
                  }}
                  showPaste
                  onPaste={handlePaste}
                  valid={step === "valid"}
                  error={step === "invalid"}
                  errorMessage="Invalid contract address. Please check and try again."
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>

              {/* Import token / Check address */}
              {hasResult ? (
                <button className="ti-check-btn" type="button" disabled>
                  Check address
                </button>
              ) : (
                <Button
                  variant="primary"
                  size="m"
                  onClick={handleImport}
                  disabled={!address.trim() || step === "loading"}
                  className={step === "loading" ? "ti-loading-pulse" : ""}
                >
                  {step === "loading" ? "Importing…" : "Import token"}
                </Button>
              )}
            </div>

            {/* Token info card — only on valid */}
            {step === "valid" && token && (
              <div className="ti-card" key="token-card">
                <div className="ti-avatar" aria-hidden="true">
                  <IconCoin className="ti-avatar-icon" size={28} strokeWidth={1.2} />
                </div>
                <div className="ti-card-body">
                  <div className="ti-token-info">
                    <span className="ti-token-name">{token.name}</span>
                    <span className="ti-token-decimals">{token.decimals} Decimals</span>
                  </div>
                  <div className="ti-stats">
                    <div className="ti-stat">
                      <span className="ti-stat-label">Token total Supply</span>
                      <div className="ti-stat-value">
                        <span className="ti-stat-amount">{token.totalSupply}</span>
                        <span className="ti-stat-symbol">{token.symbol}</span>
                      </div>
                    </div>
                    <div className="ti-stat">
                      <span className="ti-stat-label">Your token balance</span>
                      <div className="ti-stat-value">
                        <span className="ti-stat-amount">{token.balance}</span>
                        <span className="ti-stat-symbol">{token.symbol}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm — only on valid */}
          {step === "valid" && (
            <div className="ti-submit" key="confirm">
              <Button
                variant="primary"
                size="m"
                onClick={() => onConfirm?.(token!)}
              >
                Confirm
              </Button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
