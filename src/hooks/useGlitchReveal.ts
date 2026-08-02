"use client";

import { useEffect, useRef } from "react";

// One shared IntersectionObserver for every glitch-reveal element on the page,
// instead of one observer per element (a section can have 8-10 fragments).
// Elements stay observed for their whole lifetime (never unobserved after the
// first reveal) so they can glitch back in and dissolve out again each time
// the user crosses them, in either scroll direction.
interface GlitchEntry {
  onEnter: () => void;
  onLeave: () => void;
  hasEnteredOnce: boolean;
}

let observer: IntersectionObserver | null = null;
const registry = new Map<Element, GlitchEntry>();

function getObserver(): IntersectionObserver {
  if (observer) return observer;
  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const state = registry.get(entry.target);
        if (!state) continue;
        if (entry.isIntersecting) {
          state.hasEnteredOnce = true;
          state.onEnter();
        } else if (state.hasEnteredOnce) {
          // Ignore the initial false callback every observer fires on
          // observe() for elements that haven't been visible yet — only
          // dissolve out something that has actually been shown before.
          state.onLeave();
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -10% 0px" }
  );
  return observer;
}

let reducedMotion: boolean | null = null;
function prefersReducedMotion(): boolean {
  if (reducedMotion === null) {
    reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  return reducedMotion;
}

// Random per-element jitter so staggered pieces ignite in an organic,
// non-uniform order instead of a mechanical index sweep. Small range by
// default — stays well inside the ~0.5s transition budget — but callers can
// widen it (e.g. a slower first-load hero) via maxJitterMs.
const DEFAULT_MAX_JITTER_MS = 260;
const randomDelay = (maxJitterMs: number) => Math.round(Math.random() * maxJitterMs);

export interface UseGlitchRevealOptions {
  /** Stagger offset in ms. Omit to get a randomized organic jitter instead. */
  delayMs?: number;
  /** Upper bound (ms) for the randomized jitter when delayMs is omitted. */
  maxJitterMs?: number;
  /** Override for the glitch-in settle duration (default: --motion-duration-reveal). Dissolve-out duration is intentionally not configurable — exits stay uniformly quick everywhere. */
  durationMs?: number;
}

// Glitch-in on enter, dissolve-out on leave, in either scroll direction.
// Attach the returned ref to the element that should animate. See
// .glitch-target / @keyframes glitch-burn-in / glitch-dissolve-out in
// globals.css — this hook only ever toggles a class and an attribute, it
// never drives the animation itself.
export function useGlitchReveal<T extends HTMLElement>({
  delayMs,
  maxJitterMs = DEFAULT_MAX_JITTER_MS,
  durationMs,
}: UseGlitchRevealOptions = {}) {
  const ref = useRef<T | null>(null);
  const jitterRef = useRef<number | undefined>(undefined);
  if (jitterRef.current === undefined) jitterRef.current = randomDelay(maxJitterMs);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      if (process.env.NODE_ENV !== "production") {
        console.warn(
          "useGlitchReveal: ref never attached to a DOM node. If you wrapped a custom component, make sure it forwards the ref to its root element (forwardRef, or React 19's ref-as-prop)."
        );
      }
      return;
    }

    if (prefersReducedMotion()) {
      el.setAttribute("data-glitch-state", "visible");
      return;
    }

    el.style.setProperty("--glitch-delay", `${delayMs ?? jitterRef.current}ms`);
    if (durationMs) el.style.setProperty("--glitch-duration", `${durationMs}ms`);
    el.setAttribute("data-glitch-state", "idle");

    const onEnter = () => {
      el.classList.remove("animate-glitch-out");
      el.style.willChange = "opacity, transform, clip-path";
      el.setAttribute("data-glitch-state", "entering");
      el.classList.add("animate-glitch-in");
    };
    const onLeave = () => {
      el.classList.remove("animate-glitch-in");
      el.style.willChange = "opacity, transform, clip-path";
      el.setAttribute("data-glitch-state", "leaving");
      el.classList.add("animate-glitch-out");
    };
    const onAnimationEnd = (e: AnimationEvent) => {
      el.style.willChange = "";
      if (e.animationName === "glitch-burn-in") el.setAttribute("data-glitch-state", "visible");
      else if (e.animationName === "glitch-dissolve-out") el.setAttribute("data-glitch-state", "hidden");
    };
    const onAnimationCancel = () => {
      el.style.willChange = "";
    };
    el.addEventListener("animationend", onAnimationEnd);
    el.addEventListener("animationcancel", onAnimationCancel);

    registry.set(el, { onEnter, onLeave, hasEnteredOnce: false });
    getObserver().observe(el);

    return () => {
      registry.delete(el);
      getObserver().unobserve(el);
      el.removeEventListener("animationend", onAnimationEnd);
      el.removeEventListener("animationcancel", onAnimationCancel);
    };
  }, [delayMs, durationMs]);

  return ref;
}
