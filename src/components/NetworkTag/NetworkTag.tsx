import { useChainId } from "wagmi";
import "./NetworkTag.css";
import { chainToName } from "@/utils/chain-utils";

export interface NetworkTagProps {
  /** Override the displayed network (e.g. the chain encoded in the URL). */
  network?: string;
  className?: string;
}

export default function NetworkTag({ network, className }: NetworkTagProps) {
  const connectedChainId = useChainId();
  const name = network ?? chainToName(connectedChainId);
  const chainName = name.toUpperCase();

  return (
    <span className={`network-tag${className ? ` ${className}` : ""}`}>
      on {chainName}
    </span>
  );
}
