"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  IconAlertSquareRounded,
  IconCalendarEvent,
  IconClockEdit,
  IconEqualDouble,
  IconMathIntegralX,
  IconMathXDivideY2,
  IconRotate2,
} from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import Divider from "@/components/Divider/Divider";
import Stepper from "@/components/Stepper/Stepper";
import Segmented from "@/components/Segmented/Segmented";
import ReleaseCard from "@/components/ReleaseCard/ReleaseCard";
import Switch from "@/components/Switch/Switch";
import DropDownInput from "@/components/DropDownInput/DropDownInput";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import { WizardShell } from "@/components/WizardShell/WizardShell";
import { useInput } from "@/hooks/useInput";
import { commaModifier, composeModifiers, numberOnlyModifier } from "@/utils/modifier";
import { DISTRIBUTION_LIST, MAINNET_DISTRIBUTE_HREF } from "@/constants/links";
import "@/components/Input/Input.css";

type Step = "welcome" | "supply" | "release" | "rules" | "review" | "wallet" | "confirming" | "ready";
type ReleaseType = "time" | "epoch";

const FORM_STEPS: Step[] = ["supply", "release", "rules", "review"];
const STEP_NAMES = ["Supply and backing", "Release strategy", "Rules", "Review"];
const PAIRED_TOKENS = ["USDT", "ETH", "USDC", "Custom token (Soon)"];
// Mirrors DistributionWizard's local EPOCH_DURATION_OPTIONS (not exported there).
const EPOCH_DURATIONS = ["20 mins", "2 hrs", "8 hrs", "1 day"];

// Static stand-in for the user's TOKEN balance (created/imported token) until the teammate wires the chain read.
const MOCK_BALANCE = 20_000_000n;

// Whole-token amounts: digits only, comma-grouped for display; math stays in bigint.
const tokenModifier = composeModifiers(numberOnlyModifier, commaModifier);
const toBig = (v: string) => BigInt(v.replace(/,/g, "") || "0");
const fmtBig = (n: bigint) => commaModifier(n.toString());

const bodyM = "text-body leading-5.5 tracking-[0.01em]";
const bodyS = "text-body-s leading-5 tracking-[0.01em]";
const bodyL = "text-body-l leading-6 tracking-[0.02em]";

// ---------- shared bits ----------

const SectionLabel = ({ children }: { children: string }) => <p className={`${bodyL} text-secondary`}>{children}</p>;

const Rule = () => (
  <div className="flex h-2 w-full items-center">
    <Divider />
  </div>
);

const Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full items-center justify-end gap-4">{children}</div>
);

const BackContinue = ({ onBack, onNext, nextLabel = "Continue" }: { onBack: () => void; onNext: () => void; nextLabel?: string }) => (
  <Actions>
    <Button variant="ghost" size="m" className="flex-1 xl:flex-none" onClick={onBack}>
      Back
    </Button>
    <Button variant="primary" size="m" className="flex-1 xl:flex-none" onClick={onNext}>
      {nextLabel}
    </Button>
  </Actions>
);

const StepHeader = ({ title, index, description }: { title: string; index: number; description?: string }) => (
  <div className="flex w-full flex-col gap-2">
    <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">{title}</h1>
    <Stepper steps={STEP_NAMES} activeIndex={index} />
    {description && <p className={`${bodyL} text-primary`}>{description}</p>}
  </div>
);

// Input.css field with a trailing icon button that opens the native picker.
const PickerField = ({ label, type, icon }: { label: string; type: "date" | "time"; icon: React.ReactNode }) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="sqrt-input min-w-0 flex-1">
      <label className="sqrt-input__label">
        {label}
        <div className="sqrt-input__field mt-2">
          <input
            ref={ref}
            type={type}
            className="sqrt-input__el [&::-webkit-calendar-picker-indicator]:hidden"
          />
          <IconButton
            variant="secondary"
            size="s"
            aria-label={`Pick ${label}`}
            icon={icon}
            onClick={() => ref.current?.showPicker()}
          />
        </div>
      </label>
    </div>
  );
};

// ---------- steps ----------

