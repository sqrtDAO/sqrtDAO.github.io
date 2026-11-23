"use client";

import { Children, useEffect, useRef, type ReactNode } from "react";
import { addTick } from "@/utils/raf";

const OUT_MS = 220; // burn-out
const IN_MS = 300; // light-up (also the on-load reveal)
const PANEL = 96; // LED panel size, px
const GESTURE_GAP_MS = 120; // wheel silence that starts a new gesture unless deltas are still decaying
const LONG_GAP_MS = 300; // silence that always starts a new gesture
const SURGE = 1.5; // |delta| jump vs. the previous event that means fingers pushed again (momentum only decays)
const PUSH_MS = 250; // a gesture's own finger push (rising deltas) — surges inside it aren't new gestures
const EDGE_PX = 2;
const DOWN_KEYS = new Set(["ArrowDown", "PageDown", " "]);
const UP_KEYS = new Set(["ArrowUp", "PageUp"]);
const DARK = "linear-gradient(transparent 0 0)";

const smooth = (t: number) => t * t * (3 - 2 * t);
const pct = (i: number, n: number) => (n > 1 ? `${(i / (n - 1)) * 100}%` : "0%");

const shuffled = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ i, k: Math.random() }))
    .sort((a, b) => a.k - b.k)
    .map(({ i }) => i);

// CSS mask showing only the `lit` LED panels of a cols × rows grid.
const panelMask = (lit: number[], cols: number, rows: number) => {
  const size = `calc(100% / ${cols} + 1px) calc(100% / ${rows} + 1px)`;
  return lit.map((i) => `linear-gradient(#000 0 0) ${pct(i % cols, cols)} ${pct(Math.floor(i / cols), rows)} / ${size} no-repeat`).join(",");
};

// One pixel transition on a panel: "out" lit → dark, "in" dark → lit, panels in scattered order.
const play = (el: HTMLElement, dir: "in" | "out") =>
  new Promise<void>((done) => {
    const cols = Math.max(1, Math.round(el.offsetWidth / PANEL));
    const rows = Math.max(1, Math.round(Math.min(el.offsetHeight, innerHeight) / PANEL));
    const order = shuffled(cols * rows);
    const ms = dir === "in" ? IN_MS : OUT_MS;
    let t = 0;
    let key = -1;
    const paint = () => {
      const n = Math.round(smooth(dir === "in" ? t : 1 - t) * order.length);
      if (n === key) return;
      key = n;
      el.style.mask = n === order.length ? "" : n ? panelMask(order.slice(0, n), cols, rows) : DARK;
    };
    paint();
    el.style.transition = "none";
    el.style.visibility = "visible";
    const stop = addTick((dt) => {
      t = Math.min(1, t + dt / ms);
      paint();
      if (t < 1) return;
      stop();
      el.style.mask = "";
      if (dir === "out") el.style.visibility = "hidden";
      done();
    });
  });

