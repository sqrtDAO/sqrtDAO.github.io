"use client";

import { useChainId } from "wagmi";
import "./TestnetRibbon.css";
import { chainToName, isTestnet } from "@/utils/chain-utils";

export interface TestnetRibbonProps {
  network?: string;
  message?: string;
  className?: string;
}

const REPEAT_COUNT = 8;

export default function TestnetRibbon({
  message = "everything here runs on test funds. Nothing is real.",
  className,
}: TestnetRibbonProps) {
  const chainId = useChainId();
  if (!chainId || !isTestnet(chainId)) return <></>;
  const chainName = chainToName(chainId);

  const item = (
    <span className="testnet-ribbon__item">
      <strong>Testnet</strong> · {chainName} · {message}
    </span>
  );

  return (
    <div
      className={`testnet-ribbon${className ? ` ${className}` : ""}`}
      role="status"
    >
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
