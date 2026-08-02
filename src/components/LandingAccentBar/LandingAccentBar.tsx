import { forwardRef } from "react";

export interface AccentBand {
  /** Length in px (along the bar's main axis). */
  width: number;
  /** Thickness in px. */
  height: number;
  /** Suffix into --color-support-{tint}, e.g. "ochre-500". */
  tint: string;
}

export interface AccentChip {
  /** Offset in px from the band's start, along the main axis. */
  offset: number;
  /** Chip length in px along the main axis. */
  width: number;
  tint: string;
}

export interface LandingAccentBarProps {
  band: AccentBand;
  chips: AccentChip[];
  orientation?: "horizontal" | "vertical";
  className?: string;
}

// Recurring decoration across the design: a solid base band with a few small
// tinted chips floating on top at fixed offsets (never a sequential row).
// forwardRef so it can be wrapped in <GlitchReveal> like any native element.
const LandingAccentBar = forwardRef<HTMLDivElement, LandingAccentBarProps>(function LandingAccentBar(
  { band, chips, orientation = "horizontal", className = "" },
  ref
) {
  const vertical = orientation === "vertical";
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`absolute ${className}`}
      style={{ width: vertical ? band.height : band.width, height: vertical ? band.width : band.height }}
    >
      <div
        className="absolute left-0 top-0"
        style={{ width: vertical ? band.height : band.width, height: vertical ? band.width : band.height, background: `var(--color-support-${band.tint})` }}
      />
      {chips.map((c, i) => (
        <div
          key={i}
          className="absolute"
          style={
            vertical
              ? { left: 0, top: c.offset, width: band.height, height: c.width, background: `var(--color-support-${c.tint})` }
              : { left: c.offset, top: 0, width: c.width, height: band.height, background: `var(--color-support-${c.tint})` }
          }
        />
      ))}
    </div>
  );
});

export default LandingAccentBar;