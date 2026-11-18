import Image from "next/image";
import Link from "next/link";
import { IconArrowUpRight } from "@tabler/icons-react";
import { BODY_S } from "@/constants/typography";
import { WHY_TOKEN_HREF } from "@/constants/hackathon";
import CtaLinks from "./CtaLinks";
import { SIZE_M_BELOW_XL } from "./classes";
import SectionHeading from "./SectionHeading";
import { activeWeek } from "@/utils/hackathon-week";
import Timeline from "./Timeline";

// Evaluated once at build (static export); the client corrects to today's week on hydration.
const BUILD_WEEK = activeWeek(Date.now());

// Desktop widths are Figma's staircase (961 / 651 / 337); mobile rows are full width.
const STEPS = [
  { title: "Launch and distribute your token on sqrtDAO.", note: "Between 23 Nov and 20 Dec.", width: "xl:w-full" },
  { title: "Share your project.", note: "Open source? Link your repo for bonus points.", width: "xl:w-[651px]" },
  { title: "Tag @sqrtDAO on X.", note: "We’ll DM you to confirm you’re in.", width: "xl:w-[337px]" },
];

// Figma 17472:85966 (desktop) / 17563:89808 (mobile).
const HowToJoin = () => (
  <section id="how-to-join" className="scroll-mt-24 xl:py-35">
    <div className="mx-auto flex w-full max-w-[390px] flex-col xl:max-w-[1373px] xl:flex-row xl:items-start xl:gap-16 xl:px-6">
      <div className="flex flex-col gap-6 px-4 py-6 xl:order-2 xl:min-w-0 xl:flex-1 xl:p-0">
        <div className="relative flex flex-col gap-1">
          <Image src="/hackathon/join-heading-backing.svg" alt="" width={585} height={100} className="absolute top-0 left-0 hidden xl:block" />
          <SectionHeading
            text="How to join"
            wrapClassName="relative"
            className="text-h2 leading-[normal] font-semibold tracking-[-0.01em] text-primary xl:text-[72px] xl:leading-[1.02] xl:tracking-[-0.02em]"
          />
          <p className="relative hidden font-mono text-[15px] leading-[1.5] whitespace-nowrap text-secondary xl:block">
            <span className="text-primary">No forms. No applications.</span> Any idea counts, and small is welcome.
          </p>
        </div>

        <div className="flex flex-col gap-1">
          <ol className="flex flex-col gap-1 xl:gap-4">
            {STEPS.map(({ title, note, width }, i) => (
              <li key={title} className={`flex items-start gap-4 bg-black px-4 xl:items-center xl:gap-6 xl:border xl:border-muted xl:p-1 ${width}`}>
                <span className="w-6 shrink-0 font-display text-h3 leading-[normal] text-accent xl:flex xl:size-14 xl:items-center xl:justify-center xl:text-[26px] xl:font-semibold xl:tracking-[-0.01em] xl:text-primary">
                  {i + 1}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <p className="text-body-l leading-6 tracking-[0.02em] text-primary xl:font-display xl:text-[26px] xl:leading-[1.15] xl:font-semibold xl:tracking-[-0.01em]">
                    {title}
                  </p>
                  <p className={`text-secondary ${BODY_S} xl:text-[17px] xl:leading-6 xl:tracking-[0.02em]`}>{note}</p>
                </div>
              </li>
            ))}
          </ol>
          <p className={`text-secondary xl:hidden ${BODY_S}`}>No forms. No applications. Any idea counts, and small is welcome.</p>
        </div>

        <div className="hidden gap-3 xl:flex">
          <CtaLinks bookIcon />
          <WhyToken />
        </div>
      </div>

      <div className="flex flex-col gap-6 xl:order-1">
        <Timeline buildWeek={BUILD_WEEK} />
        <div className="flex flex-col gap-4 px-4 pb-6 xl:hidden">
          <CtaLinks bookIcon />
          <WhyToken />
        </div>
      </div>
    </div>
  </section>
);

const WhyToken = () => (
  <Link href={WHY_TOKEN_HREF} className={`sqrt-btn sqrt-btn--outline xl:flex-1 ${SIZE_M_BELOW_XL}`}>
    <span className="sqrt-btn__label">Why you might need a token?</span>
    <span className="sqrt-btn__icon" aria-hidden="true">
      <IconArrowUpRight />
    </span>
  </Link>
);

export default HowToJoin;
