"use client";

import { IconCalendarShare } from "@tabler/icons-react";
import Alert from "@/components/Alert/Alert";
import { Button } from "@/components/Button/Button";
import DialogShell from "@/components/DialogShell/DialogShell";
import ImportedTokenAlert from "@/components/ImportedTokenAlert/ImportedTokenAlert";

type ParticipationReviewDialogV2Props = {
  imported: boolean;
  /** Pre-formatted, e.g. "21,321 USDT". */
  amount: string;
  fromEpoch: number;
  toEpoch: number;
  tokenSymbol: string;
  claimDelayDays: number;
  /** Pre-formatted, e.g. "21 June 2026, 12:34 UTC". */
  claimDate: string;
  onClose: () => void;
};

const onConfirm = () => {
  /* TODO: teammate wires onConfirm (sign + submit participation) */
};
const onAddToCalendar = () => {
  /* TODO: teammate wires onAddToCalendar */
};

// Figma 12057:114348 (sqrtDAO token) / 12057:114399 (imported token: adds the live-tone alert).
// Built alongside ParticipationFlow's ParticipationReviewDialog, which stays untouched.
const ParticipationReviewDialogV2 = ({
  imported,
  amount,
  fromEpoch,
  toEpoch,
  tokenSymbol,
  claimDelayDays,
  claimDate,
  onClose,
}: ParticipationReviewDialogV2Props) => {
  const words: [string, boolean][] = [
    ["You’re participating with", false],
    [`${amount},`, true],
    ["From epoch", false],
    [`#${fromEpoch}`, true],
    ["to", false],
    [`#${toEpoch}.`, true],
    [`${toEpoch - fromEpoch} epochs`, true],
    ["in total", false],
    [".", false],
  ];
  return (
    <DialogShell
      title="Participation review"
      onClose={onClose}
      subtitle={
        <p className="text-body-s leading-4 font-medium tracking-[0.02em] text-primary">
          One last look!
        </p>
      }
    >
      <div className="flex flex-col gap-4 font-medium text-primary">
        <p className="flex flex-wrap items-baseline gap-x-1 gap-y-2 text-body-l leading-6 tracking-[0.02em]">
          {words.map(([text, accent]) => (
            <span key={text} className={accent ? "text-accent" : ""}>
              {text}
            </span>
          ))}
        </p>
        <p className="text-body leading-6 tracking-[0.02em]">
          Each epoch settles at one clear price when it closes, the same for
          everyone who took part.
        </p>
      </div>
      {imported && <ImportedTokenAlert />}
      <Alert
        tone="info"
        title={`Claim delay is ${claimDelayDays} days`}
        description={`You can claim your ${tokenSymbol} share after ${claimDate}.`}
        action={
          <Button
            variant="ghost"
            size="s"
            leadingIcon={<IconCalendarShare size={14} />}
            onClick={onAddToCalendar}
          >
            Add to calendar
          </Button>
        }
      />
      <div className="flex gap-4">
        <Button variant="outline" size="m" className="flex-1" onClick={onClose}>
          Back &amp; Edit
        </Button>
        <Button
          variant="primary"
          size="m"
          className="flex-1"
          onClick={onConfirm}
        >
          Confirm &amp; sign
        </Button>
      </div>
    </DialogShell>
  );
};

export default ParticipationReviewDialogV2;
