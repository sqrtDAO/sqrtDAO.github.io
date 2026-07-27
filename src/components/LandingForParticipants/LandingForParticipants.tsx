import LandingAccentBar from "@/components/LandingAccentBar/LandingAccentBar";

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

export default function LandingForParticipants() {
  return (
    <section className="relative mx-auto min-h-[1100px] w-full max-w-[1920px] px-gutter">
      <div className="relative mx-auto h-[888px] w-[1496px]">
        <div className="absolute left-[152px] top-[98px] h-[380px] w-[1183px]">
          <img
            src="/landing/for-founders-card-2.svg"
            alt=""
            width={716}
            height={154}
            className="absolute left-0 top-[51px]"
          />
          <LandingAccentBar
            className="left-[260px] top-[130px]"
            band={{ width: 265, height: 24, tint: "rose-500" }}
            chips={[
              { offset: 0, width: 40, tint: "rose-700" },
              { offset: 40, width: 40, tint: "rose-900" },
              { offset: 225, width: 40, tint: "rose-300" },
            ]}
          />
          <p className="absolute left-[24px] top-[24px] text-h4 text-accent">For participants, believers, investors</p>
          <p className="absolute left-[24px] top-[57px] w-[674px] font-display text-h1 font-semibold leading-tight tracking-[-0.01em] text-primary">
            Nobody gets in ahead of you.
          </p>

          <div className="absolute right-0 top-0">
            <BenefitList items={PARTICIPANT_ITEMS} />
          </div>
        </div>
      </div>
    </section>
  );
}