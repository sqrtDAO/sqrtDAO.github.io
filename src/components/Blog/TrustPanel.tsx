"use client";

import { useEffect, useState } from "react";
import { useInView } from "@/hooks/useInView";

const TRUST_CHECKS = [
  {
    title: "Real backing",
    text: "More locked backing means a deeper market from day one.",
  },
  {
    title: "A full profile",
    text: "Avatar, links, and what you're building. After backing, this is what participants check first.",
  },
  {
    title: "A long enough run",
    text: "Time to join says you're not rushing anyone.",
  },
  {
    title: "A modest founder share",
    text: "The clearest signal of your intentions.",
  },
  { title: "A flat release", text: "Simple terms, nothing to decode." },
];

const TICK_START_MS = 300;
const TICK_STEP_MS = 450;

// Trust checklist + meter. Once the panel scrolls into view, the checks light
// up one by one (300ms after entering view, then one every 450ms) while the
// meter fills stepwise with them. Reduced motion skips the observer and the
// ticker, so the finished state renders immediately.
export default function TrustPanel() {
  const { ref, inView } = useInView<HTMLDivElement>();
  const [reduced, setReduced] = useState(false);
  const [litCount, setLitCount] = useState(0);

  useEffect(() => {
    setReduced(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    if (!inView || reduced || litCount >= TRUST_CHECKS.length) return;
    const t = setTimeout(
      () => setLitCount((n) => n + 1),
      litCount === 0 ? TICK_START_MS : TICK_STEP_MS,
    );
    return () => clearTimeout(t);
  }, [inView, reduced, litCount]);

  const lit = reduced ? TRUST_CHECKS.length : litCount;
  const pct = Math.round((lit / TRUST_CHECKS.length) * 100);

  return (
    <div
      ref={ref}
      className="trust mt-5 grid gap-5 rounded-l border border-subtle bg-raised p-5 sm:grid-cols-[1fr_120px]"
    >
      <ul className="checks">
        {TRUST_CHECKS.map((check, i) => (
          <li
            key={check.title}
            className={`flex gap-3 border-b border-subtle py-3 first:pt-0 last:border-b-0 last:pb-0${i < lit ? " on" : ""}`}
          >
            <span
              aria-hidden
              className="box mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-xs font-display text-caption font-bold"
            >
              ✓
            </span>
            <span className="text-body-s leading-relaxed">
              <b className="font-display text-body font-semibold text-primary">
                {check.title}
              </b>
              <span className="block text-secondary">{check.text}</span>
            </span>
          </li>
        ))}
      </ul>
      <div className="meter relative min-h-36 overflow-hidden rounded-l border border-subtle bg-canvas">
        <div
          className="lvl absolute inset-x-0 bottom-0"
          style={{ height: `${pct}%` }}
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <small className="text-caption uppercase tracking-widest text-secondary">
            Trust
          </small>
          <em className="font-display text-h4 font-bold not-italic text-primary">
            {pct}%
          </em>
        </div>
      </div>
    </div>
  );
}
