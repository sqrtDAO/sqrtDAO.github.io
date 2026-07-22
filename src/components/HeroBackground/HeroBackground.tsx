"use client";

import { useEffect, useRef, useState } from "react";
import type { SmokeMeshBackground, SmokeMeshOptions } from "@/lib/heroBackground/smokeMesh";

const COL_POSITIONS = [0, 152, 304, 456, 608, 760, 912, 1064, 1216, 1368, 1520, 1672];

const DEFAULT_COLORS: [string, string, string] = ["#6B4F9E", "#C4892A", "#E8E2F0"];

export type HeroBackgroundProps = Partial<SmokeMeshOptions>;

export default function HeroBackground(props: HeroBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<SmokeMeshBackground | null>(null);
  const [ready, setReady] = useState(false);

  const colors = props.colors ?? DEFAULT_COLORS;
  const { intensity, grain, mesh, speed, hover, quality, scale } = props;

  // Mount: load the WebGL engine off the critical path and hand it the canvas.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let cancelled = false;

    import("@/lib/heroBackground/smokeMesh").then(({ createSmokeMeshBackground }) => {
      if (cancelled) return;
      instanceRef.current = createSmokeMeshBackground(canvas, {
        ...props,
        onFirstFrame: () => setReady(true),
      });
    });

    return () => {
      cancelled = true;
      instanceRef.current?.destroy();
      instanceRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync prop changes into the running instance (skipped on mount, handled above).
  useEffect(() => {
    instanceRef.current?.setOptions({ colors, intensity, grain, mesh, speed, hover, quality, scale });
  }, [colors, intensity, grain, mesh, speed, hover, quality, scale]);

  return (
    <>
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: `radial-gradient(80% 80% at 50% 45%, ${colors[1]}33, ${colors[0]}22 55%, transparent 80%)` }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className={`block h-full w-full transition-opacity duration-500 ${ready ? "opacity-100" : "opacity-0"}`}
        />
      </div>
      <div
        className="veil"
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 2,
          pointerEvents: "none",
          background: "radial-gradient(120% 100% at 50% 45%, transparent 55%, rgba(11,13,18,.55) 100%)",
        }}
      />
      <div
        className="cols"
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1672,
          height: "100vh",
          zIndex: 3,
          pointerEvents: "none",
          overflow: "visible",
          display: "none",
        }}
      >
        <svg width={1672} height="100%" preserveAspectRatio="none" style={{ display: "block", width: 1672, overflow: "visible" }}>
          {COL_POSITIONS.map((x) => (
            <line
              key={x}
              x1={x}
              y1={0}
              x2={x}
              y2="100%"
              stroke="#FFFFFF"
              strokeOpacity={0.2}
              strokeWidth={0.25}
            />
          ))}
        </svg>
      </div>
    </>
  );
}
