"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { BODY_L, BODY_S } from "@/constants/typography";
import { useHackathonLive } from "@/hooks/useHackathonLive";

type Props = {
  title: string;
  /** With an icon the title is a small amber line (Figma 17640:95565); without, an h3 (17640:95558). */
  icon?: ReactNode;
  children: ReactNode;
};

// Hackathon-period wizard banner — renders nothing outside the hackathon window (HACKATHON_END).
const HackathonBanner = ({ title, icon, children }: Props) => {
  const live = useHackathonLive();
  if (!live) return null;
  return (
    <div className="relative w-full overflow-hidden rounded-(--radius-l) border border-subtle">
      <Image src="/hackathon/banner-bg.png" alt="" width={1168} height={228} className="absolute inset-0 size-full object-cover object-bottom" />
      <div className={`relative flex flex-col p-4 text-primary ${icon ? "gap-4" : "gap-1"}`}>
        {icon ? (
          <p className={`flex items-center gap-4 text-action ${BODY_L}`}>
            {icon}
            {title}
          </p>
        ) : (
          <p className="font-display text-h3 leading-[normal]">{title}</p>
        )}
        <p className={BODY_S}>{children}</p>
      </div>
    </div>
  );
};

export default HackathonBanner;