// "LED wall" section snap: one wheel gesture / key press = next section. The current panel burns
// out in place, the scroll position jumps while it's dark, the next panel lights up — nothing
// travels. The first panel lights up on load.
// Safety: only on fine pointers with motion allowed (touch + reduced motion = plain native scroll);
// panels taller than the viewport scroll natively to their edge; nothing ever sets overflow, so the
// scrollbar, Tab, find-in-page and screen readers keep working. The first panel starts hidden via
// @starting-style with a 2s CSS failsafe, so a failed init still shows it.
// Desktop: panels clear the 96px sticky nav (the first one sits under it in normal flow).
const SnapDeck = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const deck = ref.current;
    const main = deck?.closest("main");
    if (!deck || !main || !matchMedia("(pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    const all = Array.from(deck.children) as HTMLElement[];
    const shown = () => all.filter((p) => p.offsetParent); // skips panels hidden at this breakpoint
    let busy = false;
    let queued: boolean | null = null; // one direction remembered from input made mid-transition
    let last = { at: 0, abs: 0, down: true };
    let gestureAt = 0;

    // Panel the viewport is mostly showing (read on input only, never in the rAF loop).
    const current = (panels: HTMLElement[]) => {
      const vh = main.clientHeight;
      let best = 0;
      let bestArea = -1;
      panels.forEach((p, i) => {
        const r = p.getBoundingClientRect();
        const area = Math.min(r.bottom, vh) - Math.max(r.top, 0);
        if (area > bestArea) [best, bestArea] = [i, area];
      });
      return best;
    };

    // True when the panel still has content past the viewport edge in that direction.
    const roomInside = (p: HTMLElement, down: boolean) => {
      const r = p.getBoundingClientRect();
      return down ? r.bottom > main.clientHeight + EDGE_PX : r.top < -EDGE_PX;
    };

    const goTo = async (from: HTMLElement, to: HTMLElement) => {
      busy = true;
      try {
        await play(from, "out");
        to.style.visibility = "hidden";
        main.scrollTop = to === all[0] ? 0 : main.scrollTop + to.getBoundingClientRect().top;
        from.style.visibility = "";
        await play(to, "in");
        to.focus({ preventScroll: true });
      } finally {
        all.forEach((p) => (p.style.visibility = p.style.mask = ""));
        busy = false;
      }
      if (queued !== null) {
        const down = queued;
        queued = null;
        step(down);
      }
    };

    // Returns true when the input was taken over (caller then prevents the native scroll).
    const step = (down: boolean) => {
      if (busy) {
        queued = down;
        return true;
      }
      const panels = shown();
      const i = current(panels);
      const to = panels[i + (down ? 1 : -1)];
      if (!to || roomInside(panels[i], down)) return false;
      void goTo(panels[i], to);
      return true;
    };

    const onWheel = (e: WheelEvent) => {
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY) || !e.deltaY) return;
      const now = e.timeStamp;
      const down = e.deltaY > 0;
      const abs = Math.abs(e.deltaY);
      const surge = abs > last.abs * SURGE + 4 && now - gestureAt > PUSH_MS;
      const gap = now - last.at;
      const fresh = down !== last.down || surge || gap > LONG_GAP_MS || (gap > GESTURE_GAP_MS && abs >= last.abs);
      last = { at: now, abs, down };
      if (fresh) gestureAt = now;
      if (fresh) {
        if (step(down)) e.preventDefault();
        return;
      }
      // Inertia tail of a gesture that already advanced or reached an edge: swallow it there.
      const panels = shown();
      if (busy || !roomInside(panels[current(panels)], down)) e.preventDefault();
    };

    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.altKey || e.ctrlKey || e.metaKey || t.isContentEditable || /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(t.tagName)) return;
      const down = DOWN_KEYS.has(e.key) && !e.shiftKey;
      const up = UP_KEYS.has(e.key) || (e.key === " " && e.shiftKey);
      if (!down && !up) return;
      if (step(down)) return e.preventDefault();
      // Inside a section taller than the viewport: scroll it softly, stopping at its edge. Past the
      // first/last section (e.g. down to the footer) keys stay native.
      const panels = shown();
      const r = panels[current(panels)].getBoundingClientRect();
      const room = down ? r.bottom - main.clientHeight : -r.top;
      if (room <= EDGE_PX) return;
      e.preventDefault();
      main.scrollBy({ top: (down ? 1 : -1) * Math.min(room, e.key.startsWith("Arrow") ? 120 : main.clientHeight * 0.85), behavior: "smooth" });
    };

    // In-deck anchors (e.g. the nav) play the transition instead of jumping; others stay native.
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element).closest?.("a[href^='#']")?.getAttribute("href");
      const to = href ? all.find((p) => p.offsetParent && p.querySelector(`[id="${href.slice(1)}"]`)) : undefined;
      if (!to) return;
      e.preventDefault();
      history.replaceState(null, "", href);
      const panels = shown();
      const from = panels[current(panels)];
      if (!busy && from !== to) void goTo(from, to);
    };

    const panels = shown();
    const first = panels[current(panels)];
    if (first) {
      busy = true;
      void play(first, "in").then(() => (busy = false));
    }

    main.addEventListener("wheel", onWheel, { passive: false });
    addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);
    return () => {
      main.removeEventListener("wheel", onWheel);
      removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, []);

  const snap =
    "pointer-fine:motion-safe:flex pointer-fine:motion-safe:flex-col pointer-fine:motion-safe:justify-center pointer-fine:motion-safe:xl:[&>section]:py-0";
  return (
    <div ref={ref}>
      {Children.map(children, (child, i) => (
        <div
          tabIndex={-1}
          className={`outline-none max-xl:has-[>.hidden]:hidden ${snap} ${
            i === 0
              ? "pointer-fine:motion-safe:min-h-dvh pointer-fine:motion-safe:transition-[visibility] pointer-fine:motion-safe:delay-2000 pointer-fine:motion-safe:duration-0 pointer-fine:motion-safe:starting:invisible pointer-fine:motion-safe:xl:min-h-[calc(100dvh-96px)]"
              : "pointer-fine:motion-safe:min-h-dvh pointer-fine:motion-safe:xl:pt-24"
          }`}
        >
          {child}
        </div>
      ))}
    </div>
  );
};

export default SnapDeck;
