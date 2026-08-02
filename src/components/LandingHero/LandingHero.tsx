"use client";

import LandingButtonCard from "@/components/LandingButtonCard/LandingButtonCard";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import GlitchReveal from "@/components/GlitchReveal/GlitchReveal";
import Logo from "@/components/Logo/Logo";

// The hero is already on-screen the moment a new visitor lands, so its reveal
// needs to be a deliberate first impression rather than the snappier in-page
// pace used elsewhere: a longer settle and a wider stagger spread. Per-section
// tuning knobs on the primitive itself (see GlitchReveal), not a hardcoded
// special case — adjust here only.
const HERO_DURATION_MS = 1400;
const HERO_MAX_JITTER_MS = 600;

function Glitch({ children }: { children: React.ReactElement }) {
  return (
    <GlitchReveal durationMs={HERO_DURATION_MS} maxJitterMs={HERO_MAX_JITTER_MS}>
      {children}
    </GlitchReveal>
  );
}

// Static decorative mockup of the product's epoch/progress UI — not the real
// EpochBlockChart/EpochComboChart (confirmed with the user: this illustration is
// flat and non-interactive, no chart data plumbing here).
function HeroIllustration({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <div className="absolute left-[223px] top-[107px] h-[629px] w-[1167px]">
      {/* Background Frame — Figma's own exported SVG silhouette (boolean union of
          2 rects, not a plain rectangle). */}
      <Glitch>
        <img src="/landing/hero-background-frame.svg" alt="" width={1000} height={518} className="absolute left-0 top-[49px]" />
      </Glitch>

      <Glitch>
        <LandingAccentBar
          className="left-0 top-[363px]"
          band={{ width: 380, height: 22, tint: "ochre-500" }}
          chips={[
            { offset: 48.42, width: 28, tint: "ochre-700" },
            { offset: 76.42, width: 28, tint: "ochre-500" },
            { offset: 104.42, width: 28, tint: "ochre-700" },
          ]}
        />
      </Glitch>
      <Glitch>
        <LandingFragment className="left-[38px] top-[407px] size-[28px]" />
      </Glitch>

      {/* Logo — added to the design; reuses the existing Logo component
          (same asset the footer already uses) instead of Figma's raw export. */}
      <Glitch>
        <div className="absolute left-[-167px] top-[49px] rounded-none bg-black p-[10px]">
          <Logo variant="complete" dark width={146} height={64} />
        </div>
      </Glitch>

      <div className="absolute left-0 top-[1px] h-[48px] w-[400px]">
        <Glitch>
          <div className="absolute left-0 top-0 h-[48px] w-[200px] rounded-none bg-[var(--color-slate-800)]" />
        </Glitch>
        <Glitch>
          <div className="absolute left-[200px] top-0 h-[48px] w-[200px] rounded-none bg-[var(--color-slate-500)]" />
        </Glitch>
        <Glitch>
          <div className="absolute left-[200px] top-[24px] size-[24px] rounded-none bg-black" />
        </Glitch>
        <Glitch>
          <div className="absolute left-[224px] top-[24px] size-[24px] rounded-none bg-[var(--color-slate-700)]" />
        </Glitch>
      </div>

      <Glitch>
        <LandingFragment className="left-[1015px] top-[50px] size-[31px]" />
      </Glitch>
      <Glitch>
        <img src="/landing/hero-logomark.svg" alt="" width={62} height={31} className="absolute left-[1031px] top-[116px]" />
      </Glitch>

      <Glitch>
        <p className="absolute left-[3px] top-[66px] w-[917px] font-display text-display-xl font-semibold leading-none tracking-[-0.03em] text-primary">
          Token distribution that funds itself
        </p>
      </Glitch>

      <Glitch>
        <p className="absolute left-[397px] top-[407px] w-[370px] text-h4 text-primary">
          sqrtDAO distributes your token gradually, in timed windows called epochs.
          Everyone in the same epoch gets the same price.
        </p>
      </Glitch>

      <Glitch>
        <LandingButtonCard className="absolute left-[784px] top-[387px]" onClick={onTryItClick}>
          Try it on testnet
        </LandingButtonCard>
      </Glitch>

      <Glitch>
        <LandingAccentBar
          className="left-[381px] top-[567px]"
          band={{ width: 286, height: 16, tint: "teal-300" }}
          chips={[
            { offset: 77, width: 44, tint: "teal-700" },
            { offset: 121, width: 44, tint: "teal-900" },
            { offset: 165, width: 44, tint: "teal-700" },
          ]}
        />
      </Glitch>
    </div>
  );
}

