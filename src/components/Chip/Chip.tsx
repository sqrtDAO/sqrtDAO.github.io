"use client";

import { useState } from "react";
import { BODY_M } from "@/constants/typography";

export type ChipProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

// Figma 15723:140962 "chips" — a filter pill that opens the menu (3046:1392).
const Chip = ({ label, options, value, onChange }: ChipProps) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative shrink-0"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(e) => e.key === "Escape" && setOpen(false)}
    >
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1 rounded-pill border bg-raised px-3 py-1.5 whitespace-nowrap ${BODY_M} ${
          open ? "border-focus" : "border-subtle hover:border-strong"
        }`}
      >
        <span className="text-primary">{label}</span>
        <span className="font-bold text-accent">{value}</span>
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute top-9.5 left-0 z-20 flex w-42.25 flex-col gap-1.5 rounded-m border border-subtle bg-surface p-2"
        >
          {options.map((option) => (
            <li key={option}>
              <button
                type="button"
                role="option"
                aria-selected={option === value}
                onClick={() => {
                  onChange(option);
                  setOpen(false);
                }}
                className="w-full rounded-(--radius-s) px-2 py-1.5 text-left text-body-s leading-4 font-medium tracking-[0.02em] text-primary hover:bg-raised"
              >
                {option}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Chip;
