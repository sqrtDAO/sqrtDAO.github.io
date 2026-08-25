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
};

const TOKEN_NAMES = [
  "Solstice",
  "Vector",
  "Anchor",
  "Nimbus",
  "Fathom",
  "Cinder",
  "Halcyon",
  "Wraith",
  "Ember",
  "Glacier",
  "Quartz",
  "Obelisk",
  "Tundra",
  "Pyrite",
];

const PARTICIPATION_SYMBOLS = ["ROOT", "BASE", "USDC"];

const DAY_MS = 86_400_000;

const buildAddress = (index: number): `0x${string}` =>
  `0x${(index + 1).toString(16).padStart(40, "a")}` as `0x${string}`;

const buildStatus = (index: number): DistributionStatus =>
  index % 3 === 0 ? "live" : index % 3 === 1 ? "upcoming" : "ended";

const buildTimestamps = (
  index: number,
  status: DistributionStatus,
  now: number,
): { startedAt: number; finishedAt: number } => {
  if (status === "live") {
    return {
      startedAt: now - (((index * 37) % 5) + 1) * DAY_MS,
      finishedAt: now + (((index * 53) % 6) + 1) * DAY_MS,
    };
  }
  if (status === "upcoming") {
    const startedAt = now + (((index * 41) % 5) + 1) * DAY_MS;
    return {
      startedAt,
      finishedAt: startedAt + (((index * 29) % 10) + 3) * DAY_MS,
    };
  }
  const finishedAt = now - (((index * 31) % 20) + 2) * DAY_MS;
  return {
    startedAt: finishedAt - (((index * 17) % 10) + 3) * DAY_MS,
    finishedAt,
  };
};

const buildDistribution = (index: number, now: number): Distribution => {
  const status = buildStatus(index);
  const totalEpochs = (index % 5) + 4;
  const epochsCompleted =
    status === "upcoming"
      ? 0
      : status === "ended"
        ? totalEpochs
        : Math.max(1, Math.floor((totalEpochs * ((index % 7) + 1)) / 8));
  const name = TOKEN_NAMES[index % TOKEN_NAMES.length];

  return {
    address: buildAddress(index),
    tokenAddress: buildAddress(index + 1000),
    tokenName: name,
    tokenSymbol: name.slice(0, 4).toUpperCase(),
    status,
    totalParticipation: BigInt(((index + 1) * 4137) % 500_000 + 5_000),
    participationTokenDecimals: 18,
    participationTokenSymbol:
      PARTICIPATION_SYMBOLS[index % PARTICIPATION_SYMBOLS.length],
    ...buildTimestamps(index, status, now),
    epochsCompleted,
    totalEpochs,
  };
};

const generateMockDistributions = (count: number): Distribution[] => {
  const now = Date.now();
  return Array.from({ length: count }, (_, index) =>
    buildDistribution(index, now),
  );
};

// 62 entries -> 7 pages at pageSize 10, so Pagination's "…" collapse actually
// triggers (it only kicks in above 5 pages) — 42 landed exactly on 5 pages and
// never exercised it.
export const mockDistributions: Distribution[] = generateMockDistributions(62);
