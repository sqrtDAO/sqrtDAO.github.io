"use client";

import { useEffect } from "react";
import {
  IconCircleDot,
  IconInfoCircle,
  IconInnerShadowBottomLeft,
  IconProgressBolt,
  IconX,
} from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { useCountdown } from "@/hooks/useCountdown";
import type { EpochData } from "@/lib/charts/types";
import { formatDateTime } from "@/utils/formatDate";
import { roundUnits } from "@/utils/round-units";
import { fmtInt } from "@/utils/formatInt";

export type EpochDetailDialogProps = {
  epoch: EpochData;
  /** Close timestamp (ms) of the current epoch — only used while epoch.state === "current". */
  epochEndMs: number;
  /** Most recently closed epoch's clear price — shown as "Last clear price" while this epoch is open. */
  lastClearPrice: number | null;
  tokenSymbol?: string;
  tokenDecimals?: number;
  quoteSymbol?: string;
  quoteDecimals?: number;
  claiming: boolean;
  onClose: () => void;
  onParticipateClick: () => void;
  onClaimClick: () => void;
};

/** roundUnits() output, comma-grouped ("20,000" instead of "20000"). */
function fmtGrouped(amount: bigint, decimals: number): string {
  const str = roundUnits(amount, decimals);
  if (str.startsWith("<") || str === "0") return str;
  const [intPart, rest] = str.split(".");
  const grouped = Number(intPart).toLocaleString("en-US");
  return rest ? `${grouped}.${rest}` : grouped;
}

function fmtPrice(price: number | null): string {
  return price == null ? "—" : parseFloat(price.toFixed(4)).toString();
}

function StatusChip({ state }: { state: EpochData["state"] }) {
  if (state === "current") {
    return (
      <div className="inline-flex shrink-0 items-center gap-1 bg-live-bg text-live">
        <IconProgressBolt size={18} strokeWidth={1.75} />
        <span className="text-body whitespace-nowrap">Live epoch</span>
      </div>
    );
  }
  if (state === "future") {
    return (
      <div className="inline-flex shrink-0 items-center gap-1 bg-info-bg text-info">
        <IconInnerShadowBottomLeft size={18} strokeWidth={1.75} />
        <span className="text-body whitespace-nowrap">Upcoming</span>
      </div>
    );
  }
  return (
    <div className="inline-flex shrink-0 items-center gap-1 bg-danger-bg text-danger">
      <IconCircleDot size={18} strokeWidth={1.75} />
      <span className="text-body whitespace-nowrap">Closed</span>
    </div>
  );
}

