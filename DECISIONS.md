# Decisions Log

Short log of deferred or non-obvious decisions. Add an entry when we decide
*not* to do something now, so future sessions (and teammates) don't re-litigate
it or trip over it.

## V.1 component namespacing (`components/v1/` vs flat)

**Status:** Deferred.

**Why:** A teammate has an active unmerged branch off the current flat
`src/components/` structure (wiring up contracts). Introducing a
`components/v1/` namespace now would be a tree-wide restructuring he'd have to
reconcile later.

**What's deferred:** V.0 already has `DistributionWizard` and
`DistributionDetail`; V.1 needs equivalents, so a name collision is coming.
Not resolved now — revisit once the teammate's contract branch merges.

## CLAUDE.md Tailwind/CSS migration

**Status:** Deferred, tracked as tech debt. Do not start.

**Why:** Teammate branched off the current structure; migrating CSS approaches
now would conflict with that branch.

## Rule while any teammate branch is open

Don't restructure shared folders. Keep new V.1 work additive — new files
only, no moving/renaming shared structure.

## Adaptive DPR throttle removed (SmokeMeshBackground)

**Status:** Removed, not deferred. Do not re-add as-is.

**Why:** `smokeMesh.ts`'s render loop had a one-shot auto-throttle that
sampled wall-clock time between the first ~60 draws and, if the average
exceeded 45ms, silently dropped `dprCap` from 1.5 to 1.0 and reallocated the
canvas/FBO at half the pixel count — with no visual transition. On an M5
MacBook Air (fast GPU, not the weak-hardware case the throttle was meant to
protect against) this produced a visible, unannounced resolution change
~2-5s into page load, reported as the background "resolving" from grainy to
smooth over several seconds. Root cause: the sample window included
shader-compile/tab-warm-up jank as if it were steady-state cost, so even fast
hardware could trip it on transient startup noise — confirmed by two
back-to-back headless-Chrome runs on identical code where the throttle fired
in one and not the other. Frame-timing with the throttle disabled measured
~0.035ms mean / 0.1ms p95 per frame at 1440x900 @ DPR 2 (real GPU), far under
budget — the two-pass/baked-noise optimization is the actual performance
protection; the throttle was pure downside once that was true.

**If weak-hardware protection is needed later:** it needs a separate,
deliberate pass with a warm-up window (skip N seconds/frames post-load before
sampling) so startup jank can't be counted as sustained slowness — not a
drop-in re-add of the old logic.

## V.1 mobile layout: dual-block-per-file, not separate Tablet components

**Status:** Chosen architecture, not deferred.

**Why:** CLAUDE.md's "no separate Tablet component" rule rules out the old
Desktop/Tablet/Mobile file-split pattern, but desktop's landing sections use
pixel-exact absolute positioning for dozens of decorative fragments that the
mobile Figma design drops or restructures into a plain single-column flow —
a single unified JSX tree with per-element responsive Tailwind overrides
would fight itself constantly. Instead, each `LandingXxx.tsx` keeps its
existing desktop JSX untouched (wrapped `hidden xl:block`) and gains one
new sibling JSX block for the narrow layout (wrapped `xl:hidden`) in the
same function/file. One breakpoint (`xl:` = 1280px, matching the pre-V.1
`useBreakpoint` hook's own desktop cutoff), pure CSS `display` toggling, no
JS breakpoint switching, no new component files.

**Known tradeoff:** both blocks exist in the DOM at once (only one is
`display:none`), so the hidden tree's assets still download. Acceptable for
the mobile skeleton phase (modest asset sizes, no animation yet) — revisit
once the glitch-reveal primitive is layered onto mobile, since that's when
per-block cost (extra IntersectionObserver targets, doubled image requests)
starts to matter more.

**Bug hit while wiring this up — custom breakpoint tokens miscompile:** first
attempt defined a self-documenting `--breakpoint-desktop: 1280px` custom
token (tried both in `@theme inline` and a plain `@theme` block) so classes
could read `xl:` as `desktop:`. In the compiled CSS, the custom breakpoint's
media-query variant (`.desktop\:block` etc., wrapped in
`@media (min-width:1280px)`) was emitted *before* the unprefixed base utility
it was meant to override (`.hidden{display:none}`) — with equal specificity,
whichever rule is later in source order wins the cascade, so `.hidden` won
unconditionally at every viewport width, permanently hiding the desktop
block. Verified by grepping the built `.next/static/chunks/*.css` for byte
offsets of `.hidden{` vs the `@media (min-width:1280px)` block. Switched to
Tailwind's stock `xl:` variant (identical 1280px value) instead, which does
not have this ordering problem — stock breakpoints get a guaranteed
generation order the custom-token path doesn't. If a self-documenting
breakpoint name is wanted later, this ordering behavior needs to be
understood (or reported upstream) first — don't just retry the same
`--breakpoint-*` pattern and assume it'll work.
