import { useChainId } from "wagmi";
import "./NetworkTag.css";
import { chainToName } from "@/utils/chain-utils";

export interface NetworkTagProps {
  network?: string;
  className?: string;
}

export default function NetworkTag({ className }: NetworkTagProps) {
  const chainId = useChainId();
  const chainName = chainToName(chainId).toUpperCase();

  return (
    <span className={`network-tag${className ? ` ${className}` : ""}`}>
      on {chainName}
    </span>
  );
}
