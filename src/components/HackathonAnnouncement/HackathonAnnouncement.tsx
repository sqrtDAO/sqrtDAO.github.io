"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import { IconButton } from "@/components/IconButton/IconButton";
import { useHackathonLive } from "@/hooks/useHackathonLive";
import { DISTRIBUTION_LAUNCH_HREF } from "@/constants/links";
import "@/components/Button/Button.css";

const KEY = "hackathon-announcement-dismissed";

const remember = () => {
  try {
    localStorage.setItem(KEY, "1");
  } catch {}
};

const dismissed = () => {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
};

// Main-landing announcement for the hackathon period — Figma 17617:94411. Shown once per browser
// (any close or CTA dismisses it) and never after HACKATHON_END.
const HackathonAnnouncement = () => {
  const live = useHackathonLive(() => !dismissed());
  const [closed, setClosed] = useState(false);
  const open = live && !closed;

  const close = () => {
    remember();
    setClosed(true);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      remember();
      setClosed(true);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/90 p-2"
      onClick={close}
      role="dialog"
      aria-modal="true"
      aria-labelledby="hackathon-announcement-title"
    >
      <div className="flex max-h-full w-full max-w-112.5 flex-col overflow-y-auto rounded-(--radius-l) bg-surface" onClick={(e) => e.stopPropagation()}>
        <div className="relative -mb-4 aspect-450/322 w-full shrink-0 overflow-hidden">
          <Image src="/hackathon/announcement.jpg" alt="" width={900} height={900} priority className="absolute top-[-11.3%] left-0 aspect-square w-full object-cover" />
          <div className="absolute inset-0 bg-linear-to-b from-transparent from-73% via-[rgba(9,10,14,0.75)] via-87% to-surface" />
          <IconButton variant="ghost" size="s" aria-label="Close" icon={<IconX size={16} />} onClick={close} className="absolute top-4 right-4" />
        </div>
        <div className="relative flex flex-col gap-6 px-6 pb-6">
          <h2 id="hackathon-announcement-title" className="font-display text-h3 leading-[normal] text-primary">
            The Builder Hackathon is live
          </h2>
          <p className="text-body leading-6 tracking-[0.02em] text-primary">
            Launch your project on sqrtDAO any day until 20 Dec. Ship in public, get funded by your community, and compete for up to $1.5k in
            prizes.
            <br />
            We’ll help you set it up.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href={DISTRIBUTION_LAUNCH_HREF} onClick={close} className="sqrt-btn sqrt-btn--outline sqrt-btn--m flex-1">
              <span className="sqrt-btn__label">Launch your project</span>
            </Link>
            <Link href="/hackathon/" onClick={close} className="sqrt-btn sqrt-btn--primary sqrt-btn--m flex-1">
              <span className="sqrt-btn__label">Explore the hackathon</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HackathonAnnouncement;
