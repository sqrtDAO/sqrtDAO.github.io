"use client";

import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";
import GlitchReveal from "@/components/GlitchReveal/GlitchReveal";

const PARTICIPANT_ITEMS = [
  { title: "Speed buys nothing", text: "The price is set when the epoch closes, not when you join." },
  { title: "Join whenever, however much", text: "One epoch or ten, any amount. Later epochs work exactly like early ones." },
  { title: "The backing can't be pulled", text: "it's locked in a Uniswap pool — not by the founder, not by us, not by anyone." },
  { title: "See where the money goes", text: "set the schedule once; the contract does every epoch without you." },
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

// Narrow (mobile/tablet) layout — Figma clean frame "8" (node 7060-28212), a
// single frame like LandingForFounders's mobile block. mt-[362px] derived the
// same way as the other frame-pairing gaps (see LandingProblem.tsx). The rose
// accent bar here uses the exact same band+chips values as LandingProblem's
// rose bar, so it's the real LandingAccentBar component — unlike
// LandingForFounders's ochre bar, which is a different (stacked-band/progress)
// motif entirely. Skeleton only — no GlitchReveal yet.
function ForParticipantsMobile() {
  return (
    <section className="relative mx-auto mt-[362px] w-full max-w-[640px] xl:hidden">
      <div className="relative mx-auto flex w-full max-w-[390px] flex-col items-start gap-2">
        {/* Card — Figma's own exported SVG silhouette, same reasoning as
            LandingForFounders's: a genuine multi-step union, and safe as a
            fixed-height asset since the headline is short, bounded text. */}
        <div className="relative h-[159px] w-full">
          <img src="/landing/for-participants-mobile-card.svg" alt="" width={374} height={147} className="absolute left-0 top-[12px]" />

          <LandingAccentBar
            className="left-0 top-0"
            band={{ width: 265, height: 12, tint: "rose-500" }}
            chips={[
              { offset: 0, width: 40, tint: "rose-700" },
              { offset: 40, width: 40, tint: "rose-900" },
              { offset: 225, width: 40, tint: "rose-300" },
            ]}
          />

          <p className="absolute left-[16px] top-[36px] text-body text-accent">For participants, believers, investors</p>

          <p className="absolute left-[16px] top-[69px] w-[337px] font-display text-h2 font-semibold leading-none tracking-[-0.36px] text-primary">
            Nobody gets in ahead of you.
          </p>
        </div>

        <div className="flex w-full flex-col gap-2 px-2">
          {PARTICIPANT_ITEMS.map((item) => (
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

export default function LandingForParticipants() {
  return (
    <>
      <section className="relative mx-auto hidden min-h-[1100px] w-full max-w-[1920px] px-gutter xl:block">
        <div className="relative mx-auto h-[888px] w-[1496px]">
          <div className="absolute left-[152px] top-[98px] h-[380px] w-[1183px]">
            <GlitchReveal>
              <img
                src="/landing/for-founders-card-2.svg"
                alt=""
                width={716}
                height={154}
                className="absolute left-0 top-[51px]"
              />
            </GlitchReveal>
            <GlitchReveal>
              <LandingAccentBar
                className="left-[260px] top-[130px]"
                band={{ width: 265, height: 24, tint: "rose-500" }}
                chips={[
                  { offset: 0, width: 40, tint: "rose-700" },
                  { offset: 40, width: 40, tint: "rose-900" },
                  { offset: 225, width: 40, tint: "rose-300" },
                ]}
              />
            </GlitchReveal>
            <GlitchReveal>
              <p className="absolute left-[24px] top-[24px] text-h4 text-accent">For participants, believers, investors</p>
            </GlitchReveal>
            <GlitchReveal>
              <p className="absolute left-[24px] top-[57px] w-[674px] font-display text-h1 font-semibold leading-tight tracking-[-0.01em] text-primary">
                Nobody gets in ahead of you.
              </p>
            </GlitchReveal>

            <GlitchReveal>
              <div className="absolute right-0 top-0">
                <BenefitList items={PARTICIPANT_ITEMS} />
              </div>
            </GlitchReveal>
          </div>
        </div>
      </section>

      <ForParticipantsMobile />
    </>
  );
}
