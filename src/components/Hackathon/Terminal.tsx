import type { CSSProperties, ReactNode } from "react";
import { PAUSE } from "./classes";

// Shared terminal pieces (hero launch console + Help support console). Must render inside an
// InView group/view: lines type once on enter (stepped clip-path — no reflow), then the amber
// cursor appears and shimmers. Reduced motion: everything shows, cursor solid.

export type TermLine = { text: string; node: ReactNode };
const TEAL = "text-(--color-support-teal-300)";

export const termLines = (command: string, rows: { label: string; value: string; tone?: string }[]): TermLine[] => [
  {
    text: `$ ${command}`,
    node: (
      <>
        <span className="text-accent">$</span> <span className="text-primary">{command}</span>
      </>
    ),
  },
  ...rows.map(({ label, value, tone = TEAL }) => ({
    text: label + value,
    node: (
      <>
        {label}
        <span className={tone}>{value}</span>
      </>
    ),
  })),
];

const CHAR_MS = 12;
const LINE_GAP_MS = 100;

/** Per-line timing vars and when typing finishes (ms after entering view). */
export const typing = (lines: TermLine[], start = 300) =>
  lines.reduce<{ at: number; list: CSSProperties[] }>(
    (acc, { text }) => ({
      at: acc.at + text.length * CHAR_MS + LINE_GAP_MS,
      list: [...acc.list, { "--d": `${acc.at}ms`, "--t": `${text.length * CHAR_MS}ms`, "--n": String(text.length) } as CSSProperties],
    }),
    { at: start, list: [] },
  );

export const ONCE = "delay-(--d) motion-safe:duration-(--t)";

// Amber block shimmer: pulsing fill + soft glow on an inner layer, so the outer element keeps
// its own fade-in. Pauses off screen.
export const Shimmer = ({ className = "" }: { className?: string }) => (
  <span
    style={{ animationDuration: "1.4s" }}
    className={`block size-full bg-action motion-safe:animate-pulse motion-safe:shadow-[0_0_10px_var(--color-alpha-amber-45)] ${PAUSE} ${className}`}
  />
);

export const TypedLines = ({ lines, start }: { lines: TermLine[]; start?: number }) => {
  const { list, at } = typing(lines, start);
  return (
    <div className="whitespace-pre text-secondary">
      {lines.map(({ text, node }, i) => (
        <p
          key={text}
          style={list[i]}
          className={`w-fit [clip-path:inset(0)] motion-safe:transition-[clip-path] motion-safe:ease-[steps(var(--n))] motion-safe:group-data-[view=idle]/view:[clip-path:inset(0_100%_0_0)] ${ONCE}`}
        >
          {node}
        </p>
      ))}
      <div className="flex h-[1lh] items-center" aria-hidden="true">
        <span
          style={{ "--d": `${at}ms`, "--t": "1ms" } as CSSProperties}
          className={`h-[1.13em] w-[0.6em] motion-safe:transition-opacity motion-safe:group-data-[view=idle]/view:opacity-0 ${ONCE}`}
        >
          <Shimmer />
        </span>
      </div>
    </div>
  );
};
