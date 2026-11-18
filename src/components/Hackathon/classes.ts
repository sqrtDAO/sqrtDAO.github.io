// Shared class strings (plain module so server and client components can both import them).

// Figma uses button "l" on desktop and "m" below it; Button.css sizes read --btn-l-*,
// so remapping those vars switches size without touching the shared stylesheet.
export const SIZE_M_BELOW_XL =
  "max-xl:[--btn-l-height:var(--btn-m-height)] max-xl:[--btn-l-pad:var(--btn-m-pad)] max-xl:[--btn-l-font:var(--btn-m-font)] max-xl:[--btn-l-gap:var(--btn-m-gap)] max-xl:[--btn-l-icon:var(--btn-m-icon)]";

// Loops (CSS animations) inside an InView group/view only run while it is on screen.
export const PAUSE =
  "group-data-[view=idle]/view:[animation-play-state:paused] group-data-[view=out]/view:[animation-play-state:paused]";
