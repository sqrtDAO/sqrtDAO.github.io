import { IconRosetteNumber1, IconRosetteNumber2, IconRosetteNumber3 } from "@tabler/icons-react";
import { BODY_L, BODY_M } from "@/constants/typography";
import InView from "./InView";
import SectionHeading from "./SectionHeading";

const SIDE = [
  { Icon: IconRosetteNumber2, amount: "$500", note: "For the next strongest build.", size: "xl:text-display-l xl:tracking-[-0.03em]" },
  { Icon: IconRosetteNumber3, amount: "5 × $100", note: "For five more projects worth watching.", size: "xl:text-display-m xl:tracking-[-0.02em]" },
];

const H4_MEDIUM = "xl:text-h4 xl:font-medium xl:leading-[normal] xl:tracking-normal";
// Bars grow from the left once in view (scale only).
const GROW =
  "origin-left motion-safe:transition-[scale] motion-safe:duration-1000 motion-safe:ease-out motion-safe:group-data-[view=idle]/view:scale-x-0";

// Figma 17472:86158 (desktop) / 17568:90933 + 17572:91099 (mobile: prizes, then "How it's paid").
const Prizes = () => (
  <section id="prizes" className="scroll-mt-24 py-6 xl:py-35">
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4 xl:max-w-[1373px] xl:gap-6 xl:px-6">
      <SectionHeading
        text="Prizes"
        tail="worth shipping for"
        tailClassName="text-tertiary max-xl:text-h3 max-xl:tracking-[-0.01em]"
        wrapClassName="px-4 xl:px-0"
        className="text-h2 leading-[normal] font-semibold tracking-[-0.01em] text-primary xl:text-display-m xl:tracking-[-0.02em]"
        backing={<span aria-hidden="true" className="absolute top-0 left-0 hidden h-[111px] w-[723px] bg-black xl:block" />}
      />

      {/* Mobile: one gradient block (grand + awards). Desktop: grand card + side column. */}
      <div className="flex flex-col bg-black bg-linear-[127deg] from-action-glow from-8% to-transparent to-80% py-6 xl:flex-row xl:gap-[18px] xl:bg-transparent xl:bg-none xl:p-0">
        <div className="flex flex-col xl:min-h-[440px] xl:flex-1 xl:gap-6 xl:bg-black xl:bg-linear-[147deg] xl:from-action-glow xl:from-8% xl:to-transparent xl:to-50% xl:p-8">
          <div className="p-4 xl:p-1.5">
            <IconRosetteNumber1 aria-hidden="true" stroke={1.5} className="size-[41px] text-accent xl:size-18" />
          </div>
          <div className="flex flex-col gap-2 p-4 xl:p-0">
            <p className="font-display text-display-m leading-[normal] font-semibold tracking-[-0.02em] text-accent xl:text-display-xl xl:tracking-[-0.03em]">
              $1,500
            </p>
            <h3 className="text-h3 leading-[normal] font-normal text-primary xl:text-h2 xl:font-semibold xl:tracking-[-0.01em]">Grand Prize, for #1 project</h3>
            <p className={`text-secondary ${BODY_M} xl:text-body-l xl:leading-6 xl:tracking-[0.02em]`}>
              For the strongest project across shipping, participation, product and fit.
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 xl:w-[620px] xl:shrink-0 xl:gap-[18px]">
          {SIDE.map(({ Icon, amount, note, size }) => (
            <div key={amount} className="bg-black px-4 py-1 xl:flex xl:flex-1 xl:items-center xl:gap-[22px] xl:border xl:border-muted xl:p-6">
              <Icon aria-hidden="true" stroke={1.5} className="hidden size-14 shrink-0 text-primary xl:block" />
              <div className="flex flex-col xl:gap-1">
                <p className={`font-display text-h2 leading-[normal] font-semibold tracking-[-0.01em] text-primary ${size}`}>{amount}</p>
                <p className={`text-body-s leading-5 tracking-[0.01em] text-secondary ${H4_MEDIUM}`}>{note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How it's paid — mobile: own heading + black panel; desktop: one bordered row. */}
      <div className="mt-4 flex flex-col gap-4 xl:mt-0 xl:flex-row xl:items-center xl:gap-10 xl:border xl:border-muted xl:bg-black xl:p-7">
        <h3 className="px-4 text-h2 leading-[normal] font-semibold tracking-[-0.01em] text-primary xl:hidden">How it’s paid</h3>
        <div className="flex flex-col bg-black p-4 xl:contents">
          <div className="flex flex-col gap-4 py-6 xl:w-[560px] xl:shrink-0 xl:gap-2.5 xl:p-0">
            <h3 className="hidden font-display text-h3 leading-[normal] font-normal text-primary xl:block">How it’s paid</h3>
            <p className="text-h4 leading-[normal] font-medium text-primary xl:text-secondary">sqrtDAO participates in the winner’s remaining distribution epochs.</p>
            <p className={`text-accent ${BODY_L} xl:text-body xl:leading-5.5 xl:tracking-[0.01em] xl:text-primary`}>
              Your distribution must run until at least 20 Feb 2027 for the full amount.
            </p>
          </div>
          <InView className="flex flex-col gap-2.5 bg-surface px-4 py-2 xl:min-w-0 xl:flex-1 xl:gap-4 xl:bg-transparent xl:p-0">
            <p className="font-display text-h3 leading-[normal] text-secondary">Collected funds split</p>
            <div aria-hidden="true" className="flex gap-[3px]">
              <span className={`h-3.5 flex-7 rounded-[7px] bg-(--color-support-teal-300) ${GROW}`} />
              <span className={`h-3.5 flex-3 rounded-[7px] bg-action motion-safe:delay-500 ${GROW}`} />
            </div>
            <div className="flex flex-col font-mono text-[13px] leading-[1.5] text-secondary xl:flex-row xl:justify-between xl:font-sans xl:text-body-s xl:leading-5 xl:tracking-[0.01em]">
              <p className="xl:text-(--color-support-teal-300)">
                <span className="text-primary xl:text-inherit">70%</span> goes to your address
              </p>
              <p className="xl:text-accent">
                <span className="text-primary xl:text-inherit">30%</span> goes to your token LP
              </p>
            </div>
          </InView>
        </div>
      </div>
    </div>
  </section>
);

export default Prizes;
