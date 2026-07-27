"use client";

import { useEffect, useRef, useState } from "react";
import type { SmokeMeshBackground as SmokeMeshEngine, SmokeMeshOptions } from "@/lib/heroBackground/smokeMesh";

const DEFAULT_COLORS: [string, string, string] = ["#6B4F9E", "#C4892A", "#E8E2F0"];

export type SmokeMeshBackgroundProps = Partial<SmokeMeshOptions>;

/**
 * V.1 landing background — the signed-off purple/orange/cream morphing cloud +
 * tearing vector net (sqrtdao-smoke-mesh-bg.html), ported to the two-pass/baked-noise
 * engine in src/lib/heroBackground for performance. V.1-only: do not wire into V.0 routes.
 */
export default function SmokeMeshBackground(props: SmokeMeshBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const instanceRef = useRef<SmokeMeshEngine | null>(null);
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
  );
}
