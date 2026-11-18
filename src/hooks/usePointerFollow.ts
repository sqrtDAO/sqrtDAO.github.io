import { useEffect, type RefObject } from "react";
import { addTick } from "@/utils/raf";

type Apply = (el: HTMLElement, x: number, y: number, hover: number) => void;

// Smoothed pointer position over an element: x/y in [-1, 1] from its center, hover 0..1.
// Runs on the shared rAF loop only while moving or settling. Fine pointers only; off for
// reduced motion and below minWidth (checked per event so resizes are respected).
export const usePointerFollow = (ref: RefObject<HTMLElement | null>, apply: Apply, minWidth = 0) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || !matchMedia("(hover: hover) and (pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let tx = 0, ty = 0, th = 0, x = 0, y = 0, h = 0;
    let stop: (() => void) | null = null;
    const tick = (dt: number) => {
      const k = 1 - Math.exp(-dt / 120);
      x += (tx - x) * k;
      y += (ty - y) * k;
      h += (th - h) * k;
      apply(el, x, y, h);
      if (Math.abs(tx - x) + Math.abs(ty - y) + Math.abs(th - h) < 0.002) {
        stop?.();
        stop = null;
      }
    };
    const start = () => {
      if (!stop) stop = addTick(tick);
    };
    const move = (e: PointerEvent) => {
      if (innerWidth < minWidth) return;
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      th = 1;
      start();
    };
    const leave = () => {
      tx = ty = th = 0;
      start();
    };

    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      stop?.();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, apply, minWidth]);
};
