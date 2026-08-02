"use client";

import "./TokenAvatar.css";

export interface TokenAvatarProps {
  seed?: string;
  className?: string;
}

// Deterministic hash → hue pair, so the same token name/symbol always
// generates the same gradient (no upload needed, avatar is auto-generated).
function seedToHues(seed: string): [number, number] {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 80 + (Math.abs(hash >> 8) % 120)) % 360;
  return [h1, h2];
}

export default function TokenAvatar({ seed, className }: TokenAvatarProps) {
  const trimmed = seed?.trim() ?? "";
  const hasSeed = trimmed.length > 0;
  const initials = trimmed.slice(0, 2).toUpperCase();

  const style = hasSeed
    ? (() => {
        const [h1, h2] = seedToHues(trimmed);
        return {
          backgroundImage: `linear-gradient(135deg, hsl(${h1}, 70%, 55%), hsl(${h2}, 70%, 45%))`,
        };
      })()
    : undefined;

  return (
    <div
      className={`token-avatar${hasSeed ? " is-generated" : ""}${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      {hasSeed && <span className="token-avatar__initials">{initials}</span>}
    </div>
  );
}
