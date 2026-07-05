"use client";

import { forwardRef } from "react";
import "./IconButton.css";

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
