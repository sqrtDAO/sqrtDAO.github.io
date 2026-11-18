"use client";

import { useState, type ReactNode } from "react";
import Burnout, { type BurnoutStyle } from "@/components/Hackathon/Burnout";

const STYLES: { id: BurnoutStyle; label: string }[] = [
  { id: "grid", label: "1 · LED grid" },
  { id: "dissolve", label: "2 · Dissolve" },
  { id: "scan", label: "3 · Scanline" },
];

const BurnoutToggle = ({ children }: { children: ReactNode }) => {
  const [style, setStyle] = useState<BurnoutStyle>("grid");
  return (
    <>
      <div role="radiogroup" aria-label="Burnout style" className="fixed right-4 bottom-4 z-40 flex gap-1 bg-black p-1 font-mono text-caption">
        {STYLES.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={style === id}
            onClick={() => setStyle(id)}
            className={`px-3 py-2 ${style === id ? "bg-action text-black" : "text-secondary hover:text-primary"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <Burnout style={style}>{children}</Burnout>
    </>
  );
};

export default BurnoutToggle;
