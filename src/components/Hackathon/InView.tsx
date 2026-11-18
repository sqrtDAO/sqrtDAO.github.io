"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { addTick } from "@/utils/raf";

type Props = {
  children: ReactNode;
  className?: string;
  /** Replay the sequence: flip back to "idle" every loopMs while on screen. */
  loopMs?: number;
};

// Sets data-view on its element: "idle" until first seen, then "in" / "out" as it enters and
// leaves (IntersectionObserver). CSS keys off it: transitions from idle are the reveals, PAUSE
// stops loops off screen. Reduced motion stays "idle" and every motion class is motion-safe,
// so the resting (final) state renders.
const InView = ({ children, className = "", loopMs }: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let stop: (() => void) | null = null;
    let since = 0;
    const tick = (_dt: number, now: number) => {
      if (!since) since = now;
      if (el.dataset.view === "idle") el.dataset.view = "in";
      else if (now - since >= loopMs!) {
        since = now;
        el.dataset.view = "idle";
      }
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.view = "in";
          if (loopMs && !stop) stop = addTick(tick);
        } else if (el.dataset.view !== "idle") {
          el.dataset.view = "out";
          stop?.();
          stop = null;
          since = 0;
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      stop?.();
    };
  }, [loopMs]);

  return (
    <div ref={ref} data-view="idle" className={`group/view ${className}`}>
      {children}
    </div>
  );
};

export default InView;
