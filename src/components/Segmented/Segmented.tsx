"use client";

import "./Segmented.css";

type ItemSize = "s" | "m" | "l";
type ItemState = "rest" | "hovered" | "selected";

export interface SegmentedItemProps {
  text: string;
  size?: ItemSize;
  state?: ItemState;
  icon?: React.ReactNode;
  onClick?: () => void;
}

export function SegmentedItem({ text, size = "s", state = "rest", icon, onClick }: SegmentedItemProps) {
  return (
    <button
      type="button"
      className={`seg-item seg-item--${size} seg-item--${state}`}
      onClick={onClick}
      aria-pressed={state === "selected"}
    >
      {icon && <span className="seg-item__icon" aria-hidden="true">{icon}</span>}
      <span className="seg-item__text">{text}</span>
    </button>
  );
}

export interface SegmentedProps {
  items: string[];
  activeIndex?: number;
  size?: ItemSize;
  onChange?: (index: number) => void;
  className?: string;
}

export default function Segmented({
  items,
  activeIndex = 0,
  size = "m",
  onChange,
  className,
}: SegmentedProps) {
  return (
    <div
      className={`segmented segmented--${size}${className ? ` ${className}` : ""}`}
      role="tablist"
    >
      {items.map((label, i) => (
        <SegmentedItem
          key={label}
          text={label}
          size={size}
          state={i === activeIndex ? "selected" : "rest"}
          onClick={() => onChange?.(i)}
        />
      ))}
    </div>
  );
}
