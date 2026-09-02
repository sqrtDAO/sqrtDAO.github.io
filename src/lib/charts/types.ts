export type EpochState = "passed" | "current" | "future";

/** One epoch, shared shape for both the combo chart and the block chart. */
export interface EpochData {
  epoch: number;
  state: EpochState;
  /** Raw on-chain quote-asset participation amount. 0n = no participation. */
  participationAmount: bigint;
  /** Clear price once the epoch closes; null while current/future. */
  clearPrice: number | null;
  /** Token supply released this epoch. */
  supply: number;
  /** Raw on-chain supply released this epoch (for roundUnits). */
  supplyAmount?: bigint;
  /** Unique participants this epoch, when known from the contract. */
  participants?: number;
  /** Did the connected wallet participate in this epoch. */
  participated: boolean;
  /** Epoch open time, ms since epoch. */
  timestamp: number;
}
