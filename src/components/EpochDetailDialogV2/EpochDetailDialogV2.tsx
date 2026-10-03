"use client";

import { useEffect } from "react";
import { IconCircleDot, IconProgressBolt, IconX } from "@tabler/icons-react";
import Alert from "@/components/Alert/Alert";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import type { EpochDetailDialogProps } from "@/components/EpochDetailDialog/EpochDetailDialog";
import { useCountdown } from "@/hooks/useCountdown";
import { formatDuration } from "@/utils/formatDuration";
import { roundUnits } from "@/utils/round-units";
import { fmtInt } from "@/utils/formatInt";
import { BODY_L, BODY_M, BODY_S } from "@/constants/typography";

// ponytail: fmtGrouped/fmtPrice duplicated from EpochDetailDialog (V1 stays untouched); dedupe when V1 is retired.
const fmtGrouped = (amount: bigint, decimals: number): string => {
  const str = roundUnits(amount, decimals);
  if (str.startsWith("<") || str === "0") return str;
  const [intPart, rest] = str.split(".");
  const grouped = Number(intPart).toLocaleString("en-US");
  return rest ? `${grouped}.${rest}` : grouped;
};

const fmtPrice = (price: number | null): string =>
  price == null ? "—" : parseFloat(price.toFixed(4)).toString();

const StatusChip = ({ live }: { live: boolean }) => (
  <div
    className={`inline-flex shrink-0 items-center gap-1 ${BODY_M} whitespace-nowrap ${
      live ? "bg-live-bg text-live" : "bg-danger-bg text-danger"
    }`}
  >
    {live ? (
      <IconProgressBolt size={18} strokeWidth={1.75} />
    ) : (
      <IconCircleDot size={18} strokeWidth={1.75} />
    )}
    {live ? "Live epoch" : "Closed"}
  </div>
);

const TimeSegments = ({
  hours,
  minutes,
  seconds,
}: {
  hours: number;
  minutes: number;
  seconds: number;
}) => {
  const segments: [string, number][] = [
    ["H", hours],
    ["M", minutes],
    ["S", seconds],
  ];
  return (
    <div className="flex items-stretch gap-1">
      {segments.flatMap(([unit, value], i) => [
        i > 0 && (
          // Figma vertical divider: 8px slot, hairline centred.
          <span
            key={`d-${unit}`}
            className="flex w-2 justify-center"
            aria-hidden="true"
          >
            <span className="w-px bg-subtle" />
          </span>
        ),
        <p key={unit} className="flex items-baseline gap-1 whitespace-nowrap">
          <span className={`${BODY_M} text-primary`}>{value}</span>
          <span className={`${BODY_S} text-tertiary`}>{unit}</span>
        </p>,
      ])}
    </div>
  );
};

const StatRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex w-full flex-col gap-1">
    <p className={`${BODY_M} text-tertiary`}>{label}</p>
    <div className="flex items-baseline gap-2 text-primary">{children}</div>
  </div>
);

const Value = ({
  children,
  danger = false,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) => (
  <span className={`${BODY_L} ${danger ? "text-danger" : ""}`}>{children}</span>
);
const Unit = ({
  children,
  muted = false,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) => (
  <span className={`${BODY_S} ${muted ? "text-tertiary" : ""}`}>
    {children}
  </span>
);

// Figma 10690:89504 — live / upcoming / closed × participated / normal / zero. Same props as V1 so the
// teammate can swap the import in DistributionDetail.tsx when he wires it.
const EpochDetailDialogV2 = ({
  epoch,
  epochEndMs,
  epochDurationSec,
  lastClearPrice,
  tokenSymbol,
  tokenDecimals,
  quoteSymbol,
  quoteDecimals,
  claiming,
  onClose,
  onParticipateClick,
  onClaimClick,
}: EpochDetailDialogProps) => {
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

  // Display-only share math, unchanged from V1.
  const sharePct = zero
    ? 0
    : Math.round(
        Number(
          (epoch.userParticipationAmount * 10000n) / epoch.participationAmount,
        ) / 100,
      );
  const userTokenAmount = zero
    ? 0n
    : (epoch.userParticipationAmount * (epoch.supplyAmount ?? 0n)) /
      epoch.participationAmount;

  const priceValue = isCurrent
    ? lastClearPrice
    : isClosed
      ? epoch.clearPrice
      : null;
  const [durationValue, durationUnit] =
    formatDuration(epochDurationSec).split(" ");
  const muted = `${BODY_M} text-tertiary`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Epoch ${epoch.epoch} details`}
    >
      <div
        className="flex w-full max-w-112.5 flex-col gap-6 overflow-hidden rounded-(--radius-l) bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex w-full flex-col gap-2">
          <div className="flex w-full items-center justify-between">
            <h2 className="font-display text-h3 text-primary">
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
          {!isFuture && (
            <div className="flex items-center gap-4">
              <StatusChip live={isCurrent} />
              {isCurrent && (
                <TimeSegments
                  hours={hours}
                  minutes={minutes}
                  seconds={seconds}
                />
              )}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col gap-4">
          {mine && (
            <div className="flex w-full flex-col items-end gap-4 rounded-m bg-canvas px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-2 whitespace-nowrap">
                <p className="flex flex-wrap items-baseline gap-1">
                  <span className={muted}>
                    {isClosed ? "Your share is" : "Your projected share"}
                  </span>
                  {!isClosed && (
                    <span className={`${BODY_L} text-primary`}>≈</span>
                  )}
                  <span className={`${BODY_L} text-primary`}>{sharePct}%</span>
                  {isClosed && <span className={muted}>of epoch supply</span>}
                </p>
                <p className="flex flex-wrap items-baseline gap-1">
                  {!isClosed && (
                    <span className={`${BODY_L} text-primary`}>≈</span>
                  )}
                  <span className={`${BODY_L} text-primary`}>
                    {fmtGrouped(userTokenAmount, tokenDecimals ?? 18)}
                  </span>
                  <span className={muted}>{tokenSymbol}</span>
                  <span className={muted}>for</span>
                  <span className={`${BODY_L} text-primary`}>
                    {fmtGrouped(
                      epoch.userParticipationAmount,
                      quoteDecimals ?? 18,
                    )}
                  </span>
                  <span className={muted}>{quoteSymbol}</span>
                </p>
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

          <StatRow label="Supply this epoch">
            <Value>
              {fmtGrouped(epoch.supplyAmount ?? 0n, tokenDecimals ?? 18)}
            </Value>
            <Unit>{tokenSymbol}</Unit>
          </StatRow>

          <StatRow label="Epoch total participation">
            <span className="flex items-baseline gap-1">
              <Value danger={zero}>
                {fmtGrouped(epoch.participationAmount, quoteDecimals ?? 18)}
              </Value>
              <Unit>{quoteSymbol}</Unit>
              <Unit muted>by</Unit>
              <Value danger={zero}>{fmtInt(epoch.participants ?? 0)}</Value>
              <Unit muted>participants</Unit>
            </span>
          </StatRow>

          {!isFuture && (
            <StatRow
              label={isCurrent ? "Last clear price" : "Epoch clear price"}
            >
              <Value>{fmtPrice(priceValue)}</Value>
              {priceValue != null && <Unit>{quoteSymbol}</Unit>}
            </StatRow>
          )}

          <StatRow label="Epoch duration">
            <Value>{durationValue}</Value>
            <Unit>{durationUnit}</Unit>
          </StatRow>

          {!isClosed && mine && (
            <Alert
              tone="info"
              title="Final share is set when the epoch closes."
            />
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
};

export default EpochDetailDialogV2;
