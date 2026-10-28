"use client";

import { useEffect, useRef } from "react";
import {
  ColorType,
  CrosshairMode,
  LineSeries,
  LineStyle,
  createChart,
  type IChartApi,
  type ISeriesApi,
  type MouseEventParams,
  type Time,
  type UTCTimestamp,
} from "lightweight-charts";
import { createHoverPrimitive } from "@/lib/charts/hoverPrimitive";
import {
  createIntroController,
  type IntroController,
} from "@/lib/charts/introController";
import {
  RoundedBarsSeries,
  type RoundedBarsData,
} from "@/lib/charts/roundedBars";
import {
  createTooltipController,
  type TooltipController,
} from "@/lib/charts/tooltipController";
import type { EpochData } from "@/lib/charts/types";
import { formatPrice } from "@/utils/epoch-format";
import { roundUnits, unitsToNumber } from "@/utils/round-units";
import "@/components/ChartTooltip/ChartTooltip.css";
import "./EpochComboChart.css";

export interface EpochComboChartProps {
  /** Full chronological epoch dataset: passed epochs first, one current, then future. */
  epochs: EpochData[];
  quoteSymbol?: string;
  tokenSymbol?: string;
  quoteDecimals: number;
  tokenDecimals: number;
  className?: string;
  /** Fires with the hovered bar's epoch, or null once the pointer leaves the chart. */
  onHoverEpoch?: (epoch: EpochData | null) => void;
  /** Fires when an epoch's bar is clicked/tapped. */
  onSelectEpoch?: (epoch: EpochData) => void;
  /**
   * Fires (debounced) as the user pans/zooms, with the inclusive 0-based epoch
   * indices it needs loaded — the visible window plus a prefetch margin. The
   * caller pages more `epochs` in; the viewport stays where it is.
   */
  onVisibleRange?: (fromEpochIndex: number, toEpochIndex: number) => void;
}

/** Locked values — see sqrtdao-epoch-chart-v4-locked.html. Do not retune here. */
const LOCKED = {
  barWidthFactor: 0.7,
  barRadius: 8,
  barHeight: 0.83,
  dotThresholdPx: 18,
  introMs: 750,
};

/** Bars of history/runway asked for beyond the viewport, so paging triggers
 * before the user actually hits the edge. */
const PREFETCH_BARS = 48;
/** Wait for the scrolling to settle before asking for another page. */
const RANGE_REPORT_DEBOUNCE_MS = 140;

function readVar(el: HTMLElement, name: string): string {
  return getComputedStyle(el).getPropertyValue(name).trim();
}

function timeOf(e: EpochData): UTCTimestamp {
  return Math.floor(e.timestamp / 1000) as UTCTimestamp;
}

