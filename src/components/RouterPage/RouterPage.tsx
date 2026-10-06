"use client";

import { useState } from "react";
import Link from "next/link";
import WhyLaunchDialog from "@/components/WhyLaunchDialog/WhyLaunchDialog";
import { DISTRIBUTION_LAUNCH_HREF, TOKEN_LAUNCH_HREF } from "@/constants/links";
import { WizardShell } from "@/components/WizardShell/WizardShell";

type RouterCard = {
  href: string;
  answer: string;
  title: string;
  description: string;
  accent: boolean;
};

const CARDS: RouterCard[] = [
  {
    href: TOKEN_LAUNCH_HREF,
    answer: "No",
    title: "Create a token",
    description: "We'll create it, then set up its distribution.",
    accent: true,
  },
  {
    href: DISTRIBUTION_LAUNCH_HREF,
    answer: "Yes",
    title: "Import a token",
    description: "Bring your existing token and set up its distribution.",
    accent: false,
  },
];

const cardClass =
  "group flex flex-col gap-4 rounded-(--radius-l) border border-subtle bg-surface px-5 py-4 text-left transition-colors hover:bg-raised focus-visible:border-focus focus-visible:outline-none xl:h-59 xl:flex-1";

const CardInner = ({
  answer,
  title,
  description,
  accent,
}: Omit<RouterCard, "href">) => (
  <>
    <span className="flex flex-col gap-1 xl:gap-4">
      <span className="text-body leading-5.5 tracking-[0.01em] text-primary xl:font-display xl:text-h3 xl:leading-normal xl:tracking-normal">
        {answer}
      </span>
      <span
        className={`text-h4 leading-none font-medium group-hover:text-accent ${
          accent
            ? "text-accent xl:text-primary xl:group-hover:text-accent"
            : "text-primary"
        }`}
      >
        {title}
      </span>
    </span>
    <span className="flex h-14 items-center text-body leading-5.5 tracking-[0.01em] text-secondary xl:h-auto xl:flex-1">
      {description}
    </span>
  </>
);

// Figma 11318:97198 (desktop) / 14467:103296 (mobile).
// When `onImport` is given, the "Import a token" card advances the caller's flow instead of navigating.
const RouterPage = ({ onImport }: { onImport?: () => void }) => {
  const [whyOpen, setWhyOpen] = useState(false);

  return (
    <WizardShell closeHref="/" spacious>
      <div className="flex w-full flex-col gap-8">
        {/* Desktop 11318:97203 moved to the new copy at h3; mobile frame still shows the old h2 title. */}
        <div className="flex w-full flex-col gap-2">
          <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary xl:text-h3 xl:font-normal xl:tracking-normal">
            <span className="xl:hidden">Do you own a token?</span>
            <span className="hidden xl:inline">Does your project already have a token?</span>
          </h1>
          <p className="text-body-l leading-6 tracking-[0.02em] text-secondary">
            A token for your project, or one you already own.
          </p>
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          {CARDS.map(({ href, answer, title, description, accent }) => {
            const isImport = href === DISTRIBUTION_LAUNCH_HREF;
            const inner = (
              <CardInner answer={answer} title={title} description={description} accent={accent} />
            );
            return isImport && onImport ? (
              <button key={href} type="button" className={cardClass} onClick={onImport}>
                {inner}
              </button>
            ) : (
              <Link key={href} href={href} className={cardClass}>
                {inner}
              </Link>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={() => setWhyOpen(true)}
        className="w-full rounded-m px-6 py-3 text-left text-body-l leading-6 font-medium tracking-[0.02em] text-primary transition-colors hover:text-accent active:text-secondary xl:text-center"
      >
        Why launch &amp; distribute a token with sqrtDAO?
      </button>

      {whyOpen && <WhyLaunchDialog onClose={() => setWhyOpen(false)} />}
    </WizardShell>
  );
};

export default RouterPage;
