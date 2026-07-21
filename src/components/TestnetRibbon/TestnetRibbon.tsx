"use client";

import "./TestnetRibbon.css";

export interface TestnetRibbonProps {
  network?: string;
  message?: string;
  className?: string;
}

const REPEAT_COUNT = 8;

export default function TestnetRibbon({
  network = "Base Sepolia",
  message = "everything here runs on test funds. Nothing is real.",
  className,
}: TestnetRibbonProps) {
  const item = (
    <span className="testnet-ribbon__item">
      <strong>Testnet</strong> · {network} · {message}
    </span>
  );

  return (
    <div className={`testnet-ribbon${className ? ` ${className}` : ""}`} role="status">
      <div className="testnet-ribbon__track">
        <div className="testnet-ribbon__group" aria-hidden="false">
          {Array.from({ length: REPEAT_COUNT }, (_, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
        <div className="testnet-ribbon__group" aria-hidden="true">
          {Array.from({ length: REPEAT_COUNT }, (_, i) => (
            <span key={i}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
