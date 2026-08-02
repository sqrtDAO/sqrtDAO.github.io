"use client";

import { cloneElement, isValidElement, type ReactElement } from "react";
import { useGlitchReveal } from "@/hooks/useGlitchReveal";

export interface GlitchRevealProps {
  /** Explicit stagger offset in ms. Omit for a randomized organic jitter. */
  delayMs?: number;
  /** Upper bound (ms) for the randomized jitter when delayMs is omitted. */
  maxJitterMs?: number;
  /** Override for the glitch-in settle duration (default: --motion-duration-reveal). */
  durationMs?: number;
  /** A single element (native tag or forwardRef component) to reveal in place. */
  children: ReactElement;
}

// Thin wrapper around useGlitchReveal for call sites that don't want to wire
// the hook by hand. Clones the child instead of adding a wrapper element, so
// it never disturbs the child's own absolute positioning/layout.
export default function GlitchReveal({ delayMs, maxJitterMs, durationMs, children }: GlitchRevealProps) {
  const ref = useGlitchReveal<HTMLElement>({ delayMs, maxJitterMs, durationMs });
  if (!isValidElement(children)) return children;

  const existingClassName = (children.props as { className?: string }).className ?? "";
  return cloneElement(children, {
    ref,
    className: `glitch-target ${existingClassName}`,
  } as Record<string, unknown>);
}