export default function EpochComboChart({
  epochs,
  quoteSymbol,
  tokenSymbol,
  quoteDecimals,
  tokenDecimals,
  className,
  onHoverEpoch,
  onSelectEpoch,
  onVisibleRange,
}: EpochComboChartProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const chartElRef = useRef<HTMLDivElement | null>(null);
  const skipFirstSyncRef = useRef(true);
  /** Latest dataset, for callbacks that outlive a render. */
  const epochsRef = useRef<EpochData[]>(epochs);

  const chartRef = useRef<IChartApi | null>(null);
  const barsRef = useRef<ISeriesApi<"Custom"> | null>(null);
  const lineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const introRef = useRef<IntroController | null>(null);
  const tooltipRef = useRef<TooltipController | null>(null);
  const byTimeRef = useRef<Map<number, EpochData>>(new Map());
  const hoverTimeRef = useRef<number | null>(null);
  const fmtRef = useRef({
    quoteSymbol,
    tokenSymbol,
    quoteDecimals,
    tokenDecimals,
  });
  useEffect(() => {
    fmtRef.current = {
      quoteSymbol,
      tokenSymbol,
      quoteDecimals,
      tokenDecimals,
    };
  }, [quoteSymbol, tokenSymbol, quoteDecimals, tokenDecimals]);
  const onHoverEpochRef = useRef(onHoverEpoch);
  useEffect(() => {
    onHoverEpochRef.current = onHoverEpoch;
  }, [onHoverEpoch]);
  const onSelectEpochRef = useRef(onSelectEpoch);
  useEffect(() => {
    onSelectEpochRef.current = onSelectEpoch;
  }, [onSelectEpoch]);
  const onVisibleRangeRef = useRef(onVisibleRange);
  useEffect(() => {
    onVisibleRangeRef.current = onVisibleRange;
  }, [onVisibleRange]);

  const toBarItem = (e: EpochData): RoundedBarsData => ({
    time: timeOf(e),
    value: unitsToNumber(
      e.participationAmount,
      fmtRef.current.quoteDecimals,
    ),
    state: e.state,
    mine: e.participated,
  });
  const toLinePoint = (e: EpochData) => ({
    time: timeOf(e),
    value: e.clearPrice ?? 0,
  });

  // ---- mount: create chart, series, primitives, tooltip, intro ----------
  useEffect(() => {
    const wrap = wrapRef.current;
    const chartEl = chartElRef.current;
    if (!wrap || !chartEl) return;

    const reducedMotion =
      typeof window !== "undefined" &&
      !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const colors = {
      line: readVar(wrap, "--sqrt-text-primary"),
      rest: readVar(wrap, "--color-alpha-steel-12"),
      mine: readVar(wrap, "--sqrt-action-secondary-rest"),
      current: readVar(wrap, "--color-alpha-amber-45"),
      hover: readVar(wrap, "--sqrt-action-primary-rest"),
      future: readVar(wrap, "--color-alpha-steel-12"),
      axisText: readVar(wrap, "--color-graphite-400"),
      // component-only: no semantic/primitive token matches this exact value
      crosshair: "rgba(99, 108, 121, 0.45)",
      timeAxisBorder: "rgba(167, 176, 188, 0.18)",
    };

    const chart = createChart(chartEl, {
      autoSize: true,
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: colors.axisText,
        fontSize: 12,
        fontFamily: '"IBM Plex Sans Condensed",system-ui,sans-serif',
        attributionLogo: false,
      },
      grid: { vertLines: { visible: false }, horzLines: { visible: false } },
      rightPriceScale: {
        visible: false,
        scaleMargins: { top: 0.1, bottom: 0.16 },
      },
      timeScale: {
        borderColor: colors.timeAxisBorder,
        rightOffset: 5,
        barSpacing: 12,
        minBarSpacing: 0.4,
      },
      crosshair: {
        mode: CrosshairMode.Normal,
        vertLine: {
          color: colors.crosshair,
          width: 1,
          style: LineStyle.Dashed,
          labelVisible: true,
          labelBackgroundColor: readVar(wrap, "--sqrt-bg-overlay"),
        },
        horzLine: { visible: false, labelVisible: false },
      },
      handleScale: {
        mouseWheel: true,
        pinch: true,
        axisPressedMouseMove: { time: true, price: false },
      },
      handleScroll: {
        mouseWheel: true,
        pressedMouseMove: true,
        horzTouchDrag: true,
        vertTouchDrag: false,
      },
      kineticScroll: { mouse: true, touch: true },
      localization: { dateFormat: "dd MMM" },
    });
    chartRef.current = chart;

    // bars FIRST, line SECOND — line always paints above bars.
    const bars = chart.addCustomSeries(new RoundedBarsSeries(), {
      priceScaleId: "vol",
      priceFormat: { type: "volume" },
      lastValueVisible: false,
      priceLineVisible: false,
      restColor: colors.rest,
      mineColor: colors.mine,
      curColor: colors.current,
      futColor: colors.future,
    });
    barsRef.current = bars;

    const line = chart.addSeries(LineSeries, {
      color: colors.line,
      lineWidth: 2,
      pointMarkersVisible: false,
      pointMarkersRadius: 3,
      crosshairMarkerVisible: true,
      crosshairMarkerRadius: 4,
      priceFormat: { type: "price", precision: 4, minMove: 0.0001 },
      lastValueVisible: false,
      priceLineVisible: false,
    });
    lineRef.current = line;

    chart
      .priceScale("vol")
      .applyOptions({ scaleMargins: { top: 1 - LOCKED.barHeight, bottom: 0 } });

    // ---- hover highlight primitive (paints below the line, always) -----
    const hoverPrim = createHoverPrimitive({
      chart,
      barsSeries: bars,
      getValue: (t) => {
        const rec = byTimeRef.current.get(t as unknown as number);
        return rec
          ? unitsToNumber(
              rec.participationAmount,
              fmtRef.current.quoteDecimals,
            )
          : undefined;
      },
      getBarWidthFactor: () => LOCKED.barWidthFactor,
      getBarRadius: () => LOCKED.barRadius,
      getHoverColor: () => colors.hover,
    });
    bars.attachPrimitive(hoverPrim);

    // ---- lazy paging on scroll --------------------------------------------
    // The chart can never scroll past its own data, so reaching an edge (or
    // the prefetch margin before it) is what asks the caller for more epochs.
    // Debounced: a fling fires dozens of range changes but only the resting
    // position matters, so at most one page is requested per gesture.
    let reportTimer: ReturnType<typeof setTimeout> | null = null;
    const reportVisibleRange = () => {
      if (reportTimer !== null) clearTimeout(reportTimer);
      reportTimer = setTimeout(() => {
        reportTimer = null;
        const data = epochsRef.current;
        const cb = onVisibleRangeRef.current;
        if (!cb || data.length === 0) return;
        const r = chart.timeScale().getVisibleLogicalRange();
        if (!r) return;
        const lastIndex = data.length - 1;
        const epochIndexAt = (logical: number) => {
          const i = Math.min(Math.max(Math.round(logical), 0), lastIndex);
          return data[i].epoch - 1;
        };
        cb(
          Math.max(0, epochIndexAt(r.from) - PREFETCH_BARS),
          epochIndexAt(r.to) + PREFETCH_BARS,
        );
      }, RANGE_REPORT_DEBOUNCE_MS);
    };

    // ---- dots on zoom-in --------------------------------------------------
    let dotsOn = false;
    chart.timeScale().subscribeVisibleLogicalRangeChange((r) => {
      if (!r) return;
      const spacing = chartEl.clientWidth / Math.max(1, r.to - r.from);
      const want = spacing >= LOCKED.dotThresholdPx;
      if (want !== dotsOn) {
        dotsOn = want;
        line.applyOptions({ pointMarkersVisible: want });
      }
      reportVisibleRange();
    });

    // ---- tooltip + hover ---------------------------------------------------
    const tooltip = createTooltipController(wrap);
    tooltipRef.current = tooltip;

    const fmtVol = (raw: bigint) =>
      `${roundUnits(raw, fmtRef.current.quoteDecimals)} ${fmtRef.current.quoteSymbol}`;
    const fmtPrice = (p: number | null) =>
      p == null ? "—" : `${formatPrice(p)} ${fmtRef.current.quoteSymbol}`;
    const fmtSupply = (raw: bigint) =>
      `${roundUnits(raw, fmtRef.current.tokenDecimals)} ${fmtRef.current.tokenSymbol}`;

    const onCrosshairMove = (param: MouseEventParams<Time>) => {
      const rec =
        param.time != null
          ? byTimeRef.current.get(param.time as unknown as number)
          : null;
      if (!rec || !param.point) {
        if (hoverTimeRef.current != null) {
          hoverTimeRef.current = null;
          hoverPrim.setHoverTime(null);
          onHoverEpochRef.current?.(null);
        }
        tooltip.hide();
        return;
      }
      const t = param.time as unknown as number;
      if (hoverTimeRef.current !== t) {
        hoverTimeRef.current = t;
        hoverPrim.setHoverTime(param.time as Time);
        onHoverEpochRef.current?.(rec);
      }
      tooltip.show(
        [
          { label: "Epoch num", value: `#${rec.epoch}` },
          { label: "Epoch supply", value: fmtSupply(rec.supplyAmount ?? 0n) },
          { label: "Clear price", value: fmtPrice(rec.clearPrice) },
          {
            label: "Participation vol",
            value: fmtVol(rec.participationAmount ?? 0n),
          },
        ],
        param.point.x,
        param.point.y,
        chartEl.clientWidth,
        chartEl.clientHeight,
      );
    };
    chart.subscribeCrosshairMove(onCrosshairMove);
    // Mobile has no hover — a tap fires subscribeClick (mouse click too,
    // harmlessly redundant with the crosshair move desktop already gets),
    // reusing the same handler so tapping a bar behaves like desktop hover.
    // A click additionally opens the epoch detail dialog.
    const onClick = (param: MouseEventParams<Time>) => {
      onCrosshairMove(param);
      const rec =
        param.time != null
          ? byTimeRef.current.get(param.time as unknown as number)
          : null;
      if (rec) onSelectEpochRef.current?.(rec);
    };
    chart.subscribeClick(onClick);

    const onMouseLeave = () => {
      tooltip.hide();
      if (hoverTimeRef.current != null) {
        hoverTimeRef.current = null;
        hoverPrim.setHoverTime(null);
        onHoverEpochRef.current?.(null);
      }
    };
    chartEl.addEventListener("mouseleave", onMouseLeave);

    // Touch has no hover-out — a tap elsewhere on the screen (anywhere
    // except the tooltip itself, so its contents stay readable) is what
    // returns the chart to rest, mirroring desktop's mouseleave.
    const onDocumentPointerDown = (e: PointerEvent) => {
      const tooltipEl = wrap.querySelector(".chart-tooltip");
      if (tooltipEl && e.target instanceof Node && tooltipEl.contains(e.target))
        return;
      onMouseLeave();
    };
    document.addEventListener("pointerdown", onDocumentPointerDown);

    // ---- intro (token-guarded, scale-locked) -------------------------------
    const intro = createIntroController({
      chart,
      barsSeries: bars,
      lineSeries: line,
      toBarItem,
      toLinePoint,
      getVolume: (e) =>
        unitsToNumber(
          e.participationAmount,
          fmtRef.current.quoteDecimals,
        ),
      introDurationMs: LOCKED.introMs,
      reducedMotion,
    });
    introRef.current = intro;

    const cancelIntro = () => intro.cancel();
    chartEl.addEventListener("pointerdown", cancelIntro);
    chartEl.addEventListener("wheel", cancelIntro, { passive: true });

    intro.setEpochs(epochs);
    byTimeRef.current = new Map(
      epochs.map((e) => [timeOf(e) as unknown as number, e]),
    );
    intro.run();
    skipFirstSyncRef.current = epochs.length > 0;

    return () => {
      if (reportTimer !== null) clearTimeout(reportTimer);
      chartEl.removeEventListener("pointerdown", cancelIntro);
      chartEl.removeEventListener("wheel", cancelIntro);
      chartEl.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("pointerdown", onDocumentPointerDown);
      intro.destroy();
      tooltip.destroy();
      chart.remove();
      chartRef.current = null;
      barsRef.current = null;
      lineRef.current = null;
      introRef.current = null;
      tooltipRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- epoch data updates after mount (epoch closes, paging) ------------
  useEffect(() => {
    const prev = epochsRef.current;
    epochsRef.current = epochs;
    if (skipFirstSyncRef.current) {
      skipFirstSyncRef.current = false;
      return;
    }
    byTimeRef.current = new Map(
      epochs.map((e) => [timeOf(e) as unknown as number, e]),
    );
    introRef.current?.setEpochs(epochs);
    const chart = chartRef.current;
    const bars = barsRef.current;
    const line = lineRef.current;
    if (!chart || !bars || !line || introRef.current?.isRunning()) return;

    // The pager hands its first window over one tick after mount, so the chart
    // can be born empty. Play the intro now rather than snapping to a static
    // chart — same reveal as a chart that mounted with data.
    if (prev.length === 0 && epochs.length > 0) {
      introRef.current?.run();
      return;
    }

    // Paging shifts every logical index: remember the viewport and re-apply it
    // shifted by however many points landed before the old first epoch, so the
    // bars on screen don't jump while loading. Re-applying on appends too keeps
    // the chart from following the new last bar, which would leave the view
    // pinned to the edge and chain another page on every load.
    const timeScale = chart.timeScale();
    const visible = timeScale.getVisibleLogicalRange();
    const prepended =
      prev.length > 0 && epochs.length > 0
        ? epochs.findIndex((e) => e.epoch === prev[0].epoch)
        : -1;

    bars.setData(epochs.map(toBarItem));
    line.setData(epochs.filter((e) => e.state === "passed").map(toLinePoint));

    if (visible) {
      const shifted = prepended > 0 ? prepended : 0;
      timeScale.setVisibleLogicalRange({
        from: visible.from + shifted,
        to: visible.to + shifted,
      });
    }
  }, [epochs]);

  return (
    <div
      ref={wrapRef}
      className={`epoch-combo-chart${className ? ` ${className}` : ""}`}
    >
      <div ref={chartElRef} className="epoch-combo-chart__canvas" />
    </div>
  );
}
