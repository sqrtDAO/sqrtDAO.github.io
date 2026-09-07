"use client";

import {
  IconCalendarPlus,
  IconInfoCircle,
  IconLoader2,
  IconMinus,
  IconPlus,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import type { UseInputReturn } from "@/hooks/useInput";
import { fmtInt } from "@/utils/formatInt";
import "./ParticipationFlow.css";

export type ParticipateState = "idle" | "approving" | "participating" | "error";

export type ParticipationFlowProps = {
  idPrefix: string;
  amount: UseInputReturn;
  amountLiveError: string | null;
  showWalletBalance: boolean;
  walletBalanceFormatted: number;
  participationTokenSymbol: string;
  fromEpoch: UseInputReturn;
  toEpoch: UseInputReturn;
  onFromEpochBlur: () => void;
  onToEpochBlur: () => void;
  fromEpochNum: number;
  toEpochNum: number;
  lastEpoch: number;
  perEpochAmount: number;
  claimDelayDays: number;
  epochsExpanded: boolean;
  onEpochsExpanded: (expanded: boolean) => void;
  onAmountFocus: (focused: boolean) => void;
  ctaLabel: string;
  ctaDisabled: boolean;
  onCtaClick: () => void;
};

export default function ParticipationFlow({
  idPrefix,
  amount,
  amountLiveError,
  showWalletBalance,
  walletBalanceFormatted,
  participationTokenSymbol,
  fromEpoch,
  toEpoch,
  onFromEpochBlur,
  onToEpochBlur,
  fromEpochNum,
  toEpochNum,
  lastEpoch,
  perEpochAmount,
  claimDelayDays,
  epochsExpanded,
  onEpochsExpanded,
  onAmountFocus,
  ctaLabel,
  ctaDisabled,
  onCtaClick,
}: ParticipationFlowProps) {
  const epochCountNum = toEpochNum - fromEpochNum + 1;
  const amountError = amount.error ?? amountLiveError;

  return (
    <div className="ddp-participation">
      <h2>Participation</h2>
      <div className="ddp-participation__main">
        <div className="ddp-input-card">
          <label
            className="ddp-input-card__label"
            htmlFor={`${idPrefix}-amount`}
          >
            Total participation amount
          </label>
          <div className="ddp-input-card__row">
            <input
              id={`${idPrefix}-amount`}
              className="ddp-input-card__input"
              type="text"
              inputMode="decimal"
              placeholder="Enter participation amount"
              autoComplete="off"
              value={amount.value}
              onChange={(e) => amount.onChange(e.target.value)}
              onFocus={() => onAmountFocus(true)}
              onBlur={() => onAmountFocus(false)}
            />
            <span className="ddp-input-card__unit">
              {participationTokenSymbol}
            </span>
          </div>
          {showWalletBalance && (
            <div className="ddp-input-card__hint">
              <span>Wallet balance</span>
              <span>
                {fmtInt(walletBalanceFormatted)} {participationTokenSymbol}
              </span>
            </div>
          )}
        </div>
        {amountError && (
          <p className="ddp-participation__error">{amountError}</p>
        )}

        <div className={`ddp-input-card${epochsExpanded ? " is-active" : ""}`}>
          <span className="ddp-input-card__label">Spread across</span>
          {epochsExpanded ? (
            <div className="ddp-input-card__row">
              <span className="ddp-input-card__value">{epochCountNum}</span>
              <span className="ddp-input-card__unit">Epochs</span>
            </div>
          ) : (
            <button
              type="button"
              className="ddp-input-card__toggle"
              onClick={() => onEpochsExpanded(true)}
            >
              <span className="ddp-input-card__placeholder">
                Number of epochs to participate
              </span>
              <span className="ddp-input-card__unit">Epochs</span>
            </button>
          )}
          {epochsExpanded && (
            <div className="ddp-epoch-range">
              <div className="ddp-epoch-range__field">
                <span>From #epoch</span>
                <div className="ddp-epoch-range__box">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="From epoch"
                    value={fromEpoch.value}
                    onChange={(e) => fromEpoch.onChange(e.target.value)}
                    onBlur={onFromEpochBlur}
                  />
                </div>
              </div>
              <div className="ddp-epoch-range__field">
                <span>To #epoch</span>
                <div className="ddp-epoch-range__box">
                  <input
                    type="text"
                    inputMode="numeric"
                    autoComplete="off"
                    aria-label="To epoch"
                    value={toEpoch.value}
                    onChange={(e) => toEpoch.onChange(e.target.value)}
                    onBlur={onToEpochBlur}
                  />
                </div>
                <div className="ddp-epoch-range__steppers">
                  <IconButton
                    icon={<IconMinus size={16} strokeWidth={1.75} />}
                    variant="outline"
                    size="s"
                    aria-label="Decrease to epoch"
                    disabled={toEpochNum <= fromEpochNum}
                    onClick={() =>
                      toEpoch.onChange(
                        String(Math.max(fromEpochNum, toEpochNum - 1)),
                      )
                    }
                  />
                  <IconButton
                    icon={<IconPlus size={16} strokeWidth={1.75} />}
                    variant="secondary"
                    size="s"
                    aria-label="Increase to epoch"
                    disabled={toEpochNum >= lastEpoch}
                    onClick={() =>
                      toEpoch.onChange(
                        String(Math.min(lastEpoch, toEpochNum + 1)),
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}
        </div>
        {epochsExpanded && perEpochAmount > 0 && (
          <p className="ddp-participation__per-epoch">
            ≈{" "}
            {perEpochAmount.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}{" "}
            {participationTokenSymbol} per epoch
          </p>
        )}
      </div>
      <div className="ddp-participation__footer">
        <div className="ddp-participation__claim-delay">
          <span>Claim delay</span>
          <span>{claimDelayDays} days</span>
        </div>
        <Button
          variant="primary"
          size="m"
          className="ddp-participation__cta"
          disabled={ctaDisabled}
          onClick={onCtaClick}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
}

function fmtClaimDate(timestampMs: number): string {
  const datePart = new Date(timestampMs).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const timePart = new Date(timestampMs).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return `${datePart}, ${timePart} UTC`;
}

function buildClaimReminderIcs(claimAvailableMs: number, symbol: string) {
  const dt =
    new Date(claimAvailableMs)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    `DTSTAMP:${dt}`,
    `DTSTART:${dt}`,
    `SUMMARY:Claim your ${symbol} share`,
    `DESCRIPTION:Your ${symbol} share from this participation becomes claimable.`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export type ParticipationReviewDialogProps = {
  amountText: string;
  amountSymbol: string;
  claimSymbol: string;
  fromEpochNum: number;
  toEpochNum: number;
  claimDelayDays: number;
  claimAvailableMs: number;
  state: ParticipateState;
  onClose: () => void;
  onConfirm: () => void;
};

export function ParticipationReviewDialog({
  amountText,
  amountSymbol,
  claimSymbol,
  fromEpochNum,
  toEpochNum,
  claimDelayDays,
  claimAvailableMs,
  state,
  onClose,
  onConfirm,
}: ParticipationReviewDialogProps) {
  const isParticipating =
    state === "approving" || state === "participating";
  const epochCountNum = toEpochNum - fromEpochNum + 1;

  const handleAddToCalendar = () => {
    if (!claimAvailableMs) return;
    const blob = new Blob(
      [buildClaimReminderIcs(claimAvailableMs, claimSymbol)],
      { type: "text/calendar" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "claim-reminder.ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ddp-confirm-backdrop" onClick={onClose}>
      <div className="ddp-confirm" onClick={(e) => e.stopPropagation()}>
        <div className="ddp-confirm__header">
          <div className="ddp-confirm__title-row">
            <h2>Participation review</h2>
            <IconButton
              icon={<IconX size={24} strokeWidth={1.75} />}
              variant="ghost"
              size="m"
              aria-label="Close"
              disabled={isParticipating}
              onClick={onClose}
            />
          </div>
          <p className="ddp-confirm__subtitle">One last look!</p>
        </div>

        <div className="ddp-confirm__summary">
          <p>
            You&apos;re participating with{" "}
            <strong>
              {amountText} {amountSymbol}
            </strong>
            , From epoch <strong>#{fromEpochNum}</strong> to{" "}
            <strong>#{toEpochNum}.</strong>{" "}
            <strong>
              {epochCountNum} epoch{epochCountNum > 1 ? "s" : ""}
            </strong>{" "}
            in total.
          </p>
          <p>
            Each epoch settles at one clear price when it closes, the same
            for everyone who took part.
          </p>
        </div>

        <div className="ddp-confirm__alert">
          <IconInfoCircle size={24} strokeWidth={1.75} />
          <div className="ddp-confirm__alert-text">
            <strong>Claim delay is {claimDelayDays} days</strong>
            <p>
              You can claim your {claimSymbol} share after{" "}
              {fmtClaimDate(claimAvailableMs)}.
            </p>
            <button
              type="button"
              className="ddp-confirm__calendar"
              onClick={handleAddToCalendar}
            >
              <IconCalendarPlus size={14} strokeWidth={1.75} />
              Add to calendar
            </button>
          </div>
        </div>

        {state === "error" && (
          <p className="ddp-participation__error">
            Participation failed. Please try again.
          </p>
        )}

        <div className="ddp-confirm__actions">
          <Button
            variant="outline"
            size="m"
            fullWidth
            disabled={isParticipating}
            onClick={onClose}
          >
            Back &amp; Edit
          </Button>
          <Button
            variant="primary"
            size="m"
            fullWidth
            disabled={isParticipating}
            leadingIcon={
              isParticipating ? <IconLoader2 size={18} /> : undefined
            }
            onClick={onConfirm}
          >
            {state === "approving"
              ? "Approving..."
              : state === "participating"
                ? "Participating..."
                : "Confirm & sign"}
          </Button>
        </div>
      </div>
    </div>
  );
}
