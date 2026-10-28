"use client";

import { useInView } from "@/hooks/useInView";

const RUNS = [
  {
    kind: "Short run",
    cadence: "days",
    bars: [92, 80, 96, 88, 70],
    barColor: "bg-tertiary/60",
    pros: ["Funding arrives fast", "Easy to build hype around"],
    cons: [
      "Few epochs, so fewer people get in",
      "Price has little time to settle",
      "Your funding stops early",
    ],
  },
  {
    kind: "Long run",
    cadence: "weeks to months",
    bars: [
      30, 34, 28, 36, 32, 30, 35, 29, 33, 31, 36, 30, 34, 32, 29, 35, 31, 33,
      30, 34,
    ],
    barColor: "bg-accent/80",
    pros: [
      "More people can join",
      "Price finds a real level",
      "Funding keeps coming while you build",
    ],
    cons: ["Money arrives slower", "You need to keep people engaged"],
  },
];

// Short-run vs long-run comparison. The bars grow from the bottom edge,
// staggered 40ms apart, once the panel scrolls into view — see the .runs
// rules in globals.css.
export default function RunsPanel() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`runs mt-5 grid gap-4 sm:grid-cols-2${inView ? " in" : ""}`}
    >
      {RUNS.map((run) => (
        <div
          key={run.kind}
          className="rounded-l border border-subtle bg-raised p-5"
        >
          <p className="font-display text-h4 font-semibold text-primary">
            {run.kind}
          </p>
          <p className="text-caption uppercase tracking-widest text-tertiary">
            {run.cadence}
          </p>
          <div
            className="mt-4 flex h-16 items-end gap-1 border-b border-subtle"
            aria-hidden
          >
            {run.bars.map((h, i) => (
              <div
                key={i}
                className={`bar flex-1 rounded-t-xs ${run.barColor}`}
                style={{ height: `${h}%`, transitionDelay: `${i * 40}ms` }}
              />
            ))}
          </div>
          <ul className="mt-4 space-y-1.5 text-body-s leading-relaxed text-secondary">
            {run.pros.map((pro) => (
              <li key={pro}>
                <b className="font-display text-success">+</b> {pro}
              </li>
            ))}
            {run.cons.map((con) => (
              <li key={con}>
                <b className="font-display text-danger">−</b> {con}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
