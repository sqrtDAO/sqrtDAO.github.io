"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePointerFollow } from "@/hooks/usePointerFollow";

// Desktop hover: up to 4° tilt + 4px lift, and an amber spotlight following the cursor.
const tilt = (el: HTMLElement, x: number, y: number, h: number) => {
  el.style.setProperty("--rx", `${(-y * 4).toFixed(2)}deg`);
  el.style.setProperty("--ry", `${(x * 4).toFixed(2)}deg`);
  el.style.setProperty("--lift", `${(-h * 4).toFixed(2)}px`);
  el.style.setProperty("--mx", `${((x + 1) * 50).toFixed(1)}%`);
  el.style.setProperty("--my", `${((y + 1) * 50).toFixed(1)}%`);
};

// Mobile sticky stack: once this card's top rises past 60% of the viewport, the card it slides
// over fades out (and back in when scrolling up). IntersectionObserver only, no scroll handler.
const useCoverPrevious = (ref: React.RefObject<HTMLLIElement | null>) => {
  useEffect(() => {
    const el = ref.current;
    const prev = el?.previousElementSibling as HTMLElement | null;
    if (!el || !prev) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        prev.dataset.covered = String(innerWidth < 1280 && entry.boundingClientRect.top < innerHeight * 0.6);
      },
      { rootMargin: "0px 0px -40% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref]);
};

const WhoCard = ({ className = "", children }: { className?: string; children: ReactNode }) => {
  const ref = useRef<HTMLLIElement>(null);
  usePointerFollow(ref, tilt, 1280);
  useCoverPrevious(ref);

  return (
    <li
      ref={ref}
      className={`group/card max-xl:data-[covered=true]:opacity-0 max-xl:motion-safe:transition-opacity max-xl:motion-safe:duration-300 xl:transition-[border-color] xl:duration-300 xl:hover:border-strong xl:[transform:perspective(1000px)_rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))_translateY(var(--lift,0px))] ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden bg-[radial-gradient(280px_circle_at_var(--mx,50%)_var(--my,50%),rgb(255_154_71/0.1),transparent_70%)] opacity-0 transition-opacity duration-300 xl:block xl:group-hover/card:opacity-100"
      />
    </li>
  );
};

export default WhoCard;
