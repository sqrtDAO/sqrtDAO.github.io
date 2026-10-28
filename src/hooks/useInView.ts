"use client";

import { useEffect, useRef, useState } from "react";

// One-way in-view flag for the blog panels' entrance animations
// (TwoWaysDiagram, RunsPanel, FounderSharePanel, TrustPanel): flips to true
// the first time the element crosses the viewport threshold, then stops
// observing — the reveal never un-happens. Reduced motion skips observing
// entirely so panels render (or CSS forces) their final state without
// animating. The CSS side lives in globals.css under the .doors / .runs /
// .share / .trust blocks.
export function useInView<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            io.disconnect();
            return;
          }
        }
      },
      { threshold },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return { ref, inView };
}
