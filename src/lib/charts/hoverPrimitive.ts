import type {
  IChartApi,
  IPrimitivePaneRenderer,
  IPrimitivePaneView,
  ISeriesApi,
  ISeriesPrimitive,
  SeriesAttachedParameter,
  Time,
} from "lightweight-charts";
import { roundedBarPath } from "./roundedBars";

export interface HoverPrimitiveDeps {
  chart: IChartApi;
  barsSeries: ISeriesApi<"Custom">;
  /** Resolve the bar's volume value for a hovered time, or undefined if none. */
  getValue: (time: Time) => number | undefined;
  getBarWidthFactor: () => number;
  getBarRadius: () => number;
  getHoverColor: () => string;
}

export interface HoverPrimitive extends ISeriesPrimitive<Time> {
  setHoverTime(time: Time | null): void;
}

/**
 * Ported from v4-locked: hover highlight is an ISeriesPrimitive painted with
 * zOrder 'normal' (below the price line, above the bars), never a mutation
 * of the bar series' own options/data. Do not simplify this into a
 * per-bar-color reorder — that was the exact bug v4 fixed.
 */
export function createHoverPrimitive(deps: HoverPrimitiveDeps): HoverPrimitive {
  const { chart, barsSeries, getValue, getBarWidthFactor, getBarRadius, getHoverColor } = deps;
  let hoverTime: Time | null = null;
  let requestUpdate: (() => void) | null = null;

  const renderer: IPrimitivePaneRenderer = {
    draw(target) {
      if (hoverTime == null) return;
      const value = getValue(hoverTime);
      if (value === undefined) return;
      const x = chart.timeScale().timeToCoordinate(hoverTime);
      const y = barsSeries.priceToCoordinate(value);
      const b = barsSeries.priceToCoordinate(0);
      if (x == null || y == null) return;
      const spacing = chart.timeScale().options().barSpacing;

      target.useBitmapCoordinateSpace((scope) => {
        const ctx = scope.context;
        const hpr = scope.horizontalPixelRatio;
        const vpr = scope.verticalPixelRatio;
        const baseY = b == null ? scope.bitmapSize.height : b * vpr;
        const halfW = Math.max(1, (spacing * getBarWidthFactor() * hpr) / 2);
        const top = y * vpr;
        const left = x * hpr - halfW;
        const w = halfW * 2;
        const h = Math.max(0, baseY - top);
        if (h < 0.5) return;
        const rad = Math.min(getBarRadius() * hpr, w / 2, h);
        ctx.fillStyle = getHoverColor();
        roundedBarPath(ctx, left, top, w, baseY, rad);
        ctx.fill();
      });
    },
  };

  const paneView: IPrimitivePaneView = {
    renderer: () => renderer,
    zOrder: () => "normal",
  };

  return {
    attached(param: SeriesAttachedParameter<Time>) {
      requestUpdate = param.requestUpdate;
    },
    detached() {
      requestUpdate = null;
    },
    paneViews: () => [paneView],
    updateAllViews() {},
    setHoverTime(time: Time | null) {
      hoverTime = time;
      requestUpdate?.();
    },
  };
}
