import type { CanvasRenderingTarget2D } from "fancy-canvas";
import {
  customSeriesDefaultOptions,
  type CustomData,
  type CustomSeriesOptions,
  type CustomSeriesPricePlotValues,
  type CustomSeriesWhitespaceData,
  type ICustomSeriesPaneRenderer,
  type ICustomSeriesPaneView,
  type PaneRendererCustomData,
  type PriceToCoordinateConverter,
  type Time,
} from "lightweight-charts";
import type { EpochState } from "./types";

/**
 * Ported as-is from sqrtdao-epoch-chart-v4-locked.html. Bar state colors are
 * resolved from SERIES OPTIONS at draw time (fillFor reads `o`, never the
 * per-bar record) — this is the fix the "v4 locked" build exists for, do
 * not go back to baking colors into per-bar data.
 */
export interface RoundedBarsData extends CustomData<Time> {
  value: number;
  state: EpochState;
  mine: boolean;
}

export interface RoundedBarsSeriesOptions extends CustomSeriesOptions {
  radius: number;
  widthFactor: number;
  restColor: string;
  mineColor: string;
  curColor: string;
  futColor: string;
}

export function roundedBarPath(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  w: number,
  baseY: number,
  rad: number
): void {
  ctx.beginPath();
  ctx.moveTo(left, baseY);
  ctx.lineTo(left, top + rad);
  ctx.arcTo(left, top, left + rad, top, rad);
  ctx.lineTo(left + w - rad, top);
  ctx.arcTo(left + w, top, left + w, top + rad, rad);
  ctx.lineTo(left + w, baseY);
  ctx.closePath();
}

function fillFor(rec: RoundedBarsData, o: RoundedBarsSeriesOptions): string {
  if (rec.state === "future") return o.futColor;
  if (rec.state === "current") return o.curColor;
  if (rec.mine) return o.mineColor;
  return o.restColor;
}

class RoundedBarsRenderer implements ICustomSeriesPaneRenderer {
  private _data: PaneRendererCustomData<Time, RoundedBarsData> | null = null;
  private _options: RoundedBarsSeriesOptions | null = null;

  update(data: PaneRendererCustomData<Time, RoundedBarsData>, options: RoundedBarsSeriesOptions): void {
    this._data = data;
    this._options = options;
  }

  draw(target: CanvasRenderingTarget2D, priceToCoord: PriceToCoordinateConverter): void {
    const d = this._data;
    const o = this._options;
    if (!d || !o || !d.visibleRange || d.bars.length === 0) return;

    target.useBitmapCoordinateSpace((scope) => {
      const ctx = scope.context;
      const hpr = scope.horizontalPixelRatio;
      const vpr = scope.verticalPixelRatio;
      const z = priceToCoord(0);
      const baseY = z == null ? scope.bitmapSize.height : z * vpr;
      const halfW = Math.max(1, (d.barSpacing * o.widthFactor * hpr) / 2);

      for (let i = d.visibleRange!.from; i < d.visibleRange!.to; i++) {
        const bar = d.bars[i];
        const rec = bar.originalData;
        const y = priceToCoord(rec.value);
        if (y == null) continue;
        const top = y * vpr;
        const x = bar.x * hpr;
        const left = x - halfW;
        const w = halfW * 2;
        const h = Math.max(0, baseY - top);
        if (h < 0.5) continue;
        const rad = Math.min(o.radius * hpr, w / 2, h);
        ctx.fillStyle = fillFor(rec, o);
        roundedBarPath(ctx, left, top, w, baseY, rad);
        ctx.fill();
      }
    });
  }
}

export class RoundedBarsSeries
  implements ICustomSeriesPaneView<Time, RoundedBarsData, RoundedBarsSeriesOptions>
{
  private _renderer = new RoundedBarsRenderer();

  priceValueBuilder(row: RoundedBarsData): CustomSeriesPricePlotValues {
    return [0, row.value];
  }

  isWhitespace(
    data: RoundedBarsData | CustomSeriesWhitespaceData<Time>
  ): data is CustomSeriesWhitespaceData<Time> {
    return (data as RoundedBarsData).value === undefined;
  }

  renderer(): ICustomSeriesPaneRenderer {
    return this._renderer;
  }

  update(data: PaneRendererCustomData<Time, RoundedBarsData>, options: RoundedBarsSeriesOptions): void {
    this._renderer.update(data, options);
  }

  defaultOptions(): RoundedBarsSeriesOptions {
    return {
      ...customSeriesDefaultOptions,
      radius: 8,
      widthFactor: 0.7,
      restColor: "rgba(167,176,188,0.12)",
      mineColor: "#313A63",
      curColor: "rgba(255,154,71,0.45)",
      futColor: "rgba(167,176,188,0.12)",
    };
  }
}
