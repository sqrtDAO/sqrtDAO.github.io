import Image from "next/image";

type EcosystemLogoProps = {
  /** Ecosystem slug, e.g. "base". */
  slug: string;
  /** Icon is square; watermark is the full wordmark. */
  shape?: "icon" | "watermark";
  /** Size classes; defaults to 20px tall. */
  className?: string;
};

// Figma 16805:164 — dark-background variants (the app is dark-only).
const EcosystemLogo = ({ slug, shape = "icon", className }: EcosystemLogoProps) => {
  const icon = shape === "icon";
  return (
    <Image
      src={`/ecosystems/${slug}${icon ? "-icon" : ""}.svg`}
      alt={icon ? "" : slug}
      width={icon ? 60 : 400}
      height={60}
      unoptimized
      className={`shrink-0 object-contain ${className ?? (icon ? "size-5" : "h-5 w-auto")}`}
    />
  );
};

export default EcosystemLogo;
