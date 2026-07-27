import LandingFragment from "@/components/LandingFragment/LandingFragment";
import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";

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

export default function LandingHowItWorks() {
  return (
    <section className="relative mx-auto min-h-[1100px] w-full max-w-[1920px] px-gutter">
      <div className="relative mx-auto h-[888px] w-[1496px]">
        {/* Main panel — Figma's own exported SVG silhouette (unlike LandingProblem's,
            Figma doesn't flip this particular union). */}
        <img
          src="/landing/how-it-works-card.svg"
          alt=""
          width={829}
          height={662}
          className="absolute left-[211px] top-[95px]"
        />
        <LandingFragment className="left-[152px] top-[34px] h-[87px] w-[318px]" />
        <LandingFragment className="left-[280px] top-[864px] h-[24px] w-[381px]" />
        <LandingFragment className="left-[1040px] top-[634px] size-[28px]" />
        <LandingFragment className="left-[839px] top-0 size-[31px]" />
        <LandingFragment className="left-[870px] top-[55px] size-[31px]" />

        <LandingAccentBar
          className="left-[470px] top-[98px]"
          band={{ width: 380, height: 22, tint: "ochre-500" }}
          chips={[
            { offset: 48.42, width: 28, tint: "ochre-700" },
            { offset: 76.42, width: 28, tint: "ochre-500" },
            { offset: 104.42, width: 28, tint: "ochre-700" },
          ]}
        />
        <LandingAccentBar
          className="left-[250px] top-[469px]"
          band={{ width: 208, height: 14, tint: "teal-300" }}
          chips={[
            { offset: 80, width: 32, tint: "teal-700" },
            { offset: 112, width: 32, tint: "teal-900" },
            { offset: 144, width: 32, tint: "teal-700" },
          ]}
        />

        <p className="absolute left-[212px] top-[148px] w-[431px] font-display text-display-m font-semibold leading-none tracking-[-0.02em] text-primary">
          One launch, spread across many epochs
        </p>

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

        <div className="absolute left-[152px] top-[586px] w-[432px] rounded-none bg-black">
          <p className="font-display text-h2 font-semibold text-primary">
            Your token is tradable from the first epoch close.
          </p>
        </div>

        {CALLOUTS.map((c) => (
          <div key={c.title} className={`absolute w-[260px] rounded-none bg-black ${c.className}`}>
            <p className="text-h4 text-primary">{c.title}</p>
            <p className="text-body text-secondary">{c.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
