import type { AutoscaleInfo, IChartApi, ISeriesApi, LineData, Time, WhitespaceData } from "lightweight-charts";
import type { RoundedBarsData } from "./roundedBars";
import type { EpochData } from "./types";

export interface IntroControllerOptions {
  chart: IChartApi;
  barsSeries: ISeriesApi<"Custom", Time, RoundedBarsData | WhitespaceData<Time>>;
  lineSeries: ISeriesApi<"Line">;
  toBarItem: (e: EpochData) => RoundedBarsData;
  toLinePoint: (e: EpochData) => LineData<Time>;
  introDurationMs: number;
  reducedMotion: boolean;
}

export interface IntroController {
  /** Replace the dataset the controller animates over (chronological, full). */
  setEpochs(epochs: EpochData[]): void;
  run(): void;
  cancel(): void;
  isRunning(): boolean;
  destroy(): void;
}

interface PriceRange {
  min: number;
  max: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function priceRangeOf(prices: (number | null)[]): PriceRange {
  let mn = Infinity;
  let mx = -Infinity;
  for (const p of prices) {
    if (p == null) continue;
    mn = Math.min(mn, p);
    mx = Math.max(mx, p);
  }
  if (mx < mn) return { min: 0, max: 1 };
  const pad = (mx - mn) * 0.06 || mx * 0.05;
  return { min: Math.max(0, mn - pad), max: mx + pad };
}

function volMaxOf(vols: number[]): number {
  let mx = 0;
  for (const v of vols) mx = Math.max(mx, v);
  return mx * 1.02;
}

/**
 * Ported from v4-locked's intro/zoom sequence: reveal bars+line left-to-right
 * with the Y/volume scales locked to the full-dataset range, then ease the
 * visible window and the locks down to the resting (last ~60 bars) state.
 * Token-guarded so a re-trigger (replay) or a cancel (user interacts)
 * invalidates any in-flight rAF loop cleanly.
 */
export function createIntroController(options: IntroControllerOptions): IntroController {
  const { chart, barsSeries, lineSeries, toBarItem, toLinePoint } = options;
  let epochs: EpochData[] = [];
  let introToken = 0;
  let introRunning = false;
  let rafId = 0;
  let lockY: PriceRange | null = null;
  let lockV: { max: number } | null = null;

  function applyLocks() {
    lineSeries.applyOptions({
      autoscaleInfoProvider: () =>
        lockY ? { priceRange: { minValue: lockY.min, maxValue: lockY.max } } : null,
    });
    barsSeries.applyOptions({
      autoscaleInfoProvider: () =>
        lockV ? { priceRange: { minValue: 0, maxValue: lockV.max } } : null,
    });
  }

  function releaseLocks() {
    lockY = null;
    lockV = null;
    lineSeries.applyOptions({ autoscaleInfoProvider: (base: () => AutoscaleInfo | null) => base() });
    barsSeries.applyOptions({ autoscaleInfoProvider: (base: () => AutoscaleInfo | null) => base() });
  }

  function finalRange() {
    // Anchor on the current epoch, not raw array length — a dataset with a
    // large future tail (common: distributions schedule epochs far ahead)
    // would otherwise rest on a window that's almost entirely future bars
    // with no price line in it.
    const currentIndex = epochs.findIndex((e) => e.state === "current");
    const anchor = currentIndex === -1 ? epochs.length - 1 : currentIndex;
    return { from: anchor - 56, to: anchor + 8 };
  }

  function finalWindowData() {
    const fr = finalRange();
    const slice = epochs.slice(Math.max(0, Math.floor(fr.from)));
    return {
      y: priceRangeOf(slice.map((e) => e.clearPrice)),
      v: { max: volMaxOf(slice.map((e) => e.participationVolume)) },
    };
  }

  function barItems(list: EpochData[]) {
    return list.map(toBarItem);
  }
  function lineItems(list: EpochData[]) {
    return list.filter((e) => e.state === "passed").map(toLinePoint);
  }

  function restingState() {
    cancelAnimationFrame(rafId);
    barsSeries.setData(barItems(epochs));
    lineSeries.setData(lineItems(epochs));
    releaseLocks();
    chart.timeScale().setVisibleLogicalRange(finalRange());
    introRunning = false;
  }

  function runIntro() {
    if (epochs.length === 0) return;
    if (options.reducedMotion || options.introDurationMs <= 0) {
      restingState();
      return;
    }
    const token = ++introToken;
    introRunning = true;
    const n = epochs.length;
    const lineAll = lineItems(epochs);
    const full = { from: -2, to: n + 4 };

    lockY = priceRangeOf(epochs.map((e) => e.clearPrice));
    lockV = { max: volMaxOf(epochs.map((e) => e.participationVolume)) };
    applyLocks();
    barsSeries.setData(barItems(epochs));
    lineSeries.setData(lineAll);
    chart.timeScale().setVisibleLogicalRange(full);

    const t0 = performance.now();
    const revealMs = options.introDurationMs * 0.55;
    let lastK = 0;

    const reveal = (now: number) => {
      if (token !== introToken) return;
      const t = Math.min(1, (now - t0) / revealMs);
      const k = Math.max(2, Math.round(easeOutCubic(t) * n));
      if (k !== lastK) {
        barsSeries.setData(barItems(epochs.slice(0, k)));
        lineSeries.setData(lineAll.slice(0, Math.min(k, lineAll.length)));
        lastK = k;
      }
      if (t < 1) {
        rafId = requestAnimationFrame(reveal);
        return;
      }
      barsSeries.setData(barItems(epochs));
      lineSeries.setData(lineAll);

      const fw = finalWindowData();
      const y0 = { min: lockY!.min, max: lockY!.max };
      const v0 = { max: lockV!.max };
      const fr = finalRange();
      const t1 = performance.now();
      const zoomMs = options.introDurationMs * 0.45;

      const zoom = (now2: number) => {
        if (token !== introToken) return;
        const u = Math.min(1, (now2 - t1) / zoomMs);
        const e = easeInOutCubic(u);
        chart.timeScale().setVisibleLogicalRange({
          from: full.from + (fr.from - full.from) * e,
          to: full.to + (fr.to - full.to) * e,
        });
        lockY = { min: y0.min + (fw.y.min - y0.min) * e, max: y0.max + (fw.y.max - y0.max) * e };
        lockV = { max: v0.max + (fw.v.max - v0.max) * e };
        if (u < 1) {
          rafId = requestAnimationFrame(zoom);
        } else {
          releaseLocks();
          introRunning = false;
        }
      };
      zoom(t1);
    };
    reveal(t0);
  }

  function cancelIntro() {
    if (introRunning) {
      introToken++;
      restingState();
    }
  }

  return {
    setEpochs(next: EpochData[]) {
      epochs = next;
    },
    run: runIntro,
    cancel: cancelIntro,
    isRunning: () => introRunning,
    destroy() {
      introToken++;
      cancelAnimationFrame(rafId);
    },
  };
}
