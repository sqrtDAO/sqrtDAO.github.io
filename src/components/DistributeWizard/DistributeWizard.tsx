"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  IconAlertSquareRounded,
  IconCalendarEvent,
  IconClockEdit,
  IconEqualDouble,
  IconMathIntegralX,
  IconMathXDivideY2,
  IconRotate2,
} from "@tabler/icons-react";
import {
  decodeEventLog,
  encodeFunctionData,
  encodePacked,
  formatUnits,
  maxUint256,
  parseUnits,
  zeroAddress,
  type Address,
} from "viem";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
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
import RouterPage from "@/components/RouterPage/RouterPage";
import { useInput } from "@/hooks/useInput";
import {
  allowCharsModifier,
  commaModifier,
  composeModifiers,
  decimalOnlyModifier,
  numberOnlyModifier,
  type InputModifier,
} from "@/utils/modifier";
import {
  addressValidator,
  positiveNumberValidator,
  requiredValidator,
  validateAll,
  type InputValidator,
} from "@/utils/validator";
import {
  getFactoryV1Contract,
  getTokenV1Contract,
  getWethContract,
} from "@/contracts/contracts";
import { tokenV1Abi, transferToHookAbi } from "@/contracts/abis";
import { getAddresses } from "@/contracts/contract-addresses";
import { getParticipationAssets, type ParticipationAsset } from "@/contracts/participation-assets";
import { DISTRIBUTION_LAUNCH_HREF, DISTRIBUTION_LIST } from "@/constants/links";
import { distributionV1FactoryAbi } from "@/contracts/abis";
import { showToast } from "@/hooks/useToast";
import { viewTransactionAction } from "@/utils/explorer-utils";
import { quickSqrtPriceX96 } from "@/lib/utils/sqrtPricex96";
import { EMPTY_PERMIT2 } from "@/lib/utils/permit2";
import { roundUnits } from "@/utils/round-units";
import { chainToSlug } from "@/utils/chain-utils";

type Step = "router" | "import" | "welcome" | "supply" | "release" | "rules" | "review" | "wallet" | "confirming" | "ready";
type ReleaseType = "time" | "epoch";

type TokenInfo = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  balance: bigint;
};

const FORM_STEPS: Step[] = ["supply", "release", "rules", "review"];
const STEP_NAMES = ["Supply and backing", "Release strategy", "Rules", "Review"];
const EPOCH_DURATIONS = ["20 mins", "2 hrs", "8 hrs", "1 day"];
const EPOCH_DURATION_MS: Record<string, number> = {
  "20 mins": 20 * 60 * 1000,
  "2 hrs": 2 * 60 * 60 * 1000,
  "8 hrs": 8 * 60 * 60 * 1000,
  "1 day": 24 * 60 * 60 * 1000,
};
// CreatorOrFactory — see DistributorV1.ReleasePolicy
const RELEASE_POLICY_CREATOR_OR_FACTORY = 2;
// the contract requires startTimestamp >= block.timestamp; keep a buffer
const START_TIME_BUFFER_SEC = 60;

const bodyM = "text-body leading-5.5 tracking-[0.01em]";
const bodyS = "text-body-s leading-5 tracking-[0.01em]";
const bodyL = "text-body-l leading-6 tracking-[0.02em]";

const tokenModifier = composeModifiers(decimalOnlyModifier, commaModifier);
const wholeModifier = composeModifiers(numberOnlyModifier, commaModifier);

const SectionLabel = ({ children }: { children: string }) => (
  <p className={`${bodyL} text-secondary`}>{children}</p>
);

const Rule = () => (
  <div className="flex h-2 w-full items-center">
    <Divider />
  </div>
);

const Actions = ({ children }: { children: React.ReactNode }) => (
  <div className="flex w-full items-center justify-end gap-4">{children}</div>
);

const BackContinue = ({
  onBack,
  onNext,
  nextLabel = "Continue",
  disabled,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) => (
  <Actions>
    <Button variant="ghost" size="m" className="flex-1 xl:flex-none" onClick={onBack}>
      Back
    </Button>
    <Button
      variant="primary"
      size="m"
      className="flex-1 xl:flex-none"
      onClick={onNext}
      disabled={disabled}
    >
      {nextLabel}
    </Button>
  </Actions>
);

const StepHeader = ({
  title,
  index,
  description,
}: {
  title: string;
  index: number;
  description?: string;
}) => (
  <div className="flex w-full flex-col gap-2">
    <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">{title}</h1>
    <Stepper steps={STEP_NAMES} activeIndex={index} />
    {description && <p className={`${bodyL} text-primary`}>{description}</p>}
  </div>
);

const PickerField = ({
  label,
  type,
  icon,
  value,
  onChange,
  error,
  onOptionChange,
}: {
  label: string;
  type: "date" | "time";
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  error?: string | null;
  onOptionChange?: () => void;
}) => {
  const ref = useRef<HTMLInputElement>(null);
  return (
    <div className="sqrt-input min-w-0 flex-1">
      <label className="sqrt-input__label">
        {label}
        <div className="sqrt-input__field mt-2">
          <input
            ref={ref}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`sqrt-input__el [&::-webkit-calendar-picker-indicator]:hidden ${
              error ? "is-error" : ""
            }`}
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
      {error && <p className={`${bodyS} mt-1 text-danger`}>{error}</p>}
    </div>
  );
};

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

const SettingCard = ({
  title,
  desc,
  action,
}: {
  title: string;
  desc: string;
  action?: React.ReactNode;
}) => (
  <div className="flex w-full items-center gap-6">
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <p className={`${bodyM} text-primary`}>{title}</p>
      <p className={`${bodyS} text-secondary`}>{desc}</p>
    </div>
    {action}
  </div>
);

