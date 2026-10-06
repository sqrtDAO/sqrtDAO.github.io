"use client";

import { useState } from "react";
import { IconMessageCircleQuestion } from "@tabler/icons-react";
import FaqCard from "@/components/FaqCard/FaqCard";
import { BODY_L } from "@/constants/typography";
import { DDP_FAQ } from "@/constants/faq";

const last = DDP_FAQ.length - 1;

// Figma 12057:112237 "_faq desktop"; mobile reuses FaqCard (6460:157789).
const FaqSection = () => {
  const [active, setActive] = useState(0);
  return (
    <>
      <div className="hidden flex-col bg-surface p-2 xl:flex">
        <div className="flex items-center gap-4 px-6 py-5 text-primary">
          <IconMessageCircleQuestion size={32} strokeWidth={1.5} />
          <h2 className="font-display text-h3">FAQ</h2>
        </div>
        <div className="flex">
          <div className="flex w-104 shrink-0 flex-col">
            {DDP_FAQ.map((item, i) => (
              <button
                key={item.q}
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                className={`flex h-16 items-center px-6 text-left ${BODY_L} text-primary ${
                  i === active
                    ? "rounded-l-m bg-canvas"
                    : "border-b border-subtle hover:bg-canvas/50"
                }`}
              >
                {item.q}
              </button>
            ))}
          </div>
          <div
            className={`flex-1 rounded-(--radius-l) bg-canvas p-8 ${
              active === 0
                ? "rounded-tl-none"
                : active === last
                  ? "rounded-bl-none"
                  : ""
            }`}
          >
            <p className={`${BODY_L} text-primary`}>{DDP_FAQ[active].a}</p>
          </div>
        </div>
      </div>
      {/* Wrapper carries the breakpoint: faq-card CSS is unlayered. */}
      <div className="xl:hidden">
        <FaqCard items={DDP_FAQ} activeIndex={active} onChange={setActive} />
      </div>
    </>
  );
};

export default FaqSection;
