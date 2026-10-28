"use client";

import type { CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";

const SHARES = [
  {
    pct: "5%",
    fill: "20%",
    tone: "text-success",
    bar: "bg-success",
    read: "“Here for the long build”",
  },
  {
    pct: "15%",
    fill: "60%",
    tone: "text-accent",
    bar: "bg-accent",
    read: "“Fair, I need runway”",
  },
  {
    pct: "25%",
    fill: "100%",
    tone: "text-danger",
    bar: "bg-danger",
    read: "“Taking a lot off the top”",
  },
];

// Founder-share scale. Each fill bar grows to its data width (staged via the
// --target-width custom property), rows staggered 150ms apart, once the panel
// scrolls into view — see the .share rules in globals.css.
export default function FounderSharePanel() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`share mt-5 rounded-l border border-subtle bg-raised p-5${inView ? " in" : ""}`}
    >
      {SHARES.map((share, i) => (
        <div
          key={share.pct}
          className="mt-4 grid gap-1 first:mt-0 sm:grid-cols-[3.5rem_1fr_11rem] sm:items-center sm:gap-4"
        >
          <p className={`font-display text-h4 font-bold ${share.tone}`}>
            {share.pct}
          </p>
          <div className="h-3.5 overflow-hidden rounded-pill bg-canvas">
            <div
              className={`fill h-full rounded-pill ${share.bar}`}
              style={
                {
                  "--target-width": share.fill,
                  transitionDelay: `${i * 150}ms`,
                } as CSSProperties
              }
            />
          </div>
          <p className={`text-body-s ${share.tone}`}>{share.read}</p>
        </div>
      ))}
      <p className="mt-4 text-caption text-tertiary">
        Anywhere from 0% up to the 25% max.
      </p>
    </div>
  );
}
