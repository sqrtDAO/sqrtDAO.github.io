import { Button } from "@/components/Button/Button";
import LandingFooter from "@/components/LandingFooter/LandingFooter";

// Narrow (mobile/tablet) layout — Figma clean frames "9" (node 7060-28142) and
// "10" (node 7060-28154). Unlike every other section, frame 10 is NOT new
// content: it's the same "You're early..." card as frame 9, shown via a
// negative content offset so only its tail end (and the appended footer) fit
// in frame 10's own 800px presentation-grid canvas — confirmed from the
// design context, not assumed (both frames' JSX carry the identical Container
// subtree). So this card is only built once here, immediately followed by
// <LandingFooter />, which handles its own mobile block internally.
// mt-[280px] is a judgment call, not a derived value — frame 9/10's
// negative-offset trick doesn't decompose into the top-inset/bottom-inset
// arithmetic the other frame-pairing gaps use (see LandingProblem.tsx),
// so this is sized to match the same "one screen, one focus" visual weight
// as the other section transitions instead. Skeleton only — no GlitchReveal
// yet.
function HelpUsBuildItMobile({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <section className="relative mx-auto mt-[280px] w-full max-w-[640px] xl:hidden">
      <div className="relative mx-auto w-full max-w-[390px]">
        <div className="relative mx-[16px] flex w-[358px] flex-col items-start gap-4 rounded-none bg-black">
          <p className="font-display text-h2 font-semibold leading-none tracking-[-0.36px] text-primary">
            You&apos;re early.
            <br />
            Let&apos;s shape it.
          </p>

          <div className="flex w-full flex-col items-end gap-2 px-2 py-4">
            <div className="flex w-full flex-col items-start">
              <p className="text-body-l text-primary">Launch a test token, try to break it, tell us what&apos;s confusing.</p>
              <p className="text-h4 font-medium text-accent">Starting on Base. Built to expand.</p>
            </div>
            <Button variant="outline" size="l" onClick={onTryItClick}>Try now</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function LandingHelpUsBuildIt({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <>
      <section className="relative mx-auto hidden w-full max-w-[1920px] px-gutter xl:block">
        <div className="relative mx-auto h-[672px] w-[1496px]">
          <div className="absolute left-1/2 top-[152px] flex h-[120px] w-fit -translate-x-1/2 items-center justify-center gap-24 whitespace-nowrap rounded-none bg-black px-[160px]">
            <p className="font-display text-h1 font-semibold leading-tight text-primary">
              You&apos;re early.
              <br />
              Let&apos;s shape it.
            </p>
            <div className="flex flex-col items-end gap-2">
              <div className="flex flex-col items-start">
                <p className="text-body-l text-primary">Launch a test token, try to break it, tell us what&apos;s confusing.</p>
                <p className="text-h4 text-accent">Starting on Base. Built to expand.</p>
              </div>
              <Button variant="outline" size="l" onClick={onTryItClick}>Try now</Button>
            </div>
          </div>
        </div>
      </section>

      <HelpUsBuildItMobile onTryItClick={onTryItClick} />

      <LandingFooter onTryItClick={onTryItClick} />
    </>
  );
}