import { useEffect, type RefObject } from "react";
import { addTick } from "@/utils/raf";

const REST = Math.PI / 4; // Figma: extrusion down-right
const REACH = 300; // px around the extruded line where the cursor starts to act as a light
const TAU = 60; // ms smoothing time constant
const REVEAL_MS = 700; // grow starts after the CSS reveal
const GROW_MS = 900;
const DRIFT = (14 * Math.PI) / 180; // touch idle drift amplitude
const DRIFT_PERIOD = 9000;

// Drives --dx/--dy (direction, length √2 so rest = Figma's 45° offsets) and --depth on `ref`.
// Reduced motion: does nothing — CSS defaults hold the static resting extrusion.
export const useExtrusion = (ref: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const hover = matchMedia("(hover: hover) and (pointer: fine)").matches;
    const growAt = Math.max(performance.now(), REVEAL_MS);
    // The extruded line ("launch hackathon") is the light target, not the whole h1 box.
    const line = (el.children[1] as HTMLElement | undefined) ?? el;
    let angle = REST;
    let px = -1e5;
    let py = -1e5;
    let visible = true;
    let stop: (() => void) | null = null;

    // Target angle: the shadow points away from the cursor (cursor = light). Influence fades in
    // over REACH px outside the line and fades out toward the line's center, so crossing the
    // middle eases through the resting angle instead of flipping.
    const target = (now: number) => {
      if (!hover) return REST + DRIFT * Math.sin((now / DRIFT_PERIOD) * 2 * Math.PI);
      const r = line.getBoundingClientRect();
      const dist = Math.hypot(Math.max(r.left - px, 0, px - r.right), Math.max(r.top - py, 0, py - r.bottom));
      const reach = Math.max(0, 1 - dist / REACH);
      const nx = (px - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (py - (r.top + r.height / 2)) / (r.height / 2);
      const off = Math.min(1, Math.hypot(nx, ny) * 1.5);
      const w = reach * reach * (3 - 2 * reach) * off;
      // Blend unit vectors (rest ↔ away-from-cursor) and take the angle of the result.
      const al = Math.hypot(nx, ny) || 1;
      return Math.atan2(Math.sin(REST) * (1 - w) - (ny / al) * w, Math.cos(REST) * (1 - w) - (nx / al) * w);
    };

    const tick = (dt: number, now: number) => {
      const g = Math.min(1, Math.max(0, (now - growAt) / GROW_MS));
      const goal = target(now);
      const delta = Math.atan2(Math.sin(goal - angle), Math.cos(goal - angle)); // shortest arc
      angle += delta * (1 - Math.exp(-dt / TAU));
      el.style.setProperty("--dx", (Math.cos(angle) * Math.SQRT2).toFixed(3));
      el.style.setProperty("--dy", (Math.sin(angle) * Math.SQRT2).toFixed(3));
      el.style.setProperty("--depth", (1 - (1 - g) ** 3).toFixed(3));
      if (hover && g === 1 && Math.abs(delta) < 1e-3) {
        stop?.();
        stop = null;
      }
    };

    const start = () => {
      if (!stop && visible) stop = addTick(tick);
    };
    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      start();
    };
    const onLeave = () => {
      px = py = -1e5;
      start();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else {
        stop?.();
        stop = null;
      }
    });

    io.observe(el);
    start();
    if (hover) {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    return () => {
      stop?.();
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [ref]);
};
