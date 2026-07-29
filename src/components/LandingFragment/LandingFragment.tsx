import { forwardRef } from "react";

export interface LandingFragmentProps {
  /** Position/size (absolute, Tailwind arbitrary values) and optional bg/tint override. */
  className?: string;
}

// A single "burnt screen cell" — one of the scattered black fragment blocks that sit
// around a section's main card. Deliberately zero-radius (see DECISIONS.md / plan).
// forwardRef so it can be wrapped in <GlitchReveal> like any native element.
const LandingFragment = forwardRef<HTMLDivElement, LandingFragmentProps>(function LandingFragment(
  { className = "" },
  ref
) {
  return <div ref={ref} aria-hidden="true" className={`absolute rounded-none bg-black ${className}`} />;
});

export default LandingFragment;
