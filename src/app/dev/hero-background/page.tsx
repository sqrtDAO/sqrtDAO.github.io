"use client";

import { useState } from "react";
import SmokeMeshBackground from "@/components/v1/SmokeMeshBackground/SmokeMeshBackground";
import "./page.css";

const DEFAULTS = {
  colorA: "#6B4F9E",
  colorB: "#C4892A",
  colorC: "#E8E2F0",
  intensity: 0.85,
  grain: 0.34,
  mesh: 1.0,
  speed: 0.7,
  hover: 1.0,
  scale: 0.5,
};

export default function HeroBackgroundDevPreviewPage() {
  const [props, setProps] = useState(DEFAULTS);

  const set = <K extends keyof typeof DEFAULTS>(key: K, value: (typeof DEFAULTS)[K]) =>
    setProps((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="hero-bg-dev">
      <SmokeMeshBackground
        colors={[props.colorA, props.colorB, props.colorC]}
        intensity={props.intensity}
        grain={props.grain}
        mesh={props.mesh}
        speed={props.speed}
        hover={props.hover}
        scale={props.scale}
      />

      <header className="hero-bg-dev__header">
        <h1>SmokeMeshBackground (V.1) — localhost preview</h1>
        <p>Not part of the production route tree. Move your cursor over the canvas to see the hover parting / mesh tear.</p>
      </header>

      <div className="hero-bg-dev__panel">
        <h2>Live props</h2>
        <label>
          Color A
          <input type="color" value={props.colorA} onChange={(e) => set("colorA", e.target.value)} />
        </label>
        <label>
          Color B
          <input type="color" value={props.colorB} onChange={(e) => set("colorB", e.target.value)} />
        </label>
        <label>
          Color C
          <input type="color" value={props.colorC} onChange={(e) => set("colorC", e.target.value)} />
        </label>
        <label>
          Brightness
          <input
            type="range"
            min={0.2}
            max={2}
            step={0.05}
            value={props.intensity}
            onChange={(e) => set("intensity", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Grain
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={props.grain}
            onChange={(e) => set("grain", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Mesh
          <input
            type="range"
            min={0}
            max={1.5}
            step={0.05}
            value={props.mesh}
            onChange={(e) => set("mesh", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Flow
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={props.speed}
            onChange={(e) => set("speed", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Hover
          <input
            type="range"
            min={0}
            max={2}
            step={0.05}
            value={props.hover}
            onChange={(e) => set("hover", parseFloat(e.target.value))}
          />
        </label>
        <label>
          Cloud-pass scale
          <input
            type="range"
            min={0.25}
            max={1}
            step={0.05}
            value={props.scale}
            onChange={(e) => set("scale", parseFloat(e.target.value))}
          />
        </label>
      </div>
    </div>
  );
}
