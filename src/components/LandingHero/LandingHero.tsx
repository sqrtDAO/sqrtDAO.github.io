import LandingButtonCard from "@/components/LandingButtonCard/LandingButtonCard";
import LandingFragment from "@/components/LandingFragment/LandingFragment";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";

// Static decorative mockup of the product's epoch/progress UI — not the real
// EpochBlockChart/EpochComboChart (confirmed with the user: this illustration is
// flat and non-interactive, no chart data plumbing here).
function HeroIllustration() {
  return (
    <div className="absolute left-[223px] top-[107px] h-[629px] w-[1167px]">
      {/* Background Frame — Figma's own exported SVG silhouette (boolean union of
          2 rects, not a plain rectangle). */}
      <img src="/landing/hero-background-frame.svg" alt="" width={1000} height={518} className="absolute left-0 top-[49px]" />

      <LandingAccentBar
        className="left-0 top-[363px]"
        band={{ width: 380, height: 22, tint: "ochre-500" }}
        chips={[
          { offset: 48.42, width: 28, tint: "ochre-700" },
          { offset: 76.42, width: 28, tint: "ochre-500" },
          { offset: 104.42, width: 28, tint: "ochre-700" },
        ]}
      />
      <LandingFragment className="left-[38px] top-[407px] size-[28px]" />

      <div className="absolute left-0 top-[1px] h-[48px] w-[400px]">
        <div className="absolute left-0 top-0 h-[48px] w-[200px] rounded-none bg-[var(--color-slate-800)]" />
        <div className="absolute left-[200px] top-0 h-[48px] w-[200px] rounded-none bg-[var(--color-slate-500)]" />
        <div className="absolute left-[200px] top-[24px] size-[24px] rounded-none bg-black" />
        <div className="absolute left-[224px] top-[24px] size-[24px] rounded-none bg-[var(--color-slate-700)]" />
      </div>

      <LandingFragment className="left-[1015px] top-[50px] size-[31px]" />
      <img src="/landing/hero-logomark.svg" alt="" width={62} height={31} className="absolute left-[1031px] top-[116px]" />

      <p className="absolute left-[3px] top-[66px] w-[917px] font-display text-display-xl font-semibold leading-none tracking-[-0.03em] text-primary">
        Token distribution that funds itself
      </p>

      <p className="absolute left-[397px] top-[407px] w-[370px] text-h4 text-primary">
        sqrtDAO distributes your token gradually, in timed windows called epochs.
        Everyone in the same epoch gets the same price.
      </p>

      <LandingButtonCard className="absolute left-[784px] top-[387px]">
        Try it on testnet
      </LandingButtonCard>

      <LandingAccentBar
        className="left-[381px] top-[567px]"
        band={{ width: 286, height: 16, tint: "teal-300" }}
        chips={[
          { offset: 77, width: 44, tint: "teal-700" },
          { offset: 121, width: 44, tint: "teal-900" },
          { offset: 165, width: 44, tint: "teal-700" },
        ]}
      />
    </div>
  );
}

export default function LandingHero() {
  return (
    <section className="relative mx-auto min-h-[1100px] w-full max-w-[1920px] px-gutter">
      <div className="relative mx-auto h-[880px] w-[1496px]">
        <div className="absolute left-[106px] top-[562px] h-[209px] w-[280px] rounded-none bg-black p-6">
          <p className="text-body-l text-primary">
            Distributing a token used to take a market maker, an exchange, and a
            prayer. Now it takes an afternoon.
          </p>
        </div>

        <HeroIllustration />

        <div className="absolute right-[152px] top-0 rounded-none bg-black px-3 pb-4 pt-10">
          <p className="font-display text-[28px] font-bold leading-none text-primary">Create token easily</p>
          <p className="font-display text-h3 leading-none text-primary">Distribute it fairly</p>
        </div>
      </div>
    </section>
  );
}
