"use client";

import { IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import ParticipationInputCard from "@/components/ParticipationInputCard/ParticipationInputCard";
import { useInput, type UseInputReturn } from "@/hooks/useInput";
import {
  commaModifier,
  composeModifiers,
  decimalOnlyModifier,
  numberOnlyModifier,
} from "@/utils/modifier";
import { BODY_M, BODY_S } from "@/constants/typography";

export type ParticipationRangeState = {
  from: UseInputReturn;
  to: UseInputReturn;
};

export type ParticipationCardProps = {
  connected?: boolean;
  disabled?: boolean;
  quoteSymbol: string;
  walletBalance: string;
  claimDelay: string;
  /** Suggested epoch range, shown as the From/To placeholders. */
  fromEpoch: string;
  toEpoch: string;
  /** "≈ 20 USDT per epoch" — teammate computes from amount ÷ epochs. */
  perEpochEstimate: string;
  /** Opens the participation review dialog (connected only). */
  onParticipate?: () => void;
  /** Controlled inputs (optional). Falls back to internal state when omitted. */
  amountState?: UseInputReturn;
  epochsState?: UseInputReturn;
  rangeState?: ParticipationRangeState;
  onStepEpochs?: (delta: number) => void;
  amountError?: string | null;
  rangeError?: string | null;
  onConnect?: () => void;
  /** Button label when not connected (e.g. "Switch to Base"). */
  connectLabel?: string;
  /** In-flight / failed state for the participate action. */
  state?: "idle" | "approving" | "participating" | "error";
};

const amountModifier = composeModifiers(decimalOnlyModifier, commaModifier);

const RangeInput = ({
  state,
  label,
  placeholder,
  error,
}: {
  state: UseInputReturn;
  label: string;
  placeholder: string;
  error?: string | null;
}) => (
  <>
    <input
      aria-label={label}
      value={state.value}
      onChange={(e) => state.onChange(e.target.value)}
      placeholder={placeholder}
      inputMode="numeric"
      autoComplete="off"
      className={`h-10 w-full min-w-0 rounded-m bg-surface px-2 ${BODY_S} text-primary outline-none placeholder:text-tertiary focus-visible:ring-1 focus-visible:ring-focus ${
        error ? "ring-1 ring-danger" : ""
      }`}
    />
    {error && <p className={`${BODY_S} text-danger`}>{error}</p>}
  </>
);

const StepButtons = ({
  size,
  onStep,
}: {
  size: "m" | "s";
  onStep?: (delta: number) => void;
}) => {
  const icon = size === "m" ? 24 : 16;
  return (
    <div className="flex gap-2">
      <IconButton
        variant="outline"
        size={size}
        aria-label="One epoch fewer"
        icon={<IconMinus size={icon} />}
        onClick={() => onStep?.(-1)}
      />
      <IconButton
        variant="secondary"
        size={size}
        aria-label="One epoch more"
        icon={<IconPlus size={icon} />}
        onClick={() => onStep?.(1)}
      />
    </div>
  );
};

const EpochRange = ({
  fromEpoch,
  toEpoch,
  rangeState,
  onStepEpochs,
  rangeError,
}: {
  fromEpoch: string;
  toEpoch: string;
  rangeState?: ParticipationRangeState;
  onStepEpochs?: (delta: number) => void;
  rangeError?: string | null;
}) => {
  const internalFrom = useInput("", numberOnlyModifier);
  const internalTo = useInput("", numberOnlyModifier);
  const from = rangeState?.from ?? internalFrom;
  const to = rangeState?.to ?? internalTo;
  return (
    <div className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-2">
      <span className={`${BODY_M} whitespace-nowrap text-secondary`}>
        From #epoch
      </span>
      <div className="col-span-2">
        <RangeInput state={from} label="From epoch" placeholder={fromEpoch} />
      </div>
      <span className={`${BODY_M} whitespace-nowrap text-secondary`}>
        To #epoch
      </span>
      <RangeInput state={to} label="To epoch" placeholder={toEpoch} />
      <div>
        <span className="hidden xl:block">
          <StepButtons size="m" onStep={onStepEpochs} />
        </span>
        <span className="xl:hidden">
          <StepButtons size="s" onStep={onStepEpochs} />
        </span>
      </div>
      {rangeError && (
        <p className={`col-span-3 ${BODY_S} text-danger`}>{rangeError}</p>
      )}
    </div>
  );
};

// Figma 14716:107569 (desktop) / 14411:85097 (mobile) — same structure, mobile is tighter.
const ParticipationCard = ({
  connected = false,
  disabled = false,
  quoteSymbol,
  walletBalance,
  claimDelay,
  fromEpoch,
  toEpoch,
  perEpochEstimate,
  onParticipate,
  amountState,
  epochsState,
  rangeState,
  onStepEpochs,
  amountError,
  rangeError,
  onConnect,
  connectLabel,
  state = "idle",
}: ParticipationCardProps) => {
  const internalAmount = useInput("", amountModifier);
  const internalEpochs = useInput("", numberOnlyModifier);
  const amount = amountState ?? internalAmount;
  const epochs = epochsState ?? internalEpochs;
  const busy = state === "approving" || state === "participating";
  const ctaLabel = connected
    ? state === "approving"
      ? "Approving…"
      : state === "participating"
        ? "Participating…"
        : "Participate"
    : connectLabel ?? "Connect wallet";

  return (
    <div className="flex w-full flex-col gap-4 rounded-(--radius-l) bg-canvas p-4 xl:gap-6 xl:px-6 xl:py-5">
      <h2 className="font-display text-h3 text-primary">Participation</h2>
      <div className="flex w-full flex-col gap-2">
        <ParticipationInputCard
          state={amount}
          label="Total participation amount"
          unit={quoteSymbol}
          placeholder="Enter participation amount"
          hint={`~${amount.value}`}
          disabled={disabled}
          slot={
            <p className={`flex gap-1.5 ${BODY_S}`}>
              <span className="text-secondary">Wallet balance</span>
              <span className="text-primary">{walletBalance}</span>
            </p>
          }
        />
        {amountError && <p className={`${BODY_S} text-danger`}>{amountError}</p>}
        <ParticipationInputCard
          state={epochs}
          label="Spread across"
          unit="Epochs"
          placeholder="Number of epochs to participate"
          disabled={disabled}
          slotWhen="filled"
          slot={
            <EpochRange
              fromEpoch={fromEpoch}
              toEpoch={toEpoch}
              rangeState={rangeState}
              onStepEpochs={onStepEpochs}
              rangeError={rangeError}
            />
          }
        />
        {amount.value && epochs.value && (
          <p className="text-body leading-6 font-medium tracking-[0.02em] text-accent">
            {perEpochEstimate}
          </p>
        )}
        {state === "error" && (
          <p className={`${BODY_S} text-danger`}>
            Participation didn&apos;t go through. Please try again.
          </p>
        )}
      </div>
      <div className="flex w-full items-center gap-4">
        <div className={`flex flex-1 flex-col ${BODY_S}`}>
          <span className="text-secondary">Claim delay</span>
          <span className="text-primary">{claimDelay}</span>
        </div>
        <Button
          variant="primary"
          size="m"
          className="flex-1"
          disabled={disabled || busy}
          onClick={() => {
            if (!connected) {
              onConnect?.();
              return;
            }
            onParticipate?.();
          }}
        >
          {ctaLabel}
        </Button>
      </div>
    </div>
  );
};

export default ParticipationCard;
