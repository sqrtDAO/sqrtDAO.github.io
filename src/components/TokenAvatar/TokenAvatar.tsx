"use client";

import Image from "next/image";
import "./TokenAvatar.css";

export interface TokenAvatarProps {
  seed?: string;
  imageUrl?: string;
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

export default function TokenAvatar({
  seed,
  imageUrl,
  className,
}: TokenAvatarProps) {
  const trimmed = seed?.trim() ?? "";
  const hasImage = Boolean(imageUrl);
  const hasSeed = trimmed.length > 0;
  const initials = trimmed.slice(0, 2).toUpperCase();

  const style =
    !hasImage && hasSeed
      ? (() => {
          const [h1, h2] = seedToHues(trimmed);
          return {
            backgroundImage: `linear-gradient(135deg, hsl(${h1}, 70%, 55%), hsl(${h2}, 70%, 45%))`,
          };
        })()
      : undefined;

  const variant = hasImage ? " is-image" : hasSeed ? " is-generated" : "";

  return (
    <div
      className={`token-avatar${variant}${className ? ` ${className}` : ""}`}
      style={style}
      aria-hidden="true"
    >
      {hasImage ? (
        <Image
          className="token-avatar__image"
          src={imageUrl!}
          alt=""
          fill
          sizes="(max-width: 767px) 180px, 258px"
          unoptimized
        />
      ) : (
        hasSeed && <span className="token-avatar__initials">{initials}</span>
      )}
    </div>
  );
}
