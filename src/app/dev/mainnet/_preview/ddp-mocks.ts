// Mock fixtures for the /dev/mainnet DDP previews — the teammate replaces these with contract reads.
import type { MainnetDdpData } from "@/components/MainnetDdp/MainnetDdp";
import type { DdpState } from "@/components/DistributionOverview/DistributionOverview";
import type { ParticipationCardProps } from "@/components/ParticipationCard/ParticipationCard";
import type { EpochData, EpochState } from "@/lib/charts/types";

const E18 = 10n ** 18n;

export const PARTICIPATION: ParticipationCardProps = {
  quoteSymbol: "USDT",
  walletBalance: "12,445 USDT",
  claimDelay: "23 days",
  fromEpoch: "2345",
  toEpoch: "2357",
  perEpochEstimate: "≈ 20 USDT per epoch",
};

export const LEGEND = {
  stats: [
    { label: "Total epochs", value: "630" },
    { label: "Supply per epoch (Flat release)", value: "122 TOKEN" },
    { label: "Epoch duration", value: "20 mins" },
    { label: "Unique participants", value: "32,432" },
  ],
  supplyRemaining: "12,321,578 TOKEN",
  epochsLeft: "241",
};

/** `current` = index of the live epoch; 0 → all upcoming, ≥ length → all passed. */
export const mockEpochs = (current = 80, length = 120): EpochData[] =>
  Array.from({ length }, (_, i) => {
    const state: EpochState =
      i < current ? "passed" : i === current ? "current" : "future";
    return {
      epoch: i + 1,
      state,
      participationAmount:
        state === "future" || i % 9 === 0
          ? 0n
          : BigInt(((i * 37) % 50) + 1) * 1000n * E18,
      clearPrice: state === "passed" ? 0.002 + i * 0.00002 : null,
      supply: 122,
      supplyAmount: 122n * E18,
      participants: state === "future" ? 0 : ((i * 13) % 40) + 1,
      participated: state !== "future" && i % 11 === 0,
      userParticipationAmount:
        state !== "future" && i % 11 === 0 ? 400n * E18 : 0n,
      claimed: false,
      timestamp: Date.UTC(2026, 4, 12) + i * 1_200_000,
    };
  });

export const CHART_EPOCHS = mockEpochs();

const EPOCHS_BY_STATE: Record<DdpState, EpochData[]> = {
  upcoming: mockEpochs(-1),
  live: CHART_EPOCHS,
  finished: mockEpochs(120),
};

export const ddpMock = (state: DdpState, nowMs: number): MainnetDdpData => ({
  header: {
    name: "sqrtDAO",
    symbol: "SQRT",
    creator: "0xfd9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1djd87w",
    tokenAddress: "0xfd9b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2cjd87w",
    distributionAddress: "0xfd9c3e5a7b9d1f3c5e7a9b1d3f5c7e9a1b3ejd87w",
  },
  overview: {
    distributedSupply: state === "finished" ? "20,000,000" : "20,000",
    totalSupply: "20,000,000",
    tokenSymbol: "TOKEN",
    totalParticipation: "20,000,000",
    quoteSymbol: "USDT",
    periodDate: "12:45, 21 June, 2026",
  },
  countdownTargetMs: nowMs + ((12 * 24 + 2) * 60 + 42) * 60_000 + 21_000,
  epochStats: {
    epoch: "#433",
    epochTime: "12 May, 12:32:45",
    lastClearPrice: "0.002",
    participation: "20,000",
    participants: "23",
    quoteSymbol: "USDT",
  },
  legend: LEGEND,
  epochs: EPOCHS_BY_STATE[state],
  tokenSymbol: "TOKEN",
  quoteSymbol: "USDT",
  split: { priceAnchorPct: 95, founderSharePct: 0, protocolFeePct: 5 },
  claim: { state: "ready", amount: "20,000,000", symbol: "USDT" },
  participation: PARTICIPATION,
  review: {
    amount: "21,321 USDT",
    fromEpoch: 321,
    toEpoch: 328,
    tokenSymbol: "TOKEN",
    claimDelayDays: 21,
    claimDate: "21 June 2026, 12:34 UTC",
  },
  about:
    "For the initial review, this placeholder description is intended to provide enough natural-looking copy to evaluate the rhythm, density, and overall balance of a finished layout before the final message is available. It can stand in for product details, service information, editorial content, or any other extended explanation that will eventually be written with a specific audience and purpose in mind. The language remains deliberately broad so that attention stays on hierarchy, spacing, line length, and readability rather than on the accuracy of temporary claims.",
  epochDurationSec: 1200,
  lastClearPrice: 0.002,
});