// Narrow (mobile/tablet) layout — Figma clean frames "1" (node 7081-29288) and
// "2" (node 7081-29349). Still both Hero, just reorganized from the original
// two-frame split: frame "1" now carries the logo/headline/tag/description/
// progress-bar; frame "2" carries the quote box, CTA, and segmented toggle
// that used to live in frame "1" of the very first mobile pass. Confirmed by
// content, not assumed, before folding frame "2" in here rather than treating
// it as a new section.
// Skeleton only — no GlitchReveal here yet (mobile animation is a later step).
//
// No px-4 on this section: Figma's mobile frames already bake a 16px side
// gutter into each element's own left/width offsets, so this wrapper must
// render at the frame's true 390px width. Adding px-4 here on top of that
// double-pads the column to 358px, throwing off every absolute child by 32px
// combined — invisible when nothing reaches the right edge (as here), but it
// visibly clipped text in How It Works. Same reasoning applies to every other
// narrow section — see LandingHowItWorks.tsx.
function HeroMobile({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <section className="relative mx-auto w-full max-w-[640px] xl:hidden">
      <div className="relative mx-auto w-full max-w-[390px]">
        {/* Frame "1" */}
        <div className="relative h-[661px] w-full">
          <img src="/landing/hero-mobile-bg-v2.svg" alt="" width={358} height={485} className="absolute left-[16px] top-[111px]" />
          <img src="/landing/hero-mobile-union-v2b.svg" alt="" width={42} height={24} className="absolute left-[295px] top-[425px]" />
          <div className="absolute left-[313px] top-[462px] size-[24px] rounded-none bg-black" />

          {/* Logo — reuses the existing Logo component, same asset the footer uses. */}
          <div className="absolute left-[16px] top-[43px] rounded-none bg-black p-[10px]">
            <Logo variant="complete" dark />
          </div>

          {/* Headline sits flush against the background frame's left edge — both
              start at left-16, zero horizontal padding between shape and text. */}
          <p className="absolute left-[16px] top-[129px] w-[341px] font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
            Token distribution that funds itself
          </p>

          <div className="absolute right-0 top-0 flex flex-col items-start rounded-none bg-black px-2 pb-3 pt-6">
            <p className="text-[18px] font-bold leading-none text-primary">Create token easily</p>
            <p className="text-body-l leading-none text-primary">Distribute it fairly</p>
          </div>

          <p className="absolute left-[16px] top-[471px] w-[251px] text-body-l text-primary">
            sqrtDAO distributes your token gradually, in timed windows called epochs.
            Everyone in the same epoch gets the same price.
          </p>

          {/* Ochre progress illustration */}
          <div className="absolute left-[16px] top-[596.79px] h-[11px] w-[259px] rounded-none bg-[var(--color-support-ochre-500)]" />
          <div className="absolute left-[16px] top-[596px] h-[6px] w-[259px] rounded-none bg-[var(--color-support-ochre-700)]" />
          <div className="absolute left-[16px] top-[596px] h-[3px] w-[259px] rounded-none bg-[var(--color-support-ochre-900)]" />
          <div className="absolute left-[49px] top-[596px] h-[12px] w-[19px] rounded-none bg-[var(--color-support-ochre-700)]" />
          <div className="absolute left-[68px] top-[596px] h-[12px] w-[19px] rounded-none bg-[var(--color-support-ochre-500)]" />
          <div className="absolute left-[87px] top-[596px] h-[12px] w-[19px] rounded-none bg-[var(--color-support-ochre-700)]" />

          <img src="/landing/hero-mobile-union-v2a.svg" alt="" width={47} height={24} className="absolute left-[319px] top-[637px]" />
        </div>

        {/* Frame "2" — inset 16px, same as frame "1"'s content column. mt-[210px]
            (not the old mt-12) so each screen's content gets the same generous
            top/bottom whitespace Figma gives every numbered frame — one
            section's content in view at a time, not two bleeding together.
            See LandingProblem.tsx for how this gap value is derived. */}
        <div className="relative left-[16px] mt-[210px] h-[469px] w-[358px]">
          <img src="/landing/hero-mobile-2-union-a.svg" alt="" width={47} height={23} className="absolute left-[134px] top-[72px]" />
          <img src="/landing/hero-mobile-2-bg.svg" alt="" width={358} height={258} className="absolute left-0 top-[61px]" />
          <img src="/landing/hero-mobile-2-union-b.svg" alt="" width={42} height={21} className="absolute left-[181px] top-0" />
          <div className="absolute left-[87px] top-[51px] size-[21px] rounded-none bg-black" />

          <p className="absolute left-[14px] top-[166px] w-[280px] text-body-l text-primary">
            Distributing a token used to take a market maker, an exchange, and a
            prayer. Now it takes an afternoon.
          </p>

          <LandingButtonCard className="absolute left-0 top-[319px]" onClick={onTryItClick}>
            Try it on testnet
          </LandingButtonCard>

          <div className="absolute left-[162px] top-[45px] h-[16px] w-[98px] rounded-none bg-[var(--color-slate-800)]" />
          <div className="absolute left-[260px] top-[45px] h-[16px] w-[98px] rounded-none bg-[var(--color-slate-500)]" />
          <div className="absolute left-[223px] top-[45px] h-[16px] w-[12px] rounded-none bg-black" />
          <div className="absolute left-[235px] top-[45px] h-[16px] w-[12px] rounded-none bg-[var(--color-slate-700)]" />
        </div>
      </div>
    </section>
  );
}

export default function LandingHero({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <>
      <section className="relative mx-auto hidden min-h-[1100px] w-full max-w-[1920px] px-gutter xl:block">
        <div className="relative mx-auto h-[880px] w-[1496px]">
          <Glitch>
            <div className="absolute left-[106px] top-[562px] h-[209px] w-[280px] rounded-none bg-black p-6">
              <p className="text-body-l text-primary">
                Distributing a token used to take a market maker, an exchange, and a
                prayer. Now it takes an afternoon.
              </p>
            </div>
          </Glitch>

          <HeroIllustration onTryItClick={onTryItClick} />

          <Glitch>
            <div className="absolute right-[152px] top-0 rounded-none bg-black px-3 pb-4 pt-10">
              <p className="font-display text-[28px] font-bold leading-none text-primary">Create token easily</p>
              <p className="font-display text-h3 leading-none text-primary">Distribute it fairly</p>
            </div>
          </Glitch>
        </div>
      </section>

      <HeroMobile onTryItClick={onTryItClick} />
    </>
  );
}
