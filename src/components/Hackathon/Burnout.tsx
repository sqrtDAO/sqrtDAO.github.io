"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { addTick } from "@/utils/raf";

export type BurnoutStyle = "grid" | "dissolve" | "scan";

const HOLD = 1.6; // pinned scroll distance, in viewport heights
const EDGE = 0.3; // share of the range spent lighting up / burning out
const PANEL = 96; // target LED panel size, px

const clamp = (v: number) => Math.min(1, Math.max(0, v));
const pct = (i: number, n: number) => (n > 1 ? `${(i / (n - 1)) * 100}%` : "0%");

// Panel order: grid = scattered, scan = row sweep with a ragged edge.
const panelOrder = (cols: number, rows: number, style: BurnoutStyle) =>
  Array.from({ length: cols * rows }, (_, i) => ({ i, k: style === "scan" ? Math.floor(i / cols) + Math.random() * 0.8 : Math.random() }))
    .sort((a, b) => a.k - b.k)
    .map(({ i }) => i);

const panelMask = (lit: number[], cols: number, rows: number) => {
  const size = `calc(100% / ${cols} + 1px) calc(100% / ${rows} + 1px)`;
  return lit.map((i) => `linear-gradient(#000 0 0) ${pct(i % cols, cols)} ${pct(Math.floor(i / cols), rows)} / ${size} no-repeat`).join(",");
};

// "LED wall burnout": the section pins in place (CSS sticky, native scroll), lights up, holds,
// then burns out in place. Scroll progress is read in one shared-rAF frame scheduled by a passive
// scroll listener; layout is only measured in a ResizeObserver. Writes are mask/opacity/visibility.
// Content taller than the viewport doesn't pin — it burns in/out as it passes (graceful fallback).
// Reduced motion: no pin, no effect. `enter={false}` starts lit (first screen).
const Burnout = ({ style = "grid", enter = true, children }: { style?: BurnoutStyle; enter?: boolean; children: ReactNode }) => {
  const boxRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    const pin = pinRef.current;
    const main = box?.closest("main");
    if (!box || !pin || !main || matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let fits = false;
    let start = 0;
    let end = 1;
    let cols = 1;
    let rows = 1;
    let order: number[] = [0];
    let key = "";
    let stop: (() => void) | null = null;

    const apply = () => {
      const p = (main.scrollTop - start) / (end - start);
      const on = enter ? clamp(p / EDGE) : 1;
      const off = clamp((p - 1 + EDGE) / EDGE);
      if (style === "dissolve") {
        const o = on * (1 - off);
        pin.style.opacity = `${o * o * (3 - 2 * o)}`;
        pin.style.visibility = o > 0 ? "" : "hidden";
        return;
      }
      const n = order.length;
      const a = Math.round(off * n);
      const b = Math.round(on * n);
      if (`${a}:${b}` === key) return;
      key = `${a}:${b}`;
      pin.style.visibility = a < b ? "" : "hidden";
      pin.style.mask = a < b && (a > 0 || b < n) ? panelMask(order.slice(a, b), cols, rows) : "";
    };

    const measure = () => {
      const vh = main.clientHeight;
      const ch = pin.offsetHeight;
      fits = ch > 0 && ch <= vh;
      const pinTop = fits ? (vh - ch) / 2 : 0;
      box.style.setProperty("--pin-top", `${pinTop}px`);
      box.style.setProperty("--pin-h", fits ? `${ch + HOLD * vh}px` : "auto");
      const top = box.getBoundingClientRect().top - main.getBoundingClientRect().top + main.scrollTop;
      start = fits ? top - pinTop : top - vh * 0.75;
      end = fits ? start + HOLD * vh : top + ch - vh * 0.25;
      const c = Math.max(1, Math.round(pin.offsetWidth / PANEL));
      const r = Math.max(1, Math.round(ch / PANEL));
      if (c !== cols || r !== rows || order.length !== c * r) {
        cols = c;
        rows = r;
        order = panelOrder(c, r, style);
      }
      key = "";
      apply();
    };

    const tick = () => {
      stop?.();
      stop = null;
      apply();
    };
    const onScroll = () => {
      if (!stop) stop = addTick(tick);
    };
    // A nav anchor to a pinned section lands mid-hold (fully lit), not at its dark entry.
    const id = pin.firstElementChild?.id;
    const onClick = (e: MouseEvent) => {
      if (!fits || !id || !(e.target instanceof Element) || !e.target.closest(`a[href="#${id}"]`)) return;
      e.preventDefault();
      main.scrollTo({ top: (start + end) / 2 });
      history.replaceState(null, "", `#${id}`);
    };

    // Any section above changing height moves our range, so watch them all.
    const ro = new ResizeObserver(measure);
    ro.observe(main);
    Array.from(main.children).forEach((c) => ro.observe(c));
    ro.observe(pin);
    main.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      ro.disconnect();
      main.removeEventListener("scroll", onScroll);
      stop?.();
      box.style.removeProperty("--pin-top");
      box.style.removeProperty("--pin-h");
      pin.style.mask = pin.style.opacity = pin.style.visibility = "";
    };
  }, [style, enter]);

  return (
    <div ref={boxRef} className="motion-safe:h-(--pin-h)">
      <div ref={pinRef} className="motion-safe:sticky motion-safe:top-(--pin-top) motion-safe:xl:[&>section]:py-0">
        {children}
      </div>
    </div>
  );
};

export default Burnout;
