"use client";

import Image from "next/image";
import { useRef } from "react";
import { useExtrusion } from "@/hooks/useExtrusion";

// Figma outlines the headline; rebuilt as live Oxanium text. All geometry is in cqw of the
// backing shape (888×321 desktop / 350×229 mobile) so it scales with its column, with
// sizes/offsets measured from the Figma vectors against Oxanium's metrics.
// Extrusion = Figma's three hard offset copies (epochs-500 / teal-500 / rose-500) + white glow;
// layer offsets scale by --dx/--dy (direction) × --depth. Only the extrusion moves, never the fill.
const EXTRUDE =
  "[text-shadow:-0.015em_-0.0225em_0.15em_rgb(255_255_255/0.24),calc(var(--dx)*var(--depth)*0.0425em)_calc(var(--dy)*var(--depth)*0.0425em)_0_var(--color-charts-epochs-500),calc(var(--dx)*var(--depth)*0.076em)_calc(var(--dy)*var(--depth)*0.076em)_0_var(--color-support-teal-500),calc(var(--dx)*var(--depth)*0.11em)_calc(var(--dy)*var(--depth)*0.11em)_0_var(--color-support-rose-500)]";

// Resting extrusion by default (reduced motion / before JS); with motion allowed depth starts
// at 0 and useExtrusion grows it after the CSS reveal (@starting-style, transform/opacity only).
const MOTION =
  "[--dx:1] [--dy:1] [--depth:1] motion-safe:[--depth:0] motion-safe:transition-[opacity,translate] motion-safe:duration-700 motion-safe:ease-out motion-safe:starting:translate-y-3 motion-safe:starting:opacity-0";

const LINE = "absolute whitespace-nowrap";

const HeroHeadline = () => {
  const ref = useRef<HTMLHeadingElement>(null);
  useExtrusion(ref);

  return (
    <div className="@container relative w-full max-w-[350px] xl:max-w-[888px]">
      <Image src="/hackathon/headline-backing-mobile.svg" alt="" width={350} height={229} className="h-auto w-full xl:hidden" />
      <Image src="/hackathon/headline-backing.svg" alt="" width={888} height={321} className="hidden h-auto w-full xl:block" />
      {/* Tracking per line (not on h1): em letter-spacing resolves at the declaring element. */}
      <h1 ref={ref} className={`absolute inset-0 font-display font-normal leading-none text-secondary ${MOTION}`}>
        <span className={`${LINE} left-[-0.22cqw] top-[-0.48cqw] text-[11.25cqw] tracking-[-0.023em] xl:top-[2.27cqw]`}>
          A four-week
        </span>{" "}
        <span
          className={`${LINE} left-[-0.58cqw] top-[12.91cqw] text-[20.5cqw] leading-[0.886] font-extrabold tracking-[-0.03em] text-primary xl:left-[-0.05cqw] xl:top-[12.08cqw] xl:text-[12.22cqw] xl:leading-none ${EXTRUDE}`}
        >
          launch <br className="xl:hidden" />
          hackathon
        </span>{" "}
        <span
          className={`${LINE} left-[-0.6cqw] top-[51.32cqw] text-[15.14cqw] tracking-[-0.022em] xl:left-[-0.58cqw] xl:top-[23.68cqw] xl:text-[14.97cqw] xl:tracking-[-0.017em]`}
        >
          for builders
        </span>
      </h1>
    </div>
  );
};

export default HeroHeadline;
