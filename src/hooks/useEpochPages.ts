import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { zeroAddress, type Address, type Client } from "viem";
import { getDistributorV1Contract } from "@/contracts/contracts";
import type { EpochInfo } from "@/hooks/useDistributorData";

/**
 * Lazy epoch paging for the combo chart.
 *
 * The page hook (useDistributorData) already reads a bounded window around the
 * current epoch for the whole DDP. That window is donated here as the seed, so
 * the chart opens exactly as before with ZERO extra RPC calls. Only when the
 * user scrolls the chart towards an edge of that window do we read the next
 * page of epochs — one `getEpochInfo` call per page, page-aligned so a page is
 * never fetched twice. History depth is not capped: a page costs exactly one
 * call and is only paid for when the user actually scrolls into it.
 *
 * Loaded epochs live in a small external store (not React state): pages arrive
 * from RPC callbacks and must not be dropped by a reset/re-render race.
 */

/** Epochs read per eth_call while paging through history. */
export const EPOCH_PAGE_SIZE = 200;

/**
 * A page that failed waits before the next scroll retries it. This — plus the
 * one-page-per-gesture trigger in the chart — is the whole rate limit: there is
 * no page budget, scrolling back through a long distribution is unbounded by
 * design (each page costs exactly one eth_call).
 */
const RETRY_COOLDOWN_MS = 15_000;

/** A contiguous run of already-loaded epochs. */
export type EpochPage = { from: number; infos: readonly EpochInfo[] };

const NO_PAGES: EpochPage[] = [];

/** Group loaded epochs into ordered, non-overlapping runs. */
function buildRuns(covered: Map<number, EpochInfo>): EpochPage[] {
  const indices = [...covered.keys()].sort((a, b) => a - b);
  const runs: { from: number; infos: EpochInfo[] }[] = [];
  for (const index of indices) {
    const info = covered.get(index)!;
    const run = runs[runs.length - 1];
    if (run && run.from + run.infos.length === index) run.infos.push(info);
    else runs.push({ from: index, infos: [info] });
  }
  return runs;
}

function createPagerStore() {
  let covered = new Map<number, EpochInfo>();
  let snapshot: EpochPage[] = NO_PAGES;
  const listeners = new Set<() => void>();

  return {
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot: () => snapshot,
    /** Are all epochs in [from, from + length) in memory? */
    has(from: number, length: number) {
      for (let i = from; i < from + length; i++) {
        if (!covered.has(i)) return false;
      }
      return true;
    },
    merge(from: number, infos: readonly EpochInfo[]) {
      if (infos.length === 0) return;
      for (let i = 0; i < infos.length; i++) covered.set(from + i, infos[i]);
      snapshot = buildRuns(covered);
      for (const listener of listeners) listener();
    },
    reset() {
      if (covered.size === 0) return;
      covered = new Map();
      snapshot = NO_PAGES;
      for (const listener of listeners) listener();
    },
  };
}

export interface UseEpochPagesArgs {
  publicClient: Client | undefined;
  contractAddress: Address;
  /** Reader passed to getEpochInfo — user fields are zero unless connected. */
  user?: Address;
  /** numberOfEpochs: pages never read past it. */
  total: number;
  /** Window the page hook already loaded for free (no extra call). */
  seed?: { from: number; infos: readonly EpochInfo[] };
}

export interface UseEpochPagesResult {
  /** Loaded epochs as ordered, non-overlapping runs. */
  pages: EpochPage[];
  /**
   * Make sure inclusive epoch indices [fromIndex, toIndex] are loaded, reading
   * only the pages that are missing. Safe to call on every scroll tick: covered
   * and in-flight pages are skipped, so it costs nothing when there is no work.
   */
  ensureRange: (fromIndex: number, toIndex: number) => void;
}

export function useEpochPages({
  publicClient,
  contractAddress,
  user,
  total,
  seed,
}: UseEpochPagesArgs): UseEpochPagesResult {
  const [store] = useState(createPagerStore);
  const pages = useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );

  const inflightRef = useRef<Set<number>>(new Set());
  const failedAtRef = useRef<Map<number, number>>(new Map());

  // Another distribution, chain or wallet means the pages are not ours any
  // more (they carry user-specific fields, and the page hook re-seeds).
  const resetKey = `${contractAddress}:${publicClient?.chain?.id ?? ""}:${user ?? ""}`;
  useEffect(() => {
    store.reset();
    inflightRef.current.clear();
    failedAtRef.current.clear();
  }, [store, resetKey]);

  // The page hook's window is already in memory — adopt it, don't re-read it.
  const seedFrom = seed?.from;
  const seedInfos = seed?.infos;
  useEffect(() => {
    if (seedFrom === undefined || !seedInfos) return;
    store.merge(seedFrom, seedInfos);
  }, [store, seedFrom, seedInfos]);

  const loadPage = useCallback(
    (page: number) => {
      if (!publicClient || total <= 0) return;
      if (inflightRef.current.has(page)) return;
      const failedAt = failedAtRef.current.get(page);
      if (failedAt !== undefined && Date.now() - failedAt < RETRY_COOLDOWN_MS) {
        return;
      }

      const from = page * EPOCH_PAGE_SIZE;
      const length = Math.min(EPOCH_PAGE_SIZE, total - from);
      if (length <= 0) return;

      inflightRef.current.add(page);
      getDistributorV1Contract(publicClient, contractAddress)
        .read.getEpochInfo([
          user ?? zeroAddress,
          { from: BigInt(from), length: BigInt(length) },
        ])
        .then((infos) => {
          failedAtRef.current.delete(page);
          store.merge(from, infos);
        })
        .catch((e) => {
          // back off instead of retrying on every scroll tick
          failedAtRef.current.set(page, Date.now());
          console.error(e);
        })
        .finally(() => inflightRef.current.delete(page));
    },
    [publicClient, contractAddress, user, total, store],
  );

  const ensureRange = useCallback(
    (fromIndex: number, toIndex: number) => {
      if (total <= 0) return;
      const lo = Math.max(0, Math.min(fromIndex, total - 1));
      const hi = Math.max(lo, Math.min(toIndex, total - 1));
      const firstPage = Math.floor(lo / EPOCH_PAGE_SIZE);
      const lastPage = Math.floor(hi / EPOCH_PAGE_SIZE);
      for (let page = firstPage; page <= lastPage; page++) {
        if (inflightRef.current.has(page)) continue;
        const from = page * EPOCH_PAGE_SIZE;
        const length = Math.min(EPOCH_PAGE_SIZE, total - from);
        if (store.has(from, length)) continue;
        loadPage(page);
      }
    },
    [total, store, loadPage],
  );

  return useMemo(() => ({ pages, ensureRange }), [pages, ensureRange]);
}
