"use client";

import { IconMinus } from "@tabler/icons-react";
import "./ReleaseCard.css";

export interface ReleaseCardProps {
  name?: string;
  description?: string;
  icon?: React.ReactNode;
  state?: "rest" | "hovered" | "selected" | "disabled";
  onClick?: () => void;
  className?: string;
}

export default function ReleaseCard({
  name = "Fixed",
  description = "Equal amount each epoch.",
  icon,
  state = "rest",
  onClick,
  className,
}: ReleaseCardProps) {
  return (
    <button
      type="button"
      className={`release-card release-card--${state}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={state === "disabled"}
      aria-pressed={state === "selected"}
    >
      <span className="release-card__icon" aria-hidden="true">
        {icon ?? <IconMinus size={24} strokeWidth={1.5} />}
      </span>
      <span className="release-card__text">
        <span className="release-card__name">{name}</span>
        <span className="release-card__desc">{description}</span>
      </span>
    </button>
  );
}
