"use client";

import Image from "next/image";
import { Button } from "@/components/Button/Button";
import { CLAIM_ROOT_DISCORD_URL } from "@/constants/links";
import "./ClaimRootDialog.css";

export type ClaimRootDialogProps = {
  onClose: () => void;
};

export default function ClaimRootDialog({ onClose }: ClaimRootDialogProps) {
  const onClaimClick = () => {
    window.open(CLAIM_ROOT_DISCORD_URL, "_blank", "noopener,noreferrer");
    onClose();
  };

  return (
    <div className="claim-root-backdrop" onClick={onClose}>
      <div className="claim-root" onClick={(e) => e.stopPropagation()}>
        <div className="claim-root__hero">
          <Image
            src="/claim-root/hero.jpg"
            alt=""
            fill
            sizes="450px"
            className="claim-root__hero-img"
            priority
          />
          <div className="claim-root__hero-fade" />
        </div>
        <div className="claim-root__content">
          <h2>Claim ROOT tokens</h2>
          <p className="claim-root__body">
            You&apos;ll need ROOT before you can participate in a
            distribution or run your own.
            <br />
            Claim some to get started.
          </p>
          <div className="claim-root__actions">
            <Button variant="outline" size="m" fullWidth onClick={onClose}>
              Not now
            </Button>
            <Button variant="primary" size="m" fullWidth onClick={onClaimClick}>
              Claim ROOT
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
