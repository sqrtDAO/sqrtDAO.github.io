"use client";

import LandingFragment from "@/components/LandingFragment/LandingFragment";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import GlitchReveal from "@/components/GlitchReveal/GlitchReveal";

const STEPS = [
  { n: 1, title: "You set the backing", text: "Money you put up to give your token a market. It enters a Uniswap pool and locks — nobody can take it back out." },
  { n: 2, title: "Your supply splits across epochs", text: "Each epoch releases a portion, on a schedule you set." },
  { n: 3, title: "People join open epochs", text: "Anyone can put in funds while it's open." },
  { n: 4, title: "The epoch closes and settles", text: "That epoch's tokens are shared among everyone who joined, in proportion to what they put in — all at the same price." },
];

const CALLOUTS = [
  { className: "left-[901px] top-0", title: "Backing can't be pulled", text: "Not by you, not by us, not by anyone." },
  { className: "left-[1064px] top-[304px]", title: "One clear price per epoch", text: "set at close, same for everyone." },
  { className: "left-[912px] top-[794px]", title: "On-chain", text: "don't trust it — verify it." },
];

// Narrow (mobile/tablet) layout — Figma clean frames "5" (node 7060-28067) and
// "6" (node 7060-28102). Re-confirmed via a fresh get_design_context fetch,
// not assumed from the earlier metadata scan: mobile has NO floating
// annotation callouts anywhere on either frame — CALLOUTS above is desktop-only.
// mt-[230px] (section) / mt-[379px] (frame 6) derived the same way as the other
// frame-pairing gaps — see LandingProblem.tsx for the method. Skeleton only —
// no GlitchReveal yet.
function HowItWorksMobile() {
  return (
    <section className="relative mx-auto mt-[230px] w-full max-w-[640px] xl:hidden">
      <div className="relative mx-auto w-full max-w-[390px]">
        {/* Frame "5" — the card was a fixed-height SVG silhouette
            (how-it-works-mobile-card.svg, 562px tall) sized to Figma's assumed
            text length, but the step list wraps to more lines than Figma
            assumed at real widths, so a fixed-height background falls short
            and text spills below it. The shape itself is just two flush
            rectangles (its path is pure H/V line commands, no curves — see
            the SVG), so it's rebuilt here as two plain divs instead: the
            bottom one sizes to its own content via padding (not a margin, so
            it can't hit the margin-collapse bug LandingProblem.tsx hit) and
            can never fall short of the text again. Normal flow, not fixed
            heights, for the same reason. */}
        <div className="relative w-full">
          <div className="relative left-[16px] h-[126px] w-[374px] rounded-none bg-black">
            <p className="absolute left-0 top-[8px] w-[357px] font-display text-h2 font-semibold leading-none tracking-[-0.36px] text-primary">
              One launch, spread across many epochs
            </p>
          </div>

          <div className="relative left-[68px] w-[306px] rounded-none bg-black py-6 pl-[31px] pr-6">
            <p className="font-display text-h3 text-tertiary">How It Works</p>
            <div className="mt-2 flex w-full flex-col items-start gap-2">
              {STEPS.map((s) => (
                <div key={s.n} className="flex w-full items-start gap-4">
                  <p className="font-display text-h3 leading-none text-primary">{s.n}</p>
                  <div className="flex flex-1 flex-col">
                    <p className="text-body-l text-primary">{s.title}</p>
                    <p className="text-body text-secondary">{s.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Logomark — same graphic/size as Hero's, reused instead of a
              redundant re-download. Flows below the card instead of a fixed
              top offset, since the card's height is now content-driven. */}
          <img src="/landing/hero-logomark.svg" alt="" width={62} height={31} className="relative left-[37px] mt-6" />
        </div>

        {/* Frame "6" — standalone closing statement, no nested margin inside
            this block so no margin-collapse risk here. */}
        <div className="relative left-[16px] mt-[230px] flex h-[135px] w-[374px] items-center bg-black">
          <p className="w-[348px] font-display text-h2 font-semibold leading-none tracking-[-0.36px] text-primary">
            Your token is tradable from the first epoch close.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function LandingHowItWorks() {
  return (
    <>
      <section className="relative mx-auto hidden min-h-[1100px] w-full max-w-[1920px] px-gutter xl:block">
        <div className="relative mx-auto h-[888px] w-[1496px]">
          {/* Main panel — Figma's own exported SVG silhouette (unlike LandingProblem's,
              Figma doesn't flip this particular union). */}
          <GlitchReveal>
            <img
              src="/landing/how-it-works-card.svg"
              alt=""
              width={829}
              height={662}
              className="absolute left-[211px] top-[95px]"
            />
          </GlitchReveal>
          <GlitchReveal>
            <LandingFragment className="left-[152px] top-[34px] h-[87px] w-[318px]" />
          </GlitchReveal>
          <GlitchReveal>
            <LandingFragment className="left-[280px] top-[864px] h-[24px] w-[381px]" />
          </GlitchReveal>
          <GlitchReveal>
            <LandingFragment className="left-[1040px] top-[634px] size-[28px]" />
          </GlitchReveal>
          <GlitchReveal>
            <LandingFragment className="left-[839px] top-0 size-[31px]" />
          </GlitchReveal>
          <GlitchReveal>
            <LandingFragment className="left-[870px] top-[55px] size-[31px]" />
          </GlitchReveal>

          <GlitchReveal>
            <LandingAccentBar
              className="left-[470px] top-[98px]"
              band={{ width: 380, height: 22, tint: "ochre-500" }}
              chips={[
                { offset: 48.42, width: 28, tint: "ochre-700" },
                { offset: 76.42, width: 28, tint: "ochre-500" },
                { offset: 104.42, width: 28, tint: "ochre-700" },
              ]}
            />
          </GlitchReveal>
          <GlitchReveal>
            <LandingAccentBar
              className="left-[250px] top-[469px]"
              band={{ width: 208, height: 14, tint: "teal-300" }}
              chips={[
                { offset: 80, width: 32, tint: "teal-700" },
                { offset: 112, width: 32, tint: "teal-900" },
                { offset: 144, width: 32, tint: "teal-700" },
              ]}
            />
          </GlitchReveal>

          <GlitchReveal>
            <p className="absolute left-[212px] top-[148px] w-[431px] font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
              One launch, spread across many epochs
            </p>
          </GlitchReveal>

          <GlitchReveal>
            <div className="absolute left-[657px] top-[228px] w-[333px]">
              <p className="font-display text-h3 text-tertiary">How It Works</p>
              <div className="mt-6 flex flex-col gap-6">
                {STEPS.map((s) => (
                  <div key={s.n} className="flex gap-4">
                    <p className="font-display text-h2 font-semibold leading-none text-primary">{s.n}</p>
                    <div>
                      <p className="text-h4 text-primary">{s.title}</p>
                      <p className="text-body-l text-secondary">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </GlitchReveal>

          <GlitchReveal>
            <div className="absolute left-[152px] top-[586px] w-[432px] rounded-none bg-black">
              <p className="font-display text-h2 font-semibold text-primary">
                Your token is tradable from the first epoch close.
              </p>
            </div>
          </GlitchReveal>

          {CALLOUTS.map((c) => (
            <GlitchReveal key={c.title}>
              <div className={`absolute w-[260px] rounded-none bg-black ${c.className}`}>
                <p className="text-h4 text-primary">{c.title}</p>
                <p className="text-body text-secondary">{c.text}</p>
              </div>
            </GlitchReveal>
          ))}
        </div>
      </section>

      <HowItWorksMobile />
    </>
  );
}
