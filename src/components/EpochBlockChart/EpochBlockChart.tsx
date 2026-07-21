"use client";

import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { getParticipationVolumeRange, getVolumeBucketVar, type VolumeRange } from "@/lib/charts/bucketColor";
import { BLOCK_H, BLOCK_W, blockPosition, computeBlockLayout, gridPixelSize } from "@/lib/charts/blockLayout";
import { createTooltipController, type TooltipController } from "@/lib/charts/tooltipController";
import type { EpochData } from "@/lib/charts/types";
import "@/components/ChartTooltip/ChartTooltip.css";
import "./EpochBlockChart.css";

export interface EpochBlockChartProps {
  /** Full chronological epoch dataset: passed epochs first, one current, then future. */
  epochs: EpochData[];
  quoteSymbol?: string;
  tokenSymbol?: string;
  className?: string;
}

const CAPSULE_RX = BLOCK_W / 2;
const GLOW_FILTER_ID = "epoch-block-current-glow";

function fillFor(e: EpochData, volumeRange: VolumeRange): string {
  if (e.state === "current") return "var(--sqrt-action-primary-rest)";
  if (e.state === "future") return "var(--color-alpha-steel-08)";
  if (e.participationVolume <= 0) return "var(--color-alpha-steel-08)";
  return getVolumeBucketVar(e.participationVolume, volumeRange);
}

function findCurrentIndex(epochs: EpochData[]): number {
  const i = epochs.findIndex((e) => e.state === "current");
  return i === -1 ? Math.max(0, epochs.length - 1) : i;
}

export default function EpochBlockChart({
  epochs,
  quoteSymbol = "USDT",
  tokenSymbol = "TOKEN",
  className,
}: EpochBlockChartProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const tooltipRef = useRef<TooltipController | null>(null);
  const hoveredRef = useRef<{ el: SVGRectElement; index: number } | null>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (w != null) setContainerWidth(w);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const tooltip = createTooltipController(wrap);
    tooltipRef.current = tooltip;
    return () => tooltip.destroy();
  }, []);

  const currentIndex = useMemo(() => findCurrentIndex(epochs), [epochs]);
  const volumeRange = useMemo(() => getParticipationVolumeRange(epochs), [epochs]);
  const layout = useMemo(
    () => computeBlockLayout(containerWidth, epochs.length, currentIndex),
    [containerWidth, epochs.length, currentIndex]
  );
  const gridSize = useMemo(() => gridPixelSize(layout.columns, layout.rows), [layout]);

  function restoreFill(el: SVGRectElement, index: number) {
    el.setAttribute("fill", fillFor(epochs[index], volumeRange));
  }

  function handlePointerMove(e: ReactPointerEvent<SVGSVGElement>) {
    const target = e.target as SVGElement;
    if (target.tagName !== "rect" || !target.dataset.index) {
      handlePointerLeave();
      return;
    }
    const index = Number(target.dataset.index);
    const rect = target as unknown as SVGRectElement;

    if (hoveredRef.current?.index !== index) {
      if (hoveredRef.current) restoreFill(hoveredRef.current.el, hoveredRef.current.index);
      rect.setAttribute("fill", "var(--sqrt-action-primary-rest)");
      hoveredRef.current = { el: rect, index };
    }

    const epoch = epochs[index];
    const host = scrollRef.current;
    if (!host) return;
    const hostRect = host.getBoundingClientRect();
    tooltipRef.current?.show(
      [
        { label: "Epoch num", value: `#${epoch.epoch}` },
        { label: "Epoch supply", value: `${epoch.supply.toLocaleString("en-US")} ${tokenSymbol}` },
        {
          label: "Clear price",
          value: epoch.clearPrice == null ? "—" : `${parseFloat(epoch.clearPrice.toFixed(4))} ${quoteSymbol}`,
        },
        {
          label: "Participation vol",
          value: epoch.participationVolume
            ? `${epoch.participationVolume.toLocaleString("en-US")} ${quoteSymbol}`
            : "—",
        },
      ],
      e.clientX - hostRect.left + host.scrollLeft,
      e.clientY - hostRect.top,
      host.scrollWidth,
      host.clientHeight
    );
  }

  function handlePointerLeave() {
    if (hoveredRef.current) {
      restoreFill(hoveredRef.current.el, hoveredRef.current.index);
      hoveredRef.current = null;
    }
    tooltipRef.current?.hide();
  }

  return (
    <div ref={wrapRef} className={`epoch-block-chart${className ? ` ${className}` : ""}`}>
      <div ref={scrollRef} className="epoch-block-chart__scroll">
        <svg
          ref={svgRef}
          className="epoch-block-chart__grid"
          width={gridSize.width}
          height={gridSize.height}
          viewBox={`0 0 ${Math.max(1, gridSize.width)} ${Math.max(1, gridSize.height)}`}
          onPointerMove={handlePointerMove}
          onPointerLeave={handlePointerLeave}
        >
          <defs>
            {/* objectBoundingBox % is relative to the 4x12 rect itself — a
                stdDeviation:9 blur needs ~3x that (~27px) of margin to avoid
                clipping, especially on the 4px-wide axis. */}
            <filter id={GLOW_FILTER_ID} x="-700%" y="-250%" width="1500%" height="600%">
              <feDropShadow dx="0" dy="0" stdDeviation="9" floodColor="var(--sqrt-action-primary-rest)" floodOpacity="0.4" />
            </filter>
          </defs>
          {containerWidth > 0 &&
            epochs.map((epoch, i) => {
              const { x, y } = blockPosition(i, layout.columns);
              return (
                <rect
                  key={epoch.epoch}
                  data-index={i}
                  x={x}
                  y={y}
                  width={BLOCK_W}
                  height={BLOCK_H}
                  rx={CAPSULE_RX}
                  fill={fillFor(epoch, volumeRange)}
                  filter={epoch.state === "current" ? `url(#${GLOW_FILTER_ID})` : undefined}
                />
              );
            })}
        </svg>
      </div>
    </div>
  );
}
