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
import "@/components/ChartTooltip/ChartTooltip.css";
import "./EpochComboChart.css";

export interface EpochComboChartProps {
  /** Full chronological epoch dataset: passed epochs first, one current, then future. */
  epochs: EpochData[];
  quoteSymbol?: string;
  tokenSymbol?: string;
  className?: string;
  /** Fires with the hovered bar's epoch, or null once the pointer leaves the chart. */
  onHoverEpoch?: (epoch: EpochData | null) => void;
}

/** Locked values — see sqrtdao-epoch-chart-v4-locked.html. Do not retune here. */
const LOCKED = {
  barWidthFactor: 0.7,
  barRadius: 8,
  barHeight: 0.83,
  dotThresholdPx: 18,
  introMs: 750,
};

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
  className,
  onHoverEpoch,
}: EpochComboChartProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const chartElRef = useRef<HTMLDivElement | null>(null);
  const skipFirstSyncRef = useRef(true);

  const chartRef = useRef<IChartApi | null>(null);
  const barsRef = useRef<ISeriesApi<"Custom"> | null>(null);
  const lineRef = useRef<ISeriesApi<"Line"> | null>(null);
  const introRef = useRef<IntroController | null>(null);
  const tooltipRef = useRef<TooltipController | null>(null);
  const byTimeRef = useRef<Map<number, EpochData>>(new Map());
  const hoverTimeRef = useRef<number | null>(null);
  const fmtRef = useRef({ quoteSymbol, tokenSymbol });
  useEffect(() => {
    fmtRef.current = { quoteSymbol, tokenSymbol };
  }, [quoteSymbol, tokenSymbol]);
  const onHoverEpochRef = useRef(onHoverEpoch);
  useEffect(() => {
    onHoverEpochRef.current = onHoverEpoch;
  }, [onHoverEpoch]);

  const toBarItem = (e: EpochData): RoundedBarsData => ({
    time: timeOf(e),
    value: e.participationVolume,
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
      getValue: (t) =>
        byTimeRef.current.get(t as unknown as number)?.participationVolume,
      getBarWidthFactor: () => LOCKED.barWidthFactor,
      getBarRadius: () => LOCKED.barRadius,
      getHoverColor: () => colors.hover,
    });
    bars.attachPrimitive(hoverPrim);

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
    });

    // ---- tooltip + hover ---------------------------------------------------
    const tooltip = createTooltipController(wrap);
    tooltipRef.current = tooltip;

    const fmtVol = (v: number) =>
      `${v.toLocaleString("en-US")} ${fmtRef.current.quoteSymbol}`;
    const fmtPrice = (p: number | null) =>
      p == null
        ? "—"
        : `${parseFloat(p.toFixed(4)).toString()} ${fmtRef.current.quoteSymbol}`;
    const fmtSupply = (s: number) =>
      `${s.toLocaleString("en-US")} ${fmtRef.current.tokenSymbol}`;

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
          { label: "Epoch supply", value: fmtSupply(rec.supply) },
          { label: "Clear price", value: fmtPrice(rec.clearPrice) },
          {
            label: "Participation vol",
            value: fmtVol(rec.participationVolume),
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
    chart.subscribeClick(onCrosshairMove);

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

  // ---- epoch data updates after mount (real-time epoch closes etc.) -----
  useEffect(() => {
    if (skipFirstSyncRef.current) {
      skipFirstSyncRef.current = false;
      return;
    }
    byTimeRef.current = new Map(
      epochs.map((e) => [timeOf(e) as unknown as number, e]),
    );
    introRef.current?.setEpochs(epochs);
    if (!introRef.current?.isRunning() && barsRef.current && lineRef.current) {
      barsRef.current.setData(epochs.map(toBarItem));
      lineRef.current.setData(
        epochs.filter((e) => e.state === "passed").map(toLinePoint),
      );
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
