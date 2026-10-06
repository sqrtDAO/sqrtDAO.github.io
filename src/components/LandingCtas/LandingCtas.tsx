import Link from "next/link";
import { DISTRIBUTION_LIST, MAINNET_DISTRIBUTIONS_HREF, MAINNET_NAV } from "@/constants/links";

const btn = (variant: string, className = "") => `sqrt-btn sqrt-btn--${variant} sqrt-btn--l ${className}`;

// Mainnet landing CTAs — Figma 10698:92382 (desktop row) / 14396:84218 (mobile: launch full-width, then two halves).
// Demo testnet goes to the testnet distribution list.
const LandingCtas = () => (
  <div className="flex w-full flex-col gap-4 xl:w-auto xl:flex-row">
    <Link href={MAINNET_NAV.launch.href} className={btn("primary", "w-full xl:w-auto")}>
      <span className="sqrt-btn__label">Launch token</span>
    </Link>
    <div className="flex gap-4">
      <Link href={MAINNET_DISTRIBUTIONS_HREF} className={btn("secondary", "flex-1 xl:flex-none")}>
        <span className="sqrt-btn__label">Distributions</span>
      </Link>
      <Link href={DISTRIBUTION_LIST} className={btn("outline", "flex-1 xl:flex-none")}>
        <span className="sqrt-btn__label">Demo testnet</span>
      </Link>
    </div>
  </div>
);

export default LandingCtas;
