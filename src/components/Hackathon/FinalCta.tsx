import CtaLinks from "./CtaLinks";
import SectionHeading from "./SectionHeading";

// Figma 17472:86385 — desktop only (the mobile frames go from the FAQ straight to the footer).
const FinalCta = () => (
  <section className="hidden justify-center px-6 pt-30 pb-35 xl:flex">
    <div className="flex flex-col items-center gap-5 bg-black pb-6">
      <SectionHeading
        text="Got an idea?"
        tail="Ship it."
        tailClassName="text-action"
        className="text-center text-[104px] leading-none font-semibold tracking-[-0.03em] whitespace-nowrap text-primary"
      />
      <div className="flex flex-col items-center gap-5">
        <p className="text-center text-[20px] leading-6 tracking-[0.02em] text-secondary">
          23 Nov → 20 Dec on Base and Robinhood Chain. No forms, no applications.
        </p>
        <CtaLinks />
      </div>
    </div>
  </section>
);

export default FinalCta;