const Welcome = ({ onStart }: { onStart: () => void }) => (
  <>
    <div className="flex w-full flex-col gap-2">
      <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">Welcome to Distribution</h1>
      <p className={`${bodyS} text-secondary`}>Here&apos;s how it works</p>
    </div>
    <div className={`${bodyL} flex w-full flex-col gap-6 text-primary`}>
      <p>
        Your token is released gradually, over timed windows called <strong className="font-bold">epochs</strong>,
        not all at once.
        <br />
        In each <strong className="font-bold">epoch</strong>, people take part with funds. When it closes, that
        epoch&apos;s tokens are shared out proportionally, at one price for everyone.
      </p>
      <p>
        As it runs, your token <span className="text-accent">raises funds</span>, finds a{" "}
        <span className="text-accent">fair price</span>, and builds{" "}
        <span className="text-accent">locked liquidity</span>, all at once.
      </p>
    </div>
    <Actions>
      <Button variant="primary" size="l" className="flex-1 xl:flex-none" onClick={onStart}>
        Start distribution
      </Button>
    </Actions>
  </>
);

// Figma 11940:110698 (desktop) / 14513:103662 (mobile)
const Supply = ({ pairIndex, onPairChange }: { pairIndex: number; onPairChange: (i: number) => void }) => {
  const initialSupply = useInput("", tokenModifier);
  const liquidity = useInput("");
  const toDistribute = useInput("", tokenModifier);
  const pair = PAIRED_TOKENS[pairIndex];

  // Initial supply comes out of the balance first; the slider spans what's left.
  const balance = MOCK_BALANCE;
  const initial = toBig(initialSupply.value);
  const distributed = toBig(toDistribute.value);
  const available = balance > initial ? balance - initial : 0n;
  const percent = available > 0n ? Number((distributed * 100n) / available) : 0;
  const remaining = balance - initial - distributed;

  // Typed amounts are capped: initial ≤ balance, distribute ≤ what initial leaves. Empty stays empty.
  const clampTo = (raw: string, max: bigint) => {
    const digits = numberOnlyModifier(raw);
    if (!digits) return "";
    const n = BigInt(digits);
    return fmtBig(n > max ? max : n);
  };
  const onInitialChange = (raw: string) => {
    const next = clampTo(raw, balance);
    initialSupply.onChange(next);
    const left = balance - toBig(next);
    if (distributed > left) toDistribute.onChange(fmtBig(left));
  };
  const onDistributeChange = (raw: string) => toDistribute.onChange(clampTo(raw, available));

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <SectionLabel>Initial price and liquidity pool creation</SectionLabel>
        <p className={`${bodyM} text-primary`}>
          Participants take part in epochs with this asset. It pairs with your token in a Uniswap pool.
        </p>
        <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:gap-4">
          <p className={`${bodyL} text-secondary`}>Paired your token with</p>
          <Segmented
            items={PAIRED_TOKENS}
            activeIndex={pairIndex}
            size="l"
            disabledIndices={[3]}
            onChange={(i) => {
              onPairChange(i);
              /* TODO: teammate wires onPairedTokenChange */
            }}
          />
        </div>
        <div className="flex w-full flex-col gap-4 xl:flex-row">
          <div className="xl:flex-1">
            <Input
              state={initialSupply}
              onChange={onInitialChange}
              label="Initial token supply"
              placeholder="first epoch release amount"
              suffix="TOKEN"
            />
          </div>
          <div className="xl:w-71">
            <Input state={liquidity} label="Initial liquidity" placeholder="e.g. 10,000,000" suffix={pair} />
          </div>
        </div>
        <div className="flex items-center gap-6 whitespace-nowrap">
          <p className={`hidden ${bodyM} text-secondary xl:block`}>Your token initial price will be</p>
          <p className="flex items-end gap-2">
            <span className="flex items-baseline gap-1">
              <span className={`${bodyL} font-medium text-primary`}>1</span>
              <span className={`${bodyM} text-secondary`}>TOKEN</span>
            </span>
            <span className={`${bodyM} text-secondary`}>≈</span>
            <span className="flex items-baseline gap-1">
              <span className={`${bodyL} font-medium text-primary`}>X</span>
              <span className={`${bodyM} text-secondary`}>{pair}</span>
            </span>
          </p>
        </div>
        <p className={`flex items-center gap-1.5 ${bodyS} text-live`}>
          <IconAlertSquareRounded size={16} />
          LP token will be permanently burned
        </p>
      </div>

      <Rule />

      <div className="flex w-full flex-col gap-4">
        <SectionLabel>Supply set up</SectionLabel>
        <Input state={toDistribute} onChange={onDistributeChange} label="Supply to distribute" placeholder="8,000,412" suffix="TOKEN" />
        <div className="flex w-full flex-col gap-2">
          <SupplySlider
            value={percent}
            disabled={available === 0n}
            onChange={(p) => toDistribute.onChange(fmtBig((available * BigInt(p)) / 100n))}
          />
          <div className="flex w-full items-start gap-2">
            <p className={`flex-1 ${bodyM} text-accent`}>
              {percent}% ≈ {fmtBig(distributed)} TOKEN
            </p>
            <div className="flex flex-1 flex-col items-end gap-1 whitespace-nowrap xl:flex-row xl:items-baseline xl:justify-end">
              <p className={`${bodyS} text-secondary`}>Remaining token balance</p>
              <p className="flex items-baseline gap-1">
                <span className={`${bodyM} text-primary`}>{fmtBig(remaining)}</span>
                <span className={`${bodyS} text-secondary`}>TOKEN</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Figma "Progress Indicator" 11946:111071 — 5 segments filled continuously up to the thumb.
// Track is inset by half the thumb (inset-x-2.5) so the fill ends exactly under the native thumb's center.
const SupplySlider = ({
  value,
  disabled,
  onChange,
}: {
  value: number;
  disabled: boolean;
  onChange: (v: number) => void;
}) => (
  <div className="relative flex h-5 w-full items-center">
    <div className="absolute inset-x-2.5 flex gap-0.5" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((i) => (
        <span key={i} className="h-1 flex-1 overflow-hidden bg-strong">
          {/* Dynamic fill width is the one value Tailwind can't express statically. */}
          <span
            className="block h-full bg-action"
            style={{ width: `${Math.min(100, Math.max(0, value * 5 - i * 100))}%` }}
          />
        </span>
      ))}
    </div>
    <input
      type="range"
      min={0}
      max={100}
      value={value}
      disabled={disabled}
      aria-label="Supply to distribute (% of available balance)"
      onChange={(e) => onChange(Number(e.target.value))}
      className="relative h-5 w-full cursor-pointer appearance-none bg-transparent disabled:cursor-not-allowed [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-action [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-5 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-action"
    />
  </div>
);