const ReviewRow = ({ label, value }: { label: string; value: string }) => (
  <div className={`flex w-full items-center gap-4 ${bodyM}`}>
    <p className="min-w-0 flex-1 text-secondary">{label}</p>
    <p className="min-w-0 flex-1 text-right text-primary">{value}</p>
  </div>
);

const ReviewSection = ({
  title,
  onChange,
  rows,
}: {
  title: string;
  onChange?: () => void;
  rows: [string, string][];
}) => (
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

const Status = ({
  step,
  distributor,
  chainId,
}: {
  step: "wallet" | "confirming" | "ready";
  distributor?: Address;
  chainId?: number;
}) => (
  <div className="flex w-full flex-col items-center gap-8 text-center">
    <Image
      src="/mainnet/squarehead-loader.svg"
      alt=""
      width={325}
      height={325}
      unoptimized
      className="size-81.25 shrink-0"
    />
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
        <IconRotate2 size={40} className="text-accent animate-spin [animation-direction:reverse]" />
        <p className="text-h4 leading-none font-medium text-accent">Confirming on-chain…</p>
        <p className={`${bodyM} text-tertiary`}>This can take a moment. Keep this tab open.</p>
      </div>
    )}
    {step === "ready" && (
      <>
        <p className={`w-full text-left ${bodyM} text-secondary`}>
          Your distribution is live. Share it and let the market grow with it.
        </p>
        {distributor && (
          <p className={`w-full text-left ${bodyM} text-tertiary`}>
            Distribution address: {distributor}
          </p>
        )}
        <div className="flex w-full flex-col gap-4 xl:flex-row xl:justify-center">
          <Link
            href={
              distributor
                ? `/distribution?address=${distributor}${chainId ? `&chain=${chainToSlug(chainId)}` : ""}`
                : DISTRIBUTION_LIST
            }
            className="sqrt-btn sqrt-btn--outline sqrt-btn--l"
          >
            <span className="sqrt-btn__label">Go to distribution</span>
          </Link>
        </div>
      </>
    )}
  </div>
);

