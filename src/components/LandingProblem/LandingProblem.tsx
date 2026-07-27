import { IconRobotOff, IconWalletOff, IconWalk, IconThumbDown } from "@tabler/icons-react";
import LandingButtonCard from "@/components/LandingButtonCard/LandingButtonCard";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";

// Icon glyphs are the closest Tabler equivalents to Figma's exported line icons
// (robot/wallet/walking-away/thumbs-down) — reusing the project's existing icon
// system (already used this way in Header, DistributionWizard, etc.) rather than
// one-off downloaded SVG assets.
const PROBLEMS = [
  { Icon: IconRobotOff, size: 40, text: "Bots buy the first block — before any person can — and sell to everyone who came after." },
  { Icon: IconWalletOff, size: 40, text: "A few large wallets take most of the supply at the lowest price." },
  { Icon: IconWalk, size: 40, text: "There isn't enough liquidity to hold the price, so it falls and stays down." },
];

export default function LandingProblem() {
  return (
    <section className="relative mx-auto min-h-[1100px] w-full max-w-[1920px] px-gutter">
      <div className="relative mx-auto h-[888px] w-[1496px]">
        {/* Headline card — Figma's own exported SVG silhouette (boolean-union of
            overlapping rects), not a hand-reconstructed approximation. Figma renders
            it vertically flipped (-scale-y-100), reproduced here to match. */}
        <div className="absolute left-0 top-0 h-[627px] w-[835px]">
          <img src="/landing/problem-card.svg" alt="" width={788} height={421} className="absolute left-[24px] top-0 -scale-y-100" />

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

          <p className="absolute left-[37px] top-[65px] w-[798px] font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
            Most tokens never recover from their first minute.
          </p>
          <p className="absolute left-[37px] top-[258px] w-[440px] text-h4 text-primary">
            A normal launch puts your whole supply on the market at once.
          </p>

          <LandingFragment className="left-[60px] top-[392px] size-[40px]" />
          <LandingFragment className="left-[418px] top-[456px] size-[40px]" />
          <LandingFragment className="left-[152px] top-[457px] h-[170px] w-[110px]" />
          <LandingFragment className="left-[304px] top-[544px] h-[40px] w-[120px]" />

          <div className="absolute left-[477px] top-[291px] h-[20px] w-[270px] rounded-none bg-[var(--color-support-teal-700)]" />
          <div className="absolute left-[477px] top-[311px] h-[110px] w-[270px] rounded-none bg-[var(--color-slate-800)]" />
          <div className="absolute left-[477px] top-[311px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-700)]" />
          <div className="absolute left-[518px] top-[311px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-600)]" />
          <div className="absolute left-[559px] top-[311px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-700)]" />
          <div className="absolute left-[664px] top-[381px] h-[40px] w-[41px] rounded-none bg-[var(--color-slate-700)]" />
          <div className="absolute left-[705px] top-[381px] h-[40px] w-[42px] rounded-none bg-[var(--color-slate-600)]" />
        </div>

        {/* "Old-fashioned problems" card — content flows naturally (not fixed-offset
            like Figma) so the CTA below never collides with wrapped text. */}
        <div className="absolute left-[912px] top-[180px] w-[511px]">
          <LandingAccentBar
            className="left-0 top-0"
            band={{ width: 265, height: 24, tint: "rose-500" }}
            chips={[
              { offset: 0, width: 40, tint: "rose-700" },
              { offset: 40, width: 40, tint: "rose-900" },
              { offset: 225, width: 40, tint: "rose-300" },
            ]}
          />

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

          <LandingButtonCard>
            Try it on testnet
          </LandingButtonCard>
        </div>
      </div>
    </section>
  );
}
