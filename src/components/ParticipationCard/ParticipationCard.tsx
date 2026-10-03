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
};

const amountModifier = composeModifiers(decimalOnlyModifier, commaModifier);

const RangeInput = ({
  state,
  label,
  placeholder,
}: {
  state: UseInputReturn;
  label: string;
  placeholder: string;
}) => (
  <input
    aria-label={label}
    value={state.value}
    onChange={(e) => state.onChange(e.target.value)}
    placeholder={placeholder}
    inputMode="numeric"
    autoComplete="off"
    className={`h-10 w-full min-w-0 rounded-m bg-surface px-2 ${BODY_S} text-primary outline-none placeholder:text-tertiary focus-visible:ring-1 focus-visible:ring-focus`}
  />
);

const StepButtons = ({ size }: { size: "m" | "s" }) => {
  const icon = size === "m" ? 24 : 16;
  return (
    <div className="flex gap-2">
      <IconButton
        variant="outline"
        size={size}
        aria-label="One epoch fewer"
        icon={<IconMinus size={icon} />}
        onClick={() => {
          /* TODO: teammate wires onStepEpochs(-1) */
        }}
      />
      <IconButton
        variant="secondary"
        size={size}
        aria-label="One epoch more"
        icon={<IconPlus size={icon} />}
        onClick={() => {
          /* TODO: teammate wires onStepEpochs(+1) */
        }}
      />
    </div>
  );
};

// Figma _cardSlot (epochs): From row spans the input across; To row adds the −/+ steppers (m desktop, s mobile).
const EpochRange = ({
  fromEpoch,
  toEpoch,
}: {
  fromEpoch: string;
  toEpoch: string;
}) => {
  const from = useInput("", numberOnlyModifier);
  const to = useInput("", numberOnlyModifier);
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
        {/* Wrappers carry the breakpoint: icon-btn CSS is unlayered and would beat `hidden`. */}
        <span className="hidden xl:block">
          <StepButtons size="m" />
        </span>
        <span className="xl:hidden">
          <StepButtons size="s" />
        </span>
      </div>
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
}: ParticipationCardProps) => {
  const amount = useInput("", amountModifier);
  const epochs = useInput("", numberOnlyModifier);
  /* TODO: teammate wires onAmountChange / onEpochsChange (validation, balance check, range sync) */

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
        <ParticipationInputCard
          state={epochs}
          label="Spread across"
          unit="Epochs"
          placeholder="Number of epochs to participate"
          disabled={disabled}
          slotWhen="filled"
          slot={<EpochRange fromEpoch={fromEpoch} toEpoch={toEpoch} />}
        />
        {amount.value && epochs.value && (
          <p className="text-body leading-6 font-medium tracking-[0.02em] text-accent">
            {perEpochEstimate}
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
          disabled={disabled}
          onClick={() => {
            /* TODO: teammate wires onConnect when not connected */
            if (connected) onParticipate?.();
          }}
        >
          {connected ? "Participate" : "Connect wallet"}
        </Button>
      </div>
    </div>
  );
};

export default ParticipationCard;
