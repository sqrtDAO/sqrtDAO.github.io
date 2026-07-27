export interface LandingButtonCardProps {
  className?: string;
  children: React.ReactNode;
}

// Landing-only CTA button ("_Button - card" + inner "Button" combo, Figma nodes
// 6137:21932 + 6886:27281): an amber pill inset in its own black card frame, with
// dedicated hover/pressed treatments distinct from the shared Button component.
// Used only for the "Try it on testnet" CTAs in Hero and The Problem.
export default function LandingButtonCard({ className = "", children }: LandingButtonCardProps) {
  return (
    <div className={`flex h-[179px] w-[383px] items-center justify-center rounded-none bg-black p-2 ${className}`}>
      <button
        type="button"
        className="group relative flex h-[163px] w-[367px] items-center justify-center gap-2 rounded-m bg-action p-2 transition-[background-color,transform] duration-200 ease-out hover:scale-[1.015] active:scale-[0.98] active:bg-action-press active:duration-100"
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
}