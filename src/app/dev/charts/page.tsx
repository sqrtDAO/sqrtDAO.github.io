"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import EpochBlockChart from "@/components/EpochBlockChart/EpochBlockChart";
import { generateMockEpochs } from "@/lib/charts/mockData";
import type { EpochData } from "@/lib/charts/types";
import "./page.css";

// Custom series touch canvas/window at chart-creation time — client-only,
// per the locked prototype's port notes.
const EpochComboChart = dynamic(() => import("@/components/EpochComboChart/EpochComboChart"), {
  ssr: false,
});

function advanceEpoch(epochs: EpochData[]): EpochData[] {
  const currentIndex = epochs.findIndex((e) => e.state === "current");
  if (currentIndex === -1 || currentIndex >= epochs.length - 1) return epochs;
  const next = epochs.slice();
  const closed = next[currentIndex];
  const participated = Math.random() < 0.15;
  next[currentIndex] = {
    ...closed,
    state: "passed",
    clearPrice: closed.clearPrice ?? +(0.001 * (1 + Math.random() * 0.05)).toFixed(6),
    participated,
  };
  next[currentIndex + 1] = { ...next[currentIndex + 1], state: "current" };
  return next;
}

export default function ChartsDevPreviewPage() {
  // Client-only: Math.random() inside would otherwise differ between the
  // server render and the client's first render and trigger a hydration
  // mismatch.
  const [epochs, setEpochs] = useState<EpochData[]>([]);
  const [seed, setSeed] = useState(0);
  useEffect(() => {
    // Intentional one-time client-only sync, not a cascading-render antipattern:
    // Math.random()-based mock data must never run during SSR.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEpochs(generateMockEpochs());
  }, []);

  const currentEpochLabel = useMemo(() => {
    const cur = epochs.find((e) => e.state === "current");
    return cur ? `#${cur.epoch}` : "—";
  }, [epochs]);

  const reshuffle = useCallback(() => {
    setEpochs(generateMockEpochs());
    setSeed((s) => s + 1);
  }, []);

  const advance = useCallback(() => {
    setEpochs((prev) => advanceEpoch(prev));
  }, []);

  return (
    <div className="charts-dev">
      <header className="charts-dev__header">
        <h1>Chart components — localhost preview</h1>
        <p>Mock data only. Not part of the production route tree.</p>
        <div className="charts-dev__controls">
          <button type="button" onClick={reshuffle}>
            reshuffle mock data
          </button>
          <button type="button" onClick={advance}>
            advance epoch (current: {currentEpochLabel})
          </button>
        </div>
      </header>

      <section className="charts-dev__section">
        <h2>Block chart — {epochs.length} epochs</h2>
        <div className="charts-dev__block-card">
          <EpochBlockChart key={seed} epochs={epochs} />
        </div>
      </section>

      <section className="charts-dev__section">
        <h2>Combo chart</h2>
        <div className="charts-dev__combo-card">
          <div className="charts-dev__combo-info">
            <div className="charts-dev__combo-data">
              <span>Current epoch</span>
              <strong>{currentEpochLabel}</strong>
            </div>
          </div>
          <div className="charts-dev__combo-chart">
            <EpochComboChart key={seed} epochs={epochs} />
          </div>
        </div>
      </section>
    </div>
  );
}
