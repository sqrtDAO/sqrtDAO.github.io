import type { EpochData, EpochState } from "./types";

export interface MockEpochOptions {
  /** Total epoch count across passed + current + future. */
  total?: number;
  /** How many future epochs to generate after the current one. */
  futureCount?: number;
  /** Fixed token supply released per epoch (flat release). */
  supplyPerEpoch?: number;
  /** Fraction of passed epochs that receive any participation at all. */
  participationRate?: number;
  epochDurationMs?: number;
  startTimestamp?: number;
}

/**
 * Deterministic-ish fake epoch feed, ported from the two locked prototypes'
 * genData() functions. `participated` ("mine") is independent of whether an
 * epoch had any participation at all — the block chart keys its zero/bucket
 * split off `participationVolume === 0`, not off `participated`.
 */
export function generateMockEpochs(options: MockEpochOptions = {}): EpochData[] {
  const {
    total = 630,
    futureCount = 241,
    supplyPerEpoch = 122,
    participationRate = 0.82,
    epochDurationMs = 24 * 60 * 60 * 1000,
    startTimestamp = Date.UTC(2026, 2, 1),
  } = options;

  const currentIndex = Math.max(0, total - futureCount - 1);
  const epochs: EpochData[] = [];
  let price = 0.0012;

  for (let i = 0; i < total; i++) {
    const state: EpochState =
      i < currentIndex ? "passed" : i === currentIndex ? "current" : "future";
    const timestamp = startTimestamp + i * epochDurationMs;

    if (state === "passed") {
      price *= 1 + 0.006 + (Math.random() - 0.5) * 0.055;
      if (i === Math.round(currentIndex * 0.6) || i === Math.round(currentIndex * 0.85)) {
        price *= 1.12;
      }
      price = Math.max(0.0004, price);
    }

    // Future epochs haven't happened yet, so they can't have participation —
    // stays 0 (renders gray/"no participation" on the block chart), matching
    // the design intent.
    let participationVolume = 0;
    if (state === "passed" && Math.random() < participationRate) {
      participationVolume = Math.round(20 + Math.pow(Math.random(), 1.6) * 480);
      if (Math.random() < 0.06) {
        participationVolume = Math.round(participationVolume * (2.4 + Math.random() * 0.8));
      }
    } else if (state === "current") {
      participationVolume = Math.round(30 + Math.random() * 120);
    }

    const participated = participationVolume > 0 && Math.random() < 0.15;

    epochs.push({
      epoch: i + 1,
      state,
      participationVolume,
      clearPrice: state === "passed" ? +price.toFixed(6) : null,
      supply: supplyPerEpoch,
      participated,
      timestamp,
    });
  }

  return epochs;
}

export const mockEpochs: EpochData[] = generateMockEpochs();
