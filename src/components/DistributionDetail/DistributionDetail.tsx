"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import {
  IconLoader2,
  IconMessageCircleQuestion,
  IconMinus,
  IconPlus,
  IconShare,
  IconSquareRoundedCheckFilled,
} from "@tabler/icons-react";
import { type Address, formatUnits, parseUnits } from "viem";
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
import { useDistributorData } from "@/hooks/useDistributorData";
import type {
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
import { getAddresses } from "@/contracts/contract-addresses";

const EpochComboChart = dynamic(
  () => import("@/components/EpochComboChart/EpochComboChart"),
  {
    ssr: false,
  },
);

const FAQ_ITEMS = [
  {
    q: "What am I actually getting when I participate?",
    a: "You're putting in USDT to take part in an epoch — a timed window. When the epoch closes, that epoch's token supply is split among everyone who took part, proportional to how much each person put in. You're not buying at a listed price; your share is calculated at the close.",
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
    label: "Participated (more vol → darker)",
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

function fmtInt(n: number): string {
  return Math.round(n).toLocaleString("en-US");
}

function InlineStat({
  label,
  value,
  valueFirst,
}: {
  label: string;
  value: string;
  valueFirst?: boolean;
}) {
  const labelEl = (
    <span key="label" className="ddp-inline-stat__label">
      {label}
    </span>
  );
  const valueEl = (
    <span key="value" className="ddp-inline-stat__value">
      {value}
    </span>
  );
  return (
    <div className="ddp-inline-stat">
      {valueFirst ? [valueEl, labelEl] : [labelEl, valueEl]}
    </div>
  );
}

function estimateParticipants(volume: number): number {
  return volume > 0 ? Math.max(1, Math.round(volume / 870)) : 0;
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

function buildEpochs(
  contractInfo: DistributorContractInfo,
  currentEpoch: bigint,
  epochInfo: readonly EpochInfo[] | undefined,
  decimals: number,
): EpochData[] {
  const numberOfEpochs = Number(contractInfo.numberOfEpochs);
  const epochDurationSec = Number(contractInfo.epochDuration);
  const startingTimestampSec = Number(contractInfo.startingTimestamp);
  const totalDistribution = Number(
    formatUnits(contractInfo.totalDistributionAmount, decimals),
  );
  const supplyPerEpoch =
    numberOfEpochs > 0 ? totalDistribution / numberOfEpochs : 0;
  const currentIdx = Number(currentEpoch);

  const epochs: EpochData[] = [];
  for (let i = 0; i < numberOfEpochs; i++) {
    const state: "passed" | "current" | "future" =
      i < currentIdx ? "passed" : i === currentIdx ? "current" : "future";
    const timestamp = (startingTimestampSec + i * epochDurationSec) * 1000;
    const info = epochInfo?.[i];
    const participationVolume = info
      ? Number(formatUnits(info.totalParticipationAmount, decimals))
      : 0;
    const rewardAmount = info
      ? Number(formatUnits(info.rewardAmount, decimals))
      : 0;
    const supply = rewardAmount > 0 ? rewardAmount : supplyPerEpoch;
    const clearPrice =
      state === "passed" && participationVolume > 0 && rewardAmount > 0
        ? rewardAmount / participationVolume
        : null;

    epochs.push({
      epoch: i + 1,
      state,
      participationVolume,
      clearPrice,
      supply,
      participated: false,
      timestamp,
    });
  }
  return epochs;
}

function computeShares(
  contractInfo: DistributorContractInfo,
  chainId: number,
): { priceAnchorPct: number; founderSharePct: number; protocolFeePct: number } {
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
    tokenName,
    tokenSymbol,
    participationTokenSymbol,
    isLoading,
    refetch,
  } = useDistributorData(contractAddress as Address);

  const { isConnected: isWalletConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { openConnectModal } = useConnectModal();
  const [epochs, setEpochs] = useState<EpochData[]>([]);
  const [activeFaq, setActiveFaq] = useState(0);
  const [amount, setAmount] = useState("");
  const [epochCount, setEpochCount] = useState(1);
  const [hoveredEpoch, setHoveredEpoch] = useState<EpochData | null>(null);
  const [claimState, setClaimState] = useState<
    "idle" | "claiming" | "done" | "error"
  >("idle");
  const [participateState, setParticipateState] = useState<
    "idle" | "approving" | "participating" | "error"
  >("idle");
  const [dialogueOpen, setDialogueOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);
  const shareTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleShare = useCallback(() => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareCopied(true);
      if (shareTimeoutRef.current) clearTimeout(shareTimeoutRef.current);
      shareTimeoutRef.current = setTimeout(() => setShareCopied(false), 1500);
    });
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
      const built = buildEpochs(contractInfo, currentEpoch, epochsInfo, 18);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEpochs(built);
    }
  }, [isLoading, contractInfo, currentEpoch, epochsInfo]);

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

  const supplyPerEpoch = useMemo(() => {
    if (!contractInfo) return 0;
    const num = Number(contractInfo.numberOfEpochs);
    if (num === 0) return 0;
    return Number(formatUnits(contractInfo.totalDistributionAmount, 18)) / num;
  }, [contractInfo]);

  const stats = useMemo(() => {
    const closed = epochs.filter((e) => e.state === "passed");
    const current = epochs.find((e) => e.state === "current");
    const future = epochs.filter((e) => e.state === "future");
    const totalParticipation = epochs.reduce(
      (sum, e) => sum + (e.state !== "future" ? e.participationVolume : 0),
      0,
    );
    const lastClosed = closed[closed.length - 1];
    return {
      totalEpochs: epochs.length,
      closedCount: closed.length,
      epochsLeft: future.length,
      distributedSupply: supplyPerEpoch * closed.length,
      totalSupply: supplyPerEpoch * epochs.length,
      totalParticipation,
      uniqueParticipants: Math.round(closed.length * 83.5),
      supplyRemaining: supplyPerEpoch * future.length,
      current,
      lastClearPrice: lastClosed?.clearPrice ?? null,
    };
  }, [epochs, supplyPerEpoch]);

  const sharesPct = useMemo(() => {
    if (!contractInfo)
      return { priceAnchorPct: 0, founderSharePct: 0, protocolFeePct: 0 };
    return computeShares(contractInfo, chainId);
  }, [contractInfo, chainId]);

  const isHovering = hoveredEpoch != null;
  const displayEpoch = hoveredEpoch ?? stats.current ?? null;
  const displayClearPrice = isHovering
    ? (displayEpoch?.clearPrice ?? stats.lastClearPrice)
    : stats.lastClearPrice;
  const displayParticipation = displayEpoch?.participationVolume ?? 0;
  const displayParticipants = estimateParticipants(displayParticipation);

  const hasClaimableShare = stats.closedCount > 0;
  const claimableAmount = Math.round(stats.distributedSupply * 0.015);

  const handleClaim = useCallback(async () => {
    if (!walletClient || !publicClient || !contractInfo) return;

    setClaimState("claiming");
    try {
      const distributor = getDistributorV1Contract(
        walletClient,
        contractAddress as Address,
      );
      const userAddress = walletClient.account.address;
      const targetEpoch = contractInfo.numberOfEpochs;

      const claimableEpochs: bigint[] = [];
      let fromEpoch = BigInt(0);

      while (fromEpoch < targetEpoch) {
        const [nextEpochToSearch, epochs] =
          await distributor.read.discoverRewards([
            fromEpoch,
            BigInt(100),
            userAddress,
            BigInt(100),
          ]);

        claimableEpochs.push(...epochs);

        if (nextEpochToSearch <= fromEpoch) break;
        fromEpoch = nextEpochToSearch;
        await new Promise((r) => setTimeout(r, 100));
      }

      if (claimableEpochs.length === 0) {
        setClaimState("done");
        return;
      }

      const from = claimableEpochs.reduce((min, e) => (e < min ? e : min));
      const to = claimableEpochs.reduce((max, e) => (e > max ? e : max));

      const claimTx = await distributor.write.claim(
        [userAddress, { from, length: to - from + BigInt(1) }],
        { account: walletClient.account, chain: walletClient.chain },
      );
      await publicClient.waitForTransactionReceipt({ hash: claimTx });

      setClaimState("done");
      refetch();
    } catch (e) {
      console.error("Claim failed:", e);
      setClaimState("error");
    }
  }, [walletClient, publicClient, contractInfo, contractAddress, refetch]);

  console.log(currentEpoch);
  const canParticipate =
    isWalletConnected &&
    state === "running" &&
    Number(amount) > 0 &&
    participateState !== "approving" &&
    participateState !== "participating";
  const isParticipating =
    participateState === "approving" || participateState === "participating";
  const participateLabel = !isWalletConnected
    ? "Connect wallet"
    : state === "waiting"
      ? "Not started"
      : isParticipating
        ? participateState === "approving"
          ? "Approving..."
          : "Participating..."
        : canParticipate
          ? `Participate in ${epochCount} epoch${epochCount > 1 ? "s" : ""}`
          : "Participate";

  const handleParticipateClick = async () => {
    if (!isWalletConnected) {
      openConnectModal?.();
      return;
    }
    if (!walletClient || !contractInfo || currentEpoch === undefined) return;

    try {
      setParticipateState("approving");

      const amountPerEpoch = parseUnits(amount, 18);
      const totalAmount = amountPerEpoch * BigInt(epochCount);

      const pToken = getTokenV1Contract(
        walletClient,
        contractInfo.participationToken,
      );
      const approveTx = await pToken.write.approve(
        [contractAddress as Address, totalAmount],
        { account: walletClient.account, chain: walletClient.chain },
      );
      await publicClient!.waitForTransactionReceipt({ hash: approveTx });

      setParticipateState("participating");

      const distributor = getDistributorV1Contract(
        walletClient,
        contractAddress as Address,
      );
      const participateTx = await distributor.write.participate(
        [
          amountPerEpoch,
          { from: BigInt(currentEpoch), length: BigInt(epochCount) },
          walletClient.account.address,
          "0x",
        ],
        { account: walletClient.account, chain: walletClient.chain },
      );
      await publicClient!.waitForTransactionReceipt({ hash: participateTx });

      setParticipateState("idle");
      setAmount("");
      refetch();
    } catch (e) {
      console.error("Participate failed:", e);
      setParticipateState("error");
    }
  };

  const handleMobileParticipateClick = () => {
    if (!isWalletConnected) {
      openConnectModal?.();
      return;
    }
    setDialogueOpen(true);
  };

  function renderClaimAndParticipation(idPrefix: string) {
    return (
      <>
        {isWalletConnected && hasClaimableShare && (
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
                  <span>{fmtInt(claimableAmount)}</span>
                  <span className="ddp-claim-card__unit">
                    {participationTokenSymbol}
                  </span>
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
                  disabled={claimState === "claiming"}
                  leadingIcon={
                    claimState === "claiming" ? (
                      <IconLoader2 size={18} />
                    ) : undefined
                  }
                  onClick={handleClaim}
                >
                  {claimState === "claiming" ? "Processing" : "Claim all"}
                </Button>
              </>
            )}
          </div>
        )}

        <div className="ddp-participation">
          <h2>Participation</h2>
          <div className="ddp-participation__field">
            <label htmlFor={`${idPrefix}-amount`}>
              Total participation amount
            </label>
            <div className="ddp-participation__input">
              <input
                id={`${idPrefix}-amount`}
                type="text"
                inputMode="decimal"
                placeholder="e.g. 50"
                autoComplete="off"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <span>{participationTokenSymbol}</span>
            </div>
          </div>
          <div className="ddp-participation__row">
            <div className="ddp-participation__field">
              <label htmlFor={`${idPrefix}-epochs`}>
                Participation epoch counts
              </label>
              <div
                className={`ddp-participation__input${epochCount > 1 ? " is-active" : ""}`}
              >
                <input
                  id={`${idPrefix}-epochs`}
                  type="text"
                  readOnly
                  value={epochCount}
                />
                <span>Epochs</span>
              </div>
            </div>
            <div className="ddp-participation__steppers">
              <IconButton
                icon={<IconMinus size={20} strokeWidth={1.75} />}
                variant="outline"
                size="m"
                aria-label="Decrease epoch count"
                disabled={epochCount <= 1}
                onClick={() => setEpochCount((n) => Math.max(1, n - 1))}
              />
              <IconButton
                icon={<IconPlus size={20} strokeWidth={1.75} />}
                variant="secondary"
                size="m"
                aria-label="Increase epoch count"
                onClick={() => setEpochCount((n) => n + 1)}
              />
            </div>
          </div>
          <Button
            variant="primary"
            size="m"
            fullWidth
            disabled={isWalletConnected && !canParticipate}
            onClick={handleParticipateClick}
          >
            {participateLabel}
          </Button>
        </div>
      </>
    );
  }

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
                  className="ddp-token-header__avatar"
                />
                <div className="ddp-token-header__info">
                  <div className="ddp-token-header__name-row">
                    <h1>{tokenName}</h1>
                    <span className="ddp-ticker">{tokenSymbol}</span>
                  </div>
                  <div className="ddp-token-header__creator ddp-token-header__creator--desktop">
                    <span>Created by</span>
                    <AddressTag value={contractInfo?.creator ?? "?"} />
                  </div>
                </div>
                <NetworkTag
                  network={
                    chainId === 8453
                      ? "BASE"
                      : chainId === 84532
                        ? "BASE SEPOLIA"
                        : chainId === 31337
                          ? "ANVIL"
                          : "UNKNOWN"
                  }
                />
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
                <div className="ddp-summary-row">
                  <div className="ddp-stat">
                    <span className="ddp-stat__label">Distributed supply</span>
                    <div className="ddp-stat__value-row">
                      <span className="ddp-stat__value-primary">
                        {fmtInt(stats.distributedSupply)}
                      </span>
                      <span className="ddp-stat__slash">/</span>
                      <span className="ddp-stat__value-secondary">
                        {fmtInt(stats.totalSupply)}
                      </span>
                      <span className="ddp-stat__unit">{tokenSymbol}</span>
                    </div>
                  </div>
                  <div className="ddp-stat">
                    <span className="ddp-stat__label">Total participation</span>
                    <div className="ddp-stat__value-row">
                      <span className="ddp-stat__value-primary">
                        {fmtInt(stats.totalParticipation)}
                      </span>
                      <span className="ddp-stat__unit">
                        {participationTokenSymbol}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="ddp-countdown-row">
                  <div className="ddp-countdown-label">
                    <span>Distribution period</span>
                    <div className="ddp-countdown-sub">
                      <span>Ends</span>
                      <span className="ddp-countdown-sub__value">
                        {fmtEpochDate(endTimestampMs, true)}
                      </span>
                    </div>
                  </div>
                  <div className="ddp-countdown-clock">
                    <div className="ddp-countdown-segment">
                      <strong>{countdown.days}</strong>
                      <span>D</span>
                    </div>
                    <span className="ddp-countdown-divider" />
                    <div className="ddp-countdown-segment">
                      <strong>{countdown.hours}</strong>
                      <span>H</span>
                    </div>
                    <span className="ddp-countdown-divider" />
                    <div className="ddp-countdown-segment">
                      <strong>{countdown.minutes}</strong>
                      <span>M</span>
                    </div>
                    <span className="ddp-countdown-divider" />
                    <div className="ddp-countdown-segment">
                      <strong>{countdown.seconds}</strong>
                      <span>S</span>
                    </div>
                  </div>
                </div>

                <Button
                  variant="primary"
                  size="m"
                  fullWidth
                  className="ddp-summary__participate"
                  onClick={handleMobileParticipateClick}
                >
                  {participateLabel}
                </Button>
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
                      value={`${fmtInt(supplyPerEpoch)} ${tokenSymbol}`}
                    />
                  </div>
                  <EpochBlockChart
                    epochs={epochs}
                    quoteSymbol={participationTokenSymbol}
                    tokenSymbol={tokenSymbol}
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
                      value={fmtInt(stats.uniqueParticipants)}
                    />
                    <InlineStat
                      label="Supply remaining"
                      value={`${fmtInt(stats.supplyRemaining)} ${tokenSymbol}`}
                    />
                    <InlineStat
                      label="Epochs left"
                      value={fmtInt(stats.epochsLeft)}
                      valueFirst
                    />
                  </div>
                </div>

                <div className="ddp-epoch-card">
                  <div className="ddp-epoch-card__info">
                    <div className="ddp-epoch-card__data">
                      <span>
                        {isHovering ? "Epoch number" : "Current epoch"}
                      </span>
                      <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--epoch">
                        <strong className={isHovering ? "is-accent" : ""}>
                          #{displayEpoch?.epoch ?? "—"}
                        </strong>
                        <time className={isHovering ? "is-accent" : ""}>
                          {displayEpoch
                            ? fmtEpochDate(displayEpoch.timestamp, !isHovering)
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
                          {fmtInt(displayParticipation)}
                        </strong>
                        <span className="ddp-epoch-card__unit">
                          {participationTokenSymbol}
                        </span>
                        <span className="ddp-epoch-card__by">by</span>
                        <strong className={isHovering ? "is-accent" : ""}>
                          {displayParticipants}
                        </strong>
                        <span className="ddp-epoch-card__by">participants</span>
                      </div>
                    </div>
                    <p className="ddp-epoch-card__note">
                      The clear price is set when the epoch closes, everyone in
                      the epoch gets the same price.
                    </p>
                  </div>
                  <div className="ddp-epoch-card__chart">
                    <EpochComboChart
                      epochs={epochs}
                      quoteSymbol={participationTokenSymbol}
                      tokenSymbol={tokenSymbol}
                      onHoverEpoch={setHoveredEpoch}
                    />
                  </div>
                </div>
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
                  <Button variant="ghost" size="s">
                    Details
                  </Button>
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
              {renderClaimAndParticipation("ddp")}
            </section>
          </div>
        </div>
      </div>

      {dialogueOpen && (
        <div
          className="ddp-dialogue-backdrop"
          onClick={() => setDialogueOpen(false)}
        >
          <div className="ddp-dialogue" onClick={(e) => e.stopPropagation()}>
            <div className="ddp-claim-participation">
              {renderClaimAndParticipation("ddp-dialogue")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
