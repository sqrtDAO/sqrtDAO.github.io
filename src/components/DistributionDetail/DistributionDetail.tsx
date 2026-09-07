"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  IconLoader2,
  IconMessageCircleQuestion,
  IconShare,
  IconSquareRoundedCheckFilled,
} from "@tabler/icons-react";
import { type Address, formatUnits, maxUint256, parseUnits } from "viem";
import {
  useAccount,
  useChainId,
  useWalletClient,
  usePublicClient,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import NetworkTag from "@/components/NetworkTag/NetworkTag";
import AddressTag from "@/components/AddressTag/AddressTag";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import EpochBlockChart from "@/components/EpochBlockChart/EpochBlockChart";
import FaqCard from "@/components/FaqCard/FaqCard";
import InsideFooter from "@/components/InsideFooter/InsideFooter";
import Status, { type DistributionStatus } from "@/components/Status/Status";
import ParticipationFlow, {
  ParticipationReviewDialog,
  type ParticipateState,
} from "@/components/ParticipationFlow/ParticipationFlow";
import { useDistributorData } from "@/hooks/useDistributorData";
import useTokenAvatar from "@/hooks/useTokenAvatar";
import type {
  DistributionState,
  DistributorContractInfo,
  EpochInfo,
} from "@/hooks/useDistributorData";
import type { EpochData } from "@/lib/charts/types";
import "@/components/DistributionWizard/DistributionWizard.css";
import "./DistributionDetail.css";
import {
  getDistributorV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { distributorV1Abi, tokenV1Abi } from "@/contracts/abis";
import { getAddresses } from "@/contracts/contract-addresses";
import { useInput } from "@/hooks/useInput";
import { decimalOnlyModifier, numberOnlyModifier } from "@/utils/modifier";
import { validateAll, type InputValidator } from "@/utils/validator";
import { formatDate } from "@/utils/formatDate";
import { formatDuration } from "@/utils/formatDuration";
import { showToast } from "@/hooks/useToast";
import { isUserRejectedError } from "@/utils/wallet-error";
import { viewTransactionAction } from "@/utils/explorer-utils";
import { fmtInt } from "@/utils/formatInt";
import { roundUnits, unitsToNumber } from "@/utils/round-units";

const EpochComboChart = dynamic(
  () => import("@/components/EpochComboChart/EpochComboChart"),
  {
    ssr: false,
  },
);

const STATE_TO_STATUS: Record<DistributionState, DistributionStatus> = {
  waiting: "upcoming",
  running: "live",
  ended: "ended",
};

const FAQ_ITEMS = [
  {
    q: "What am I actually getting when I participate?",
    a: "You're putting in fund to take part in an epoch — a timed window. When the epoch closes, that epoch's token supply is split among everyone who took part, proportional to how much each person put in. You're not buying at a listed price; your share is calculated at the close.",
  },
  {
    q: "Why don't I see a price before I participate?",
    a: "There isn't one yet. Every participant in an epoch gets the same clear price, set only once that epoch closes — so nobody can front-run the price by watching a live feed.",
  },
  {
    q: "Am I better off going early or late?",
    a: "Neither is guaranteed. Clear price depends on how much total volume the epoch attracts, not on when you put your funds in — timing within an epoch doesn't change your share.",
  },
  {
    q: "Can the founder take the money and disappear?",
    a: "No. Backing is locked into the epoch fund split shown here and can't be pulled early — the founder's own share, if any, is capped and set before launch. It can't change.",
  },
  {
    q: "When can I get my tokens?",
    a: "As soon as the epoch you participated in closes and clears, your share of that epoch's token supply becomes claimable from the participation card.",
  },
  {
    q: "What happens when all the epochs are done?",
    a: "The distribution ends — remaining supply has all been released across the schedule, and the token trades freely from there.",
  },
];

const BLOCK_LEGEND = [
  {
    swatch: "var(--color-charts-epochs-500)",
    label: "Participated (more vol → lighter)",
  },
  { swatch: "var(--sqrt-action-primary-rest)", label: "Current" },
  { swatch: "var(--color-alpha-steel-08)", label: "No participation" },
];

function useCountdown(endTimestamp: number) {
  const [remaining, setRemaining] = useState(0);
  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, endTimestamp - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [endTimestamp]);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

function InlineStat({
  label,
  value,
  valueFirst,
  danger,
}: {
  label: string;
  value: string;
  valueFirst?: boolean;
  danger?: boolean;
}) {
  const labelEl = (
    <span key="label" className="ddp-inline-stat__label">
      {label}
    </span>
  );
  const valueEl = (
    <span
      key="value"
      className={`ddp-inline-stat__value${danger ? " ddp-inline-stat__value--danger" : ""}`}
    >
      {value}
    </span>
  );
  return (
    <div className="ddp-inline-stat">
      {valueFirst ? [valueEl, labelEl] : [labelEl, valueEl]}
    </div>
  );
}

function CountdownClock({
  value,
}: {
  value: { days: number; hours: number; minutes: number; seconds: number };
}) {
  return (
    <div className="ddp-countdown-clock">
      <div className="ddp-countdown-segment">
        <strong>{value.days}</strong>
        <span>D</span>
      </div>
      <span className="ddp-countdown-divider" />
      <div className="ddp-countdown-segment">
        <strong>{value.hours}</strong>
        <span>H</span>
      </div>
      <span className="ddp-countdown-divider" />
      <div className="ddp-countdown-segment">
        <strong>{value.minutes}</strong>
        <span>M</span>
      </div>
      <span className="ddp-countdown-divider" />
      <div className="ddp-countdown-segment">
        <strong>{value.seconds}</strong>
        <span>S</span>
      </div>
    </div>
  );
}

function PeriodLabel({
  title,
  prefix,
  value,
}: {
  title: string;
  prefix: string;
  value: string;
}) {
  return (
    <div className="ddp-countdown-label">
      <span>{title}</span>
      <div className="ddp-countdown-sub">
        <span>{prefix}</span>
        <span className="ddp-countdown-sub__value">{value}</span>
      </div>
    </div>
  );
}

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function fmtEpochDate(timestamp: number, withTime: boolean): string {
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  if (withTime) {
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${day} ${month}, ${time}`;
  }
  return `${day} ${month}, ${d.getFullYear()}`;
}

// "distribution period" / "starts in" label, e.g. "12:45, 21 June, 2026" —
// reuses the shared formatDate util (full month name + year) for the date
// half, distinct from fmtEpochDate above which the epoch card still uses.
function fmtPeriodDateTime(timestampMs: number): string {
  const time = new Date(timestampMs).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  return `${time}, ${formatDate(timestampMs)}`;
}

// Short form for the participation button's "Starts 21 Jun!" label.
function fmtShortDate(timestampMs: number): string {
  const d = new Date(timestampMs);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

function buildEpochs(
  contractInfo: DistributorContractInfo,
  currentEpoch: bigint,
  epochInfo: readonly EpochInfo[] | undefined,
  epochsFrom: bigint,
  distributionDecimals: number,
  participationDecimals: number,
): EpochData[] {
  if (!epochInfo || epochInfo.length === 0) return [];
  const numberOfEpochs = Number(contractInfo.numberOfEpochs);
  const epochDurationSec = Number(contractInfo.epochDuration);
  const startingTimestampSec = Number(contractInfo.startingTimestamp);
  const totalDistribution = Number(
    formatUnits(contractInfo.totalDistributionAmount, distributionDecimals),
  );
  const supplyPerEpoch =
    numberOfEpochs > 0 ? totalDistribution / numberOfEpochs : 0;
  const supplyPerEpochAmount =
    contractInfo.numberOfEpochs > 0n
      ? contractInfo.totalDistributionAmount / contractInfo.numberOfEpochs
      : 0n;
  // when the distribution has ended, currentEpoch >= numberOfEpochs and
  // every epoch correctly lands on "passed"
  const currentIdx = Number(currentEpoch);
  const fromIdx = Number(epochsFrom);

  // only the fetched window is built — huge distributions render their
  // recent slice instead of materializing every epoch
  const epochs: EpochData[] = [];
  for (let i = 0; i < epochInfo.length; i++) {
    const idx = fromIdx + i;
    const state: "passed" | "current" | "future" =
      idx < currentIdx ? "passed" : idx === currentIdx ? "current" : "future";
    const timestamp = (startingTimestampSec + idx * epochDurationSec) * 1000;
    const info = epochInfo[i];
    const volume = unitsToNumber(
      info.totalParticipationAmount,
      participationDecimals,
    );
    const rewardAmount = unitsToNumber(info.rewardAmount, distributionDecimals);
    const supply = rewardAmount > 0 ? rewardAmount : supplyPerEpoch;
    const supplyAmount =
      info.rewardAmount > 0n ? info.rewardAmount : supplyPerEpochAmount;
    const clearPrice =
      state === "passed" && volume > 0 && rewardAmount > 0
        ? rewardAmount / volume
        : null;

    epochs.push({
      epoch: idx + 1,
      state,
      participationAmount: info.totalParticipationAmount,
      clearPrice,
      supply,
      supplyAmount,
      participants: Number(info.uniqueParticipants),
      participated: false,
      timestamp,
    });
  }
  return epochs;
}

function computeShares(
  contractInfo: DistributorContractInfo,
  chainId: number,
): {
  priceAnchorPct: number;
  founderSharePct: number;
  protocolFeePct: number;
} {
  const shares = contractInfo.shares;
  const addresses = getAddresses(chainId);

  // detects price anchor hook from contract address
  const priceAnchor = shares.find(
    (e) => e.hook.contractAddress === addresses.buyAndBurnHook,
  );
  const priceAnchorPct = Math.round(
    priceAnchor ? Number(priceAnchor.shareBps) / 100 : 0,
  );

  // protocol fee is always last one because factory contract injects it
  const protocolFeePct =
    Math.round(Number(shares[shares.length - 1].shareBps)) / 100;

  // contract checks if bps s sum up to 100% so we can do this
  const founderSharePct = 100 - (protocolFeePct + priceAnchorPct);

  return {
    priceAnchorPct,
    founderSharePct,
    protocolFeePct,
  };
}

export default function DistributionDetail({
  contractAddress,
}: {
  contractAddress: string;
}) {
  const chainId = useChainId();

  const {
    state,
    contractInfo,
    currentEpoch,
    epochsInfo,
    epochsFrom,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    claimData,
    participationTokenSymbol,
    participationTokenDecimals,
    participationTokenBalance,
    isLoading,
    refetch,
  } = useDistributorData(contractAddress as Address);

  const tokenAvatarUrl = useTokenAvatar(
    contractInfo?.distributionToken,
    chainId,
  );

  const { isConnected: isWalletConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { openConnectModal } = useConnectModal();
  const [epochs, setEpochs] = useState<EpochData[]>([]);
  const [activeFaq, setActiveFaq] = useState(0);
  const [hoveredEpoch, setHoveredEpoch] = useState<EpochData | null>(null);
  const [claimState, setClaimState] = useState<
    "idle" | "claiming" | "done" | "error"
  >("idle");
  const [participateState, setParticipateState] =
    useState<ParticipateState>("idle");
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [amountFocused, setAmountFocused] = useState(false);
  const [epochsExpanded, setEpochsExpanded] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // epoch numbers are 1-based in the UI; the contract's participate() takes
  // the 0-based index, so fromEpochNum - 1 is passed on-chain
  const currentEpochDisplay =
    currentEpoch !== undefined ? Number(currentEpoch) + 1 : null;
  const lastEpoch = contractInfo ? Number(contractInfo.numberOfEpochs) : 0;

  const validateFromEpoch = useMemo<InputValidator>(
    () => (v) => {
      if (currentEpochDisplay === null || lastEpoch === 0) return null;
      if (v.trim() === "") return "Required";
      const n = parseInt(v, 10);
      if (isNaN(n)) return "Invalid epoch";
      if (n < currentEpochDisplay)
        return `Cannot be before epoch #${currentEpochDisplay}`;
      if (n > lastEpoch) return `Max epoch is #${lastEpoch}`;
      return null;
    },
    [currentEpochDisplay, lastEpoch],
  );

  const fromEpochInput = useInput("", numberOnlyModifier, validateFromEpoch);

  const fromEpochNum = useMemo(() => {
    const n = parseInt(fromEpochInput.value, 10);
    if (isNaN(n) || n < 1) return currentEpochDisplay ?? 1;
    return n;
  }, [fromEpochInput.value, currentEpochDisplay]);

  const validateToEpoch = useMemo<InputValidator>(
    () => (v) => {
      if (lastEpoch === 0) return null;
      if (v.trim() === "") return "Required";
      const n = parseInt(v, 10);
      if (isNaN(n)) return "Invalid epoch";
      if (n < fromEpochNum) return `Cannot be before epoch #${fromEpochNum}`;
      if (n > lastEpoch) return `Max epoch is #${lastEpoch}`;
      return null;
    },
    [lastEpoch, fromEpochNum],
  );

  const toEpochInput = useInput("", numberOnlyModifier, validateToEpoch);

  const toEpochNum = useMemo(() => {
    const n = parseInt(toEpochInput.value, 10);
    if (isNaN(n) || n < fromEpochNum) return fromEpochNum;
    return n;
  }, [toEpochInput.value, fromEpochNum]);

  const epochCountNum = toEpochNum - fromEpochNum + 1;

  const amountIssues = useCallback(
    (parsed: bigint): string | null => {
      if (
        contractInfo &&
        contractInfo.minParticipation > 0n &&
        parsed / BigInt(epochCountNum) < contractInfo.minParticipation
      ) {
        return `Minimum participation is ${roundUnits(
          contractInfo.minParticipation,
          participationTokenDecimals ?? 18,
        )} ${participationTokenSymbol ?? ""} per epoch`;
      }
      if (
        isWalletConnected &&
        participationTokenBalance !== undefined &&
        parsed > participationTokenBalance
      ) {
        return "Amount exceeds your wallet balance";
      }
      return null;
    },
    [
      contractInfo,
      epochCountNum,
      participationTokenDecimals,
      participationTokenSymbol,
      isWalletConnected,
      participationTokenBalance,
    ],
  );

  const validateAmount = useMemo<InputValidator>(
    () => (v) => {
      const t = v.trim();
      if (t === "") return "Required";
      let parsed: bigint;
      try {
        parsed = parseUnits(t, participationTokenDecimals ?? 18);
      } catch {
        return "Invalid amount";
      }
      if (parsed === 0n) return "Must be greater than 0";
      return amountIssues(parsed);
    },
    [amountIssues, participationTokenDecimals],
  );

  const amountInput = useInput("", decimalOnlyModifier, validateAmount);

  // parse errors surface on submit only; min/balance issues show live
  const amountParsed = useMemo<bigint | null>(() => {
    try {
      return parseUnits(
        amountInput.value.trim(),
        participationTokenDecimals ?? 18,
      );
    } catch {
      return null;
    }
  }, [amountInput.value, participationTokenDecimals]);
  const amountLimitError =
    amountParsed !== null ? amountIssues(amountParsed) : null;

  // default the range to the current epoch once on-chain data is in —
  // clamped to the last epoch so ended distributions don't default out
  // of range
  useEffect(() => {
    if (currentEpochDisplay === null || lastEpoch === 0) return;
    const defaultEpoch = String(Math.min(currentEpochDisplay, lastEpoch));
    if (fromEpochInput.value === "") fromEpochInput.onChange(defaultEpoch);
    if (toEpochInput.value === "") toEpochInput.onChange(defaultEpoch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpochDisplay, lastEpoch]);

  const handleShare = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        showToast("copy.link");
        setShareCopied(true);
        if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
        shareTimeoutRef.current = setTimeout(() => setShareCopied(false), 1500);
      })
      .catch(() => showToast("generic.error"));
  }, []);

  useEffect(
    () => () => {
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
    },
    [],
  );

  useEffect(() => {
    if (isLoading) return;

    if (contractInfo && currentEpoch !== undefined) {
      const built = buildEpochs(
        contractInfo,
        currentEpoch,
        epochsInfo,
        epochsFrom,
        tokenDecimals ?? 18,
        participationTokenDecimals ?? 18,
      );
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEpochs(built);
    }
  }, [
    isLoading,
    contractInfo,
    currentEpoch,
    epochsInfo,
    epochsFrom,
    tokenDecimals,
    participationTokenDecimals,
  ]);

  const [endTimestampMs, setEndTimestampMs] = useState(0);
  useEffect(() => {
    if (!contractInfo) return;
    const endSec =
      Number(contractInfo.startingTimestamp) +
      Number(contractInfo.numberOfEpochs) * Number(contractInfo.epochDuration);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEndTimestampMs(endSec * 1000);
  }, [contractInfo]);

  const countdown = useCountdown(endTimestampMs);

  const startTimestampMs = useMemo(() => {
    if (!contractInfo) return 0;
    return Number(contractInfo.startingTimestamp) * 1000;
  }, [contractInfo]);
  const startCountdown = useCountdown(startTimestampMs);

  const epochDurationLabel = useMemo(() => {
    if (!contractInfo) return "—";
    return formatDuration(Number(contractInfo.epochDuration));
  }, [contractInfo]);

  const currentEpochEndMs = useMemo(() => {
    if (!contractInfo || currentEpoch === undefined) return 0;
    return (
      Number(
        contractInfo.startingTimestamp +
          (currentEpoch + 1n) * contractInfo.epochDuration,
      ) * 1000
    );
  }, [contractInfo, currentEpoch]);

  useEffect(() => {
    if (!contractInfo) return;
    const startTime = Number(contractInfo.startingTimestamp * 1000n);
    const delay = startTime - Date.now();
    if (delay < 0) return; // already started
    const id = setTimeout(() => refetch(), delay);
    return () => clearTimeout(id);
  }, [contractInfo, refetch]);

  useEffect(() => {
    if (currentEpochEndMs <= 0 || state !== "running") return;
    const delay = currentEpochEndMs - Date.now();
    if (delay <= 0) {
      refetch();
      return;
    }
    const id = setTimeout(() => refetch(), delay);
    return () => clearTimeout(id);
  }, [currentEpochEndMs, state, refetch]);

  const supplyPerEpochAmount = useMemo(() => {
    if (!contractInfo || contractInfo.numberOfEpochs === 0n) return 0n;
    return contractInfo.totalDistributionAmount / contractInfo.numberOfEpochs;
  }, [contractInfo]);

  const stats = useMemo(() => {
    // totals are derived arithmetically from contractInfo so they stay
    // correct even though only a recent epoch window is loaded/rendered
    const total = contractInfo ? Number(contractInfo.numberOfEpochs) : 0;
    const currentIdx = currentEpoch !== undefined ? Number(currentEpoch) : 0;
    const closedCount = Math.min(Math.max(currentIdx, 0), total);
    const remainingCount = total - closedCount - (state === "running" ? 1 : 0);

    // closed epochs inside the fetched window contribute their actual
    // reward; anything older falls back to the flat per-epoch supply
    const closedInWindow = Math.min(
      Math.max(closedCount - Number(epochsFrom), 0),
      epochsInfo?.length ?? 0,
    );
    let windowClosedSupply = 0n;
    if (epochsInfo) {
      for (let i = 0; i < closedInWindow; i++) {
        windowClosedSupply +=
          epochsInfo[i].rewardAmount > 0n
            ? epochsInfo[i].rewardAmount
            : supplyPerEpochAmount;
      }
    }

    const closed = epochs.filter((e) => e.state === "passed");
    const last = closed.length > 0 ? closed[closed.length - 1] : null;
    return {
      totalEpochs: total,
      closedCount,
      epochsLeft: remainingCount,
      distributedSupplyAmount:
        BigInt(closedCount - closedInWindow) * supplyPerEpochAmount +
        windowClosedSupply,
      totalSupplyAmount: contractInfo?.totalDistributionAmount ?? 0n,
      totalParticipation: contractInfo?.totalParticipation ?? 0n,
      uniqueParticipants: contractInfo?.totalUniqueParticipants ?? 0n,
      // released = closed epochs; current + future are not (0 once ended)
      supplyRemainingAmount: supplyPerEpochAmount * BigInt(remainingCount),
      current: epochs.find((e) => e.state === "current") ?? null,
      last,
      lastClearPrice: last?.clearPrice ?? null,
    };
  }, [
    epochs,
    epochsInfo,
    epochsFrom,
    supplyPerEpochAmount,
    contractInfo,
    currentEpoch,
    state,
  ]);

  const sharesPct = useMemo(() => {
    if (!contractInfo)
      return { priceAnchorPct: 0, founderSharePct: 0, protocolFeePct: 0 };
    return computeShares(contractInfo, chainId);
  }, [contractInfo, chainId]);

  const isHovering = hoveredEpoch != null;
  const displayEpoch = hoveredEpoch ?? stats.current ?? stats.last ?? null;
  const displayClearPrice = isHovering
    ? (displayEpoch?.clearPrice ?? stats.lastClearPrice)
    : stats.lastClearPrice;
  const displayParticipationAmount = displayEpoch?.participationAmount ?? 0n;
  const displayParticipants = displayEpoch?.participants ?? 0;

  const amountNum = Number(amountInput.value);
  const perEpochAmount = amountNum > 0 ? amountNum / epochCountNum : 0;

  const hasClaimableShare =
    claimState === "done" || (claimData?.claimableAmount ?? 0n) > 0n;

  const walletBalanceFormatted = useMemo(() => {
    if (participationTokenBalance === undefined || !participationTokenDecimals)
      return 0;
    return Number(
      formatUnits(participationTokenBalance, participationTokenDecimals),
    );
  }, [participationTokenBalance, participationTokenDecimals]);
  const showWalletBalance =
    (amountInput.value !== "" || amountFocused) && isWalletConnected;

  const claimDelayDays = contractInfo
    ? Math.round(Number(contractInfo.claimDelaySeconds) / 86400)
    : 0;

  // end of the last epoch in the selected range, plus the claim delay
  const claimAvailableMs = useMemo(() => {
    if (!contractInfo) return 0;
    const lastEpochEndSec =
      Number(contractInfo.startingTimestamp) +
      toEpochNum * Number(contractInfo.epochDuration);
    return (lastEpochEndSec + Number(contractInfo.claimDelaySeconds)) * 1000;
  }, [contractInfo, toEpochNum]);

  const handleClaim = useCallback(async () => {
    if (!walletClient || !publicClient || !contractInfo || !claimData) return;

    if (claimData.claimableAmount === BigInt(0)) {
      showToast("claim.nothing");
      return;
    }

    const distributor = getDistributorV1Contract(
      walletClient,
      contractAddress as Address,
    );

    const toastId = `claim-${contractAddress}`;
    setClaimState("claiming");
    showToast("claim.pending", {
      id: toastId,
      params: { symbol: tokenSymbol ?? "" },
    });
    try {
      const claimParams = claimData!.ranges.map((r) => {
        return {
          user: walletClient.account.address!,
          range: { from: r.from, length: r.to - r.from + BigInt(1) },
        };
      });
      const claimTx = await distributor.write.claimMany([claimParams], {
        account: walletClient.account,
        chain: walletClient.chain,
      });
      const claimReceipt = await publicClient.waitForTransactionReceipt({
        hash: claimTx,
      });
      if (claimReceipt.status === "reverted") {
        showToast("claim.failed", {
          id: toastId,
          action: viewTransactionAction(chainId, claimTx),
        });
        setClaimState("error");
        return;
      }

      showToast("claim.success", {
        id: toastId,
        params: {
          amount: roundUnits(claimData.claimableAmount, tokenDecimals ?? 18),
          symbol: tokenSymbol ?? "",
        },
        action: viewTransactionAction(chainId, claimTx),
      });

      setClaimState("done");
      refetch();
    } catch (e) {
      console.error("Claim failed:", e);
      showToast(isUserRejectedError(e) ? "claim.rejected" : "claim.failed", {
        id: toastId,
      });
      setClaimState("error");
    }
  }, [
    walletClient,
    publicClient,
    contractInfo,
    contractAddress,
    refetch,
    claimData,
    chainId,
    tokenSymbol,
    tokenDecimals,
  ]);

  const canParticipate =
    isWalletConnected &&
    state === "running" &&
    amountNum > 0 &&
    amountLimitError === null &&
    participateState !== "approving" &&
    participateState !== "participating";
  const isParticipating =
    participateState === "approving" || participateState === "participating";
  const participateLabel = !isWalletConnected
    ? "Connect wallet"
    : isParticipating
      ? participateState === "approving"
        ? "Approving..."
        : "Participating..."
      : canParticipate
        ? `Participate in ${epochCountNum} epoch${epochCountNum > 1 ? "s" : ""}`
        : "Participate";

  const handleParticipateClick = async () => {
    if (!isWalletConnected) {
      openConnectModal?.();
      return;
    }
    if (!validateAll(amountInput, fromEpochInput, toEpochInput)) return;
    if (
      !walletClient ||
      !publicClient ||
      !contractInfo ||
      !participationTokenDecimals
    )
      return;

    const toastId = `participate-${contractAddress}`;

    try {
      setParticipateState("approving");
      showToast("participate.pending", {
        id: toastId,
        params: { epoch: fromEpochNum },
      });

      const totalAmount = parseUnits(
        amountInput.value,
        participationTokenDecimals,
      );
      const amountPerEpoch = totalAmount / BigInt(epochCountNum);

      const pToken = getTokenV1Contract(
        walletClient,
        contractInfo.participationToken,
      );
      const allowance = await pToken.read.allowance([
        walletClient.account.address,
        contractAddress as Address,
      ]);
      if (allowance < totalAmount) {
        await publicClient!.simulateContract({
          address: contractInfo.participationToken,
          abi: tokenV1Abi,
          functionName: "approve",
          args: [contractAddress as Address, maxUint256],
          account: walletClient.account.address,
        });
        const approveTx = await pToken.write.approve(
          [contractAddress as Address, maxUint256],
          { account: walletClient.account, chain: walletClient.chain },
        );
        const approveReceipt = await publicClient!.waitForTransactionReceipt({
          hash: approveTx,
        });

        if (approveReceipt.status === "reverted") {
          showToast("approve.failed", {
            id: toastId,
            action: viewTransactionAction(chainId, approveTx),
          });
          setParticipateState("error");
          return;
        }
      }

      setParticipateState("participating");

      const distributor = getDistributorV1Contract(
        walletClient,
        contractAddress as Address,
      );
      const params = [
        amountPerEpoch,
        { from: BigInt(fromEpochNum - 1), length: BigInt(epochCountNum) },
        walletClient.account.address,
        "0x",
      ] as const;
      await publicClient!.simulateContract({
        address: contractAddress as Address,
        abi: distributorV1Abi,
        functionName: "participate",
        args: params,
        account: walletClient.account.address,
      });
      const participateTx = await distributor.write.participate(params, {
        account: walletClient.account,
        chain: walletClient.chain,
      });
      const participateReceipt = await publicClient!.waitForTransactionReceipt({
        hash: participateTx,
      });
      if (participateReceipt.status === "reverted") {
        showToast("participate.failed", {
          id: toastId,
          action: viewTransactionAction(chainId, participateTx),
        });
        setParticipateState("error");
        return;
      }
      const action = viewTransactionAction(chainId, participateTx);
      if (epochCountNum > 1) {
        showToast("participate.multiSuccess", {
          id: toastId,
          params: {
            n: epochCountNum,
            first: fromEpochNum,
            last: toEpochNum,
          },
          action,
        });
      } else {
        showToast("participate.success", {
          id: toastId,
          params: { epoch: fromEpochNum },
          action,
        });
      }

      setParticipateState("idle");
      amountInput.reset();
      const nextEpoch = String(toEpochNum + 1);
      fromEpochInput.onChange(nextEpoch);
      toEpochInput.onChange(nextEpoch);
      setEpochsExpanded(false);
      setConfirmOpen(false);
      refetch();
    } catch (e) {
      console.error("Participate failed:", e);
      showToast(
        isUserRejectedError(e) ? "participate.rejected" : "participate.failed",
        { id: toastId },
      );
      setParticipateState("error");
    }
  };

  const handleParticipateReview = () => {
    if (!isWalletConnected) {
      openConnectModal?.();
      return;
    }
    if (!validateAll(amountInput, fromEpochInput, toEpochInput)) return;
    setConfirmOpen(true);
  };

  const handleMobileParticipateClick = () => {
    if (!isWalletConnected) {
      openConnectModal?.();
      return;
    }
    setDialogueOpen(true);
  };

  const isInteractive = state === "running";
  const submitLabel = isInteractive
    ? participateLabel
    : state === "waiting"
      ? `Starts ${fmtShortDate(startTimestampMs)}!`
      : "Distribution is finished!";

  const claimCard =
    isWalletConnected && hasClaimableShare ? (
      <div className="ddp-claim-card">
        <h2>Ready to claim</h2>
        {claimState === "done" ? (
          <div className="ddp-claim-card__done">
            <IconSquareRoundedCheckFilled size={20} />
            Claim share done successfully.
          </div>
        ) : (
          <>
            <div className="ddp-claim-card__amount">
              <span>
                {roundUnits(
                  claimData?.claimableAmount ?? BigInt(0),
                  tokenDecimals ?? 18,
                )}
              </span>
              <span className="ddp-claim-card__unit">{tokenSymbol}</span>
            </div>
            {claimState === "error" && (
              <p className="ddp-claim-card__error">
                Claim failed. Please try again.
              </p>
            )}
            <Button
              variant="primary"
              size="m"
              fullWidth
              className="ddp-claim-card__button"
              disabled={
                claimState === "claiming" ||
                (claimData?.claimableAmount ?? 0) === BigInt(0)
              }
              leadingIcon={
                claimState === "claiming" ? <IconLoader2 size={18} /> : undefined
              }
              onClick={handleClaim}
            >
              {claimState === "claiming" ? "Processing" : "Claim all"}
            </Button>
          </>
        )}
      </div>
    ) : null;

  const participationFlowProps = {
    amount: amountInput,
    amountLiveError: amountLimitError,
    showWalletBalance,
    walletBalanceFormatted,
    participationTokenSymbol: participationTokenSymbol ?? "",
    fromEpoch: fromEpochInput,
    toEpoch: toEpochInput,
    fromEpochNum,
    toEpochNum,
    lastEpoch,
    perEpochAmount,
    claimDelayDays,
    epochsExpanded,
    onEpochsExpanded: setEpochsExpanded,
    onAmountFocus: setAmountFocused,
    ctaLabel: participateLabel,
    ctaDisabled: isWalletConnected && !canParticipate,
    onCtaClick: handleParticipateReview,
  };

  if (isLoading) {
    return (
      <div className="ddp">
        <div className="ddp-chrome">
          <Header />
          <TestnetRibbon />
        </div>
        <div
          className="ddp-body"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 400,
          }}
        >
          <IconLoader2 size={32} className="ddp-loading" />
        </div>
      </div>
    );
  }

  return (
    <div className="ddp">
      <div className="ddp-chrome">
        <Header />
        <TestnetRibbon />
      </div>

      <div className="ddp-body">
        <div className="ddp-columns">
          <div className="ddp-left">
            <section className="ddp-token-header">
              <div className="ddp-token-header__row1">
                <TokenAvatar
                  seed={`${tokenName} ${tokenSymbol}`}
                  imageUrl={tokenAvatarUrl ?? undefined}
                  className="ddp-token-header__avatar"
                />
                <div className="ddp-token-header__info">
                  <div className="ddp-token-header__name-row">
                    <h1>{tokenName}</h1>
                    <span className="ddp-ticker">{tokenSymbol}</span>
                    {state && (
                      <Status
                        status={STATE_TO_STATUS[state]}
                        className="ddp-token-header__status"
                      />
                    )}
                  </div>
                  <div className="ddp-token-header__creator ddp-token-header__creator--desktop">
                    <span>Created by</span>
                    <AddressTag value={contractInfo?.creator ?? "?"} />
                  </div>
                </div>
                <NetworkTag />
              </div>
              <div className="ddp-token-header__row2">
                <div className="ddp-token-header__creator ddp-token-header__creator--mobile">
                  <span className="ddp-token-header__contract-label">
                    Created by
                  </span>
                  <AddressTag value={contractInfo?.creator ?? "?"} />
                </div>
                <div className="ddp-token-header__contract">
                  <span className="ddp-token-header__contract-label">
                    Contract address
                  </span>
                  <AddressTag value={contractAddress ?? "0xfd9...jd87w"} />
                </div>
                <Button
                  variant="outline"
                  size="m"
                  leadingIcon={<IconShare size={16} strokeWidth={1.75} />}
                  className="ddp-token-header__share"
                  onClick={handleShare}
                >
                  {shareCopied ? "Copied!" : "Share"}
                </Button>
                <IconButton
                  icon={<IconShare size={24} strokeWidth={1.75} />}
                  variant="outline"
                  size="m"
                  aria-label="Share"
                  className="ddp-token-header__share-icon"
                  onClick={handleShare}
                />
              </div>
            </section>

            <div className="ddp-main-content">
              <section className="ddp-summary">
                {state !== "waiting" && (
                  <div className="ddp-summary-row">
                    <div className="ddp-stat">
                      <span className="ddp-stat__label">
                        Distributed supply
                      </span>
                      <div className="ddp-stat__value-row">
                        <span className="ddp-stat__value-primary">
                          {roundUnits(
                            stats.distributedSupplyAmount,
                            tokenDecimals ?? 18,
                          )}
                        </span>
                        <span className="ddp-stat__slash">/</span>
                        <span className="ddp-stat__value-secondary">
                          {roundUnits(
                            stats.totalSupplyAmount,
                            tokenDecimals ?? 18,
                          )}
                        </span>
                        <span className="ddp-stat__unit">{tokenSymbol}</span>
                      </div>
                    </div>
                    <div className="ddp-stat">
                      <span className="ddp-stat__label">
                        Total participation
                      </span>
                      <div className="ddp-stat__value-row">
                        <span className="ddp-stat__value-primary">
                          {roundUnits(
                            stats.totalParticipation,
                            participationTokenDecimals ?? 18,
                          )}
                        </span>
                        <span className="ddp-stat__unit">
                          {participationTokenSymbol}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {state === "waiting" ? (
                  <div className="ddp-countdown-row">
                    <PeriodLabel
                      title="Distribution starts in"
                      prefix="Starts"
                      value={fmtPeriodDateTime(startTimestampMs)}
                    />
                    <CountdownClock value={startCountdown} />
                  </div>
                ) : state === "ended" ? (
                  <div className="ddp-countdown-row">
                    <PeriodLabel
                      title="Distribution period"
                      prefix="Ends"
                      value={fmtPeriodDateTime(endTimestampMs)}
                    />
                    <p className="ddp-countdown-finished">
                      This distribution is finished!
                    </p>
                  </div>
                ) : (
                  <div className="ddp-countdown-row">
                    <PeriodLabel
                      title="Distribution period"
                      prefix="Ends"
                      value={fmtPeriodDateTime(endTimestampMs)}
                    />
                    <CountdownClock value={countdown} />
                  </div>
                )}

                {isInteractive ? (
                  <Button
                    variant="primary"
                    size="m"
                    fullWidth
                    className="ddp-summary__participate"
                    onClick={handleMobileParticipateClick}
                  >
                    {participateLabel}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="m"
                    fullWidth
                    className="ddp-summary__participate ddp-summary__participate--muted"
                    onClick={() => setDialogueOpen(true)}
                  >
                    {submitLabel}
                  </Button>
                )}
              </section>

              <section className="ddp-epochs-data">
                <div className="ddp-block-card">
                  <div className="ddp-block-card__stats-top">
                    <InlineStat
                      label="Total epochs"
                      value={fmtInt(stats.totalEpochs)}
                    />
                    <InlineStat
                      label="Supply per epoch (Flat release)"
                      value={`${roundUnits(supplyPerEpochAmount, tokenDecimals ?? 18)} ${tokenSymbol}`}
                    />
                    <InlineStat
                      label="Epoch duration"
                      value={epochDurationLabel}
                    />
                  </div>
                  <EpochBlockChart
                    epochs={epochs}
                    quoteSymbol={participationTokenSymbol}
                    tokenSymbol={tokenSymbol}
                    quoteDecimals={participationTokenDecimals ?? 18}
                    tokenDecimals={tokenDecimals ?? 18}
                  />
                  <div className="ddp-block-card__legend">
                    {BLOCK_LEGEND.map((item) => (
                      <span
                        key={item.label}
                        className="ddp-block-card__legend-item"
                      >
                        <span
                          className="ddp-block-card__legend-swatch"
                          style={{ background: item.swatch }}
                        />
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <div className="ddp-block-card__stats-bottom">
                    <InlineStat
                      label="Unique participants"
                      value={stats.uniqueParticipants.toString()}
                    />
                    <InlineStat
                      label="Supply remaining"
                      value={`${roundUnits(stats.supplyRemainingAmount, tokenDecimals ?? 18)} ${tokenSymbol}`}
                    />
                    <InlineStat
                      label="Epochs left"
                      value={fmtInt(stats.epochsLeft)}
                      valueFirst
                    />
                  </div>
                </div>

                {state !== "waiting" && (
                  <div className="ddp-epoch-card">
                    <div className="ddp-epoch-card__info">
                      <div className="ddp-epoch-card__data">
                        <span>
                          {isHovering
                            ? "Epoch number"
                            : state === "ended"
                              ? "Last epoch"
                              : "Current epoch"}
                        </span>
                        <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--epoch">
                          <strong className={isHovering ? "is-accent" : ""}>
                            #{displayEpoch?.epoch ?? "—"}
                          </strong>
                          <time className={isHovering ? "is-accent" : ""}>
                            {displayEpoch
                              ? fmtEpochDate(
                                  displayEpoch.timestamp,
                                  !isHovering,
                                )
                              : "—"}
                          </time>
                        </div>
                      </div>
                      <div className="ddp-epoch-card__data">
                        <span>
                          {isHovering ? "Clear price" : "Last clear price"}
                        </span>
                        <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--price">
                          <strong className={isHovering ? "is-accent" : ""}>
                            {displayClearPrice?.toFixed(4) ?? "—"}
                          </strong>
                          <span className="ddp-epoch-card__unit">
                            {participationTokenSymbol}
                          </span>
                        </div>
                      </div>
                      <div className="ddp-epoch-card__data">
                        <span>Participation this epoch</span>
                        <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--participation">
                          <strong className={isHovering ? "is-accent" : ""}>
                            {roundUnits(
                              displayParticipationAmount,
                              participationTokenDecimals ?? 18,
                            )}
                          </strong>
                          <span className="ddp-epoch-card__unit">
                            {participationTokenSymbol}
                          </span>
                          <span className="ddp-epoch-card__by">by</span>
                          <strong className={isHovering ? "is-accent" : ""}>
                            {displayParticipants}
                          </strong>
                          <span className="ddp-epoch-card__by">
                            participants
                          </span>
                        </div>
                      </div>
                      <p className="ddp-epoch-card__note">
                        The clear price is set when the epoch closes, everyone
                        in the epoch gets the same price.
                      </p>
                    </div>
                    <div className="ddp-epoch-card__chart">
                      <EpochComboChart
                        epochs={epochs}
                        quoteSymbol={participationTokenSymbol}
                        tokenSymbol={tokenSymbol}
                        quoteDecimals={participationTokenDecimals ?? 18}
                        tokenDecimals={tokenDecimals ?? 18}
                        onHoverEpoch={setHoveredEpoch}
                      />
                    </div>
                  </div>
                )}
              </section>

              <section className="ddp-faq">
                <div className="ddp-faq__body--desktop">
                  <div className="ddp-faq__header">
                    <IconMessageCircleQuestion size={32} strokeWidth={1.5} />
                    <h2>FAQ</h2>
                  </div>
                  <div className="ddp-faq__body">
                    <div className="ddp-faq__questions">
                      {FAQ_ITEMS.map((item, i) => (
                        <button
                          key={item.q}
                          type="button"
                          className={`ddp-faq__question${i === activeFaq ? " is-active" : ""}`}
                          onClick={() => setActiveFaq(i)}
                        >
                          {item.q}
                        </button>
                      ))}
                    </div>
                    <div
                      className={`ddp-faq__answer ddp-faq__answer--${
                        activeFaq === 0
                          ? "first"
                          : activeFaq === FAQ_ITEMS.length - 1
                            ? "last"
                            : "middle"
                      }`}
                    >
                      <p>{FAQ_ITEMS[activeFaq].a}</p>
                    </div>
                  </div>
                </div>

                <div className="ddp-faq__body--mobile">
                  <FaqCard
                    items={FAQ_ITEMS}
                    activeIndex={activeFaq}
                    onChange={setActiveFaq}
                  />
                </div>
              </section>
            </div>
          </div>

          <div className="ddp-right">
            <section className="ddp-fund-split">
              <div className="ddp-fund-split__header">
                <div className="ddp-fund-split__title-row">
                  <h2>Epoch fund split</h2>
                  {/* <Button variant="ghost" size="s">
                    Details
                  </Button> */}
                </div>
                <p>
                  How each epoch&apos;s funds are split. Set by the founder
                  before launch, It can&apos;t change.
                </p>
              </div>
              <div className="ddp-fund-split__chart">
                <div className="dw-chart-bar">
                  <div className="dw-chart-bar__liquidity" />
                  <div className="dw-chart-bar__fee" />
                  {sharesPct.founderSharePct > 0 && (
                    <div
                      className="dw-chart-bar__founder"
                      style={{ width: `${sharesPct.founderSharePct}%` }}
                    />
                  )}
                </div>
                <div className="dw-chart-legend">
                  <span className="dw-chart-legend__item dw-chart-legend__item--anchor">
                    {sharesPct.priceAnchorPct}% Price anchor
                  </span>
                  <span className="dw-chart-legend__item dw-chart-legend__item--founder">
                    {sharesPct.founderSharePct}% Founder share
                  </span>
                  <span className="dw-chart-legend__item dw-chart-legend__item--fee">
                    {sharesPct.protocolFeePct}% Protocol fee
                  </span>
                </div>
              </div>
            </section>

            <section className="ddp-claim-participation">
              {claimCard}
              <ParticipationFlow idPrefix="ddp" {...participationFlowProps} />
            </section>
          </div>
        </div>
      </div>

      <InsideFooter />

      {dialogueOpen && (
        <div
          className="ddp-dialogue-backdrop"
          onClick={() => setDialogueOpen(false)}
        >
          <div className="ddp-dialogue" onClick={(e) => e.stopPropagation()}>
            <div className="ddp-claim-participation">
              {claimCard}
              <ParticipationFlow
                idPrefix="ddp-dialogue"
                {...participationFlowProps}
              />
            </div>
          </div>
        </div>
      )}

      {confirmOpen && (
        <ParticipationReviewDialog
          amountText={amountInput.value}
          amountSymbol={participationTokenSymbol ?? ""}
          claimSymbol={tokenSymbol ?? ""}
          fromEpochNum={fromEpochNum}
          toEpochNum={toEpochNum}
          claimDelayDays={claimDelayDays}
          claimAvailableMs={claimAvailableMs}
          state={participateState}
          onClose={() => setConfirmOpen(false)}
          onConfirm={handleParticipateClick}
        />
      )}
    </div>
  );
}
