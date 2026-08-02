import { forwardRef } from "react";

export interface LandingButtonCardProps {
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}

// Landing-only CTA button ("_Button - card" + inner "Button" combo, Figma nodes
// 6137:21932 + 6886:27281): an amber pill inset in its own black card frame, with
// dedicated hover/pressed treatments distinct from the shared Button component.
// Used for the "Try it on testnet" CTAs in Hero and The Problem, both desktop and
// mobile — mobile's clean Figma frame uses a slightly smaller card (150x358 vs
// desktop's 179x383), so the size itself is responsive via the `xl:` breakpoint
// (1280px, the project's desktop cutoff — see DECISIONS.md for why this uses the
// stock `xl:` variant rather than a custom-named one) instead of a mobile variant.
// forwardRef so it can be wrapped in <GlitchReveal> like any native element.
const LandingButtonCard = forwardRef<HTMLDivElement, LandingButtonCardProps>(function LandingButtonCard(
  { className = "", children, onClick },
  ref
) {
  return (
    <div ref={ref} className={`flex h-[150px] w-[358px] items-center justify-center rounded-none bg-black p-2 xl:h-[179px] xl:w-[383px] ${className}`}>
      <button
        type="button"
        onClick={onClick}
        className="group relative flex h-[134px] w-[342px] items-center justify-center gap-2 rounded-m bg-action p-2 transition-[background-color,transform] duration-200 ease-out hover:scale-[1.015] active:scale-[0.98] active:bg-action-press active:duration-100 xl:h-[163px] xl:w-[367px]"
      >
        <span className="relative flex h-full flex-1 items-center justify-center rounded-m px-1 transition-colors duration-200 ease-out group-hover:bg-canvas group-active:bg-black group-active:duration-100">
          <span className="text-body-l text-on-amber transition-colors duration-200 ease-out group-hover:text-accent group-active:text-primary group-active:duration-100">
            {children}
          </span>
        </span>
        <span className="pointer-events-none absolute inset-0 rounded-[inherit] shadow-[inset_-1px_1px_7px_0_rgba(0,0,0,0.16)]" />
      </button>
    </div>
  );
});

export default LandingButtonCard;