"use client";

import { forwardRef } from "react";
import "./IconButton.css";

/**
 * sqrtDAO — IconButton  (Figma node 3058:1733)
 *
 * Same variants, states, and color tokens as Button (Button.tsx) — only the
 * sizing differs (icon-only: uniform padding, larger icons, no text).
 * state (rest | hovered | pressed | focused | disabled) is driven by the
 * same native pseudo-classes as Button; never passed as a prop.
 */

export type IconButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
export type IconButtonSize = "l" | "m" | "s";

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton(
    { icon, variant = "primary", size = "l", disabled = false, className = "", ...rest },
    ref
  ) {
    const classes = [
      "icon-btn",
      `icon-btn--${variant}`,
      `icon-btn--${size}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type="button" className={classes} disabled={disabled} {...rest}>
        <span className="icon-btn__icon" aria-hidden="true">{icon}</span>
      </button>
    );
  }
);
