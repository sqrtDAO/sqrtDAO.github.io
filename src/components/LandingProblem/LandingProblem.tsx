"use client";

import { IconRobotOff, IconWalletOff, IconWalk, IconThumbDown } from "@tabler/icons-react";
import LandingButtonCard from "@/components/LandingButtonCard/LandingButtonCard";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import GlitchReveal from "@/components/GlitchReveal/GlitchReveal";

// Icon glyphs are the closest Tabler equivalents to Figma's exported line icons
// (robot/wallet/walking-away/thumbs-down) — reusing the project's existing icon
// system (already used this way in Header, DistributionWizard, etc.) rather than
// one-off downloaded SVG assets. Shared between desktop and mobile.
const PROBLEMS = [
  { Icon: IconRobotOff, size: 40, text: "Bots buy the first block — before any person can — and sell to everyone who came after." },
  { Icon: IconWalletOff, size: 40, text: "A few large wallets take most of the supply at the lowest price." },
  { Icon: IconWalk, size: 40, text: "There isn't enough liquidity to hold the price, so it falls and stays down." },
];

// Narrow (mobile/tablet) layout — Figma clean frames "3" (node 7060-28019) and
// "4" (node 7060-28040), unchanged node ids from the original mobile pass (no
// logo/rearrangement here, unlike Hero). Skeleton only — no GlitchReveal yet.
//
// Vertical gaps between screens: Figma's numbered frames are each a real 800px
// "screen" in the scroll sequence, with content inset from both the top and
// bottom of its own frame — the design intent is one section's content fully
// framed per screen, not two bleeding together. Gap = (previous frame's own
// bottom inset) + (next frame's own top inset), read from the metadata: Hero
// frame "2" → Problem frame "3" is ~307px (mt-[300px] below, on this section's
// own top margin); Problem frame "3" → "4" is ~290px (mt-[290px] further down).
function ProblemMobile({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <section className="relative mx-auto mt-[300px] w-full max-w-[640px] xl:hidden">
      <div className="relative mx-auto w-full max-w-[390px]">
        {/* Frame "3" */}
        <div className="relative h-[485px] w-full">
          <img src="/landing/problem-mobile-card.svg" alt="" width={374} height={402} className="absolute left-0 top-[20px] -scale-y-100" />

          <LandingAccentBar
            className="left-[16px] top-[84px]"
            orientation="vertical"
            band={{ width: 251, height: 12, tint: "ochre-500" }}
            chips={[
              { offset: 0, width: 20, tint: "ochre-700" },
              { offset: 20, width: 20, tint: "ochre-900" },
              { offset: 40, width: 20, tint: "ochre-700" },
            ]}
          />

          <p className="absolute left-[36px] top-[89px] w-[340px] font-display text-h1 font-semibold leading-none tracking-[-0.48px] text-primary">
            Most tokens never recover from their first minute.
          </p>

          <p className="absolute left-[83px] top-[378px] w-[239px] text-body text-primary">
            A normal launch puts your whole supply on the market at once.
          </p>

          <div className="absolute left-[282px] top-0 size-[40px] rounded-none bg-black" />

          {/* Chevron — desktop approximates this as a flat LandingFragment; mobile
              uses the real exported asset instead, per the asset-fidelity rule. */}
          <img src="/landing/problem-mobile-chevron.svg" alt="" width={120} height={40} className="absolute left-[28px] top-[445px] -scale-y-100" />
        </div>

        {/* Frame "4" — inset 16px, same as Hero's second-frame convention. Height
            is auto (not Figma's fixed 557px) since the content below flows
            naturally — see comment further down. mt-[290px] (not the old mt-12)
            for the same one-screen-per-content reason as the section's own top
            margin above. flow-root: without it, the content container's own
            mt-[72px] collapses straight through this plain relative block (no
            border/padding to stop it) and renders flush with the wrapper's own
            top — landing the title on top of the first black square and pushing
            the rose bar down into the list instead of sitting above it. flow-root
            gives the wrapper its own block-formatting context so that margin
            actually creates space here instead of leaking out. */}
        <div className="relative left-[16px] mt-[290px] w-[358px] flow-root">
          <LandingAccentBar
            className="left-0 top-[60px]"
            band={{ width: 265, height: 12, tint: "rose-500" }}
            chips={[
              { offset: 0, width: 40, tint: "rose-700" },
              { offset: 40, width: 40, tint: "rose-900" },
              { offset: 225, width: 40, tint: "rose-300" },
            ]}
          />

          <div className="absolute left-[225px] top-0 size-[24px] rounded-none bg-black" />
          <div className="absolute left-[294px] top-[36px] size-[24px] rounded-none bg-black" />

          {/* Content flows naturally (not fixed-offset like Figma) so the CTA
              below never collides with wrapped text — same fix desktop already
              needed for this exact card. */}
          <div className="mt-[72px] flex w-[358px] flex-col gap-6 rounded-none bg-black">
            <p className="font-display text-h3 text-primary">Old-fashioned problems</p>
            {PROBLEMS.map(({ Icon, size, text }) => (
              <div key={text} className="flex items-center gap-4">
                <Icon size={size} stroke={1.5} className="shrink-0 text-primary" />
                <p className="text-body text-primary">{text}</p>
              </div>
            ))}
            <div className="flex items-center gap-4">
              <IconThumbDown size={48} stroke={1.5} className="shrink-0 text-accent" />
              <p className="text-body-l text-primary">
                You did the work. The fastest bot took the reward, and your token wears the chart forever.
              </p>
            </div>
          </div>

          <LandingButtonCard onClick={onTryItClick}>
            Try it on testnet
          </LandingButtonCard>
        </div>
      </div>
    </section>
  );
}

