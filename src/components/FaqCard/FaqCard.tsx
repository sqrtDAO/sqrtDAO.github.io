"use client";

import { IconMessageCircleQuestion } from "@tabler/icons-react";
import "./FaqCard.css";

export interface FaqCardItem {
  q: string;
  a: string;
}

export interface FaqCardProps {
  items: FaqCardItem[];
  activeIndex: number;
  onChange: (index: number) => void;
  className?: string;
}

// Mobile FAQ — accordion where the active question expands its answer
// inline (own bg-canvas/radius-l card), rest sit as plain bordered rows.
// Figma source: "_faq mobile" (node 6460:157789) + "_question" (6460:157760)
export default function FaqCard({ items, activeIndex, onChange, className }: FaqCardProps) {
  return (
    <div className={`faq-card${className ? ` ${className}` : ""}`}>
      <div className="faq-card__header">
        <IconMessageCircleQuestion size={32} strokeWidth={1.5} />
        <h2>FAQ</h2>
      </div>
      <div className="faq-card__content">
        {items.map((item, i) => (
          <div key={item.q} className={`faq-card__item${i === activeIndex ? " is-active" : ""}`}>
            <button
              type="button"
              className="faq-card__question"
              aria-expanded={i === activeIndex}
              onClick={() => onChange(i)}
            >
              {item.q}
            </button>
            {/* always mounted (not conditional) — the collapse/expand is a
                max-height transition, which needs the answer present in the
                DOM at all times to animate in and out. */}
            <div className="faq-card__answer-collapse">
              <div className="faq-card__answer">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
