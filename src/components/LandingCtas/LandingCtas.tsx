import Link from "next/link";
import { DISTRIBUTION_LIST, TOKEN_LAUNCH_HREF, TRY_TESTNET_HREF } from "@/constants/links";

const btn = (variant: string, className = "") => `sqrt-btn sqrt-btn--${variant} sqrt-btn--l ${className}`;

// Mainnet landing CTAs — Figma 10698:92382 (desktop row) / 14396:84218 (mobile: launch full-width, then two halves).
// "Demo testnet" opens the distribution list scoped to Sepolia.
const LandingCtas = () => (
  <div className="flex w-full flex-col gap-4 xl:w-auto xl:flex-row">
    <Link href={TOKEN_LAUNCH_HREF} className={btn("primary", "w-full xl:w-auto")}>
      <span className="sqrt-btn__label">Launch token</span>
    </Link>
    <div className="flex gap-4">
      <Link href={DISTRIBUTION_LIST} className={btn("secondary", "flex-1 xl:flex-none")}>
        <span className="sqrt-btn__label">Distributions</span>
      </Link>
      <Link href={TRY_TESTNET_HREF} className={btn("outline", "flex-1 xl:flex-none")}>
        <span className="sqrt-btn__label">Demo testnet</span>
      </Link>
    </div>
  </div>
);

export default LandingCtas;
