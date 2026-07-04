"use client";

import { useState } from "react";
import { IconChevronLeft, IconRocket, IconHammer } from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import Uploader from "@/components/Uploader/Uploader";
import "./TokenLaunch.css";

type LaunchStep = 1 | 2 | 3;

interface TokenLaunchProps {
  onClose: () => void;
  onDistribute: () => void;
}

const DEFAULT_ADDRESS = "1FfmbHfnpaZjKFvyi1okTjJJusN455paPH";

export default function TokenLaunch({ onClose, onDistribute }: TokenLaunchProps) {
  const [step, setStep] = useState<LaunchStep>(1);
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [receiver, setReceiver] = useState("");
  const [editingReceiver, setEditingReceiver] = useState(false);

  function handleBack() {
    if (step === 1) onClose();
    else setStep((s) => (s - 1) as LaunchStep);
  }

  function handleContinue() {
    setStep((s) => Math.min(s + 1, 3) as LaunchStep);
  }

  function handlePasteReceiver() {
    navigator.clipboard
      .readText()
      .then((t) => setReceiver(t))
      .catch(() => {});
  }

  return (
    <div className="tl-backdrop">
      <div className="tl-panel">
        <div>
          <button className="tl-back" onClick={handleBack} aria-label="Go back">
            <IconChevronLeft size={24} strokeWidth={2} />
          </button>
        </div>

        {/* key re-mounts on step change, triggering CSS enter animation */}
        <div className="tl-content" key={step}>

          {step === 1 && (
            <>
              <div className="tl-text">
                <h2 className="tl-title">Launch token</h2>
                <p className="tl-subtitle">
                  Creating a new token is free and easy, but the actual fight is about its PRICE.
                </p>
              </div>

              <div className="tl-row">
                <Uploader />
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
                <button className="tl-btn tl-btn--secondary" onClick={onClose}>
                  Cancel
                </button>
                <button className="tl-btn tl-btn--primary" onClick={handleContinue}>
                  Continue
                </button>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="tl-text">
                <h2 className="tl-title">One more thing!</h2>
                <p className="tl-subtitle">
                  Where do you want to have your new-born token?
                </p>
              </div>

              <div className="tl-receiver-wrap">
                <div className="tl-receiver-label-group">
                  <span className="tl-field-label">Receiver address</span>
                  <span className="tl-field-desc">
                    By default we&apos;ll send it to your connected wallet. you can change the receiver here.
                  </span>
                </div>

                {editingReceiver ? (
                  <Input
                    placeholder={DEFAULT_ADDRESS}
                    value={receiver}
                    onChange={setReceiver}
                    showPaste
                    onPaste={handlePasteReceiver}
                    spellCheck={false}
                    autoComplete="off"
                  />
                ) : (
                  <div className="tl-receiver-display">
                    <span className="tl-receiver-address">
                      {receiver || DEFAULT_ADDRESS}
                    </span>
                    <button
                      className="tl-change-btn"
                      onClick={() => setEditingReceiver(true)}
                    >
                      Change receiver
                    </button>
                  </div>
                )}
              </div>

              <div className="tl-footer">
                <button className="tl-btn tl-btn--secondary" onClick={onClose}>
                  Cancel
                </button>
                <button className="tl-btn tl-btn--primary" onClick={handleContinue}>
                  <IconRocket size={18} strokeWidth={2} />
                  Launch
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div className="tl-text">
                <h2 className="tl-title">Token created and transferred!</h2>
              </div>

              <p className="tl-body-text">Now you just have to distribute your token.</p>

              <div className="tl-footer">
                <button className="tl-btn tl-btn--secondary" onClick={onClose}>
                  I will do that later
                </button>
                <button className="tl-btn tl-btn--primary" onClick={onDistribute}>
                  <IconHammer size={18} strokeWidth={2} />
                  Set up distribution
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
