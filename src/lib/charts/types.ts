export type EpochState = "passed" | "current" | "future";

/** One epoch, shared shape for both the combo chart and the block chart. */
export interface EpochData {
  epoch: number;
  state: EpochState;
  /** Quote-asset participation volume for this epoch. 0 = no participation. */
  participationVolume: number;
  /** Clear price once the epoch closes; null while current/future. */
  clearPrice: number | null;
  /** Token supply released this epoch. */
  supply: number;
  /** Unique participants this epoch, when known from the contract. */
  participants?: number;
  /** Did the connected wallet participate in this epoch. */
  participated: boolean;
  /** Epoch open time, ms since epoch. */
  timestamp: number;
}
