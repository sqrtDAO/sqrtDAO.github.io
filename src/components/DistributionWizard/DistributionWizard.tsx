"use client";

import { useState, useMemo, useRef } from "react";
import {
  IconX,
  IconCalendar,
  IconClock,
  IconSettings,
  IconEqualDouble,
  IconMathFunctionY,
  IconMathIntegralX,
} from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import Stepper from "@/components/Stepper/Stepper";
import Segmented from "@/components/Segmented/Segmented";
import SelectBox from "@/components/SelectBox/SelectBox";
import ReleaseCard from "@/components/ReleaseCard/ReleaseCard";
import DataRow from "@/components/DataRow/DataRow";
import Divider from "@/components/Divider/Divider";
import "./DistributionWizard.css";

// ── Types ──────────────────────────────────────────────────────────────────

type DistStep = "welcome" | "supply" | "release" | "backing" | "rules" | "review";

const STEP_LABELS = ["Supply", "Release schedule", "Backing", "Rules", "Review"];
const STEP_ORDER: DistStep[] = ["supply", "release", "backing", "rules", "review"];

type ReleaseCurve = "fixed" | "linear" | "exponential";
type EpochRule = "price-anchor" | "fund-share";

export interface DistributionWizardProps {
  onClose: () => void;
  onConfirm: () => void;
  tokenSymbol?: string;
  tokenBalance?: number;
}

// ── Helpers ─────────────────────────────────────────────────────────────────

function stepperIndex(step: DistStep): number {
  return STEP_ORDER.indexOf(step); // -1 for "welcome"
}

function formatNumber(n: number): string {
  return n.toLocaleString("en-US");
}

function calcEpochs(start: string, end: string, durationMs: number): number | null {
  if (!start || !end) return null;
  const diff = new Date(end).getTime() - new Date(start).getTime();
  if (diff <= 0) return null;
  return Math.round(diff / durationMs);
}

