import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";

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

export default function LandingForFounders() {
  return (
    <section className="relative mx-auto min-h-[1100px] w-full max-w-[1920px] px-gutter">
      <div className="relative mx-auto h-[888px] w-[1496px]">
        <div className="absolute left-[152px] top-[98px] h-[370px] w-[1183px]">
          {/* Headline card — Figma's own exported SVG silhouette. */}
          <img
            src="/landing/for-founders-card-1.svg"
            alt=""
            width={736}
            height={265}
            className="absolute left-0 top-0"
          />
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
          <p className="absolute left-[62px] top-[106px] text-h4 text-accent">For Founders, builders, token owners</p>
          <p className="absolute left-[62px] top-[138px] w-[674px] font-display text-h1 font-semibold leading-tight tracking-[-0.01em] text-primary">
            Launch once, Then get back to work.
          </p>

          <div className="absolute right-0 top-0">
            <BenefitList items={FOUNDER_ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}