export default function LandingProblem({ onTryItClick }: { onTryItClick?: () => void }) {
  return (
    <>
      <section className="relative mx-auto hidden min-h-[1100px] w-full max-w-[1920px] px-gutter xl:block">
        <div className="relative mx-auto h-[888px] w-[1496px]">
          {/* Headline card — Figma's own exported SVG silhouette (boolean-union of
              overlapping rects), not a hand-reconstructed approximation. Figma renders
              it vertically flipped (-scale-y-100), reproduced here to match. */}
          <div className="absolute left-0 top-0 h-[627px] w-[835px]">
            <GlitchReveal>
              <img src="/landing/problem-card.svg" alt="" width={788} height={421} className="absolute left-[24px] top-0 -scale-y-100" />
            </GlitchReveal>

            <GlitchReveal>
              <LandingAccentBar
                className="left-0 top-[21px]"
                orientation="vertical"
                band={{ width: 503, height: 24, tint: "ochre-500" }}
                chips={[
                  { offset: 0, width: 40, tint: "ochre-700" },
                  { offset: 40, width: 40, tint: "ochre-900" },
                  { offset: 80, width: 40, tint: "ochre-700" },
                ]}
              />
            </GlitchReveal>

            <GlitchReveal>
              <p className="absolute left-[37px] top-[65px] w-[798px] font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
                Most tokens never recover from their first minute.
              </p>
            </GlitchReveal>
            <GlitchReveal>
              <p className="absolute left-[37px] top-[258px] w-[440px] text-h4 text-primary">
                A normal launch puts your whole supply on the market at once.
              </p>
            </GlitchReveal>

            <GlitchReveal>
              <LandingFragment className="left-[60px] top-[392px] size-[40px]" />
            </GlitchReveal>
            <GlitchReveal>
              <LandingFragment className="left-[418px] top-[456px] size-[40px]" />
            </GlitchReveal>
            <GlitchReveal>
              <LandingFragment className="left-[152px] top-[457px] h-[170px] w-[110px]" />
            </GlitchReveal>
            <GlitchReveal>
              <LandingFragment className="left-[304px] top-[544px] h-[40px] w-[120px]" />
            </GlitchReveal>

            <GlitchReveal>
              <div className="absolute left-[477px] top-[291px] h-[20px] w-[270px] rounded-none bg-[var(--color-support-teal-700)]" />
            </GlitchReveal>
            <GlitchReveal>
              <div className="absolute left-[477px] top-[311px] h-[110px] w-[270px] rounded-none bg-[var(--color-slate-800)]" />
            </GlitchReveal>
            <GlitchReveal>
              <div className="absolute left-[477px] top-[311px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-700)]" />
            </GlitchReveal>
            <GlitchReveal>
              <div className="absolute left-[518px] top-[311px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-600)]" />
            </GlitchReveal>
            <GlitchReveal>
              <div className="absolute left-[559px] top-[311px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-700)]" />
            </GlitchReveal>
            <GlitchReveal>
              <div className="absolute left-[664px] top-[381px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-700)]" />
            </GlitchReveal>
            <GlitchReveal>
              <div className="absolute left-[705px] top-[381px] h-[40px] w-[42px] rounded-none bg-[var(--color-slate-600)]" />
            </GlitchReveal>
          </div>

          {/* "Old-fashioned problems" card — content flows naturally (not fixed-offset
              like Figma) so the CTA below never collides with wrapped text. */}
          <div className="absolute left-[912px] top-[180px] w-[511px]">
            <GlitchReveal>
              <LandingAccentBar
                className="left-0 top-0"
                band={{ width: 265, height: 24, tint: "rose-500" }}
                chips={[
                  { offset: 0, width: 40, tint: "rose-700" },
                  { offset: 40, width: 40, tint: "rose-900" },
                  { offset: 225, width: 40, tint: "rose-300" },
                ]}
              />
            </GlitchReveal>

            <GlitchReveal>
              <div className="mt-6 flex w-[511px] flex-col gap-8 rounded-none bg-black">
                <p className="font-display text-h3 text-primary">Old-fashioned problems</p>
                {PROBLEMS.map(({ Icon, size, text }) => (
                  <div key={text} className="flex items-center gap-4">
                    <Icon size={size} stroke={1.5} className="shrink-0 text-primary" />
                    <p className="text-body-l text-primary">{text}</p>
                  </div>
                ))}
                <div className="flex items-center gap-6">
                  <IconThumbDown size={48} stroke={1.5} className="shrink-0 text-accent" />
                  <p className="text-h4 text-primary">
                    You did the work. The fastest bot took the reward, and your token wears the chart forever.
                  </p>
                </div>
              </div>
            </GlitchReveal>

            <GlitchReveal>
              <LandingButtonCard onClick={onTryItClick}>
                Try it on testnet
              </LandingButtonCard>
            </GlitchReveal>
          </div>
        </div>
      </section>

      <ProblemMobile onTryItClick={onTryItClick} />
    </>
  );
}