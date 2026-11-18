"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { BODY_L, BODY_S } from "@/constants/typography";
import { X_URL } from "@/constants/links";
import { BOOKING_URL } from "@/constants/hackathon";
import SectionHeading from "./SectionHeading";

// Figma 17472:86292 (desktop) / 17573:92007 (mobile). Figma only has the first answer; the rest
// are DRAFTS built strictly from facts stated elsewhere on this page — need approval before launch.
const FAQ = [
  { q: "Who can join?", a: "Anyone 18 or older, at any experience level: students, first-time builders, experienced devs, solo or in a team, new or existing projects." },
  { q: "Do I need a big idea or a team?", a: "No. One person and one idea is enough, and small projects are welcome." },
  { q: "I’m a student. Can I join?", a: "Yes, if you’re 18 or older. Ship your first public project, with real help behind you." },
  {
    q: "I’ve never launched a token. Is that okay?",
    a: "Yes. We help you choose supply, epochs and a release strategy that fit your project, and you can book a call with the team from setup to launch.",
  },
  { q: "Does it cost anything to join?", a: "There are no forms and no applications to join. For anything about launch costs, ask us on X or in Discord." },
  {
    q: "Do I need to fill in a form?",
    a: "No. Launch and distribute your token on sqrtDAO between 23 Nov and 20 Dec, share your project and tag @sqrtDAO on X. We’ll DM you to confirm you’re in.",
  },
  {
    q: "What does the 70:30 split mean?",
    a: "For distributions in the hackathon window, 70% of the collected funds goes to your project’s address and 30% goes to your token’s liquidity pool.",
  },
  { q: "Can an existing project join?", a: "Yes. New or existing projects can join by launching and distributing their token on sqrtDAO between 23 Nov and 20 Dec." },
  { q: "Can anon teams join?", a: "Ask us on X or in Discord and we’ll let you know." },
  {
    q: "What help do I get?",
    a: "Token strategy help, calls when you’re stuck, feedback on what you ship, and posts about your project to the sqrtDAO community on X.",
  },
  {
    q: "How are prizes paid?",
    a: "sqrtDAO participates in the winner’s remaining distribution epochs after Demo Day. Your distribution must run until at least 20 Feb 2027 for the full amount.",
  },
  {
    q: "What if my distribution ends before 20 Feb?",
    a: "The prize is paid as participation in your remaining epochs, so the full amount needs your distribution to run until at least 20 Feb 2027.",
  },
  {
    q: "When and how are projects judged?",
    a: "After the Hackathon closes on 20 Dec, with winners announced in Demo week (week of 21 Dec). We look at open source and continuous shipping, community participation volume and votes, the product idea and market fit. Open-source projects with a public repo get bonus points.",
  },
];

const EXTERNAL = { target: "_blank", rel: "noopener noreferrer" } as const;

const Toggle = ({ open }: { open: boolean }) => (
  <span
    aria-hidden="true"
    className={`relative flex size-5 shrink-0 items-center justify-center transition-colors duration-300 xl:size-7 xl:rounded-m xl:border ${open ? "xl:border-action xl:bg-action" : "xl:border-strong"}`}
  >
    <span className={`h-0.5 w-3.5 rounded-[1px] xl:w-3 ${open ? "bg-primary xl:bg-on-amber" : "bg-primary"}`} />
    <span className={`absolute h-0.5 w-3.5 rotate-90 rounded-[1px] bg-primary transition-[scale] duration-300 xl:w-3 ${open ? "scale-x-0" : ""}`} />
  </span>
);

// Accessible accordion (one open at a time): heading > button[aria-expanded] controls a region.
// Height animates via grid-template-rows 0fr → 1fr (the one sanctioned layout animation);
// closed answers are inert so they leave the accessibility tree.
const Faq = () => {
  const [open, setOpen] = useState<number | null>(0);
  const base = useId();

  return (
    <section id="faq" className="scroll-mt-24 py-6 xl:py-35">
      <div className="mx-auto flex w-full max-w-[390px] flex-col gap-6 xl:max-w-[1373px] xl:flex-row xl:items-start xl:px-6">
        <div className="relative flex flex-col px-4 xl:w-[520px] xl:shrink-0 xl:gap-4 xl:px-0">
          <Image src="/hackathon/faq-heading-backing.svg" alt="" width={520} height={266} className="absolute top-0 left-0 hidden xl:block" />
          <SectionHeading
            text="Questions, answered"
            wrapClassName="xl:pt-4"
            className="text-h3 leading-[normal] font-normal text-primary xl:text-display-l xl:font-semibold xl:tracking-[-0.03em]"
            backing={<span aria-hidden="true" className="absolute top-0 -left-4 h-[35px] w-[346px] bg-black xl:hidden" />}
          />
          <p className={`relative hidden text-secondary xl:block ${BODY_L}`}>
            Still stuck?{" "}
            <a href={X_URL} {...EXTERNAL} className="text-accent hover:underline">
              DM us on X
            </a>{" "}
            or{" "}
            <a href={BOOKING_URL} {...EXTERNAL} className="text-accent hover:underline">
              book a call
            </a>
            .
          </p>
        </div>

        <div className="px-4 pb-12 xl:min-w-0 xl:flex-1 xl:border-t xl:border-muted xl:bg-black xl:py-3">
          <ul>
            {FAQ.map(({ q, a }, i) => {
              const isOpen = open === i;
              const id = `${base}-${i}`;
              return (
                <li key={q} className="border-b border-muted">
                  <h3>
                    <button
                      type="button"
                      id={`${id}-q`}
                      aria-expanded={isOpen}
                      aria-controls={`${id}-a`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full cursor-pointer items-center gap-3 rounded-s py-3 text-left focus-visible:outline-1 focus-visible:outline-focus xl:gap-5 xl:py-6"
                    >
                      <span
                        className={`flex-1 text-body leading-5.5 tracking-[0.01em] text-primary transition-colors xl:text-h4 xl:leading-[normal] xl:font-medium xl:tracking-normal ${isOpen ? "xl:text-accent" : ""}`}
                      >
                        {q}
                      </span>
                      <Toggle open={isOpen} />
                    </button>
                  </h3>
                  <div
                    id={`${id}-a`}
                    role="region"
                    aria-labelledby={`${id}-q`}
                    inert={!isOpen}
                    className={`grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
                  >
                    <div className="overflow-hidden">
                      <p className={`pb-3 text-secondary ${BODY_S} xl:pr-12 xl:pb-6 xl:text-body xl:leading-5.5`}>{a}</p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default Faq;
