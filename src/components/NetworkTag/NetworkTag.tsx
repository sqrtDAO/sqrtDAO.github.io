import "./NetworkTag.css";

export interface NetworkTagProps {
  network?: string;
  className?: string;
}

export default function NetworkTag({ network = "BASE", className }: NetworkTagProps) {
  return (
    <span className={`network-tag${className ? ` ${className}` : ""}`}>on {network}</span>
  );
}
