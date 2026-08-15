import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";

// Narrow (mobile/tablet) layout — Figma clean component "landing footer"
// (node 7063-28761), which frame "10" (node 7060-28154) instances directly.
// mt-[240px]: breathing room before the footer starts, same "one screen, one
// focus" reasoning as HelpUsBuildItMobile's own mt-[280px] above it — a
// judgment call, not derived (this component has no fixed position of its
// own in the frame sequence; it's called directly after the mobile card).
// Desktop's own footer usage is untouched (mt only applies inside this
// xl:hidden block). Skeleton only — no GlitchReveal yet.
function LandingFooterMobile({
  onTryItClick,
  mobileTopMargin,
}: {
  onTryItClick?: () => void;
  mobileTopMargin: string;
}) {
  return (
    <div
      className={`relative ${mobileTopMargin} flex w-full flex-col items-center gap-8 bg-canvas px-4 py-12 xl:hidden`}
    >
      <div className="absolute left-[16px] top-[-27px] rounded-none bg-black p-[6px]">
        <Logo variant="complete" dark width={94} height={41} />
      </div>

      <div className="flex w-full flex-col items-start gap-8">
        <p className="w-[273px] text-h4 font-medium text-primary">
          Try it on the Base testnet.
          <br />
          Then tell us how it was.
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <Button variant="primary" size="m" fullWidth onClick={onTryItClick}>
            Try it on testnet
          </Button>
          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              size="m"
              className="flex-1"
              onClick={() =>
                window.open(
                  "https://discord.gg/hsW64egPRJ",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Join Discord
            </Button>
            <Button
              variant="outline"
              size="m"
              className="flex-1"
              onClick={() =>
                window.open(
                  "https://x.com/sqrtDAO",
                  "_blank",
                  "noopener,noreferrer",
                )
              }
            >
              Follow on X
            </Button>
          </div>
        </div>
      </div>

      <img
        src="/landing/footer-headline-mobile.svg"
        alt="Give your token a beginning it can survive"
        width={358}
        height={65}
        className="w-full"
      />
    </div>
  );
}

export default function LandingFooter({
  onTryItClick,
  mobileTopMargin = "mt-[240px]",
}: {
  onTryItClick?: () => void;
  /** Tailwind margin-top class for the mobile variant. Defaults to the
   * landing page's own "one screen, one focus" spacing (mt-[240px]) so
   * existing call sites (e.g. src/app/page.tsx) render unchanged; pass
   * "mt-0" or similar when this footer follows content that already
   * defines its own spacing, e.g. a flush footer per Figma. */
  mobileTopMargin?: string;
}) {
  return (
    <>
      {/* px-[60px]: absorbed from the LandingHelpUsBuildIt call site so
          <LandingFooter /> can be called the same way at every breakpoint —
          desktop's footer is adaptive-width (viewport minus 60px each side),
          not capped by the 1920px main-content frame like the sections above. */}
      <div className="relative hidden w-full flex-col items-center gap-14 bg-canvas px-[60px] py-10 xl:flex">
        <div className="absolute left-0 top-[-53px] rounded-none bg-black p-[10px]">
          <Logo variant="complete" dark />
        </div>

        <div className="flex w-full items-center justify-center gap-6">
          <p className="w-[273px] text-h4 text-primary">
            Try it on the Base testnet.
            <br />
            Then tell us how it was.
          </p>
          <Button variant="primary" size="m" onClick={onTryItClick}>
            Try it on testnet
          </Button>
          <Button
            variant="outline"
            size="m"
            onClick={() =>
              window.open(
                "https://discord.gg/hsW64egPRJ",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            Join Discord
          </Button>
          <Button
            variant="outline"
            size="m"
            onClick={() =>
              window.open(
                "https://x.com/sqrtDAO",
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            Follow on X
          </Button>
        </div>

        <img
          src="/landing/footer-headline.svg"
          alt="Give your token a beginning it can survive"
          className="h-[66px] w-[1300px]"
        />
      </div>

      <LandingFooterMobile
        mobileTopMargin={mobileTopMargin}
        onTryItClick={onTryItClick}
      />
    </>
  );
}
