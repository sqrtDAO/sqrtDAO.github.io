import Link from "next/link";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import {
  DISCORD_URL,
  X_URL,
  EXPLORE_DISTRIBUTIONS_HREF,
  TRY_TESTNET_HREF,
} from "@/constants/links";

const COPYRIGHT = `© ${new Date().getFullYear()} sqrtDAO. All rights reserved.`;

// Figma "inside footer" — a compact page footer (distinct from the landing
// page's hero LandingFooter) used at the bottom of the DDP page across all
// three distribution states. Desktop: node 8000:43639. Mobile: node 8154:43150.
function InsideFooterMobile() {
  return (
    <div className="flex w-full flex-col items-start gap-8 border-t border-subtle bg-canvas px-4 pb-8 pt-8 md:hidden">
      <Logo variant="complete" width={92} height={40} />
      <nav className="flex w-full flex-col gap-4">
        <Link
          href={TRY_TESTNET_HREF}
          className="sqrt-btn sqrt-btn--ghost sqrt-btn--m w-full"
        >
          <span className="sqrt-btn__label">Try it on testnet</span>
        </Link>
        <Link
          href={EXPLORE_DISTRIBUTIONS_HREF}
          className="sqrt-btn sqrt-btn--ghost sqrt-btn--m w-full"
        >
          <span className="sqrt-btn__label">Explore distributions</span>
        </Link>
        <Button
          variant="ghost"
          size="m"
          fullWidth
          onClick={() => window.open(DISCORD_URL, "_blank", "noopener,noreferrer")}
        >
          Join Discord
        </Button>
        <Button
          variant="ghost"
          size="m"
          fullWidth
          onClick={() => window.open(X_URL, "_blank", "noopener,noreferrer")}
        >
          Follow on X
        </Button>
      </nav>
      <p className="w-full text-center text-body-s text-tertiary">{COPYRIGHT}</p>
    </div>
  );
}

export default function InsideFooter() {
  return (
    <footer className="w-full bg-canvas">
      <div className="mx-auto hidden w-full max-w-[1320px] items-center justify-between border-t border-muted px-12 py-8 md:flex">
        <div className="flex items-center gap-6">
          <Logo variant="complete" width={110} height={48} />
          <span className="h-4 w-px bg-muted" aria-hidden="true" />
          <p className="text-body-s text-tertiary">{COPYRIGHT}</p>
        </div>
        <nav className="flex items-center gap-4">
          <Link href={TRY_TESTNET_HREF} className="sqrt-btn sqrt-btn--ghost sqrt-btn--m">
            <span className="sqrt-btn__label">Try it on testnet</span>
          </Link>
          <Link
            href={EXPLORE_DISTRIBUTIONS_HREF}
            className="sqrt-btn sqrt-btn--ghost sqrt-btn--m"
          >
            <span className="sqrt-btn__label">Explore distributions</span>
          </Link>
          <Button
            variant="ghost"
            size="m"
            onClick={() => window.open(DISCORD_URL, "_blank", "noopener,noreferrer")}
          >
            Join Discord
          </Button>
          <Button
            variant="ghost"
            size="m"
            onClick={() => window.open(X_URL, "_blank", "noopener,noreferrer")}
          >
            Follow on X
          </Button>
        </nav>
      </div>
      <InsideFooterMobile />
    </footer>
  );
}
