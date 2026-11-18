"use client";

import { useEffect, useRef } from "react";
import { addTick } from "@/utils/raf";

// Scroll progress bar. The passive scroll listener only schedules one shared-rAF frame,
// which writes `scale` (compositor-only).
const ScrollFx = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = ref.current;
    const main = bar?.closest("main");
    if (!bar || !main) return;
    let stop: (() => void) | null = null;
    const tick = () => {
      const max = main.scrollHeight - main.clientHeight;
      bar.style.scale = `${max > 0 ? main.scrollTop / max : 0} 1`;
      stop?.();
      stop = null;
    };
    const onScroll = () => {
      if (!stop) stop = addTick(tick);
    };
    main.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      main.removeEventListener("scroll", onScroll);
      stop?.();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="fixed top-0 left-0 z-30 h-0.5 w-full origin-left scale-x-0 bg-action" />;
};

export default ScrollFx;
