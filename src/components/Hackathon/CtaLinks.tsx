"use client";

import Link from "next/link";
import { useRef } from "react";
import { IconCalendarTime } from "@tabler/icons-react";
import { DISTRIBUTION_LAUNCH_HREF } from "@/constants/links";
import { BOOKING_URL } from "@/constants/hackathon";
import { usePointerFollow } from "@/hooks/usePointerFollow";
import { SIZE_M_BELOW_XL } from "./classes";
import "@/components/Button/Button.css";

// Magnetic primary button: drifts up to 6px toward the cursor, springs back on leave.
const magnet = (el: HTMLElement, x: number, y: number) => {
  el.style.translate = `${(x * 6).toFixed(2)}px ${(y * 6).toFixed(2)}px`;
};

const CtaLinks = ({ className = "", bookIcon = false }: { className?: string; bookIcon?: boolean }) => {
  const primary = useRef<HTMLAnchorElement>(null);
  usePointerFollow(primary, magnet);

  return (
    <div className={`flex gap-4 xl:gap-3 ${className}`}>
      <Link
        ref={primary}
        href={DISTRIBUTION_LAUNCH_HREF}
        className={`sqrt-btn sqrt-btn--primary flex-1 xl:flex-none ${SIZE_M_BELOW_XL}`}
      >
        <span className="sqrt-btn__label">Launch and distribute</span>
      </Link>
      <a
        href={BOOKING_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`sqrt-btn sqrt-btn--secondary ${SIZE_M_BELOW_XL}`}
      >
        {bookIcon && (
          <span className="sqrt-btn__icon" aria-hidden="true">
            <IconCalendarTime />
          </span>
        )}
        <span className="sqrt-btn__label">Book a call</span>
      </a>
    </div>
  );
};

export default CtaLinks;
