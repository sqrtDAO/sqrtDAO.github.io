import Link from "next/link";
import {
  IconArrowUpRight,
  IconArticle,
  IconBrandDiscord,
  IconBrandX,
  IconCalendarEvent,
  IconCalendarTime,
  IconChartDonutFilled,
  IconMessages,
} from "@tabler/icons-react";
import { BODY_M } from "@/constants/typography";
import { DISCORD_URL, DOCS_HREF, X_URL } from "@/constants/links";
import { BOOKING_URL, WHY_TOKEN_HREF } from "@/constants/hackathon";
import InView from "./InView";
import SectionHeading from "./SectionHeading";
import { TypedLines, termLines } from "./Terminal";
import { SIZE_M_BELOW_XL } from "./classes";
import "@/components/Button/Button.css";

const CARDS = [
  { Icon: IconChartDonutFilled, title: "Token strategy help", note: "We help you choose supply, epochs and a release strategy that fit your project." },
  { Icon: IconCalendarEvent, title: "Calls when you’re stuck", note: "Book a call with the team, from setup to launch." },
  { Icon: IconMessages, title: "Feedback on what you ship", note: "Share your build and we’ll tell you what’s working and what to fix." },
  { Icon: IconBrandX, title: "Posts about your project", note: "We share what you ship with the sqrtDAO community on X." },
];

const LINKS = [
  { Icon: IconCalendarTime, label: "Book a call", href: BOOKING_URL },
  { Icon: IconBrandX, label: "DM us on X", href: X_URL },
  { Icon: IconBrandDiscord, label: "Join Discord", href: DISCORD_URL },
  { Icon: IconArticle, label: "Read the docs", href: DOCS_HREF },
];

const LINES = termLines("sqrt help --project my-idea", [
  { label: "> token strategy ........ ", value: "call booked" },
  { label: "> launch review ......... ", value: "done √" },
  { label: "> feedback on v0.2 ...... ", value: "sent" },
  { label: "> post on @sqrtDAO ...... ", value: "live ●" },
]);

const GHOST_M = "sqrt-btn sqrt-btn--ghost sqrt-btn--m";

// Figma 17472:86249 (desktop: console | 2×2 cards) / 17572:91766 (mobile: card titles as rows +
// terminal in one black block, links below). One DOM: a 2-column grid places the pieces on desktop.
const Help = () => (
  <section id="help" className="scroll-mt-24 py-6 xl:py-35">
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4 xl:max-w-[1373px] xl:gap-12 xl:px-6">
      <SectionHeading
        text="We’ll help you ship it"
        wrapClassName="px-4 xl:px-0"
        className="text-h3 leading-[normal] font-normal text-primary xl:text-[72px] xl:leading-[1.02] xl:font-semibold xl:tracking-[-0.02em]"
        backing={<span aria-hidden="true" className="absolute top-0 left-0 h-[35px] w-[346px] bg-black xl:hidden" />}
      />

      <div className="flex flex-col xl:grid xl:grid-cols-[670px_1fr] xl:grid-rows-[1fr_auto] xl:gap-x-7">
        <ul className="flex flex-col gap-4 bg-black px-4 pt-4 xl:col-start-2 xl:row-span-2 xl:grid xl:grid-cols-2 xl:gap-[18px] xl:bg-transparent xl:p-0">
          {CARDS.map(({ Icon, title, note }) => (
            <li key={title} className="flex items-center gap-1 xl:flex-col xl:items-start xl:gap-3 xl:bg-black xl:p-6">
              <span className="flex size-8 shrink-0 items-center justify-center xl:size-11" aria-hidden="true">
                <Icon className="size-5 text-(--color-support-violet-300) xl:size-8" />
              </span>
              <h3 className="font-sans text-body leading-5.5 font-normal tracking-[0.01em] text-primary xl:font-display xl:text-[22px] xl:leading-[1.15] xl:font-semibold xl:tracking-[-0.01em]">
                {title}
              </h3>
              <p className={`hidden text-secondary xl:block ${BODY_M}`}>{note}</p>
            </li>
          ))}
        </ul>

        <div className="xl:col-start-1 xl:row-start-1">
          <InView className="h-full bg-black px-4 pt-8 pb-8 font-mono text-caption leading-[1.94] xl:p-6 xl:text-body">
            <TypedLines lines={LINES} />
          </InView>
        </div>

        <div className="mt-4 flex flex-col gap-4 bg-black px-6 py-2 xl:col-start-1 xl:row-start-2 xl:mt-0 xl:p-6">
          <Link href={WHY_TOKEN_HREF} className={`sqrt-btn sqrt-btn--ghost w-full ${SIZE_M_BELOW_XL}`}>
            <span className="sqrt-btn__label">Why you might need a token?</span>
            <span className="sqrt-btn__icon" aria-hidden="true">
              <IconArrowUpRight />
            </span>
          </Link>
          <div className="grid grid-cols-2 gap-4 xl:flex xl:gap-2.5">
            {LINKS.map(({ Icon, label, href }) => (
              <Link key={label} href={href} className={GHOST_M} {...(href.startsWith("/") ? {} : { target: "_blank", rel: "noopener noreferrer" })}>
                <span className="sqrt-btn__icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="sqrt-btn__label">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Help;
