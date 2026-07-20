"use client";

import "./RouterCard.css";

export interface RouterCardProps {
  title?: string;
  subtitle?: string;
  description?: string;
  state?: "default" | "selected";
  onClick?: () => void;
  className?: string;
}

export default function RouterCard({
  title = "No",
  subtitle = "Create a token",
  description = "We'll create it, then set up distribution.",
  state = "default",
  onClick,
  className,
}: RouterCardProps) {
  return (
    <button
      type="button"
      className={`router-card${state === "selected" ? " is-selected" : ""}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      aria-pressed={state === "selected"}
    >
      <span className="router-card__title">{title}</span>
      <span className="router-card__subtitle">{subtitle}</span>
      <p className="router-card__description">{description}</p>
    </button>
  );
}
