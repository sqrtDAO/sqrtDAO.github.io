"use client";

import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import GlitchReveal from "@/components/GlitchReveal/GlitchReveal";

const FOUNDER_ITEMS = [
  { title: "Four jobs, one mechanism", text: "raising funds, discovering a price, building liquidity, and getting a tradable token." },
  { title: "A price that survives", text: "gradual release means the market finds a level instead of setting one in a single block." },
  { title: "No middlemen", text: "no VC, no market maker, no listing to wait for." },
  { title: "It runs itself", text: "set the schedule once; the contract does every epoch without you." },
];

function BenefitList({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="flex w-[423px] flex-col gap-2">
      {items.map((item) => (
        <div key={item.title} className="rounded-none bg-black">
          <p className="font-display text-h3 text-primary">{item.title}</p>
          <p className="text-body-l text-secondary">{item.text}</p>
        </div>
      ))}
    </div>
  );
}

// Narrow (mobile/tablet) layout — Figma clean frame "7" (node 7060-28108), a
// single frame (unlike the other sections so far, this one isn't split across
// two Figma screens). mt-[566px] derived the same way as the other
// frame-pairing gaps (see LandingProblem.tsx). Skeleton only — no GlitchReveal
// yet.
function ForFoundersMobile() {
  return (
    <section className="relative mx-auto mt-[566px] w-full max-w-[640px] xl:hidden">
      <div className="relative mx-auto flex w-full max-w-[390px] flex-col items-start gap-2">
        {/* Card — Figma's own exported SVG silhouette (a genuine multi-step
            union, not decomposable into a couple of plain rects the way
            LandingHowItWorks's card was). Fixed height is safe here since the
            headline is short, fixed, two-line text — not the unbounded list
            that broke the fixed-height card in LandingHowItWorks. */}
        <div className="relative h-[180px] w-full">
          <img src="/landing/for-founders-mobile-card.svg" alt="" width={392} height={168} className="absolute left-0 top-[12px]" />

          {/* Ochre progress-style bar — same 3-band + 3-chip motif as Hero's
              progress illustration, not the band+chips LandingAccentBar
              (that's a different shape: one solid band with chips at fixed
              offsets, not stacked decreasing-height layers). */}
          <div className="absolute left-[16px] top-[0.78px] h-[11px] w-[193px] rounded-none bg-[var(--color-support-ochre-500)]" />
          <div className="absolute left-[16px] top-0 h-[6px] w-[193px] rounded-none bg-[var(--color-support-ochre-700)]" />
          <div className="absolute left-[16px] top-0 h-[3px] w-[193px] rounded-none bg-[var(--color-support-ochre-900)]" />
          <div className="absolute left-[41px] top-0 h-[12px] w-[14px] rounded-none bg-[var(--color-support-ochre-700)]" />
          <div className="absolute left-[55px] top-0 h-[12px] w-[14px] rounded-none bg-[var(--color-support-ochre-500)]" />
          <div className="absolute left-[69px] top-0 h-[12px] w-[14px] rounded-none bg-[var(--color-support-ochre-700)]" />

          <p className="absolute left-[16px] top-[23px] text-body text-accent">For Founders, builders, token owners</p>

          <p className="absolute left-[16px] top-[45px] w-[327px] font-display text-h2 font-semibold leading-none tracking-[-0.36px] text-primary">
            Launch once,
            <br />
            Then get back to work.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 px-4">
          {FOUNDER_ITEMS.map((item) => (
            <div key={item.title} className="flex w-full flex-col justify-center rounded-none bg-black">
              <p className="text-body-l text-primary">{item.title}</p>
              <p className="text-body-s text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function LandingForFounders() {
  return (
    <>
      <section className="relative mx-auto hidden min-h-[1100px] w-full max-w-[1920px] px-gutter xl:block">
        <div className="relative mx-auto h-[888px] w-[1496px]">
          <div className="absolute left-[152px] top-[98px] h-[370px] w-[1183px]">
            {/* Headline card — Figma's own exported SVG silhouette. */}
            <GlitchReveal>
              <img
                src="/landing/for-founders-card-1.svg"
                alt=""
                width={736}
                height={265}
                className="absolute left-0 top-0"
              />
            </GlitchReveal>
            <GlitchReveal>
              <LandingAccentBar
                className="left-[318px] top-[37px]"
                band={{ width: 207.971, height: 13.979, tint: "violet-300" }}
                chips={[
                  { offset: 0, width: 31.724, tint: "violet-500" },
                  { offset: 31.54, width: 31.724, tint: "violet-900" },
                  { offset: 63.14, width: 31.724, tint: "violet-500" },
                  { offset: 176.28, width: 31.724, tint: "violet-700" },
                ]}
              />
            </GlitchReveal>
            <GlitchReveal>
              <p className="absolute left-[62px] top-[106px] text-h4 text-accent">For Founders, builders, token owners</p>
            </GlitchReveal>
            <GlitchReveal>
              <p className="absolute left-[62px] top-[138px] w-[674px] font-display text-h1 font-semibold leading-tight tracking-[-0.01em] text-primary">
                Launch once, Then get back to work.
              </p>
            </GlitchReveal>

            <GlitchReveal>
              <div className="absolute right-0 top-0">
                <BenefitList items={FOUNDER_ITEMS} />
              </div>
            </GlitchReveal>
          </div>
        </div>
      </section>

      <ForFoundersMobile />
    </>
  );
}
