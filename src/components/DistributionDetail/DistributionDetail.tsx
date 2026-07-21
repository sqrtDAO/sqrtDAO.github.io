"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import {
  IconLoader2,
  IconMessageCircleQuestion,
  IconMinus,
  IconPlus,
  IconShare,
  IconSquareRoundedCheckFilled,
} from "@tabler/icons-react";
import Header from "@/components/Header/Header";
import TestnetRibbon from "@/components/TestnetRibbon/TestnetRibbon";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import NetworkTag from "@/components/NetworkTag/NetworkTag";
import AddressTag from "@/components/AddressTag/AddressTag";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import EpochBlockChart from "@/components/EpochBlockChart/EpochBlockChart";
import { generateMockEpochs } from "@/lib/charts/mockData";
import type { EpochData } from "@/lib/charts/types";
// Reuses .dw-chart-bar / .dw-chart-legend as-is for the epoch fund split —
// same visual language as the Distribution Wizard's split chart.
import "@/components/DistributionWizard/DistributionWizard.css";
import "./DistributionDetail.css";

const EpochComboChart = dynamic(() => import("@/components/EpochComboChart/EpochComboChart"), {
  ssr: false,
});

const SUPPLY_PER_EPOCH = 122;
const TOKEN_SYMBOL = "TOKEN";
const QUOTE_SYMBOL = "USDT";
const PRICE_ANCHOR_PCT = 95;
const FOUNDER_SHARE_PCT = 0;
const PROTOCOL_FEE_PCT = 5;

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
  { swatch: "var(--color-charts-epochs-500)", label: "Participated (more vol → darker)" },
  { swatch: "var(--sqrt-action-primary-rest)", label: "Current" },
  { swatch: "var(--color-alpha-steel-08)", label: "Passed / Future" },
];