function TimeSegments({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) {
  const segments: [string, number][] = [
    ["H", hours],
    ["M", minutes],
    ["S", seconds],
  ];
  return (
    <div className="flex items-center gap-1">
      {segments.flatMap(([unit, value], i) => [
        i > 0 ? (
          <span key={`d-${unit}`} className="h-[18px] w-px bg-subtle" />
        ) : null,
        <div key={unit} className="flex items-baseline gap-1 whitespace-nowrap">
          <span className="text-body text-primary">{value}</span>
          <span className="text-body-s text-tertiary">{unit}</span>
        </div>,
      ])}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex w-full flex-col gap-1">
      <p className="text-body text-tertiary">{label}</p>
      <div className="flex items-baseline gap-2 text-primary">{value}</div>
    </div>
  );
}

export default function EpochDetailDialog({
  epoch,
  epochEndMs,
  lastClearPrice,
  tokenSymbol,
  tokenDecimals,
  quoteSymbol,
  quoteDecimals,
  claiming,
  onClose,
  onParticipateClick,
  onClaimClick,
}: EpochDetailDialogProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const { hours, minutes, seconds } = useCountdown(epochEndMs);

  const isCurrent = epoch.state === "current";
  const isFuture = epoch.state === "future";
  const isClosed = epoch.state === "passed";
  const mine = epoch.participated;
  const zero = epoch.participationAmount === 0n;
  const hasParticipation = epoch.participationAmount > 0n;

  const sharePct = hasParticipation
    ? Math.round(
        Number((epoch.userParticipationAmount * 10000n) / epoch.participationAmount) / 100,
      )
    : 0;
  const userTokenAmount = hasParticipation
    ? (epoch.userParticipationAmount * (epoch.supplyAmount ?? 0n)) /
      epoch.participationAmount
    : 0n;

  const priceValue = isCurrent ? lastClearPrice : isClosed ? epoch.clearPrice : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-label={`Epoch ${epoch.epoch} details`}
    >
      <div
        className="flex w-full max-w-[450px] flex-col gap-6 rounded-l bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <h2 className="text-h3 font-display text-primary">
              Epoch #{epoch.epoch}
            </h2>
            <IconButton
              icon={<IconX size={24} strokeWidth={1.75} />}
              variant="ghost"
              size="m"
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <div className="flex items-center gap-4">
            <StatusChip state={epoch.state} />
            {isCurrent && (
              <TimeSegments hours={hours} minutes={minutes} seconds={seconds} />
            )}
            {isFuture && (
              <div className="flex items-baseline gap-1 whitespace-nowrap">
                <span className="text-body text-tertiary">Opens in</span>
                <span className="text-body text-primary">
                  {formatDateTime(epoch.timestamp)}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex w-full flex-col gap-4">
          {mine && (
            <div className="flex w-full flex-col items-end gap-4 rounded-m bg-canvas px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap items-baseline gap-1">
                  {isClosed ? (
                    <>
                      <span className="text-body text-tertiary">
                        Your share is
                      </span>
                      <span className="text-body-l text-primary">
                        {sharePct}%
                      </span>
                      <span className="text-body text-tertiary">
                        of epoch supply
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-body text-tertiary">
                        Your projected share
                      </span>
                      <span className="text-body-l text-primary">≈</span>
                      <span className="text-body-l text-primary">
                        {sharePct}%
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap items-baseline gap-1">
                  {!isClosed && <span className="text-body-l text-primary">≈</span>}
                  <span className="text-body-l text-primary">
                    {fmtGrouped(userTokenAmount, tokenDecimals ?? 18)}
                  </span>
                  <span className="text-body text-tertiary">{tokenSymbol}</span>
                  <span className="text-body text-tertiary">for</span>
                  <span className="text-body-l text-primary">
                    {fmtGrouped(epoch.userParticipationAmount, quoteDecimals ?? 18)}
                  </span>
                  <span className="text-body text-tertiary">{quoteSymbol}</span>
                </div>
              </div>
              {isClosed ? (
                <Button
                  variant="outline"
                  size="m"
                  className="shrink-0"
                  disabled={epoch.claimed || claiming}
                  onClick={onClaimClick}
                >
                  {epoch.claimed ? "Claimed" : claiming ? "Claiming…" : "Claim"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="m"
                  className="shrink-0"
                  onClick={onParticipateClick}
                >
                  Participate
                </Button>
              )}
            </div>
          )}

          <StatRow
            label="Supply this epoch"
            value={
              <>
                <span className="text-body-l">
                  {fmtGrouped(epoch.supplyAmount ?? 0n, tokenDecimals ?? 18)}
                </span>
                <span className="text-body-s">{tokenSymbol}</span>
              </>
            }
          />

          <StatRow
            label="Epoch total participation"
            value={
              <>
                <span className={`text-body-l ${zero ? "text-danger" : ""}`}>
                  {fmtGrouped(epoch.participationAmount, quoteDecimals ?? 18)}
                </span>
                <span className="text-body-s">{quoteSymbol}</span>
                <span className="text-body-s text-tertiary">by</span>
                <span className={`text-body-l ${zero ? "text-danger" : ""}`}>
                  {fmtInt(epoch.participants ?? 0)}
                </span>
                <span className="text-body-s text-tertiary">participants</span>
              </>
            }
          />

          {!isFuture && (
            <StatRow
              label={isCurrent ? "Last clear price" : "Epoch clear price"}
              value={
                <>
                  <span className="text-body-l">{fmtPrice(priceValue)}</span>
                  {priceValue != null && (
                    <span className="text-body-s">{quoteSymbol}</span>
                  )}
                </>
              }
            />
          )}

          {!isClosed && mine && (
            <div className="flex w-full items-start gap-3 rounded-m border-l-[2.5px] border-info bg-info-bg px-4 py-3">
              <IconInfoCircle
                size={24}
                strokeWidth={1.75}
                className="shrink-0 text-info"
              />
              <p className="text-body font-medium text-info">
                Final share is set when the epoch closes.
              </p>
            </div>
          )}
        </div>

        {!isClosed && !mine && (
          <div className="flex w-full gap-4">
            <Button
              variant="outline"
              size="m"
              className="flex-1"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="m"
              className="flex-1"
              onClick={onParticipateClick}
            >
              Participate
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
