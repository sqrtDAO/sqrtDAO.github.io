"use client";

import { useSyncExternalStore } from "react";
import { BODY_S } from "@/constants/typography";
import { DEMO_WEEK_LABEL, TIMELINE_NOW } from "@/constants/hackathon";
import { activeWeek } from "@/utils/hackathon-week";
import InView from "./InView";
import { PAUSE } from "./classes";

// One logic for both layouts — Figma Timeline component 17586:108396 (5 variants = active week
// 1…Demo): the active week gets the live background, a note (its own, or the shared "Opens to
// join…") and a status pill. Desktop renders it as the vertical card list; mobile (Figma
// 17563:89892) as horizontal week tabs with the active week's note + pill underneath.
const WEEKS = [
  { title: "Week 1", tab: "Week 1", pill: "Opens 23 Nov" },
  { title: "Week 2", tab: "Week 2" },
  { title: "Week 3", tab: "Week 3" },
  { title: "Week 4", tab: "Week 4", note: "Ship Report: what the cohort shipped." },
  { title: "Demo week", tab: "Demo", note: `${DEMO_WEEK_LABEL}. Judging, winners announced.`, pill: "Judging" },
];
const ACTIVE_NOTE = "Opens to join. Launch. ship. market.";
const RUNNING = "Running";

const noteFor = (i: number, active: number) => WEEKS[i].note ?? (i === active ? ACTIVE_NOTE : null);
const pillFor = (i: number) => WEEKS[i].pill ?? RUNNING;

const clientWeek = () => activeWeek(TIMELINE_NOW ? Date.parse(TIMELINE_NOW) : Date.now());
const noSubscribe = () => () => {};

const DATE = `${BODY_S} text-tertiary`;
const ACTIVE_BG = "bg-live-bg";
const IDLE_BG = "bg-surface";

const From = () => (
  <p className={DATE}>
    From <span className="text-primary">23 Nov</span>
  </p>
);
const To = () => (
  <p className={DATE}>
    To <span className="text-primary">20 Dec</span>
  </p>
);

// Status pill: the dot shimmers (pulse + amber glow) to draw the eye; pauses off screen,
// solid with reduced motion.
const Pill = ({ text }: { text: string }) => (
  <p className="flex items-center gap-[7px] font-mono text-caption leading-[1.5] text-accent">
    <span
      aria-hidden="true"
      style={{ animationDuration: "1.4s" }}
      className={`size-[7px] shrink-0 rounded-pill bg-accent motion-safe:animate-pulse motion-safe:shadow-[0_0_8px_var(--color-amber-signal-text)] ${PAUSE}`}
    />
    {text}
  </p>
);

// Static export: buildWeek is the week at build time (SSR + hydration); the browser then
// switches to today's week.
const Timeline = ({ buildWeek }: { buildWeek: number }) => {
  const current = useSyncExternalStore(noSubscribe, clientWeek, () => buildWeek);
  const activeNote = noteFor(current, current);

  return (
    <InView>
      {/* Desktop */}
      <div className="hidden w-[300px] shrink-0 flex-col gap-2 bg-black p-1 xl:flex">
        <div className="flex flex-col gap-2 px-4 py-2">
          <p className="font-display text-h3 leading-[normal] text-tertiary">Timeline</p>
          <From />
        </div>
        <ol className="flex flex-col gap-1">
          {WEEKS.map(({ title }, i) => {
            const active = i === current;
            const note = noteFor(i, current);
            return (
              <li key={title} aria-current={active ? "step" : undefined} className={`flex flex-col gap-2 px-4 py-3 ${active ? ACTIVE_BG : IDLE_BG}`}>
                <p className="font-medium leading-[normal] text-primary">{title}</p>
                {note && <p className={`text-secondary ${BODY_S}`}>{note}</p>}
                {active && <Pill text={pillFor(i)} />}
              </li>
            );
          })}
        </ol>
        <div className="px-4 py-2">
          <To />
        </div>
      </div>

      {/* Mobile */}
      <div className="flex flex-col gap-2 bg-black py-2 xl:hidden">
        <div className="flex flex-col gap-1 px-4">
          <p className="text-h4 leading-[normal] font-medium text-tertiary">Timeline</p>
          <div className="flex justify-between">
            <From />
            <To />
          </div>
        </div>
        <ol className="flex gap-1 px-4">
          {WEEKS.map(({ tab }, i) => (
            <li
              key={tab}
              aria-current={i === current ? "step" : undefined}
              className={`px-1 py-1.5 font-medium leading-[normal] text-primary ${i === current ? `${ACTIVE_BG} flex-1` : IDLE_BG}`}
            >
              {tab}
            </li>
          ))}
        </ol>
        <div className="px-4">
          {activeNote && <p className={`text-secondary ${BODY_S}`}>{activeNote}</p>}
          <Pill text={pillFor(current)} />
        </div>
      </div>
    </InView>
  );
};

export default Timeline;