function useCountdown(msFromNow: number) {
  const [remaining, setRemaining] = useState(msFromNow);
  useEffect(() => {
    const end = Date.now() + msFromNow;
    const tick = () => setRemaining(Math.max(0, end - Date.now()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  return <div className="ddp-inline-stat">{valueFirst ? [valueEl, labelEl] : [labelEl, valueEl]}</div>;
}

function estimateParticipants(volume: number): number {
  return volume > 0 ? Math.max(1, Math.round(volume / 870)) : 0;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Figma spells epoch dates day-first ("12 May, 12:32:45" / "10 May, 2026"),
// which toLocaleString("en-US") won't produce (it reorders to month-first).
function fmtEpochDate(timestamp: number, withTime: boolean): string {
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  if (withTime) {
    const time = d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    return `${day} ${month}, ${time}`;
  }
  return `${day} ${month}, ${d.getFullYear()}`;
}

export default function DistributionDetail() {
  // Generated client-only: Math.random() inside would otherwise differ
  // between the server render and the client's first render and trigger a
  // hydration mismatch. Starts empty; populates once mounted.
  const [epochs, setEpochs] = useState<EpochData[]>([]);
  useEffect(() => {
    // Intentional one-time client-only sync, not a cascading-render antipattern:
    // Math.random()-based mock data must never run during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEpochs(generateMockEpochs());
  }, []);
  const [activeFaq, setActiveFaq] = useState(0);
  const [amount, setAmount] = useState("");
  const [epochCount, setEpochCount] = useState(1);
  const [hoveredEpoch, setHoveredEpoch] = useState<EpochData | null>(null);
  const [walletConnected, setWalletConnected] = useState(false);
  const [claimState, setClaimState] = useState<"idle" | "claiming" | "done">("idle");

  const countdown = useCountdown(12 * 86400_000 + 2 * 3600_000 + 42 * 60_000 + 21_000);

  const stats = useMemo(() => {
    const closed = epochs.filter((e) => e.state === "passed");
    const current = epochs.find((e) => e.state === "current");
    const future = epochs.filter((e) => e.state === "future");
    const totalParticipation = epochs.reduce(
      (sum, e) => sum + (e.state !== "future" ? e.participationVolume : 0),
      0
    );
    const lastClosed = closed[closed.length - 1];
    return {
      totalEpochs: epochs.length,
      closedCount: closed.length,
      epochsLeft: future.length,
      distributedSupply: SUPPLY_PER_EPOCH * closed.length,
      totalSupply: SUPPLY_PER_EPOCH * epochs.length,
      totalParticipation,
      uniqueParticipants: Math.round(closed.length * 83.5),
      supplyRemaining: SUPPLY_PER_EPOCH * future.length,
      current,
      lastClearPrice: lastClosed?.clearPrice ?? null,
    };
  }, [epochs]);

  const isHovering = hoveredEpoch != null;
  const displayEpoch = hoveredEpoch ?? stats.current ?? null;
  const displayClearPrice = isHovering ? (displayEpoch?.clearPrice ?? stats.lastClearPrice) : stats.lastClearPrice;
  const displayParticipation = displayEpoch?.participationVolume ?? 0;
  const displayParticipants = estimateParticipants(displayParticipation);

  // Claim card only appears once connected and the wallet has a claimable
  // share — mocked here as "at least one epoch has closed", with the share
  // itself a small illustrative slice of the supply distributed so far.
  const hasClaimableShare = stats.closedCount > 0;
  const claimableAmount = Math.round(stats.distributedSupply * 0.015);

  const handleClaim = useCallback(() => {
    setClaimState("claiming");
    setTimeout(() => setClaimState("done"), 1600);
  }, []);

  const canParticipate = walletConnected && Number(amount) > 0;
  const participateLabel = !walletConnected
    ? "Connect wallet"
    : canParticipate
      ? `Participate in ${epochCount} epoch${epochCount > 1 ? "s" : ""}`
      : "Participate";
  const handleParticipateClick = !walletConnected
    ? () => setWalletConnected(true)
    : canParticipate
      ? () => setAmount("")
      : undefined;

  return (
    <div className="ddp">
      <div className="ddp-chrome">
        <Header onConnectWallet={() => setWalletConnected(true)} />
        <TestnetRibbon />
      </div>

      <div className="ddp-body">
        <div className="ddp-columns">
          <div className="ddp-left">
            <section className="ddp-token-header">
              <TokenAvatar seed="sqrtDAO SQRT" className="ddp-token-header__avatar" />
              <div className="ddp-token-header__info">
                <div className="ddp-token-header__name-row">
                  <h1>sqrtDAO</h1>
                  <span className="ddp-ticker">SQRT</span>
                </div>
                <div className="ddp-token-header__creator">
                  <span>Created by</span>
                  <AddressTag value="0xfd9...jd87w" />
                </div>
              </div>
              <NetworkTag network="BASE" />
              <AddressTag value="0xfd9...jd87w" />
              <Button variant="outline" size="m" leadingIcon={<IconShare size={16} strokeWidth={1.75} />}>
                Share
              </Button>
            </section>

            <div className="ddp-main-content">
              <section className="ddp-summary">
                <div className="ddp-summary-row">
                  <div className="ddp-stat">
                    <span className="ddp-stat__label">Distributed supply</span>
                    <div className="ddp-stat__value-row">
                      <span className="ddp-stat__value-primary">{fmtInt(stats.distributedSupply)}</span>
                      <span className="ddp-stat__slash">/</span>
                      <span className="ddp-stat__value-secondary">{fmtInt(stats.totalSupply)}</span>
                      <span className="ddp-stat__unit">{TOKEN_SYMBOL}</span>
                    </div>
                  </div>
                  <div className="ddp-stat">
                    <span className="ddp-stat__label">Total participation</span>
                    <div className="ddp-stat__value-row">
                      <span className="ddp-stat__value-primary">{fmtInt(stats.totalParticipation)}</span>
                      <span className="ddp-stat__unit">{QUOTE_SYMBOL}</span>
                    </div>
                  </div>
                </div>

                <div className="ddp-countdown-row">
                  <div className="ddp-countdown-label">
                    <span>Distribution period</span>
                    <div className="ddp-countdown-sub">
                      <span>Ends</span>
                      <span className="ddp-countdown-sub__value">—</span>
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
              </section>

              <section className="ddp-epochs-data">
                <div className="ddp-block-card">
                  <div className="ddp-block-card__stats-top">
                    <InlineStat label="Total epochs" value={fmtInt(stats.totalEpochs)} />
                    <InlineStat
                      label="Supply per epoch (Flat release)"
                      value={`${fmtInt(SUPPLY_PER_EPOCH)} ${TOKEN_SYMBOL}`}
                    />
                  </div>
                  <EpochBlockChart epochs={epochs} quoteSymbol={QUOTE_SYMBOL} tokenSymbol={TOKEN_SYMBOL} />
                  <div className="ddp-block-card__legend">
                    {BLOCK_LEGEND.map((item) => (
                      <span key={item.label} className="ddp-block-card__legend-item">
                        <span className="ddp-block-card__legend-swatch" style={{ background: item.swatch }} />
                        {item.label}
                      </span>
                    ))}
                  </div>
                  <div className="ddp-block-card__stats-bottom">
                    <InlineStat label="Unique participants" value={fmtInt(stats.uniqueParticipants)} />
                    <InlineStat
                      label="Supply remaining"
                      value={`${fmtInt(stats.supplyRemaining)} ${TOKEN_SYMBOL}`}
                    />
                    <InlineStat label="Epochs left" value={fmtInt(stats.epochsLeft)} valueFirst />
                  </div>
                </div>

                <div className="ddp-epoch-card">
                  <div className="ddp-epoch-card__info">
                    <div className="ddp-epoch-card__data">
                      <span>{isHovering ? "Epoch number" : "Current epoch"}</span>
                      <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--epoch">
                        <strong className={isHovering ? "is-accent" : ""}>
                          #{displayEpoch?.epoch ?? "—"}
                        </strong>
                        <time className={isHovering ? "is-accent" : ""}>
                          {displayEpoch ? fmtEpochDate(displayEpoch.timestamp, !isHovering) : "—"}
                        </time>
                      </div>
                    </div>
                    <div className="ddp-epoch-card__data">
                      <span>{isHovering ? "Clear price" : "Last clear price"}</span>
                      <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--price">
                        <strong className={isHovering ? "is-accent" : ""}>
                          {displayClearPrice?.toFixed(4) ?? "—"}
                        </strong>
                        <span className="ddp-epoch-card__unit">{QUOTE_SYMBOL}</span>
                      </div>
                    </div>
                    <div className="ddp-epoch-card__data">
                      <span>Participation this epoch</span>
                      <div className="ddp-epoch-card__data-row ddp-epoch-card__data-row--participation">
                        <strong className={isHovering ? "is-accent" : ""}>{fmtInt(displayParticipation)}</strong>
                        <span className="ddp-epoch-card__unit">{QUOTE_SYMBOL}</span>
                        <span className="ddp-epoch-card__by">by</span>
                        <strong className={isHovering ? "is-accent" : ""}>{displayParticipants}</strong>
                        <span className="ddp-epoch-card__by">participants</span>
                      </div>
                    </div>
                    <p className="ddp-epoch-card__note">
                      The clear price is set when the epoch closes, everyone in the epoch gets the same price.
                    </p>
                  </div>
                  <div className="ddp-epoch-card__chart">
                    <EpochComboChart
                      epochs={epochs}
                      quoteSymbol={QUOTE_SYMBOL}
                      tokenSymbol={TOKEN_SYMBOL}
                      onHoverEpoch={setHoveredEpoch}
                    />
                  </div>
                </div>
              </section>

              <section className="ddp-faq">
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
                      activeFaq === 0 ? "first" : activeFaq === FAQ_ITEMS.length - 1 ? "last" : "middle"
                    }`}
                  >
                    <p>{FAQ_ITEMS[activeFaq].a}</p>
                  </div>
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
                <p>How each epoch&apos;s funds are split. Set by the founder before launch, It can&apos;t change.</p>
              </div>
              <div className="ddp-fund-split__chart">
                <div className="dw-chart-bar">
                  <div className="dw-chart-bar__liquidity" />
                  <div className="dw-chart-bar__fee" />
                  {FOUNDER_SHARE_PCT > 0 && (
                    <div className="dw-chart-bar__founder" style={{ width: `${FOUNDER_SHARE_PCT}%` }} />
                  )}
                </div>
                <div className="dw-chart-legend">
                  <span className="dw-chart-legend__item dw-chart-legend__item--anchor">
                    {PRICE_ANCHOR_PCT}% Price anchor
                  </span>
                  <span className="dw-chart-legend__item dw-chart-legend__item--founder">
                    {FOUNDER_SHARE_PCT}% Founder share
                  </span>
                  <span className="dw-chart-legend__item dw-chart-legend__item--fee">
                    {PROTOCOL_FEE_PCT}% Protocol fee
                  </span>
                </div>
              </div>
            </section>

            <section className="ddp-claim-participation">
              {walletConnected && hasClaimableShare && (
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
                        <span className="ddp-claim-card__unit">{QUOTE_SYMBOL}</span>
                      </div>
                      <Button
                        variant="primary"
                        size="m"
                        fullWidth
                        className="ddp-claim-card__button"
                        disabled={claimState === "claiming"}
                        leadingIcon={claimState === "claiming" ? <IconLoader2 size={18} /> : undefined}
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
                  <label htmlFor="ddp-amount">Total participation amount</label>
                  <div className="ddp-participation__input">
                    <input
                      id="ddp-amount"
                      type="text"
                      inputMode="decimal"
                      placeholder="e.g. 50"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                    />
                    <span>{QUOTE_SYMBOL}</span>
                  </div>
                </div>
                <div className="ddp-participation__row">
                  <div className="ddp-participation__field">
                    <label htmlFor="ddp-epochs">Participation epoch counts</label>
                    <div className={`ddp-participation__input${epochCount > 1 ? " is-active" : ""}`}>
                      <input id="ddp-epochs" type="text" readOnly value={epochCount} />
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
                  disabled={walletConnected && !canParticipate}
                  onClick={handleParticipateClick}
                >
                  {participateLabel}
                </Button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