function formatAmount(n: number): string {
  return n.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function calcEndDateFromEpochs(start: string, epochs: number): Date | null {
  if (!start || isNaN(epochs) || epochs <= 0) return null;
  const d = new Date(start);
  d.setDate(d.getDate() + epochs);
  return d;
}

function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateLong(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const BACKING_ASSETS = ["USDT", "BASE", "USDC", "DAI"];
const BACKING_ASSETS_DISABLED = [1, 2, 3];
const RELEASE_TYPES = ["Time-based", "Epoch-based"];
const EPOCH_DURATION_OPTIONS = ["20 mins", "2 hrs", "8 hrs", "1 day"];
const EPOCH_DURATION_MS: Record<string, number> = {
  "20 mins": 20 * 60 * 1000,
  "2 hrs": 2 * 60 * 60 * 1000,
  "8 hrs": 8 * 60 * 60 * 1000,
  "1 day": 24 * 60 * 60 * 1000,
};

// ── Main component ──────────────────────────────────────────────────────────

export default function DistributionWizard({
  onClose,
  onConfirm,
  tokenSymbol = "TOKEN",
  tokenBalance = 20_000_000,
}: DistributionWizardProps) {
  // Navigation
  const [step, setStep] = useState<DistStep>("welcome");

  // Step 2 — Supply
  const [supply, setSupply] = useState("");

  // Step 3 — Release schedule
  const [releaseCurve, setReleaseCurve] = useState<ReleaseCurve>("fixed");
  const [releaseTypeIdx, setReleaseTypeIdx] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [epochDuration, setEpochDuration] = useState(EPOCH_DURATION_OPTIONS[3]);
  const [epochCountInput, setEpochCountInput] = useState("");
  const [releasePerEpoch, setReleasePerEpoch] = useState("");
  const startRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Step 4 — Backing
  const [backingAssetIdx, setBackingAssetIdx] = useState(0);
  const [backingTypeIdx, setBackingTypeIdx] = useState(0);
  const [selfAmount, setSelfAmount] = useState("");
  const [selfEpochs, setSelfEpochs] = useState("");

  // Step 5 — Rules
  const [minParticipation, setMinParticipation] = useState("");
  const [claimDelay, setClaimDelay] = useState("");
  const [epochRule, setEpochRule] = useState<EpochRule>("price-anchor");
  const [fundShare, setFundShare] = useState("");
  const [receiverAddress, setReceiverAddress] = useState("");

  // Time-based: epoch count from date range ÷ epoch duration
  const epochsFromDates = useMemo(
    () => calcEpochs(startDate, endDate, EPOCH_DURATION_MS[epochDuration]),
    [startDate, endDate, epochDuration]
  );
  // Time-based: release amount per epoch, derived from total supply ÷ epoch count
  const releasePerEpochFromDates = useMemo(() => {
    if (!epochsFromDates) return null;
    const supplyNum = parseFloat(supply.replace(/,/g, ""));
    if (isNaN(supplyNum)) return null;
    return supplyNum / epochsFromDates;
  }, [supply, epochsFromDates]);
  // Epoch-based: computed end date from start + count
  const endDateFromEpochs = useMemo(
    () => calcEndDateFromEpochs(startDate, parseInt(epochCountInput)),
    [startDate, epochCountInput]
  );

  // ── Navigation helpers ───────────────────────────────────────────────────

  function goNext() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx < STEP_ORDER.length - 1) setStep(STEP_ORDER[idx + 1]);
  }

  function goBack() {
    const idx = STEP_ORDER.indexOf(step);
    if (idx > 0) setStep(STEP_ORDER[idx - 1]);
    else setStep("welcome");
  }

  function jumpTo(target: DistStep) {
    setStep(target);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  const showStepper = step !== "welcome";
  const stepIdx = stepperIndex(step);

  return (
    <div className="dw-backdrop">
      <div className="dw-panel">

        {/* Close button */}
        <div>
          <button className="dw-back" onClick={onClose} aria-label="Close">
            <IconX size={24} strokeWidth={2} />
          </button>
        </div>

        {/* Step content — key triggers enter animation on each step change */}
        <div className="dw-content" key={step}>

          {/* ── STEP 1: Welcome ─────────────────────────────────────────── */}
          {step === "welcome" && (
            <>
              <div className="dw-text">
                <h2 className="dw-title">Welcome to Distribution engine</h2>
                <p className="dw-section-label">Read before start</p>
              </div>

              <div className="dw-welcome-body">
                <p>
                  Here you can set up a fair distribution mechanism for your token.
                  While simultaneously you are fundraising, token price discovery and
                  providing liquidity.
                </p>
                <p>
                  It happens through time-based windows we call <strong>epochs</strong>.{" "}
                  Every epoch has a max distribution supply and users will participate in them.
                </p>
                <p>
                  When epoch closes, the available tokens are distributed proportionally
                  based on each participant&apos;s participation, and it will continued
                  until your supply finished.
                </p>
              </div>

              <div className="dw-footer">
                <button
                  className="dw-btn dw-btn--primary-l"
                  onClick={() => setStep("supply")}
                >
                  Start distribution
                </button>
              </div>
            </>
          )}

          {/* ── STEP 2: Supply ──────────────────────────────────────────── */}
          {step === "supply" && (
            <>
              <div className="dw-text">
                <h2 className="dw-title">Distribution</h2>
                {showStepper && (
                  <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
                )}
                <p className="dw-step-desc">
                  Set how many of your Tokens go out across all epochs.
                </p>
              </div>

              <div className="dw-form">
                {/* Supply input with TOKEN suffix */}
                <div className="dw-supply-group">
                  <label className="dw-supply-label">Supply to distribute</label>
                  <div className="dw-supply-field">
                    <input
                      className="dw-supply-el"
                      type="text"
                      inputMode="numeric"
                      placeholder="e.g. 10,000,000"
                      value={supply}
                      onChange={(e) =>
                        setSupply(e.target.value.replace(/[^0-9,]/g, ""))
                      }
                      spellCheck={false}
                      autoComplete="off"
                    />
                    <span className="dw-supply-suffix">{tokenSymbol}</span>
                  </div>
                </div>

                {/* Wallet balance + HALF / MAX */}
                <div className="dw-wallet-row">
                  <div className="dw-balance">
                    <span className="dw-balance-label">Wallet balance of the token</span>
                    <div className="dw-balance-line">
                      <span className="dw-balance-amount">
                        {formatNumber(tokenBalance)}
                      </span>
                      <span className="dw-balance-unit">{tokenSymbol}</span>
                    </div>
                  </div>
                  <div className="dw-halfmax">
                    <button
                      type="button"
                      className="dw-btn dw-btn--secondary"
                      onClick={() =>
                        setSupply(formatNumber(Math.floor(tokenBalance / 2)))
                      }
                    >
                      HALF
                    </button>
                    <button
                      type="button"
                      className="dw-btn dw-btn--secondary"
                      onClick={() => setSupply(formatNumber(tokenBalance))}
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>

              <div className="dw-footer">
                <button className="dw-btn dw-btn--ghost" onClick={goBack}>
                  Back
                </button>
                <button className="dw-btn dw-btn--primary" onClick={goNext}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── STEP 3: Release schedule ─────────────────────────────────── */}
          {step === "release" && (
            <>
              <div className="dw-text">
                <h2 className="dw-title">Distribution</h2>
                <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
                <p className="dw-step-desc">
                  Define the epoch structure and how supply releases across it.
                </p>
              </div>

              <div className="dw-form">
                {/* Distribution start */}
                <div className="dw-release-type-section">
                  <p className="dw-section-label">Distribution start</p>
                  <div className="dw-date-row">
                    <div className="dw-date-wrap">
                      <label className="dw-date-label">Start date</label>
                      <div className="dw-date-field">
                        <input
                          ref={startRef}
                          type="date"
                          className="dw-date-el"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                        />
                        <button
                          type="button"
                          className="dw-cal-btn"
                          aria-label="Pick start date"
                          onClick={() => startRef.current?.showPicker?.()}
                        >
                          <IconCalendar size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                    <div className="dw-date-wrap">
                      <label className="dw-date-label">Start time (UTC)</label>
                      <div className="dw-date-field">
                        <input
                          ref={startTimeRef}
                          type="time"
                          className="dw-date-el"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                        />
                        <button
                          type="button"
                          className="dw-cal-btn"
                          aria-label="Pick start time"
                          onClick={() => startTimeRef.current?.showPicker?.()}
                        >
                          <IconClock size={16} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Divider />

                {/* Release curve cards */}
                <div className="dw-curve-section">
                  <p className="dw-section-label">
                    Release curve (Linear and Exponential option will coming soon)
                  </p>
                  <div className="dw-curve-cards">
                    <ReleaseCard
                      name="Fixed curve"
                      description="Release equal amount each epoch"
                      icon={<IconEqualDouble size={24} strokeWidth={1.5} />}
                      state={releaseCurve === "fixed" ? "selected" : "rest"}
                      onClick={() => setReleaseCurve("fixed")}
                    />
                    <ReleaseCard
                      name="Linear curve"
                      description="Release decreasing or increasing amount"
                      icon={<IconMathFunctionY size={24} strokeWidth={1.5} />}
                      state="disabled"
                    />
                    <ReleaseCard
                      name="Exponential curve"
                      description="Sharply participation-dependent"
                      icon={<IconMathIntegralX size={24} strokeWidth={1.5} />}
                      state="disabled"
                    />
                  </div>
                </div>

                <Divider />

                {/* Release type + dates */}
                <div className="dw-release-type-section">
                  <p className="dw-section-label">Release type</p>

                  <Segmented
                    items={RELEASE_TYPES}
                    activeIndex={releaseTypeIdx}
                    size="m"
                    onChange={setReleaseTypeIdx}
                  />

                  <p className="dw-release-desc">
                    {releaseTypeIdx === 0
                      ? "With this choice, the number of epochs is calculated automatically."
                      : "With this choice, the distribution duration is calculated automatically."}
                  </p>

                  {/* Input row — changes based on release type */}
                  {releaseTypeIdx === 0 ? (
                    <div className="dw-date-row">
                      <div className="dw-date-wrap">
                        <label className="dw-date-label">End date</label>
                        <div className="dw-date-field">
                          <input
                            ref={endRef}
                            type="date"
                            className="dw-date-el"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                          <button
                            type="button"
                            className="dw-cal-btn"
                            aria-label="Pick end date"
                            onClick={() => endRef.current?.showPicker?.()}
                          >
                            <IconCalendar size={16} strokeWidth={1.5} />
                          </button>
                        </div>
                      </div>
                      <div className="dw-input-flex">
                        <Input
                          label="Epoch duration"
                          placeholder="Select an option"
                          value={epochDuration}
                          onChange={setEpochDuration}
                          dropdown
                          options={EPOCH_DURATION_OPTIONS}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="dw-date-row">
                      <div className="dw-date-wrap">
                        <label className="dw-date-label">Number of epochs</label>
                        <div className="dw-supply-field">
                          <input
                            className="dw-supply-el"
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 54"
                            value={epochCountInput}
                            onChange={(e) =>
                              setEpochCountInput(e.target.value.replace(/[^0-9]/g, ""))
                            }
                            spellCheck={false}
                            autoComplete="off"
                          />
                          <span className="dw-supply-suffix">Epochs</span>
                        </div>
                      </div>
                      <div className="dw-date-wrap">
                        <label className="dw-date-label">Release per epoch</label>
                        <div className="dw-supply-field">
                          <input
                            className="dw-supply-el"
                            type="text"
                            inputMode="numeric"
                            placeholder="e.g. 100"
                            value={releasePerEpoch}
                            onChange={(e) =>
                              setReleasePerEpoch(e.target.value.replace(/[^0-9.,]/g, ""))
                            }
                            spellCheck={false}
                            autoComplete="off"
                          />
                          <span className="dw-supply-suffix">{tokenSymbol}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Release schedule summary */}
                  {releaseTypeIdx === 0 && epochsFromDates !== null && (
                    <p className="dw-release-summary">
                      This creates <strong>{epochsFromDates} epochs.</strong> Releasing{" "}
                      <strong>
                        {releasePerEpochFromDates !== null
                          ? `${formatAmount(releasePerEpochFromDates)} ${tokenSymbol}`
                          : `— ${tokenSymbol}`}
                      </strong>{" "}
                      each.
                    </p>
                  )}
                  {releaseTypeIdx === 1 && endDateFromEpochs !== null && (
                    <p className="dw-release-summary">
                      This creates{" "}
                      <strong>{parseInt(epochCountInput)} epochs.</strong> Ends{" "}
                      <strong>
                        {formatDateLong(endDateFromEpochs)}{" "}
                        ({parseInt(epochCountInput)} days later)
                      </strong>
                    </p>
                  )}
                </div>
              </div>

              <div className="dw-footer">
                <button className="dw-btn dw-btn--ghost" onClick={goBack}>
                  Back
                </button>
                <button className="dw-btn dw-btn--primary" onClick={goNext}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── STEP 4: Backing ──────────────────────────────────────────── */}
          {step === "backing" && (
            <>
              <div className="dw-text">
                <h2 className="dw-title">Distribution</h2>
                <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
                <p className="dw-step-desc">
                  Set the backing that gives the Distribution Token a market and runs price
                  discovery.{" "}
                  <br />
                  More backing = Higher initial price
                </p>
              </div>

              <div className="dw-form">
                {/* Backing asset */}
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                    <p className="dw-section-label" style={{ margin: 0 }}>Backing asset</p>
                    <Segmented
                      items={BACKING_ASSETS}
                      activeIndex={backingAssetIdx}
                      size="m"
                      onChange={setBackingAssetIdx}
                      disabledIndices={BACKING_ASSETS_DISABLED}
                    />
                  </div>
                  <p className="dw-section-label" style={{ fontSize: 16, lineHeight: "22px", letterSpacing: "0.01em" }}>
                    The asset that backs your token&apos;s market. Participants take part in
                    epochs with this asset. It pairs with your token in a Uniswap pool.
                  </p>
                </div>

                <Divider />

                {/* Backing type */}
                <div className="dw-rules-section">
                  <p className="dw-section-label">Backing type</p>
                  <div className="dw-selectbox-group">
                    <SelectBox
                      label="As backing, I'll take part in epochs myself from day one (Recommended)"
                      description="Just set the participation amount and epoch count."
                      selected={backingTypeIdx === 0}
                      onChange={() => setBackingTypeIdx(0)}
                      showSlot={backingTypeIdx === 0}
                    >
                      <div className="dw-backing-inputs">
                        <div className="dw-supply-group">
                          <label className="dw-supply-label">Self participation amount</label>
                          <div className="dw-supply-field">
                            <input
                              className="dw-supply-el"
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. 50"
                              value={selfAmount}
                              onChange={(e) =>
                                setSelfAmount(e.target.value.replace(/[^0-9,]/g, ""))
                              }
                              spellCheck={false}
                              autoComplete="off"
                            />
                            <span className="dw-supply-suffix">
                              {BACKING_ASSETS[backingAssetIdx].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="dw-supply-group">
                          <label className="dw-supply-label">Self participation epochs count</label>
                          <div className="dw-supply-field">
                            <input
                              className="dw-supply-el"
                              type="text"
                              inputMode="numeric"
                              placeholder="e.g. 50"
                              value={selfEpochs}
                              onChange={(e) =>
                                setSelfEpochs(e.target.value.replace(/[^0-9]/g, ""))
                              }
                              spellCheck={false}
                              autoComplete="off"
                            />
                            <span className="dw-supply-suffix">Epochs</span>
                          </div>
                        </div>
                      </div>
                    </SelectBox>
                    <SelectBox
                      label="As backing, I'll provide the initial liquidity myself."
                      description="Your Initial Backing is permanent. At launch it enters a Uniswap pool and cannot be withdrawn, not by you, not by anyone."
                      selected={false}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="dw-footer">
                <button className="dw-btn dw-btn--ghost" onClick={goBack}>
                  Back
                </button>
                <button className="dw-btn dw-btn--primary" onClick={goNext}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── STEP 5: Rules ────────────────────────────────────────────── */}
          {step === "rules" && (
            <>
              <div className="dw-text">
                <h2 className="dw-title">Distribution</h2>
                <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
                <p className="dw-step-desc">Optional guardrails on participation.</p>
              </div>

              <div className="dw-form">
                {/* Epoch setup */}
                <div className="dw-rules-section">
                  <p className="dw-section-label">Epoch setup</p>
                  <Input
                    label="Minimum participation (Optional)"
                    placeholder="e.g. 0.5"
                    value={minParticipation}
                    onChange={setMinParticipation}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <Input
                    label="Claim delay"
                    placeholder="e.g. 5"
                    value={claimDelay}
                    onChange={(v) => setClaimDelay(v.replace(/[^0-9]/g, ""))}
                    spellCheck={false}
                    autoComplete="off"
                  />
                </div>

                <Divider />

                {/* After-epoch rules */}
                <div className="dw-rules-section">
                  <p className="dw-section-label">After-epoch rules</p>
                  <div className="dw-selectbox-group">
                    <SelectBox
                      label={<><strong>Price Anchor</strong>; Buy and burn the token from Uniswap pool.</>}
                      description="After each epoch ends, the protocol buys the token and burns it to sync the price with Uniswap."
                      selected={epochRule === "price-anchor"}
                      onChange={() => setEpochRule("price-anchor")}
                    />
                    <SelectBox
                      label={<>Send <strong>funds to an address</strong> after each epoch.</>}
                      description="After each epoch ends, a portion is sent to the address you set. (20% Max)"
                      selected={epochRule === "fund-share"}
                      onChange={() => setEpochRule("fund-share")}
                      showSlot={epochRule === "fund-share"}
                    >
                      <div className="dw-backing-inputs">
                        <div className="dw-supply-group">
                          <label className="dw-supply-label">Fund share</label>
                          <div className="dw-supply-field">
                            <input
                              className="dw-supply-el"
                              type="text"
                              inputMode="numeric"
                              placeholder="Maximum 20%"
                              value={fundShare}
                              onChange={(e) => {
                                const raw = e.target.value.replace(/[^0-9.]/g, "");
                                const num = parseFloat(raw);
                                setFundShare(!isNaN(num) && num > 20 ? "20" : raw);
                              }}
                              spellCheck={false}
                              autoComplete="off"
                            />
                            <span className="dw-supply-suffix">%</span>
                          </div>
                        </div>
                        <div className="dw-supply-group">
                          <label className="dw-supply-label">Receiver address</label>
                          <div className="dw-supply-field">
                            <input
                              className="dw-supply-el"
                              type="text"
                              placeholder="e.g. 0xfe3...34kj4"
                              value={receiverAddress}
                              onChange={(e) => setReceiverAddress(e.target.value)}
                              spellCheck={false}
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      </div>
                    </SelectBox>
                    <SelectBox
                      label={<><strong>Buy Back & Redistribute</strong> the token.</>}
                      description="After each epoch ends, the protocol buys the token back and redistributes it."
                      selected={false}
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="dw-footer">
                <button className="dw-btn dw-btn--ghost" onClick={goBack}>
                  Back
                </button>
                <button className="dw-btn dw-btn--primary" onClick={goNext}>
                  Continue
                </button>
              </div>
            </>
          )}

          {/* ── STEP 6: Review ───────────────────────────────────────────── */}
          {step === "review" && (
            <>
              <div className="dw-text">
                <h2 className="dw-title">Distribution review</h2>
                <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
              </div>

              <div className="dw-form">

                {/* Supply */}
                <div className="dw-review-section">
                  <div className="dw-review-header">
                    <span className="dw-review-title">Supply</span>
                    <button
                      className="dw-edit-btn"
                      aria-label="Edit supply"
                      onClick={() => jumpTo("supply")}
                    >
                      <IconSettings size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <DataRow
                    label="Total supply:"
                    value={supply ? `${supply} ${tokenSymbol}` : `— ${tokenSymbol}`}
                  />
                </div>

                <Divider />

                {/* Release schedule */}
                <div className="dw-review-section">
                  <div className="dw-review-header">
                    <span className="dw-review-title">Release schedule</span>
                    <button
                      className="dw-edit-btn"
                      aria-label="Edit release schedule"
                      onClick={() => jumpTo("release")}
                    >
                      <IconSettings size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <DataRow
                    label="Release curve:"
                    value={releaseCurve.charAt(0).toUpperCase() + releaseCurve.slice(1)}
                  />
                  <DataRow
                    label="Release type:"
                    value={RELEASE_TYPES[releaseTypeIdx]}
                  />
                  <DataRow label="Start date:" value={formatDate(startDate)} />
                  <DataRow label="Start time (UTC):" value={startTime || "—"} />
                  {releaseTypeIdx === 0 ? (
                    <>
                      <DataRow label="End date:" value={formatDate(endDate)} />
                      <DataRow label="Epoch duration:" value={epochDuration} />
                      <DataRow
                        label="Total epochs:"
                        value={epochsFromDates !== null ? String(epochsFromDates) : "—"}
                      />
                    </>
                  ) : (
                    <>
                      <DataRow
                        label="Number of epochs:"
                        value={epochCountInput ? `${epochCountInput} Epochs` : "—"}
                      />
                      <DataRow
                        label="Release per epoch:"
                        value={releasePerEpoch ? `${releasePerEpoch} ${tokenSymbol}` : "—"}
                      />
                      <DataRow
                        label="Distribution ends on:"
                        value={endDateFromEpochs ? formatDateLong(endDateFromEpochs) : "—"}
                      />
                    </>
                  )}
                </div>

                <Divider />

                {/* Backing */}
                <div className="dw-review-section">
                  <div className="dw-review-header">
                    <span className="dw-review-title">Backing</span>
                    <button
                      className="dw-edit-btn"
                      aria-label="Edit backing"
                      onClick={() => jumpTo("backing")}
                    >
                      <IconSettings size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <DataRow
                    label="Backing asset:"
                    value={BACKING_ASSETS[backingAssetIdx].toUpperCase()}
                  />
                  <DataRow
                    label="Backing type:"
                    value={backingTypeIdx === 0 ? "Self participation" : "Initial liquidity"}
                  />
                  {backingTypeIdx === 0 && (
                    <>
                      <DataRow
                        label="Self participation amount:"
                        value={
                          selfAmount
                            ? `${selfAmount} ${BACKING_ASSETS[backingAssetIdx].toUpperCase()}`
                            : "—"
                        }
                      />
                      <DataRow
                        label="Self participation epochs count:"
                        value={selfEpochs ? `${selfEpochs} Epochs` : "—"}
                      />
                    </>
                  )}
                </div>

                <Divider />

                {/* Rules */}
                <div className="dw-review-section">
                  <div className="dw-review-header">
                    <span className="dw-review-title">Rules</span>
                    <button
                      className="dw-edit-btn"
                      aria-label="Edit rules"
                      onClick={() => jumpTo("rules")}
                    >
                      <IconSettings size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <DataRow
                    label="Minimum participation:"
                    value={
                      minParticipation ? `${minParticipation} ${tokenSymbol}` : "None"
                    }
                  />
                  <DataRow
                    label="Claim delay:"
                    value={claimDelay ? `${claimDelay} DAYS` : "None"}
                  />
                  <DataRow
                    label="After epoch rule:"
                    value={
                      epochRule === "price-anchor"
                        ? "Price anchor (buy & burn)"
                        : "Fund share to address"
                    }
                  />
                  {epochRule === "fund-share" && (
                    <>
                      <DataRow
                        label="Fund share:"
                        value={fundShare ? `${fundShare}%` : "—"}
                      />
                      <DataRow
                        label="Receiver address:"
                        value={receiverAddress || "—"}
                      />
                    </>
                  )}
                </div>

                <Divider />

                {/* Allocation */}
                <div className="dw-review-section">
                  <div className="dw-review-header">
                    <span className="dw-review-title">Allocation</span>
                    <button
                      className="dw-edit-btn"
                      aria-label="Edit allocation"
                      onClick={() => jumpTo("supply")}
                    >
                      <IconSettings size={24} strokeWidth={1.5} />
                    </button>
                  </div>
                  <DataRow label="Tokenomics:" value="100% public distribution" />
                  <DataRow label="Allowlist:" value="No one" />
                </div>

                <Divider />

                {/* Cost details */}
                <div className="dw-review-section">
                  <div className="dw-review-header">
                    <span className="dw-review-title">Cost details</span>
                  </div>
                  <DataRow label="Protocol fee:" value="5%" />
                </div>

              </div>

              <div className="dw-footer">
                <button className="dw-btn dw-btn--ghost" onClick={goBack}>
                  Back
                </button>
                <button className="dw-btn dw-btn--primary" onClick={onConfirm}>
                  Confirm
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