// Figma 11254:94308 (time) / 11254:94595 (epoch); mobile 14411:84859 / 14522:104111
const Release = ({ type, onTypeChange }: { type: ReleaseType; onTypeChange: (t: ReleaseType) => void }) => {
  const duration = useInput("");
  const epochs = useInput("");
  const perEpoch = useInput("");
  const durationField = (
    <DropDownInput state={duration} options={EPOCH_DURATIONS} label="Epoch duration" placeholder="Select an option" />
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <SectionLabel>Distribution start</SectionLabel>
        <div className="flex w-full gap-4">
          <PickerField label="Start date" type="date" icon={<IconCalendarEvent size={16} />} />
          <PickerField label="Start time (UTC)" type="time" icon={<IconClockEdit size={16} />} />
        </div>
      </div>

      <Rule />

      <div className="flex w-full flex-col gap-4">
        <SectionLabel>Release strategy (Linear and Exponential coming soon)</SectionLabel>
        <div className="flex w-full gap-4 overflow-x-auto">
          <ReleaseCard
            name="Flat curve"
            description="Release equal amount each epoch"
            icon={<IconEqualDouble size={24} />}
            state="selected"
            className="shrink-0"
          />
          <ReleaseCard
            name="Linear curve"
            description="Release decreasing or increasing amount"
            icon={<IconMathXDivideY2 size={24} />}
            state="disabled"
            className="shrink-0"
          />
          <ReleaseCard
            name="Exponential curve"
            description="Release scales sharply with participation."
            icon={<IconMathIntegralX size={24} />}
            state="disabled"
            className="shrink-0"
          />
        </div>
        <div className="flex w-full flex-col items-start gap-4">
          <Segmented
            items={["Time-based", "Epoch-based"]}
            activeIndex={type === "time" ? 0 : 1}
            size="l"
            onChange={(i) => onTypeChange(i === 0 ? "time" : "epoch")}
          />
          <p className={`${bodyM} text-primary`}>
            {type === "time"
              ? "With this choice, the number of epochs is calculated automatically."
              : "With this choice, the distribution duration is calculated automatically."}
          </p>
          {/* Time-based block stays mounted: End date is an uncontrolled native input. */}
          <div className={`w-full items-start gap-4 ${type === "time" ? "flex" : "hidden"}`}>
            <PickerField label="End date" type="date" icon={<IconCalendarEvent size={16} />} />
            <div className="min-w-0 flex-1">{durationField}</div>
          </div>
          {type === "epoch" && (
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full gap-4">
                <div className="min-w-0 flex-1">
                  <Input state={epochs} label="Number of epochs" placeholder="e.g. 54" suffix="Epochs" />
                </div>
                <div className="min-w-0 flex-1">
                  <Input state={perEpoch} label="Release per epoch" placeholder="e.g. 100" suffix="TOKEN" />
                </div>
              </div>
              {durationField}
            </div>
          )}
          {/* TODO: teammate wires derived epoch math; static copy from Figma. */}
          <p className={`flex w-full flex-wrap items-center gap-2 rounded-m border border-subtle bg-surface p-4 ${bodyM} text-secondary`}>
            This creates
            {type === "time" ? (
              <>
                <strong className="font-bold text-primary">27 total epochs</strong> Releasing
                <strong className="font-bold text-primary">100 TOKEN</strong> each.
              </>
            ) : (
              <>
                <strong className="font-bold text-primary">32 total epochs (8 hrs each).</strong> Ends
                <strong className="font-bold text-primary">23:12, June 30, 2026 (23 days later)</strong>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

const SettingCard = ({ title, desc, action }: { title: string; desc: string; action?: React.ReactNode }) => (
  <div className="flex w-full items-center gap-6">
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className={`${bodyM} text-primary`}>{title}</p>
      <p className={`${bodyS} text-secondary`}>{desc}</p>
    </div>
    {action}
  </div>
);

const splitFor = (founderOn: boolean) =>
  founderOn ? { anchor: 80, founder: 15, fee: 5 } : { anchor: 95, founder: 0, fee: 5 };

// Figma 11254:94369 (off) / 11254:94424 (on); mobile 14411:84919 / 14411:84973
const Rules = ({ founderOn, onFounderChange }: { founderOn: boolean; onFounderChange: (on: boolean) => void }) => {
  const minParticipation = useInput("");
  const claimDelay = useInput("");
  const share = useInput("15");
  const receiver = useInput("");
  const split = splitFor(founderOn);

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex w-full flex-col gap-4">
        <SectionLabel>Epoch setup</SectionLabel>
        <div className="flex w-full flex-col gap-4 xl:flex-row">
          <div className="xl:flex-1">
            <Input
              state={minParticipation}
              label="Minimum participation (Optional)"
              placeholder="e.g. 0.5"
              suffix="TOKEN"
            />
          </div>
          <div className="xl:flex-1">
            <Input state={claimDelay} label="Claim delay" placeholder="e.g. 5" suffix="Days" />
          </div>
        </div>
      </div>

      <Rule />

      <div className="flex w-full flex-col gap-4">
        <SectionLabel>After-epoch rules</SectionLabel>
        <p className={`${bodyM} text-primary`}>
          Choose how each epoch&apos;s collected funds are split when it closes. The split applies to every epoch and
          can&apos;t change after launch.
        </p>
        <div className="flex w-full flex-col gap-1">
          <div className="flex w-full gap-1 overflow-hidden rounded-s border border-strong p-1" aria-hidden="true">
            <span className="h-6 flex-1 bg-(--color-support-teal-900)" />
            <span className="h-6 w-2 bg-(--color-alpha-amber-45)" />
            {founderOn && <span className="h-6 w-6.75 bg-(--color-support-violet-700)" />}
          </div>
          <div className={`flex w-full flex-wrap gap-4 ${bodyS}`}>
            <span className="text-(--color-support-teal-300)">{split.anchor}% Price anchor</span>
            <span className="text-(--color-support-violet-300)">{split.founder}% Founder share</span>
            <span className="text-accent">{split.fee}% Protocol fee</span>
          </div>
        </div>
        <div className="flex w-full flex-col gap-3">
          <SettingCard
            title="Price anchor (Buy and burn)"
            desc="The protocol buys your token from the pool and burns it, keeping the clear price aligned with the open market."
          />
          <Rule />
          <div className="flex w-full flex-col gap-2">
            <SettingCard
              title="Founder share"
              desc="Sent to your address when the epoch closes. Capped at 25%."
              action={<Switch on={founderOn} onChange={onFounderChange} className="shrink-0" />}
            />
            {founderOn && (
              <div className="flex w-full flex-col gap-2 xl:flex-row xl:gap-4">
                <div className="xl:w-40">
                  <Input state={share} placeholder="0" suffix="%" />
                </div>
                <div className="xl:flex-1">
                  <Input
                    state={receiver}
                    placeholder="Receiver address"
                    showPaste
                    onPaste={async () => {
                      try {
                        receiver.onChange((await navigator.clipboard.readText()).trim());
                      } catch {
                        // Clipboard permission denied — user can still type.
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className={`flex w-full items-center gap-4 ${bodyM}`}>
    <p className="min-w-0 flex-1 text-secondary">{label}</p>
    <p className="min-w-0 flex-1 text-right text-primary">{value}</p>
  </div>
);

const ReviewSection = ({ title, onChange, rows }: { title: string; onChange?: () => void; rows: [string, string][] }) => (
  <div className="flex w-full flex-col gap-2">
    <div className={`flex w-full items-center justify-between ${onChange ? "" : "py-2"}`}>
      <p className={`${bodyL} text-primary`}>{title}</p>
      {onChange && (
        <Button variant="outline" size="s" onClick={onChange}>
          Change
        </Button>
      )}
    </div>
    {rows.map(([label, value]) => (
      <ReviewRow key={label} label={label} value={value} />
    ))}
  </div>
);

// Figma 11254:94534 (time) / 12046:111715 (epoch); values are mock until wired.
const Review = ({ type, founderOn, goTo }: { type: ReleaseType; founderOn: boolean; goTo: (s: Step) => void }) => {
  const split = splitFor(founderOn);
  return (
    <div className="flex w-full flex-col gap-4">
      <ReviewSection
        title="Supply and backing"
        onChange={() => goTo("supply")}
        rows={[
          ["Supply to distribute:", "10,000,000 TOKEN"],
          ["Initial price:", "1 TOKEN = X USDT"],
        ]}
      />
      <Rule />
      <ReviewSection
        title="Release strategy"
        onChange={() => goTo("release")}
        rows={[
          ["Release starts at:", "23:12, Jun 30, 2026"],
          ["Release ends at:", "23:12, Jul 30, 2026 (23 days later)"],
          ["Release strategy:", "Flat"],
          ["Release type:", type === "time" ? "Time-based" : "Epoch-based"],
          ["Epoch duration:", "20 min"],
          ["Number of epochs:", "12,345 epochs"],
          ["Release per epoch:", "123 TOKEN"],
        ]}
      />
      <Rule />
      <ReviewSection
        title="Rules"
        onChange={() => goTo("rules")}
        rows={[
          ["Minimum participation:", "0.5 TOKEN"],
          ["Claim delay:", "5 DAYS"],
        ]}
      />
      <Rule />
      <ReviewSection
        title="Fund split"
        rows={[
          ["Price anchor:", `${split.anchor}%`],
          ["Founder share:", `${split.founder}%`],
          ["Protocol fee:", `${split.fee}%`],
        ]}
      />
    </div>
  );
};

// Figma 13147:24575 / 13144:24395 / 13154:24666 — squarehead loader (animated SVG) fills Figma's illustration slot.
const Status = ({ step }: { step: "wallet" | "confirming" | "ready" }) => (
  <div className="flex w-full flex-col items-center gap-8 text-center">
    <Image src="/mainnet/squarehead-loader.svg" alt="" width={325} height={325} unoptimized className="size-81.25 shrink-0" />
    <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">
      {step === "ready" ? "Your distribution is ready!" : "Setting up your distribution"}
    </h1>
    {step === "wallet" && (
      <div className="flex flex-col items-center gap-2">
        <p className={`${bodyM} text-tertiary`}>Waiting for you to</p>
        <p className="text-h4 leading-none font-medium text-accent">Confirm in your wallet</p>
      </div>
    )}
    {step === "confirming" && (
      <div className="flex flex-col items-center gap-2">
        <IconRotate2 size={40} className="text-accent" />
        <p className="text-h4 leading-none font-medium text-accent">Confirming on-chain…</p>
        <p className={`${bodyM} text-tertiary`}>This can take a moment. Keep this tab open.</p>
      </div>
    )}
    {step === "ready" && (
      <>
        <p className={`w-full text-left ${bodyM} text-secondary`}>
          Now share it and get back to building. Let people watch you work, and let the market grow with it.
        </p>
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:justify-center">
          <Link href={DISTRIBUTION_LIST} className="sqrt-btn sqrt-btn--outline sqrt-btn--l">
            <span className="sqrt-btn__label">Go to distribution</span>
          </Link>
          <Button
            variant="primary"
            size="l"
            onClick={() => {
              /* TODO: teammate wires onShare */
            }}
          >
            Share distribution
          </Button>
        </div>
      </>
    )}
  </div>
);

// Figma 11254:94191 (desktop) / 14411:84775 (mobile)
const DistributeWizard = () => {
  const [step, setStep] = useState<Step>("welcome");
  const [pairIndex, setPairIndex] = useState(0);
  const [releaseType, setReleaseType] = useState<ReleaseType>("time");
  const [founderOn, setFounderOn] = useState(true);

  const formIndex = FORM_STEPS.indexOf(step);
  const back = () => setStep(formIndex > 0 ? FORM_STEPS[formIndex - 1] : "welcome");
  const next = () => {
    /* TODO: teammate wires per-step onContinue (validation) */
    setStep(FORM_STEPS[formIndex + 1]);
  };
  const confirm = () => {
    /* TODO: teammate wires onConfirm (create distribution) */
    setStep("wallet");
  };

  // ponytail: fake progress so the status screens are reviewable; teammate replaces with tx state.
  useEffect(() => {
    if (step !== "wallet" && step !== "confirming") return;
    const t = setTimeout(() => setStep(step === "wallet" ? "confirming" : "ready"), 2000);
    return () => clearTimeout(t);
  }, [step]);

  if (step === "wallet" || step === "confirming" || step === "ready") {
    return (
      <WizardShell>
        <Status step={step} />
      </WizardShell>
    );
  }

  return (
    <WizardShell closeHref={MAINNET_DISTRIBUTE_HREF}>
      {/* Form steps stay mounted (hidden when inactive) so values survive Back / "Change". */}
      <div className="flex w-full flex-col gap-8">
        {step === "welcome" && <Welcome onStart={() => setStep("supply")} />}
        <div className={step === "supply" ? "contents" : "hidden"}>
            <StepHeader title="Distribution" index={0} description="Set how many of [token name] go out across all epochs." />
            <Supply pairIndex={pairIndex} onPairChange={setPairIndex} />
            <BackContinue onBack={back} onNext={next} />
        </div>
        <div className={step === "release" ? "contents" : "hidden"}>
            <StepHeader
              title="Distribution"
              index={1}
              description="Set the distribution's timing and how supply releases across it."
            />
            <Release type={releaseType} onTypeChange={setReleaseType} />
            <BackContinue onBack={back} onNext={next} />
        </div>
        <div className={step === "rules" ? "contents" : "hidden"}>
            <StepHeader title="Distribution" index={2} description="Optional guardrails on participation." />
            <Rules founderOn={founderOn} onFounderChange={setFounderOn} />
            <BackContinue onBack={back} onNext={next} />
        </div>
        {step === "review" && (
          <>
            <StepHeader title="Distribution review" index={3} />
            <Review type={releaseType} founderOn={founderOn} goTo={setStep} />
            <BackContinue onBack={back} onNext={confirm} nextLabel="Confirm" />
          </>
        )}
      </div>
    </WizardShell>
  );
};

export default DistributeWizard;
