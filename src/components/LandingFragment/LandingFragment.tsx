export interface LandingFragmentProps {
  /** Position/size (absolute, Tailwind arbitrary values) and optional bg/tint override. */
  className?: string;
}

// A single "burnt screen cell" — one of the scattered black fragment blocks that sit
// around a section's main card. Deliberately zero-radius (see DECISIONS.md / plan).
// Phase 2 attaches the glitch-reveal hook to these; Phase 1 is layout only.
export default function LandingFragment({ className = "" }: LandingFragmentProps) {
  return <div aria-hidden="true" className={`absolute rounded-none bg-black ${className}`} />;
}
