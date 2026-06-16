import React, { forwardRef } from "react";
import "./Button.css";

/**
 * sqrtDAO — Button  (Figma component set 1106:5006)
 *
 * variant : primary | secondary | outline | ghost | danger
 * size    : m | l                       (Figma sizes "m" / "l")
 * state   : rest | hovered | pressed | focused | disabled
 *           → driven by native :hover / :active / :focus-visible / [disabled];
 *             never passed as a prop in production.
 *
 * Icons inherit the button's text color via currentColor, so chevron fills
 * track every state automatically (e.g. light on pressed-primary).
 */

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "m" | "l";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "l",
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      disabled = false,
      className = "",
      children,
      type = "button",
      ...rest
    },
    ref
  ) {
    const classes = [
      "sqrt-btn",
      `sqrt-btn--${variant}`,
      `sqrt-btn--${size}`,
      fullWidth ? "sqrt-btn--full" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button ref={ref} type={type} className={classes} disabled={disabled} {...rest}>
        {leadingIcon && (
          <span className="sqrt-btn__icon" aria-hidden="true">{leadingIcon}</span>
        )}
        <span className="sqrt-btn__label">{children}</span>
        {trailingIcon && (
          <span className="sqrt-btn__icon" aria-hidden="true">{trailingIcon}</span>
        )}
      </button>
    );
  }
);