const DistributeWizard = ({ initialToken }: { initialToken?: Address }) => {
  const searchParams = useSearchParams();
  const queryToken = (searchParams.get("token") as Address | null) ?? undefined;
  const targetToken = initialToken ?? queryToken;

  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { openConnectModal } = useConnectModal();
  const chainId = walletClient?.chain.id ?? publicClient?.chain.id;

  const [step, setStep] = useState<Step>(targetToken ? "welcome" : "router");
  const [token, setToken] = useState<TokenInfo | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [distributor, setDistributor] = useState<Address | null>(null);
  const importAddress = useInput("", undefined, addressValidator);
  const [importing, setImporting] = useState(false);

  const assets = useMemo(() => (chainId ? getParticipationAssets(chainId) : []), [chainId]);
  const [assetIndex, setAssetIndex] = useState(0);
  const asset: ParticipationAsset | undefined = assets[assetIndex];

  const [protocolFeeBps, setProtocolFeeBps] = useState<bigint>(0n);
  const [buyAndBurnMinBps, setBuyAndBurnMinBps] = useState<bigint>(0n);

  const protocolFeePct = Number(protocolFeeBps) / 100;
  const minAnchorPct = Number(buyAndBurnMinBps) / 100;
  // Founder share cap, derived entirely from the on-chain Factory config: the
  // anchor can never drop below config().buyBackAndBurnMinBps, so the founder
  // gets at most 100% − protocolFee − minAnchor.
  const maxFounderBps =
    10000n - protocolFeeBps - buyAndBurnMinBps > 0n
      ? 10000n - protocolFeeBps - buyAndBurnMinBps
      : 0n;
  const founderCapPct = Number(maxFounderBps) / 100;

  // form state
  const initialSupply = useInput("", tokenModifier, positiveNumberValidator("Initial token supply"));

  // participation-asset wallet balance — validates the "Initial liquidity" input
  const [assetBalance, setAssetBalance] = useState<bigint | null>(null);
  useEffect(() => {
    if (!publicClient || !address || !asset) {
      setAssetBalance(null);
      return;
    }
    if (asset.native) {
      publicClient
        .getBalance({ address })
        .then(setAssetBalance)
        .catch(() => {});
    } else {
      getTokenV1Contract(publicClient, asset.address)
        .read.balanceOf([address])
        .then(setAssetBalance)
        .catch(() => {});
    }
  }, [publicClient, address, asset]);

  const liquidityValidator = useMemo<InputValidator>(
    () => (v) => {
      const base = positiveNumberValidator("Initial liquidity")(v);
      if (base) return base;
      if (asset && assetBalance !== null) {
        try {
          if (parseUnits(v.replace(/,/g, ""), asset.decimals) > assetBalance) {
            return `Insufficient ${asset.symbol} balance`;
          }
        } catch {
          // mid-edit value — pass through
        }
      }
      return null;
    },
    [asset, assetBalance],
  );
  const liquidity = useInput("", tokenModifier, liquidityValidator);

  const toDistribute = useInput("", tokenModifier, positiveNumberValidator("Supply to distribute"));
  const startDate = useInput("", undefined, requiredValidator("Start date"));
  const startTime = useInput("", undefined, requiredValidator("Start time"));
  const epochDurationInput = useInput(EPOCH_DURATIONS[3]);
  const [releaseTypeIdx, setReleaseTypeIdx] = useState(0);
  const endDate = useInput("");
  const epochs = useInput("", wholeModifier);
  const perEpoch = useInput("", tokenModifier);
  const minParticipation = useInput("", tokenModifier);
  const claimDelay = useInput("0", numberOnlyModifier);
  const [founderOn, setFounderOn] = useState(false);
  // Cap the founder share as the user types: values over the on-chain-derived
  // cap snap to it instead of showing an error, matching how the balance inputs behave.
  // Fractional percents are allowed (e.g. 0.5% → 50 bps).
  const founderShareModifier: InputModifier = (v) => {
    const digits = allowCharsModifier(/[^0-9.]/g)(v);
    const n = parseFloat(digits);
    if (!isNaN(n) && n > founderCapPct) return String(founderCapPct);
    return digits;
  };
  const founderShareValidator: InputValidator = (v) => {
    if (v.trim() === "") return "Founder share is required";
    const n = parseFloat(v);
    if (isNaN(n) || n <= 0) return "Founder share must be greater than 0";
    return null;
  };
  const founderShare = useInput("", founderShareModifier, founderShareValidator);
  const founderReceiver = useInput("", undefined, addressValidator);

  const loadToken = async (addr: Address) => {
    if (!publicClient) return;
    setImporting(true);
    setLoadError(null);
    try {
      const contract = getTokenV1Contract(publicClient, addr);
      const [name, symbol, decimals, totalSupply, balance] = await Promise.all([
        contract.read.name(),
        contract.read.symbol(),
        contract.read.decimals(),
        contract.read.totalSupply(),
        address ? contract.read.balanceOf([address]) : Promise.resolve(0n),
      ]);
      setToken({ address: addr, name, symbol, decimals: Number(decimals), totalSupply, balance });
      setDistributor(null);
      // Reflect the imported token in the URL (shallow update, no remount): a
      // refresh or re-open re-imports instead of dropping back to the router,
      // and the half-configured wizard can be bookmarked/shared for support.
      window.history.replaceState(null, "", `${DISTRIBUTION_LAUNCH_HREF}?token=${addr}`);
      setStep("welcome");
    } catch (e) {
      console.error(e);
      setLoadError("Couldn't read that token on this network.");
    } finally {
      setImporting(false);
    }
  };

  useEffect(() => {
    if (targetToken) void loadToken(targetToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetToken, publicClient]);

  useEffect(() => {
    if (!publicClient) return;
    getFactoryV1Contract(publicClient)
      .read.config()
      .then(([fee, , min]) => {
        setProtocolFeeBps(fee);
        setBuyAndBurnMinBps(min);
      })
      .catch(() => {});
  }, [publicClient]);

  useEffect(() => {
    if (!token || !address || !publicClient) return;
    getTokenV1Contract(publicClient, token.address)
      .read.balanceOf([address])
      .then((balance) => setToken((t) => (t ? { ...t, balance } : t)))
      .catch(() => {});
  }, [token?.address, address, publicClient]);

  const decimals = token?.decimals ?? 18;
  const balanceBig = token?.balance ?? 0n;
  const tryParseAmount = (v: string): bigint | null => {
    try {
      return parseUnits(v.replace(/,/g, "") || "0", decimals);
    } catch {
      return null;
    }
  };
  const initialBig = tryParseAmount(initialSupply.value) ?? 0n;
  const distributedBig = tryParseAmount(toDistribute.value) ?? 0n;
  const availableBig = balanceBig > initialBig ? balanceBig - initialBig : 0n;

  const balanceNum = Number(formatUnits(balanceBig, decimals));
  const initialNum = Number(formatUnits(initialBig, decimals));
  const distributedNum = Number(formatUnits(distributedBig, decimals));
  const available = Number(formatUnits(availableBig, decimals));
  const percent =
    availableBig > 0n ? Math.min(100, Number((distributedBig * 100n) / availableBig)) : 0;

  // bigint formatting keeps fractions precise (500.5 stays 500.5, never floored)
  const fmtAmount = (v: bigint) => commaModifier(formatUnits(v, decimals));

  // Both amounts come out of the same wallet balance, so they stay coupled:
  // - typing "Initial token supply" caps itself at the balance and live-shrinks
  //   "Supply to distribute" when the LP deposit eats into it,
  // - typing "Supply to distribute" is capped live at the remainder, so it can
  //   never exceed the balance (no over-100% state).
  const onInitialSupplyChange = (v: string) => {
    const parsed = tryParseAmount(v);
    if (parsed === null) {
      // mid-edit value ("1.") — pass through untouched
      initialSupply.onChange(v);
      return;
    }
    if (parsed > balanceBig) {
      // over balance → snap to the balance (and empty the distribute field)
      initialSupply.onChange(fmtAmount(balanceBig));
      if (distributedBig > 0n) toDistribute.onChange(fmtAmount(0n));
      return;
    }
    // keep the user's text exactly as typed, so "1.", "1.5", "1000.25" survive
    initialSupply.onChange(v);
    const leftBig = balanceBig - parsed;
    if (distributedBig > leftBig) toDistribute.onChange(fmtAmount(leftBig));
  };
  const onToDistributeChange = (v: string) => {
    const parsed = tryParseAmount(v);
    if (parsed !== null && parsed > availableBig) {
      toDistribute.onChange(fmtAmount(availableBig));
      return;
    }
    toDistribute.onChange(v);
  };

  const founderBps = founderOn ? BigInt(Math.round((parseFloat(founderShare.value) || 0) * 100)) : 0n;
  // the anchor takes whatever the founder and the protocol fee leave behind,
  // so the three shares always sum to exactly 100%
  const buyAndBurnBps = 10000n - protocolFeeBps - founderBps;
  const priceAnchorPct = Number(buyAndBurnBps) / 100;
  const founderPct = Number(founderBps) / 100;

  // Initial price preview: 1 TOKEN ≈ liquidity / initial supply (asset units)
  const liquidityNum = Number(liquidity.value.replace(/,/g, "")) || 0;
  const initialPrice =
    initialNum > 0 && liquidityNum > 0 ? liquidityNum / initialNum : null;

  // Epoch-based coupling (restored from the old wizard): "Supply to distribute"
  // is the source of truth — typing one field recomputes the other. The per-epoch
  // amount snaps to the exact floor division, so perEpoch × epochs ≤ supply and
  // the contract's `totalDistributionAmount >= calculateTotal(...)` always holds.
  const epochsOnChange = (v: string) => {
    epochs.onChange(v);
    const n = parseInt(v.replace(/,/g, ""), 10);
    if (!n || n < 1 || !distributedNum) {
      perEpoch.onChange("");
      return;
    }
    perEpoch.onChange(commaModifier(String(Number((distributedNum / n).toFixed(6)))));
  };

  const perEpochOnChange = (v: string) => {
    const n = Number(v.replace(/,/g, ""));
    if (!n || !distributedNum) {
      perEpoch.onChange(v);
      epochs.onChange("");
      return;
    }
    if (n > distributedNum) {
      perEpoch.onChange(v);
      epochs.onChange("1");
      perEpoch.setError("Release per epoch exceeds the supply to distribute");
      return;
    }
    const count = Math.max(1, Math.floor(distributedNum / n));
    epochs.onChange(String(count));
    perEpoch.onChange(commaModifier(String(Number((distributedNum / count).toFixed(6)))));
  };

  // keep the pair consistent when "Supply to distribute" changes afterwards
  useEffect(() => {
    if (releaseTypeIdx !== 1) return;
    const n = parseInt(epochs.value.replace(/,/g, ""), 10);
    if (!n || n < 1 || !distributedNum) return;
    const per = Number((distributedNum / n).toFixed(6));
    if (Number(perEpoch.value.replace(/,/g, "")) !== per) {
      perEpoch.onChange(commaModifier(String(per)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toDistribute.value, epochs.value, releaseTypeIdx]);

  // Epoch / emission math
  const epochsCount = useMemo(() => {
    if (releaseTypeIdx === 0) {
      if (!startDate.value || !startTime.value || !endDate.value) return 0;
      const start = Number(parseUTCToTimestampSec(startDate.value, startTime.value));
      const end = Number(parseUTCToTimestampSec(endDate.value));
      const duration = EPOCH_DURATION_MS[epochDurationInput.value] / 1000;
      return Math.max(0, Math.floor((end - start) / duration));
    }
    return Math.floor(parseFloat(epochs.value.replace(/,/g, "")) || 0);
  }, [releaseTypeIdx, startDate.value, startTime.value, endDate.value, epochDurationInput.value, epochs.value]);

    // Epoch-based: when the schedule ends (start + epochs × duration)
  const epochBasedEndMs = useMemo(() => {
    if (
      releaseTypeIdx !== 1 ||
      !startDate.value ||
      !startTime.value ||
      epochsCount < 1
    )
      return null;
    return (
      Number(parseUTCToTimestampSec(startDate.value, startTime.value)) * 1000 +
      epochsCount * EPOCH_DURATION_MS[epochDurationInput.value]
    );
  }, [releaseTypeIdx, startDate.value, startTime.value, epochsCount, epochDurationInput.value]);

const totalDistributionAmount = useMemo(() => {
    if (!token) return 0n;
    // "Supply to distribute" is the source of truth in both modes; in epoch-based
    // mode the per-epoch amount is floored from it at confirm time, which keeps
    // perEpoch × epochs ≤ total (the contract validates this invariant).
    return parseUnits(toDistribute.value.replace(/,/g, "") || "0", token.decimals);
  }, [token, toDistribute.value]);

  const releasePerEpoch = useMemo(() => {
    if (epochsCount <= 0) return 0n;
    return totalDistributionAmount / BigInt(epochsCount);
  }, [totalDistributionAmount, epochsCount]);

  const stepValidation = (): boolean => {
    switch (step) {
      case "supply": {
        if (!validateAll(initialSupply, liquidity, toDistribute)) return false;
        const need = initialNum + distributedNum;
        if (need > balanceNum) {
          toDistribute.setError("Not enough token balance");
          return false;
        }
        return true;
      }
      case "release":
        if (!validateAll(startDate, startTime, epochDurationInput)) return false;
        {
          // the contract requires startTimestamp >= block.timestamp; keep a small
          // buffer so it can't expire while the user signs
          const startSec = Number(
            parseUTCToTimestampSec(startDate.value, startTime.value),
          );
          if (startSec > 0 && startSec < Math.floor(Date.now() / 1000) + START_TIME_BUFFER_SEC) {
            startDate.setError("Start must be in the future");
            return false;
          }
        }
        if (epochsCount < 1) {
          if (releaseTypeIdx === 0)
            endDate.setError("End must cover at least one full epoch");
          else epochs.setError("Must cover at least one full epoch");
          return false;
        }
        if (releaseTypeIdx === 0 && !validateAll(endDate)) return false;
        if (releaseTypeIdx === 1 && !validateAll(epochs, perEpoch)) return false;
        return true;
      case "rules":
        return !founderOn || validateAll(minParticipation, claimDelay, founderShare, founderReceiver);
      default:
        return true;
    }
  };

  const goNext = () => {
    if (!stepValidation()) return;
    const idx = FORM_STEPS.indexOf(step);
    setStep(FORM_STEPS[idx + 1]);
  };
  const goBack = () => {
    const idx = FORM_STEPS.indexOf(step);
    setStep(idx > 0 ? FORM_STEPS[idx - 1] : "welcome");
  };

  const approveIfNeeded = async (erc20: Address, owner: Address, spender: Address, amount: bigint) => {
    // writes must go through the wallet client, not the public RPC
    const contract = getTokenV1Contract(walletClient!, erc20);
    const allowance = await contract.read.allowance([owner, spender]);
    if (allowance >= amount) return;
    const hash = await contract.write.approve([spender, maxUint256], {
      account: walletClient!.account,
      chain: walletClient!.chain,
    });
    const receipt = await publicClient!.waitForTransactionReceipt({ hash });
    if (receipt.status === "reverted") throw new Error("approve failed");
  };

  // The chain's own clock — local time can drift from block.timestamp.
  const latestChainSeconds = useCallback(async (): Promise<number> => {
    if (!publicClient) return Math.floor(Date.now() / 1000);
    try {
      const block = await publicClient.getBlock({ blockTag: "latest" });
      return Number(block.timestamp);
    } catch {
      return Math.floor(Date.now() / 1000);
    }
  }, [publicClient]);

  const onConfirm = async () => {
    if (!walletClient || !publicClient || !token || !asset) {
      showToast("generic.error");
      return;
    }
    if (!isConnected || !address) {
      openConnectModal?.();
      return;
    }

    // Re-check the start time at confirm: it may have slipped into the past while
    // the user filled the form, and the contract reverts `start timestamp in the past`.
    // Compare against the chain's own block time, not the local clock.
    const startTimestamp = parseUTCToTimestampSec(startDate.value, startTime.value);
    const chainNow = await latestChainSeconds();
    if (Number(startTimestamp) < chainNow + START_TIME_BUFFER_SEC) {
      startDate.setError("Start must be in the future");
      showToast("tx.reverted", {
        params: { reason: "start time is in the past — pick a later one" },
      });
      setStep("release");
      return;
    }

    setStep("wallet");
    const participationDecimals = asset.decimals;
    const participationAmount = parseUnits(liquidity.value.replace(/,/g, ""), participationDecimals);
    const distributionLiquidity = parseUnits(initialSupply.value.replace(/,/g, ""), token.decimals);
    const factory = getFactoryV1Contract(walletClient);
    const addresses = getAddresses(walletClient.chain.id);
    const toastId = "distribution-launch";

    try {
      const epochDuration = BigInt(EPOCH_DURATION_MS[epochDurationInput.value] / 1000);
      const minPart = parseUnits(minParticipation.value.replace(/,/g, "") || "0", participationDecimals);
      const claimDelaySeconds = BigInt((parseInt(claimDelay.value) || 0) * 86400);

      const shares = [] as {
        shareBps: bigint;
        hook: { contractAddress: Address; callData: `0x${string}` };
      }[];
      if (founderBps > 0n) {
        shares.push({
          shareBps: founderBps,
          hook: {
            contractAddress: addresses.transferToHook,
            callData: encodeFunctionData({
              abi: transferToHookAbi,
              functionName: "transferTo",
              args: [asset.address, founderReceiver.value.trim() as Address],
            }),
          },
        });
      }

      const config = {
        distributionToken: token.address,
        participationToken: asset.address,
        epochDuration,
        startTimestamp,
        minParticipation: minPart,
        claimDelaySeconds,
        allowFutureEpochParticipation: true,
        releasePolicy: RELEASE_POLICY_CREATOR_OR_FACTORY,
        shares,
        emissionFunction: {
          emissionContract: addresses.fixedEmission,
          curveConfig: encodePacked(["uint256"], [releasePerEpoch]),
        },
        allowlistSigner: zeroAddress,
        allowlistDeadline: 0n,
        numberOfEpochs: BigInt(epochsCount),
        totalDistributionAmount,
        initialMetadata: [],
        metadataEditable: true,
      };

      const [token0, token1] =
        asset.address.toLowerCase() < token.address.toLowerCase()
          ? [asset.address, token.address]
          : [token.address, asset.address];
      const amount0Desired =
        token0 === asset.address ? participationAmount : distributionLiquidity;
      const amount1Desired =
        token1 === asset.address ? participationAmount : distributionLiquidity;
      const sqrtPriceX96 = quickSqrtPriceX96(amount1Desired, amount0Desired);

      // Wrap only the shortfall: if the wallet already holds enough WETH we go straight
// to the factory (one prompt). Otherwise we deposit first, then the factory call —
// two wallet prompts, which is fine.
if (asset.native) {
        const weth = getWethContract(walletClient);
        const wethBalance = await weth.read.balanceOf([address]);
        const shortfall = participationAmount - wethBalance;
        if (shortfall > 0n) {
          showToast("wrap.pending", {
            id: toastId,
            params: { asset: asset.symbol },
          });
          const wrapHash = await weth.write.deposit({
            value: shortfall,
            account: walletClient.account,
            chain: walletClient.chain,
          });
          const wrapReceipt = await publicClient.waitForTransactionReceipt({
            hash: wrapHash,
          });
          if (wrapReceipt.status === "reverted") throw new Error("wrap failed");
        }
      }
      await approveIfNeeded(asset.address, address, factory.address, participationAmount);
      await approveIfNeeded(
        token.address,
        address,
        factory.address,
        distributionLiquidity + totalDistributionAmount,
      );

      // Re-check the start time: approvals + wallet prompts can take long enough
      // that a near-future start expires, and the contract reverts.
      const chainNowLate = await latestChainSeconds();
      if (Number(startTimestamp) < chainNowLate + START_TIME_BUFFER_SEC) {
        showToast("tx.reverted", {
          id: toastId,
          params: { reason: "start time passed while confirming — pick a later one" },
        });
        startDate.setError("Start must be in the future");
        setStep("release");
        return;
      }

      setStep("confirming");
      showToast("launch.pending", { id: toastId });
      const args = [
        sqrtPriceX96,
        participationAmount,
        distributionLiquidity,
        0n,
        0n,
        config,
        buyAndBurnBps,
        EMPTY_PERMIT2,
        EMPTY_PERMIT2,
      ] as const;
      // Skip eth_estimateGas: this launch is very gas-heavy (~63M) and public
      // RPCs cap their estimate/call, returning a bogus "reverted". Hand the tx
      // the whole block gas limit and let the wallet send it.
      const latestBlock = await publicClient.getBlock({ blockTag: "latest" });
      const hash = await factory.write.createLiquidityAndDistribution(args, {
        account: walletClient.account,
        chain: walletClient.chain,
        // wallets reject gas ==/above the block limit, so leave a small margin
        gas: (latestBlock.gasLimit * 98n) / 100n,
      });
      const receipt = await publicClient
        .waitForTransactionReceipt({ hash })
        .catch((e) => {
          console.error(e);
          // Tx was broadcast, so the distribution may already exist. A failed
          // receipt fetch must not read as "launch failed".
          showToast("launch.unconfirmed", {
            id: toastId,
            action: viewTransactionAction(walletClient.chain.id, hash),
          });
          return null;
        });
      if (!receipt) {
        setStep("review");
        return;
      }
      if (receipt.status === "reverted") {
        showToast("launch.failed", { id: toastId, action: viewTransactionAction(walletClient.chain.id, hash) });
        throw new Error("createLiquidityAndDistribution reverted");
      }
      showToast("launch.success", { id: toastId, action: viewTransactionAction(walletClient.chain.id, hash) });
      // the distributor is created by the DistributionV1Factory, not FactoryV1
      for (const log of receipt.logs) {
        try {
          const event = decodeEventLog({
            abi: distributionV1FactoryAbi,
            data: log.data,
            topics: log.topics,
          });
          if (event.eventName === "NewDistributor") {
            setDistributor(
              (event.args as { distributor: Address }).distributor,
            );
          }
        } catch {}
      }
      setStep("ready");
    } catch (e) {
      console.error(e);
      showToast("tx.reverted", { id: toastId, params: { reason: revertReason(e) } });
      setStep("review");
    }
  };

  if (step === "router") {
    return <RouterPage onImport={() => setStep("import")} />;
  }

  if (step === "wallet" || step === "confirming" || step === "ready") {
    return (
      <WizardShell>
        <Status step={step} distributor={distributor ?? undefined} chainId={walletClient?.chain.id} />
      </WizardShell>
    );
  }

  if (step === "import" || !token) {
    return (
      <WizardShell closeHref="/">
        {step === "import" && (
          <div className="flex w-full flex-col gap-8">
            <div className="flex w-full flex-col gap-2">
              <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">
                Import existing token
              </h1>
              <p className={`${bodyL} text-secondary`}>
                Paste the contract address of the token you want to distribute.
              </p>
            </div>
            <Input
              state={importAddress}
              label="Token contract address"
              placeholder="0x…"
              showPaste
              onPaste={async () => {
                try {
                  importAddress.onChange((await navigator.clipboard.readText()).trim());
                } catch {}
              }}
            />
            {loadError && <p className={`${bodyM} text-danger`}>{loadError}</p>}
            <Actions>
              <Button variant="ghost" size="m" onClick={() => setStep("router")}>
                Back
              </Button>
              <Button
                variant="primary"
                size="m"
                disabled={importing}
                onClick={() => {
                  if (!importAddress.validate()) return;
                  void loadToken(importAddress.value.trim() as Address);
                }}
              >
                {importing ? "Loading…" : "Import token"}
              </Button>
            </Actions>
          </div>
        )}
      </WizardShell>
    );
  }

  const formIndex = FORM_STEPS.indexOf(step);
  const split = { priceAnchorPct, founderSharePct: founderPct, protocolFeePct };

  return (
    <WizardShell closeHref="/">
      <div className="flex w-full flex-col gap-8">
        {step === "welcome" && (
          <>
            <div className="flex w-full flex-col gap-2">
              <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">
                Welcome to Distribution
              </h1>
              <p className={`${bodyS} text-secondary`}>Here&apos;s how it works</p>
            </div>
            <div className={`${bodyL} flex w-full flex-col gap-6 text-primary`}>
              <p>
                Your token is released gradually, over timed windows called{" "}
                <strong className="font-bold">epochs</strong>, not all at once. In each epoch, people
                take part with funds. When it closes, that epoch&apos;s tokens are shared out
                proportionally, at one price for everyone.
              </p>
              <p>
                As it runs, your token <span className="text-accent">raises funds</span>, finds a{" "}
                <span className="text-accent">fair price</span>, and builds{" "}
                <span className="text-accent">locked liquidity</span>, all at once.
              </p>
            </div>
            <Actions>
              <Button variant="primary" size="l" className="flex-1 xl:flex-none" onClick={() => setStep("supply")}>
                Start distribution
              </Button>
            </Actions>
          </>
        )}

        {step === "supply" && (
          <>
            <StepHeader
              title="Distribution"
              index={0}
              description={`Set how many ${token.symbol} go out across all epochs.`}
            />
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-4">
                <SectionLabel>Initial price and liquidity pool creation</SectionLabel>
                <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:gap-4">
                  <p className={`${bodyL} text-secondary`}>Pair your token with</p>
                  <Segmented
                    items={assets.map((a) => a.symbol)}
                    activeIndex={assetIndex}
                    size="l"
                    onChange={setAssetIndex}
                  />
                </div>
                {assets.length === 0 && (
                  <p className={`${bodyM} text-danger`}>
                    No participation assets are configured for this network yet.
                  </p>
                )}
                <div className="flex w-full flex-col gap-4 xl:flex-row">
                  <div className="xl:flex-1">
                    <Input
                      state={initialSupply}
                      onChange={onInitialSupplyChange}
                      label="Initial token supply"
                      placeholder="first epoch release amount"
                      suffix={token.symbol}
                    />
                  </div>
                  <div className="xl:w-71">
                    <Input
                      state={liquidity}
                      label="Initial liquidity"
                      placeholder="e.g. 10,000,000"
                      suffix={asset?.symbol}
                    />
                  </div>
                </div>
                <p className="flex items-baseline gap-2 whitespace-nowrap">
                  <span className={`${bodyM} text-secondary`}>
                    Your token initial price will be
                  </span>
                  <span className={`${bodyM} text-primary`}>
                    1 {token.symbol} ≈{" "}
                    {initialPrice !== null
                      ? fmtPrice(initialPrice)
                      : "—"}{" "}
                    {asset?.symbol}
                  </span>
                </p>
                <p className={`flex items-center gap-1.5 ${bodyS} text-live`}>
                  <IconAlertSquareRounded size={16} />
                  LP token will be permanently burned
                </p>
              </div>

              <Rule />

              <div className="flex w-full flex-col gap-4">
                <SectionLabel>Supply set up</SectionLabel>
                <Input
                  state={toDistribute}
                  onChange={onToDistributeChange}
                  label="Supply to distribute"
                  placeholder="0"
                  suffix={token.symbol}
                />
                <div className="flex w-full flex-col gap-2">
                  <SupplySlider
                    value={percent}
                    disabled={availableBig <= 0n}
                    onChange={(p) =>
                      toDistribute.onChange(
                        fmtAmount((availableBig * BigInt(p)) / 100n),
                      )
                    }
                  />
                  <div className="flex w-full items-start gap-2">
                    <p className={`flex-1 ${bodyM} text-accent`}>
                      {percent}% ≈ {distributedNum.toLocaleString("en-US")} {token.symbol}
                    </p>
                    <div className="flex flex-1 flex-col items-end gap-1 xl:flex-row xl:items-baseline xl:justify-end">
                      <p className={`${bodyS} text-secondary`}>Wallet balance</p>
                      <p className={`${bodyM} text-primary`}>
                        {roundUnits(token.balance, token.decimals)} {token.symbol}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BackContinue onBack={() => setStep("welcome")} onNext={goNext} />
          </>
        )}

        {step === "release" && (
          <>
            <StepHeader
              title="Distribution"
              index={1}
              description="Set the distribution's timing and how supply releases across it."
            />
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-4">
                <SectionLabel>Distribution start</SectionLabel>
                <div className="flex w-full gap-4">
                  <PickerField
                    label="Start date"
                    type="date"
                    icon={<IconCalendarEvent size={16} />}
                    value={startDate.value}
                    onChange={startDate.onChange}
                    error={startDate.error}
                  />
                  <PickerField
                    label="Start time (UTC)"
                    type="time"
                    icon={<IconClockEdit size={16} />}
                    value={startTime.value}
                    onChange={startTime.onChange}
                    error={startTime.error}
                  />
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
                    activeIndex={releaseTypeIdx}
                    size="l"
                    onChange={setReleaseTypeIdx}
                  />
                  <p className={`${bodyM} text-primary`}>
                    {releaseTypeIdx === 0
                      ? "With this choice, the number of epochs is calculated automatically."
                      : "With this choice, the distribution duration is calculated automatically."}
                  </p>
                  {releaseTypeIdx === 0 ? (
                    <div className="flex w-full items-start gap-4">
                      <PickerField
                        label="End date"
                        type="date"
                        icon={<IconCalendarEvent size={16} />}
                        value={endDate.value}
                        onChange={endDate.onChange}
                        error={endDate.error}
                      />
                      <div className="min-w-0 flex-1">
                        <DropDownInput
                          state={epochDurationInput}
                          options={EPOCH_DURATIONS}
                          label="Epoch duration"
                          placeholder="Select an option"
                          onOptionChange={() => {
                            // duration change invalidates the stale epoch-count error
                            endDate.clearError();
                          }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex w-full flex-col gap-4">
                      <div className="flex w-full gap-4">
                        <div className="min-w-0 flex-1">
                          <Input
                            state={epochs}
                            onChange={epochsOnChange}
                            label="Number of epochs"
                            placeholder="e.g. 54"
                            suffix="Epochs"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Input
                            state={perEpoch}
                            onChange={perEpochOnChange}
                            label="Release per epoch"
                            placeholder="e.g. 100"
                            suffix={token.symbol}
                          />
                        </div>
                      </div>
                      <DropDownInput
                        state={epochDurationInput}
                        options={EPOCH_DURATIONS}
                        label="Epoch duration"
                        placeholder="Select an option"
                      />
                    </div>
                  )}
                  <p className={`flex w-full flex-wrap items-center gap-2 rounded-m border border-subtle bg-surface p-4 ${bodyM} text-secondary`}>
                    This creates{" "}
                    <strong className="font-bold text-primary">{epochsCount} total epochs</strong> releasing{" "}
                    <strong className="font-bold text-primary">
                      {roundUnits(releasePerEpoch, token.decimals)} {token.symbol}
                    </strong>{" "}
                    each.
                    {releaseTypeIdx === 1 && epochBasedEndMs && (
                      <>
                        {" "}Ends{" "}
                        <strong className="font-bold text-primary">
                          {fmtDateTimeUtc(epochBasedEndMs)} (
                          {((epochsCount * EPOCH_DURATION_MS[epochDurationInput.value]) / 86400000).toFixed(1)} days
                          later)
                        </strong>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
            <BackContinue onBack={goBack} onNext={goNext} />
          </>
        )}

        {step === "rules" && (
          <>
            <StepHeader title="Distribution" index={2} description="Optional guardrails on participation." />
            <div className="flex w-full flex-col gap-6">
              <div className="flex w-full flex-col gap-4">
                <SectionLabel>Epoch setup</SectionLabel>
                <div className="flex w-full flex-col gap-4 xl:flex-row">
                  <div className="xl:flex-1">
                    <Input
                      state={minParticipation}
                      label="Minimum participation (Optional)"
                      placeholder="e.g. 0.5"
                      suffix={asset?.symbol}
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
                <div className="flex w-full flex-col gap-1">
                  <div className="flex w-full gap-1 overflow-hidden rounded-s border border-strong p-1" aria-hidden="true">
                    {/* Dynamic widths: founder/fee follow the live split; teal flexes over the rest. */}
                    <span className="h-6 flex-1 bg-(--color-support-teal-900)" />
                    <span
                      className="h-6 shrink-0 bg-(--color-alpha-amber-45)"
                      style={{ width: `${protocolFeePct}%` }}
                    />
                    {founderOn && founderPct > 0 && (
                      <span
                        className="h-6 shrink-0 bg-(--color-support-violet-700)"
                        style={{ width: `${founderPct}%` }}
                      />
                    )}
                  </div>
                  <div className={`flex w-full flex-wrap gap-4 ${bodyS}`}>
                    <span className="text-(--color-support-teal-300)">{priceAnchorPct}% Price anchor</span>
                    <span className="text-(--color-support-violet-300)">{founderPct}% Founder share</span>
                    <span className="text-accent">{protocolFeePct}% Protocol fee</span>
                  </div>
                </div>
                <SettingCard
                  title="Price anchor (Buy and burn)"
                  desc={`The protocol buys your token from the pool and burns it, keeping the clear price aligned with the open market. Protocol minimum: ${minAnchorPct}%.`}
                />
                <Rule />
                <div className="flex w-full flex-col gap-2">
                  <SettingCard
                    title="Founder share"
                    desc={`Sent to your address when the epoch closes. Capped at ${founderCapPct}% — anything above the protocol's ${minAnchorPct}% price-anchor minimum.`}
                    action={<Switch on={founderOn} onChange={setFounderOn} className="shrink-0" />}
                  />
                  {founderOn && (
                    <div className="flex w-full flex-col gap-2 xl:flex-row xl:gap-4">
                      <div className="xl:w-40">
                        <Input state={founderShare} placeholder="0" suffix="%" />
                      </div>
                      <div className="xl:flex-1">
                        <Input
                          state={founderReceiver}
                          placeholder="Receiver address"
                          showPaste
                          onPaste={async () => {
                            try {
                              founderReceiver.onChange((await navigator.clipboard.readText()).trim());
                            } catch {}
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <BackContinue onBack={goBack} onNext={goNext} />
          </>
        )}

        {step === "review" && (
          <>
            <StepHeader title="Distribution review" index={3} />
            <div className="flex w-full flex-col gap-4">
              <ReviewSection
                title="Supply and backing"
                onChange={() => setStep("supply")}
                rows={[
                  ["Supply to distribute:", `${toDistribute.value || "0"} ${token.symbol}`],
                  ["Initial liquidity:", `${liquidity.value || "0"} ${asset?.symbol ?? ""}`],
                  [
                    "Initial price:",
                    initialPrice !== null
                      ? `1 ${token.symbol} = ${fmtPrice(initialPrice)} ${asset?.symbol ?? ""}`
                      : "—",
                  ],
                  [
                    "Tokenomics:",
                    token.totalSupply > 0n
                      ? `${((distributedNum / Number(formatUnits(token.totalSupply, token.decimals))) * 100).toFixed(2)}% public distribution`
                      : "—",
                  ],
                ]}
              />
              <Rule />
              <ReviewSection
                title="Release strategy"
                onChange={() => setStep("release")}
                rows={[
                  ["Release starts at:", `${startDate.value} ${startTime.value} UTC`],
                  [
                    "Release ends at:",
                    releaseTypeIdx === 0
                      ? endDate.value
                        ? `${endDate.value} ${startTime.value} UTC`
                        : "—"
                      : epochBasedEndMs
                        ? fmtDateTimeUtc(epochBasedEndMs)
                        : "—",
                  ],
                  ["Number of epochs:", `${epochsCount}`],
                  ["Release per epoch:", `${roundUnits(releasePerEpoch, token.decimals)} ${token.symbol}`],
                  ["Release type:", releaseTypeIdx === 0 ? "Time-based" : "Epoch-based"],
                  ["Epoch duration:", epochDurationInput.value],
                ]}
              />
              <Rule />
              <ReviewSection
                title="Rules"
                onChange={() => setStep("rules")}
                rows={[
                  ["Minimum participation:", minParticipation.value || "None"],
                  ["Claim delay:", `${claimDelay.value || "0"} DAYS`],
                  ["Allowlist:", "No one"],
                  ...(founderOn
                    ? ([
                        [
                          "Founder receiver:",
                          founderReceiver.value ? shortAddress(founderReceiver.value) : "—",
                        ],
                      ] as [string, string][])
                    : []),
                ]}
              />
              <Rule />
              <ReviewSection
                title="Fund split"
                rows={[
                  ["Price anchor:", `${split.priceAnchorPct}%`],
                  ["Founder share:", `${split.founderSharePct}%`],
                  ["Protocol fee:", `${split.protocolFeePct}%`],
                ]}
              />
            </div>
            <BackContinue onBack={goBack} onNext={onConfirm} nextLabel="Confirm" />
          </>
        )}
      </div>
    </WizardShell>
  );
};

const parseUTCToTimestampSec = (date: string, time?: string) => {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time ? time.split(":").map(Number) : [0, 0];
  const utcDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0));
  return BigInt(Math.floor(utcDate.getTime() / 1000));
};

const fmtPrice = (n: number) =>
  n.toLocaleString("en-US", { maximumFractionDigits: 6 });

const fmtDateTimeUtc = (ms: number) =>
  `${new Date(ms).toISOString().slice(0, 16).replace("T", " ")} UTC`;

const shortAddress = (a: string) =>
  a.length > 10 ? `${a.slice(0, 6)}…${a.slice(-4)}` : a;

// Pulls the human reason out of a viem contract error so users see why a tx failed.
const revertReason = (e: unknown): string => {
  const err = e as { shortMessage?: string; message?: string };
  const msg = err.shortMessage ?? err.message ?? String(e);
  const afterReason = msg.match(/reason:\s*([^\n]+)/);
  if (afterReason) return afterReason[1].trim();
  return msg.split("\n")[0];
};

export default DistributeWizard;
