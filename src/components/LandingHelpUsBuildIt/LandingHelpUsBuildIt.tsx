import { Button } from "@/components/Button/Button";
import LandingFooter from "@/components/LandingFooter/LandingFooter";

export default function LandingHelpUsBuildIt() {
  return (
    <>
      <section className="relative mx-auto w-full max-w-[1920px] px-gutter">
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
              <Button variant="outline" size="l">Try now</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer is adaptive-width (viewport minus 60px each side) at every desktop
          size, not capped by the 1920px main-content frame like the sections above. */}
      <div className="w-full px-[60px]">
        <LandingFooter />
      </div>
    </>
  );
}