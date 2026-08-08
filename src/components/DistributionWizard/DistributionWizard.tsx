"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  IconX,
  IconCalendar,
  IconClock,
  IconSettings,
  IconEqualDouble,
  IconMathFunctionY,
  IconMathIntegralX,
  IconAlertSquare,
} from "@tabler/icons-react";
import Input from "@/components/Input/Input";
import DropDownInput from "@/components/DropDownInput/DropDownInput";
import { useInput } from "@/hooks/useInput";
import {
  allowCharsModifier,
  commaModifier,
  composeModifiers,
  decimalOnlyModifier,
  noModifier,
  numberOnlyModifier,
} from "@/utils/modifier";
import {
  addressValidator,
  positiveNumberValidator,
  validateAll,
} from "@/utils/validator";
import type { InputValidator } from "@/utils/validator";
import Stepper from "@/components/Stepper/Stepper";
import Segmented from "@/components/Segmented/Segmented";
import ReleaseCard from "@/components/ReleaseCard/ReleaseCard";
import DataRow from "@/components/DataRow/DataRow";
import Divider from "@/components/Divider/Divider";
import Switch from "@/components/Switch/Switch";
import { IconButton } from "@/components/IconButton/IconButton";
import { Button } from "@/components/Button/Button";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import "./DistributionWizard.css";
import { TokenDetails } from "../TokenLaunch/TokenLaunch";
import { Address, formatEther, parseUnits } from "viem";
import {
  getFactoryV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { useAccount, usePublicClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { getAddresses } from "@/contracts/contract-addresses";

export type DistributionDetails = {
  totalDistributionAmount: bigint;
  participationToken: Address;
  initialParticipationLiquidity: bigint;
  initialDistributionLiquidity: bigint;
  startTime: bigint; // in seconds
  epochDuration: bigint; // in seconds
  numberOfEpochs: bigint;
  releasePerEpoch: bigint;
  minimumParticipation: bigint;
  claimDelay: bigint; // in seconds
  founderShareBps: bigint; // can be 0%
  founderShareReceiver: Address;
  protocolFeeBps: bigint;
};

export default function DistributionWizard(props: {
  token: TokenDetails;
  onCancel: () => void;
  onFinish: (distributionDetails: DistributionDetails) => void;
}) {
  // Navigation
  const [step, setStep] = useState<DistStep>("welcome");

  const publicClient = usePublicClient();
  const [protocolFeePercent, setProtocolFeePercent] = useState<number>(0); // not bps

  // ── Validators ────────────────────────────────────────────────────────────

  const totalSupplyF = parseFloat(formatEther(props.token.totalSupply));

  const startTimeValidator: InputValidator = (v) =>
    v === "" ? "Start time is required" : null;
  const founderShareValidator: InputValidator = (v) => {
    if (v === "") return "Share percentage is required";
    if (parseFloat(v) > FOUNDER_SHARE_CAP)
      return `Capped at ${FOUNDER_SHARE_CAP}%`;
    return null;
  };

  // Step 2 — Supply and backing
  const initialParticipationLiquidity = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
    positiveNumberValidator("Initial liquidity"),
  );
  const initialDistributionLiquidity = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
    positiveNumberValidator("Initial token supply"),
  );
  const supplyValidator: InputValidator = (v) => {
    if (v === "") return "Supply amount is required";
    if (parseFloat(v.replace(/,/g, "")) > totalSupplyF)
      return "Insufficient balance";
    return null;
  };
  const supply = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
    supplyValidator,
  );
  const [backingAssetIdx, setBackingAssetIdx] = useState(0);

  // Step 3 — Release strategy
  const [releaseCurve, setReleaseCurve] = useState<ReleaseCurve>("flat");
  const [releaseTypeIdx, setReleaseTypeIdx] = useState(0);
  const startTime = useInput("", noModifier, startTimeValidator);
  const startDateValidator: InputValidator = (v) => {
    if (v === "") return "Start date is required";
    if (
      startTime.value !== "" &&
      nowSec() > parseUTCToTimestampSec(v, startTime.value)
    )
      return "Start must be in the future";
    return null;
  };
  const startDate = useInput("", noModifier, startDateValidator);
  const endDateValidator: InputValidator = (v) => {
    if (v === "") return "End date is required";
    if (
      startDate.value !== "" &&
      startTime.value !== "" &&
      parseUTCToTimestampSec(v) <=
        parseUTCToTimestampSec(startDate.value, startTime.value)
    )
      return "End must be after start";
    return null;
  };
  const endDate = useInput("", noModifier, endDateValidator);
  const epochDurationInput = useInput(EPOCH_DURATION_OPTIONS[3]);
  const numberOfEpochs = useInput(
    "",
    numberOnlyModifier,
    positiveNumberValidator("Number of epochs"),
  );
  const releasePerEpoch = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
    positiveNumberValidator("Release per epoch"),
  );
  const startRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLInputElement>(null);

  // Step 4 — Rules
  const minParticipation = useInput(
    "",
    composeModifiers(decimalOnlyModifier, commaModifier),
  );
  const claimDelay = useInput("0", numberOnlyModifier, (v) =>
    v === "" ? "Claim delay is required" : null,
  );
  const [founderShareOn, setFounderShareOn] = useState(false);
  const founderSharePercent = useInput(
    "",
    allowCharsModifier(/[^0-9.]/g),
    founderShareValidator,
  );
  const founderReceiverInput = useInput("", noModifier, addressValidator);

  const { isConnected: isWalletConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const [confirming, setConfirming] = useState(false);

  // Initial price preview (Initial liquidity ÷ Supply)
  const backingLiquidity = parseFloat(
    initialParticipationLiquidity.value.replace(/,/g, ""),
  );
  const tokenLiquidity = parseFloat(
    initialDistributionLiquidity.value.replace(/,/g, ""),
  );
  const initialPrice =
    tokenLiquidity > 0 && backingLiquidity > 0
      ? backingLiquidity / tokenLiquidity
      : null;

  // Supply validation
  const supplyNum = parseFloat(supply.value.replace(/,/g, ""));

  // Epoch-based: typing one field recomputes the other
  const epochsOnChange = (v: string) => {
    const clean = v.replace(/[^0-9]/g, "");
    numberOfEpochs.onChange(clean);
    if (!clean) {
      releasePerEpoch.onChange("");
    } else {
      const epochsNum = parseInt(clean);
      releasePerEpoch.onChange(
        supplyNum && epochsNum ? (supplyNum / epochsNum).toString() : "",
      );
    }
  };

  const releaseOnChange = (v: string) => {
    const clean = decimalOnlyModifier(v);
    releasePerEpoch.onChange(clean);
    if (!clean) {
      numberOfEpochs.onChange("");
    } else {
      const perEpochNum = parseFloat(clean);
      numberOfEpochs.onChange(
        supplyNum && perEpochNum ? (supplyNum / perEpochNum).toString() : "",
      );
    }
  };

  // Time-based: epoch count from date range ÷ epoch duration
  const epochsFromDates = useMemo(
    () =>
      calcEpochs(
        startDate.value,
        startTime.value,
        endDate.value,
        EPOCH_DURATION_MS[epochDurationInput.value],
      ),
    [startDate.value, startTime.value, endDate.value, epochDurationInput.value],
  );
  // Time-based: release amount per epoch, derived from total supply ÷ epoch count
  const releasePerEpochFromDates = useMemo(() => {
    if (!epochsFromDates) return null;
    if (!supplyNum) return null;
    return supplyNum / epochsFromDates;
  }, [supplyNum, epochsFromDates]);

  // Epoch-based: computed end date from start + count
  const endDateFromEpochs = useMemo(
    () =>
      calcEndDateFromEpochs(
        startDate.value,
        startTime.value,
        parseInt(numberOfEpochs.value),
        EPOCH_DURATION_MS[epochDurationInput.value] / 1000,
      ),
    [
      startDate.value,
      startTime.value,
      numberOfEpochs.value,
      epochDurationInput.value,
    ],
  );

  // Rules: founder share % + resulting split
  const founderPercentNum = parseFloat(founderSharePercent.value) || 0;
  const founderSharePctClamped = founderShareOn
    ? Math.min(founderPercentNum, FOUNDER_SHARE_CAP)
    : 0;
  const priceAnchorPct = 100 - protocolFeePercent - founderSharePctClamped;

  useEffect(() => {
    if (!publicClient) return;
    getFactoryV1Contract(publicClient)
      .read.protocolFeeBps()
      .then((feeBps) => {
        setProtocolFeePercent(Number(feeBps) / 100);
      });
  }, [publicClient]);

  // ── Navigation helpers ───────────────────────────────────────────────────

  const stepValidation = () => {
    switch (step) {
      case "supply":
        return validateAll(
          supply,
          initialParticipationLiquidity,
          initialDistributionLiquidity,
        );
      case "release":
        return releaseTypeIdx === 0
          ? validateAll(startDate, startTime, endDate)
          : validateAll(startDate, startTime, numberOfEpochs, releasePerEpoch);
      case "rules":
        return founderShareOn
          ? validateAll(
              minParticipation,
              claimDelay,
              founderSharePercent,
              founderReceiverInput,
            )
          : validateAll(minParticipation, claimDelay);
      default:
        return true;
    }
  };

  function goNext() {
    if (!stepValidation()) return;
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

  function handlePasteFounderAddress() {
    navigator.clipboard
      .readText()
      .then((t) => founderReceiverInput.onChange(t))
      .catch(() => {});
  }

  const onConfirm = async () => {
    if (confirming) return;
    setConfirming(true);
    try {
      const addresses = getAddresses(publicClient!.chain.id);
      const participationToken = getTokenV1Contract(
        publicClient!,
        addresses.rootToken,
      );

      const startTimeN = parseUTCToTimestampSec(
        startDate.value,
        startTime.value,
      );
      const epochDurationN = BigInt(
        EPOCH_DURATION_MS[epochDurationInput.value] / 1000,
      );
      const totalDistributionAmountN = parseUnits(
        supply.value.replace(/,/g, ""),
        props.token.decimals,
      );

      let numberOfEpochsN: bigint;
      let releasePerEpochN: bigint;
      if (releaseTypeIdx === 0) {
        // Time base
        const endTimeN = parseUTCToTimestampSec(endDate.value);
        numberOfEpochsN = BigInt((endTimeN - startTimeN) / epochDurationN);
        releasePerEpochN = totalDistributionAmountN / numberOfEpochsN;
      } else {
        // Epoch base
        numberOfEpochsN = BigInt(parseInt(numberOfEpochs.value));
        releasePerEpochN = BigInt(
          parseUnits(
            releasePerEpoch.value.replace(/,/g, ""),
            props.token.decimals,
          ),
        );
      }
      const pTokenDecimals = await participationToken.read.decimals();
      const initialParticipationLiquidityN = parseUnits(
        initialParticipationLiquidity.value.replace(/,/g, ""),
        pTokenDecimals,
      );
      const minParS = minParticipation.value.replace(/,/g, "").trim();
      const minimumParticipationN = parseUnits(
        minParS !== "" ? minParS : "0",
        pTokenDecimals,
      );
      props.onFinish({
        totalDistributionAmount:
          totalDistributionAmountN - initialParticipationLiquidityN,
        participationToken: participationToken.address,
        initialParticipationLiquidity: initialParticipationLiquidityN,
        initialDistributionLiquidity: parseUnits(
          initialDistributionLiquidity.value.replace(/,/g, ""),
          props.token.decimals,
        ),
        startTime: startTimeN,
        epochDuration: epochDurationN, // BigInt(60) | epochDurationN
        numberOfEpochs: numberOfEpochsN,
        releasePerEpoch: releasePerEpochN,
        minimumParticipation: minimumParticipationN,
        claimDelay: BigInt(parseInt(claimDelay.value) * 86400), // convert days to seconds
        founderShareBps: founderShareOn
          ? BigInt(founderPercentNum * 100) // *100 percent to bps
          : BigInt(0),
        founderShareReceiver: founderReceiverInput.value as Address,
        protocolFeeBps: BigInt(protocolFeePercent * 100),
      });
    } catch (e) {
      console.error(e);
      setConfirming(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  const showStepper = step !== "welcome";
  const stepIdx = stepperIndex(step);

  return (
    <div className="dw-backdrop">
      <div className="dw-chrome">
        <Header />
        <TestnetRibbon />
      </div>
      <div className="dw-scroll">
        <div className="dw-panel">
          {/* Close button */}
          <div>
            <IconButton
              variant="outline"
              size="m"
              icon={<IconX size={24} strokeWidth={2} />}
              onClick={props.onCancel}
              aria-label="Close"
            />
          </div>

          {/* Step content — key triggers enter animation on each step change */}
          <div
            className={`dw-content${showStepper ? " dw-content--stepped" : ""}`}
            key={step}
          >
            {/* ── STEP 1: Welcome ───────────────────────────────────────── */}
            {step === "welcome" && (
              <>
                <div className="dw-text">
                  <h2 className="dw-title">Welcome to Distribution</h2>
                  <p className="dw-section-label">Here&apos;s how it works</p>
                </div>

                <div className="dw-welcome-body">
                  <p>
                    Your token is released gradually, over timed windows called{" "}
                    <strong>epochs</strong>, not all at once.
                  </p>
                  <p>
                    In each <strong>epoch</strong>, people take part with funds.
                    When it closes, that epoch&apos;s tokens are shared out
                    proportionally, at one price for everyone.
                  </p>
                  <p>
                    As it runs, your token{" "}
                    <span className="dw-accent">raises funds</span>, finds a{" "}
                    <span className="dw-accent">fair price</span>, and builds{" "}
                    <span className="dw-accent">locked liquidity</span>, all at
                    once.
                  </p>
                </div>

                <div className="dw-footer">
                  <Button
                    variant="primary"
                    size="l"
                    onClick={() => setStep("supply")}
                  >
                    Start distribution
                  </Button>
                </div>
              </>
            )}

            {/* ── STEP 2: Supply and backing ───────────────────────────── */}
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
                  {/* Supply set up */}
                  <div className="dw-rules-section">
                    <p className="dw-section-label">Supply set up</p>
                    <Input
                      state={supply}
                      label="Supply to distribute"
                      placeholder="e.g. 10,000,000"
                      suffix={props.token.symbol}
                    />

                    <div className="dw-wallet-row">
                      <div className="dw-balance">
                        <span className="dw-balance-label">
                          Wallet balance of the token
                        </span>
                        <div className="dw-balance-line">
                          <span className="dw-balance-amount">
                            {formatEther(props.token.totalSupply)}
                          </span>
                          <span className="dw-balance-unit">
                            {props.token.symbol}
                          </span>
                        </div>
                      </div>
                      <div className="dw-halfmax">
                        <Button
                          variant="outline"
                          size="m"
                          onClick={() =>
                            supply.onChange(
                              formatEther(props.token.totalSupply / BigInt(2)),
                            )
                          }
                        >
                          HALF
                        </Button>
                        <Button
                          variant="outline"
                          size="m"
                          onClick={() =>
                            supply.onChange(
                              formatEther(props.token.totalSupply),
                            )
                          }
                        >
                          MAX
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Initial backing and liquidity */}
                  <div className="dw-rules-section">
                    <p className="dw-section-label">
                      Initial backing and liquidity
                    </p>
                    <p
                      className="dw-step-desc"
                      style={{
                        fontSize: 16,
                        lineHeight: "22px",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Participants take part in epochs with this asset. It pairs
                      with your token in a Uniswap pool.
                    </p>

                    <div className="dw-pairing-row">
                      <p className="dw-section-label">Paired your token with</p>
                      <Segmented
                        items={BACKING_ASSETS}
                        activeIndex={backingAssetIdx}
                        size="m"
                        onChange={setBackingAssetIdx}
                        disabledIndices={BACKING_ASSETS_DISABLED}
                      />
                    </div>

                    <div className="dw-backing-inputs">
                      <div className="dw-input-flex">
                        <Input
                          state={initialDistributionLiquidity}
                          label="Initial token supply"
                          placeholder="first epoch release amount"
                          suffix={props.token.symbol}
                        />
                      </div>
                      <div className="dw-input-flex">
                        <Input
                          state={initialParticipationLiquidity}
                          label="Initial liquidity"
                          placeholder="e.g. 10,000,000"
                          suffix={BACKING_ASSETS[backingAssetIdx]}
                        />
                      </div>
                    </div>

                    <div className="dw-price-row">
                      <span className="dw-price-label">
                        Your token initial price will be:
                      </span>
                      <span className="dw-price-value">
                        1{" "}
                        <span className="dw-price-unit">
                          {props.token.symbol}
                        </span>{" "}
                        ={" "}
                        {initialPrice !== null
                          ? formatAmount(initialPrice)
                          : "X"}{" "}
                        <span className="dw-price-unit">
                          {BACKING_ASSETS[backingAssetIdx]}
                        </span>
                      </span>
                    </div>

                    <div className="dw-validation dw-validation--warning">
                      <IconAlertSquare size={16} strokeWidth={1.5} />
                      <span>LP token will be permanently burned</span>
                    </div>
                  </div>
                </div>

                <div className="dw-footer">
                  <Button variant="ghost" size="m" onClick={goBack}>
                    Back
                  </Button>
                  <Button variant="primary" size="m" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </>
            )}

            {/* ── STEP 3: Release strategy ─────────────────────────────── */}
            {step === "release" && (
              <>
                <div className="dw-text">
                  <h2 className="dw-title">Distribution</h2>
                  <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
                  <p className="dw-step-desc">
                    Set the distribution&apos;s timing and how supply releases
                    across it.
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
                            value={startDate.value}
                            onChange={(e) => startDate.onChange(e.target.value)}
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
                        {startDate.error && (
                          <div className="dw-validation dw-validation--danger">
                            <IconAlertSquare size={16} strokeWidth={1.5} />
                            <span>{startDate.error}</span>
                          </div>
                        )}
                      </div>
                      <div className="dw-date-wrap">
                        <label className="dw-date-label">
                          Start time (UTC)
                        </label>
                        <div className="dw-date-field">
                          <input
                            ref={startTimeRef}
                            type="time"
                            className="dw-date-el"
                            value={startTime.value}
                            onChange={(e) => startTime.onChange(e.target.value)}
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
                        {startTime.error && (
                          <div className="dw-validation dw-validation--danger">
                            <IconAlertSquare size={16} strokeWidth={1.5} />
                            <span>{startTime.error}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* Release strategy cards */}
                  <div className="dw-curve-section">
                    <p className="dw-section-label">
                      Release strategy (Linear and Exponential coming soon)
                    </p>
                    <div className="dw-curve-cards">
                      <ReleaseCard
                        name="Flat curve"
                        description="Release equal amount each epoch"
                        icon={<IconEqualDouble size={24} strokeWidth={1.5} />}
                        state={releaseCurve === "flat" ? "selected" : "rest"}
                        onClick={() => setReleaseCurve("flat")}
                      />
                      <ReleaseCard
                        name="Linear curve"
                        description="Release decreasing or increasing amount"
                        icon={<IconMathFunctionY size={24} strokeWidth={1.5} />}
                        state="disabled"
                      />
                      <ReleaseCard
                        name="Exponential curve"
                        description="Release scales sharply with participation."
                        icon={<IconMathIntegralX size={24} strokeWidth={1.5} />}
                        state="disabled"
                      />
                    </div>

                    {/* Release type + dates */}
                    <div className="dw-release-type-section">
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

                      {releaseTypeIdx === 0 ? (
                        <div className="dw-date-row">
                          <div className="dw-date-wrap">
                            <label className="dw-date-label">End date</label>
                            <div className="dw-date-field">
                              <input
                                ref={endRef}
                                type="date"
                                className="dw-date-el"
                                value={endDate.value}
                                onChange={(e) =>
                                  endDate.onChange(e.target.value)
                                }
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
                            {endDate.error && (
                              <div className="dw-validation dw-validation--danger">
                                <IconAlertSquare size={16} strokeWidth={1.5} />
                                <span>{endDate.error}</span>
                              </div>
                            )}
                          </div>
                          <div className="dw-input-flex">
                            <DropDownInput
                              state={epochDurationInput}
                              label="Epoch duration"
                              placeholder="Select an option"
                              options={EPOCH_DURATION_OPTIONS}
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="dw-date-row">
                            <div className="dw-date-wrap">
                              <Input
                                state={numberOfEpochs}
                                label="Number of epochs"
                                placeholder="e.g. 54"
                                suffix="Epochs"
                                onChange={epochsOnChange}
                              />
                            </div>
                            <div className="dw-date-wrap">
                              <Input
                                state={releasePerEpoch}
                                label="Release per epoch"
                                placeholder="e.g. 100"
                                suffix={props.token.symbol}
                                onChange={releaseOnChange}
                              />
                            </div>
                          </div>
                          <div className="dw-input-flex mt-4">
                            <DropDownInput
                              state={epochDurationInput}
                              label="Epoch duration"
                              placeholder="Select an option"
                              options={EPOCH_DURATION_OPTIONS}
                            />
                          </div>
                        </div>
                      )}

                      {/* Release schedule summary */}
                      {releaseTypeIdx === 0 && epochsFromDates !== null && (
                        <p className="dw-release-summary">
                          This creates{" "}
                          <strong>{epochsFromDates} total epochs</strong>{" "}
                          Releasing{" "}
                          <strong>
                            {releasePerEpochFromDates !== null
                              ? `${formatAmount(releasePerEpochFromDates)} ${props.token.symbol}`
                              : `— ${props.token.symbol}`}
                          </strong>{" "}
                          each.
                        </p>
                      )}
                      {releaseTypeIdx === 1 && endDateFromEpochs !== null && (
                        <p className="dw-release-summary">
                          This creates{" "}
                          <strong>
                            {parseInt(numberOfEpochs.value)} total epochs (
                            {epochDurationInput.value} each).
                          </strong>{" "}
                          Ends{" "}
                          <strong>
                            {formatDateLong(endDateFromEpochs)} (
                            {(
                              (parseInt(numberOfEpochs.value) *
                                EPOCH_DURATION_MS[epochDurationInput.value]) /
                              (24 * 60 * 60 * 1000)
                            ).toFixed(1)}{" "}
                            days later)
                          </strong>
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="dw-footer">
                  <Button variant="ghost" size="m" onClick={goBack}>
                    Back
                  </Button>
                  <Button variant="primary" size="m" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </>
            )}

            {/* ── STEP 4: Rules ─────────────────────────────────────────── */}
            {step === "rules" && (
              <>
                <div className="dw-text">
                  <h2 className="dw-title">Distribution</h2>
                  <Stepper steps={STEP_LABELS} activeIndex={stepIdx} />
                  <p className="dw-step-desc">
                    Optional guardrails on participation.
                  </p>
                </div>

                <div className="dw-form">
                  {/* Epoch setup */}
                  <div className="dw-rules-section">
                    <p className="dw-section-label">Epoch setup</p>
                    <div className="dw-backing-inputs">
                      <div className="dw-input-flex">
                        <Input
                          state={minParticipation}
                          label="Minimum participation (Optional)"
                          placeholder="e.g. 0.5"
                          suffix={BACKING_ASSETS[backingAssetIdx]}
                        />
                      </div>
                      <div className="dw-input-flex">
                        <Input
                          state={claimDelay}
                          label="Claim delay"
                          placeholder="e.g. 5"
                          suffix="Days"
                        />
                      </div>
                    </div>
                  </div>

                  <Divider />

                  {/* After-epoch rules */}
                  <div className="dw-rules-section">
                    <p className="dw-section-label">After-epoch rules</p>
                    <p
                      className="dw-step-desc"
                      style={{
                        fontSize: 16,
                        lineHeight: "22px",
                        letterSpacing: "0.01em",
                      }}
                    >
                      Choose how each epoch&apos;s collected funds are split
                      when it closes. The split applies to every epoch and
                      can&apos;t change after launch.
                    </p>

                    {/* Split chart */}
                    <div className="dw-chart">
                      <div className="dw-chart-bar">
                        <div className="dw-chart-bar__liquidity" />
                        <div className="dw-chart-bar__fee" />
                        {founderSharePctClamped > 0 && (
                          <div
                            className="dw-chart-bar__founder"
                            style={{ width: `${founderSharePctClamped}%` }}
                          />
                        )}
                      </div>
                      <div className="dw-chart-legend">
                        <span className="dw-chart-legend__item dw-chart-legend__item--anchor">
                          {priceAnchorPct}% Price anchor
                        </span>
                        <span className="dw-chart-legend__item dw-chart-legend__item--founder">
                          {founderSharePctClamped}% Founder share
                        </span>
                        <span className="dw-chart-legend__item dw-chart-legend__item--fee">
                          {protocolFeePercent}% Protocol fee
                        </span>
                      </div>
                    </div>

                    {/* Price anchor — always on */}
                    <div className="dw-setting-card">
                      <div className="dw-setting-card__text">
                        <p className="dw-setting-card__title">
                          Price anchor (Buy and burn)
                        </p>
                        <p className="dw-setting-card__desc">
                          The protocol buys your token from the pool and burns
                          it, keeping the clear price aligned with the open
                          market.
                        </p>
                      </div>
                    </div>

                    <Divider />

                    {/* Founder share — toggle */}
                    <div className="dw-setting-card">
                      <div className="dw-setting-card__text">
                        <p className="dw-setting-card__title">Founder share</p>
                        <p className="dw-setting-card__desc">
                          Sent to your address when the epoch closes. Capped at{" "}
                          {FOUNDER_SHARE_CAP}%.
                        </p>
                      </div>
                      <Switch
                        on={founderShareOn}
                        onChange={setFounderShareOn}
                      />
                    </div>

                    {founderShareOn && (
                      <div className="dw-backing-inputs">
                        <div className="dw-share-pct-group">
                          <Input
                            state={founderSharePercent}
                            placeholder="Share percentage"
                            suffix="%"
                          />
                        </div>
                        <div className="dw-input-flex">
                          <Input
                            state={founderReceiverInput}
                            placeholder="Receiver address"
                            showPaste
                            onPaste={handlePasteFounderAddress}
                            spellCheck={false}
                            autoComplete="off"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="dw-footer">
                  <Button variant="ghost" size="m" onClick={goBack}>
                    Back
                  </Button>
                  <Button variant="primary" size="m" onClick={goNext}>
                    Continue
                  </Button>
                </div>
              </>
            )}

            {/* ── STEP 5: Review ────────────────────────────────────────── */}
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
                      <IconButton
                        variant="ghost"
                        size="m"
                        icon={<IconSettings size={24} strokeWidth={1.5} />}
                        aria-label="Edit supply"
                        onClick={() => jumpTo("supply")}
                      />
                    </div>
                    <DataRow
                      label="Total supply:"
                      value={
                        supply.value
                          ? `${supply.value} ${props.token.symbol}`
                          : `— ${formatEther(props.token.totalSupply)}`
                      }
                    />
                  </div>

                  <Divider />

                  {/* Release schedule */}
                  <div className="dw-review-section">
                    <div className="dw-review-header">
                      <span className="dw-review-title">Release schedule</span>
                      <IconButton
                        variant="ghost"
                        size="m"
                        icon={<IconSettings size={24} strokeWidth={1.5} />}
                        aria-label="Edit release schedule"
                        onClick={() => jumpTo("release")}
                      />
                    </div>
                    <DataRow
                      label="Release curve:"
                      value={
                        releaseCurve.charAt(0).toUpperCase() +
                        releaseCurve.slice(1)
                      }
                    />
                    <DataRow
                      label="Release type:"
                      value={RELEASE_TYPES[releaseTypeIdx]}
                    />
                    <DataRow
                      label="Release starts at:"
                      value={formatDate(startDate.value)}
                    />
                    <DataRow
                      label="Release ends at:"
                      value={
                        releaseTypeIdx === 0
                          ? formatDate(endDate.value)
                          : endDateFromEpochs
                            ? formatDate(endDateFromEpochs.toISOString())
                            : "—"
                      }
                    />
                  </div>

                  <Divider />

                  {/* Backing */}
                  <div className="dw-review-section">
                    <div className="dw-review-header">
                      <span className="dw-review-title">Backing</span>
                      <IconButton
                        variant="ghost"
                        size="m"
                        icon={<IconSettings size={24} strokeWidth={1.5} />}
                        aria-label="Edit backing"
                        onClick={() => jumpTo("supply")}
                      />
                    </div>
                    <DataRow
                      label="Backing asset:"
                      value={BACKING_ASSETS[backingAssetIdx]}
                    />
                    <DataRow
                      label="Initial liquidity:"
                      value={
                        initialParticipationLiquidity.value
                          ? `${initialParticipationLiquidity.value} ${BACKING_ASSETS[backingAssetIdx]}`
                          : "—"
                      }
                    />
                    <DataRow
                      label="Initial price:"
                      value={
                        initialPrice !== null
                          ? `1 ${props.token.symbol} = ${formatAmount(initialPrice)} ${BACKING_ASSETS[backingAssetIdx]}`
                          : "—"
                      }
                    />
                  </div>

                  <Divider />

                  {/* Rules */}
                  <div className="dw-review-section">
                    <div className="dw-review-header">
                      <span className="dw-review-title">Rules</span>
                      <IconButton
                        variant="ghost"
                        size="m"
                        icon={<IconSettings size={24} strokeWidth={1.5} />}
                        aria-label="Edit rules"
                        onClick={() => jumpTo("rules")}
                      />
                    </div>
                    <DataRow
                      label="Minimum participation:"
                      value={
                        minParticipation.value
                          ? `${minParticipation.value} ${props.token.symbol}`
                          : "None"
                      }
                    />
                    <DataRow
                      label="Claim delay:"
                      value={
                        claimDelay.value ? `${claimDelay.value} DAYS` : "None"
                      }
                    />
                    <DataRow
                      label="Price anchor:"
                      value={`${priceAnchorPct}%`}
                    />
                    <DataRow
                      label="Protocol fee:"
                      value={`${protocolFeePercent}%`}
                    />
                    {founderShareOn && (
                      <>
                        <DataRow
                          label="Founder share:"
                          value={`${founderSharePctClamped}%`}
                        />
                        <DataRow
                          label="Founder receiver address:"
                          value={
                            formatAddress(founderReceiverInput.value) || "—"
                          }
                        />
                      </>
                    )}
                  </div>

                  <Divider />

                  {/* Allocation */}
                  <div className="dw-review-section">
                    <div className="dw-review-header">
                      <span className="dw-review-title">Allocation</span>
                      <IconButton
                        variant="ghost"
                        size="m"
                        icon={<IconSettings size={24} strokeWidth={1.5} />}
                        aria-label="Edit allocation"
                        onClick={() => jumpTo("supply")}
                      />
                    </div>
                    <DataRow
                      label="Tokenomics:"
                      value={
                        supply.value
                          ? `${((supplyNum / totalSupplyF) * 100).toFixed(2)}% public distribution`
                          : "—"
                      }
                    />
                    <DataRow label="Allowlist:" value="No one" />
                  </div>

                  <Divider />
                </div>

                <div className="dw-footer">
                  <Button variant="ghost" size="m" onClick={goBack}>
                    Back
                  </Button>
                  <Button
                    variant="primary"
                    size="m"
                    onClick={() => {
                      if (!isWalletConnected) {
                        openConnectModal?.();
                        return;
                      }
                      onConfirm();
                    }}
                    disabled={confirming}
                  >
                    {!isWalletConnected
                      ? "Connect wallet"
                      : confirming
                        ? "Confirming..."
                        : "Confirm"}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Types ──────────────────────────────────────────────────────────────────

type DistStep = "welcome" | "supply" | "release" | "rules" | "review";

const STEP_LABELS = [
  "Supply and backing",
  "Release strategy",
  "Rules",
  "Review",
];
const STEP_ORDER: DistStep[] = ["supply", "release", "rules", "review"];

type ReleaseCurve = "flat" | "linear" | "exponential";

// ── Helpers ─────────────────────────────────────────────────────────────────

const stepperIndex = (step: DistStep) => STEP_ORDER.indexOf(step); // -1 for "welcome"

const calcEpochs = (
  startDate: string,
  startTime: string,
  end: string,
  durationMs: number,
): number | null => {
  if (!startDate || !startTime || !end) return null;
  const diffMs =
    Number(
      parseUTCToTimestampSec(end) -
        parseUTCToTimestampSec(startDate, startTime),
    ) * 1000;
  if (diffMs <= 0) return null;
  return Math.round(diffMs / durationMs);
};

const formatAmount = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 2 });

const calcEndDateFromEpochs = (
  startDate: string,
  startTime: string,
  numberOfEpochs: number,
  epochDurationSec: number,
): Date | null => {
  if (!startDate || !startTime || isNaN(numberOfEpochs) || numberOfEpochs <= 0)
    return null;
  const startSec = Number(parseUTCToTimestampSec(startDate, startTime));
  const endSec = startSec + numberOfEpochs * epochDurationSec;
  return new Date(endSec * 1000);
};

const formatDate = (iso: string) => {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateLong = (d: Date) => {
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const formatAddress = (address: string) =>
  `${address.slice(0, 6)}...${address.slice(-4)}`;

const parseUTCToTimestampSec = (date: string, time?: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time ? time.split(":").map(Number) : [0, 0];
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  return BigInt(Math.floor(utcDate.getTime() / 1000));
};
const nowSec = () => BigInt(Math.round(Date.now() / 1000));

const BACKING_ASSETS = ["ROOT", "BASE", "USDC", "ETH"];
const BACKING_ASSETS_DISABLED = [1, 2, 3];
const RELEASE_TYPES = ["Time-based", "Epoch-based"];
const EPOCH_DURATION_OPTIONS = ["20 mins", "2 hrs", "8 hrs", "1 day"];
const EPOCH_DURATION_MS: Record<string, number> = {
  "20 mins": 20 * 60 * 1000,
  "2 hrs": 2 * 60 * 60 * 1000,
  "8 hrs": 8 * 60 * 60 * 1000,
  "1 day": 24 * 60 * 60 * 1000,
};
const FOUNDER_SHARE_CAP = 25;
