"use client";

import { IconHelpSquare } from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { BODY_S } from "@/constants/typography";

type NativeTokenBannerProps = {
  /** Opens the "About the token" dialog. */
  onLearnMore: () => void;
};

// Figma 12549:20970 (desktop, flush in the 872 column) / 14557:105379 (mobile, full-bleed with icon button).
// bg-kasumi's last stop is transparent, so bg-canvas supplies the dropped #0B0D12 layer.
const NativeTokenBanner = ({ onLearnMore }: NativeTokenBannerProps) => (
  <div className="flex w-full items-center gap-4 bg-canvas bg-kasumi px-4 py-2 xl:px-0">
    <div className="flex min-w-0 flex-1 flex-col">
      <p className={`${BODY_S} text-accent`}>Created on sqrtDAO</p>
      <p className={`${BODY_S} text-primary xl:text-body xl:leading-5.5`}>
        This token has been launched via sqrtDAO.
      </p>
    </div>
    {/* Wrappers carry the breakpoint: sqrt-btn/icon-btn CSS is unlayered and would beat `hidden`. */}
    <span className="hidden xl:block">
      <Button variant="ghost" size="m" onClick={onLearnMore}>
        What&apos;s that mean?
      </Button>
    </span>
    <span className="xl:hidden">
      <IconButton
        variant="ghost"
        size="m"
        aria-label="What's that mean?"
        icon={<IconHelpSquare size={24} />}
        onClick={onLearnMore}
      />
    </span>
  </div>
);

export default NativeTokenBanner;
