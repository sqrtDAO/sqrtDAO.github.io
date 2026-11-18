import type { ReactNode } from "react";
import { BODY_M } from "@/constants/typography";
import { OpenSourceVignette, SoloVignette, StudentsVignette, VibeVignette } from "./Vignettes";
import SectionHeading from "./SectionHeading";
import WhoCard from "./WhoCard";

const CARDS: { title: string; body: string; art: ReactNode; footer?: string; tall?: boolean }[] = [
  { title: "Solo builders and small teams", body: "No big team needed. One person and one idea is enough.", art: <SoloVignette />, tall: true },
  {
    title: "Students",
    body: "Ship your first public project, with real help behind you.",
    art: <StudentsVignette className="h-[306px] xl:h-auto xl:min-h-0 xl:flex-1" />,
    footer: "New ideas from fresh minds.",
    tall: true,
  },
  { title: "Vibe coders", body: "Turn this weekend’s idea into a live product people can use.", art: <VibeVignette /> },
  { title: "Open-source maintainers", body: "Give the project you already maintain a way to get backed.", art: <OpenSourceVignette /> },
];

// Figma 17472:86022 (desktop: 4 cards in a row) / 17566:89942 + WhoIsCards 17566:90203
// (mobile: full-width cards, each sticks to the top so the next slides over it — CSS sticky only).
const WhoItsFor = () => (
  <section id="who-its-for" aria-labelledby="who-its-for-title" className="scroll-mt-24 py-6 xl:py-30">
    <div className="mx-auto flex w-full max-w-[390px] flex-col gap-4 xl:max-w-[1373px] xl:gap-6 xl:px-6">
      <SectionHeading
        id="who-its-for-title"
        text="Who it’s for"
        className="px-4 text-h2 leading-[normal] font-semibold tracking-[-0.01em] text-primary xl:px-0 xl:text-display-m xl:tracking-[-0.02em]"
      />
      <ul className="flex flex-col xl:flex-row xl:items-start xl:gap-[18px]">
        {CARDS.map(({ title, body, art, footer, tall }) => (
          <WhoCard
            key={title}
            className={`sticky top-0 flex flex-col gap-4 bg-black px-4 py-6 xl:relative xl:min-w-0 xl:flex-1 xl:border xl:border-muted xl:px-2 xl:py-3 ${tall ? "xl:h-[483px] xl:overflow-hidden" : ""}`}
          >
            <div className="flex flex-col gap-4 xl:gap-2">
              <h3 className="font-display text-h3 leading-[normal] font-normal text-primary xl:text-h2 xl:font-semibold xl:tracking-[-0.01em]">
                {title}
              </h3>
              <p className={`text-secondary ${BODY_M}`}>{body}</p>
            </div>
            {art}
            {footer && <p className={`text-secondary ${BODY_M}`}>{footer}</p>}
          </WhoCard>
        ))}
      </ul>
    </div>
  </section>
);

export default WhoItsFor;
