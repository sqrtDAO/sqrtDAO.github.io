"use client";

import { IconLoader3, IconSquareRoundedCheckFilled } from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import { BODY_L, BODY_S } from "@/constants/typography";

export type ClaimState = "ready" | "claiming" | "done";

export type ClaimCardProps = {
  state: ClaimState;
  /** Pre-formatted claimable amount, e.g. "20,000,000". */
  amount: string;
  symbol: string;
  onClaim?: () => void;
  onAddToWallet?: () => void;
};

const ClaimButton = ({
  claiming,
  size,
  onClick,
}: {
  claiming: boolean;
  size: "m" | "s";
  onClick?: () => void;
}) => (
  <Button
    variant="primary"
    size={size}
    className={size === "m" ? "w-full" : ""}
    disabled={claiming}
    leadingIcon={
      claiming ? (
        <IconLoader3 size={size === "m" ? 18 : 14} className="animate-spin" />
      ) : undefined
    }
    onClick={onClick}
  >
    {claiming ? "Processing" : "Claim all"}
  </Button>
);

const Done = ({ size, onAddToWallet }: { size: "m" | "s"; onAddToWallet?: () => void }) => (
  <>
    <p className={`flex items-center gap-1.5 ${BODY_L} text-success`}>
      <IconSquareRoundedCheckFilled size={20} aria-hidden="true" />
      Claim share done successfully.
    </p>
    <Button
      variant="outline"
      size={size}
      className="w-full"
      onClick={onAddToWallet}
    >
      Add token to wallet
    </Button>
  </>
);

// Figma 10289:98044 (desktop) / 14796:126165 (mobile). Mobile has no "done" frame; it reuses the desktop copy at size s.
const ClaimCard = ({ state, amount, symbol, onClaim, onAddToWallet }: ClaimCardProps) => {
  const claiming = state === "claiming";
  const done = state === "done";
  return (
    <>
      <div className="hidden w-full flex-col gap-4 rounded-(--radius-l) border border-subtle bg-sumi px-6 py-5 xl:flex">
        <h2 className="font-display text-h3 text-primary">Ready to claim</h2>
        {done ? (
          <Done size="m" onAddToWallet={onAddToWallet} />
        ) : (
          <>
            <p className="flex items-baseline gap-1">
              <span className="text-h4 leading-none font-medium text-primary">
                {amount}
              </span>
              <span className={`${BODY_S} text-secondary`}>{symbol}</span>
            </p>
            <ClaimButton claiming={claiming} size="m" onClick={onClaim} />
          </>
        )}
      </div>

      <div className="flex w-full flex-col gap-2 rounded-(--radius-l) border border-subtle bg-sumi px-4 py-3 xl:hidden">
        <h2 className="text-h4 leading-none font-medium text-primary">
          Ready to claim
        </h2>
        {done ? (
          <Done size="s" onAddToWallet={onAddToWallet} />
        ) : (
          <div className="flex items-center justify-between gap-4">
            <p className="flex items-baseline gap-1">
              <span className={`${BODY_L} text-primary`}>{amount}</span>
              <span className={`${BODY_S} text-secondary`}>{symbol}</span>
            </p>
            <ClaimButton claiming={claiming} size="s" onClick={onClaim} />
          </div>
        )}
      </div>
    </>
  );
};

export default ClaimCard;
