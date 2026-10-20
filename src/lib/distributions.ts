import type { DistributionStatus } from "@/components/Status/Status";

export type { DistributionStatus };

export type Distribution = {
  address: `0x${string}`;
  tokenAddress: `0x${string}`;
  tokenName: string;
  tokenSymbol: string;
  status: DistributionStatus;
  totalParticipation: bigint;
  participationTokenDecimals: number;
  participationTokenSymbol: string;
  /** ms since epoch. Future for "upcoming" rows. */
  startedAt: number;
  /** ms since epoch. Future for "live" rows, past for "ended" rows. */
  finishedAt: number;
  epochsCompleted: number;
  totalEpochs: number;
  /** Launched through sqrtDAO's factory (creatorOf != 0). */
  native: boolean;
  /** Last closed epoch's clear price, or null if none has closed. */
  lastClearPrice: number | null;
};
