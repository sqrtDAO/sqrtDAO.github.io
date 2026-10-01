import { IconBrandDiscord, IconBrandGithub, IconBrandLinkedin, IconBrandX } from "@tabler/icons-react";
import Image from "next/image";
import Logo from "@/components/Logo/Logo";
import NavLink from "@/components/NavLink/NavLink";
import { DISCORD_URL, GITHUB_URL, LINKEDIN_URL, MAINNET_NAV, X_URL } from "@/constants/links";
import "@/components/IconButton/IconButton.css";

type MainnetFooterProps = {
  placement?: "panel" | "landing";
};

const BLURB = "The fair way to launch and distribute a token over time.";
const COPYRIGHT = `© ${new Date().getFullYear()} sqrtDAO. All rights reserved.`;
const TAGLINE = "Give your token a beginning it can survive";

const SOCIALS = [
  { label: "X", href: X_URL, Icon: IconBrandX },
  { label: "Discord", href: DISCORD_URL, Icon: IconBrandDiscord },
  { label: "GitHub", href: GITHUB_URL, Icon: IconBrandGithub },
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: IconBrandLinkedin },
];

const Socials = ({ className = "" }: { className?: string }) => (
  <div className={`flex items-start gap-4 ${className}`}>
    {SOCIALS.map(({ label, href, Icon }) => (
      <a
        key={label}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="icon-btn icon-btn--ghost icon-btn--m"
      >
        <span className="icon-btn__icon" aria-hidden="true">
          <Icon size={24} />
        </span>
      </a>
    ))}
  </div>
);

// Desktop: 3 cols × 2 rows; mobile: 2 cols × 3 rows — same source order.
const LinkGrid = ({ className = "" }: { className?: string }) => (
  <nav className={`grid gap-4 ${className}`}>
    {Object.values(MAINNET_NAV).map((item) => (
      <NavLink key={item.href} {...item} />
    ))}
  </nav>
);

const Copyright = ({ className = "" }: { className?: string }) => (
  <p className={`text-body-s leading-5 tracking-[0.01em] text-tertiary ${className}`}>{COPYRIGHT}</p>
);

// Figma 11089:93493 (desktop) / 11252:94162 (mobile)
const PanelFooter = () => (
  <footer className="w-full bg-canvas">
    <div className="hidden justify-center border-t border-muted py-8 xl:flex">
      <div className="flex w-full max-w-325 items-center justify-between">
        <div className="flex flex-col items-start gap-2">
          <div className="flex items-start gap-6">
            <Logo className="h-14 w-auto" />
            <div className="inline-flex flex-col justify-center gap-2">
              <p className="w-min min-w-full text-body leading-5.5 tracking-[0.01em] text-primary">{BLURB}</p>
              <Copyright className="whitespace-nowrap" />
            </div>
          </div>
          <Socials />
        </div>
        <LinkGrid className="w-154.25 grid-cols-3" />
      </div>
    </div>

    <div className="flex flex-col items-center pt-8 pb-6 xl:hidden">
      <div className="flex w-full flex-col items-start gap-8 border-t border-subtle px-4 pt-8">
        <Logo className="h-10 w-auto" />
        <p className="w-full text-body-l leading-6 tracking-[0.02em] text-primary">{BLURB}</p>
        <LinkGrid className="w-full grid-cols-2" />
        <Socials className="w-full justify-center" />
        <Copyright className="w-full text-center" />
      </div>
    </div>
  </footer>
);

// Figma 11089:93492 (desktop) / 11252:94163 (mobile)
const LandingFooter = () => (
  <footer className="w-full bg-canvas">
    <div className="relative hidden flex-col items-center pt-8 pb-12 xl:flex">
      <div className="absolute left-0 -top-13.25 bg-black p-2.5">
        <Logo className="h-16 w-auto" />
      </div>
      <div className="flex w-full max-w-325 flex-col items-center gap-8">
        <div className="flex w-full items-center justify-between">
          <div className="flex flex-col items-start justify-center gap-4">
            <div className="flex flex-col items-start gap-4">
              <p className="w-68.25 text-body-l leading-6 tracking-[0.02em] text-primary">{BLURB}</p>
              <Copyright className="whitespace-nowrap" />
            </div>
            <Socials />
          </div>
          <LinkGrid className="w-154.25 grid-cols-3" />
        </div>
        <Image src="/landing/footer-headline.svg" alt={TAGLINE} width={1300} height={66} className="h-16.5 w-325" />
      </div>
    </div>

    <div className="relative flex flex-col items-start gap-8 px-4 pt-12 pb-6 xl:hidden">
      <div className="absolute left-4 -top-6.75 bg-black p-1.5">
        <Logo className="h-10.25 w-auto" />
      </div>
      <p className="w-full text-body-l leading-6 tracking-[0.02em] text-primary">{BLURB}</p>
      <LinkGrid className="w-full grid-cols-2" />
      <Image src="/landing/footer-headline-mobile.svg" alt={TAGLINE} width={358} height={65} className="h-auto w-full" />
      <div className="flex w-full flex-col items-center gap-4">
        <Socials className="justify-center" />
        <Copyright />
      </div>
    </div>
  </footer>
);

const MainnetFooter = ({ placement = "panel" }: MainnetFooterProps) =>
  placement === "landing" ? <LandingFooter /> : <PanelFooter />;

export default MainnetFooter;
