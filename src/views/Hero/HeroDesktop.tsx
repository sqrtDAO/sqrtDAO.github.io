"use client";

import Logo from "@/components/Logo/Logo";

export default function HeroDesktop() {
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {/* info card — pinned top-right */}
      <div className="card tilt" style={{ position: "absolute", top: 24, right: 24, width: 432, height: 299, background: "var(--sqrt-bg-space)", borderRadius: 0, border: "none", padding: "16px 16px 16px" }}>
        <Logo width={201} style={{ marginBottom: 24 }} />
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)", color: "var(--sqrt-text-accent)", margin: 0 }}>Launch and distribute</p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)", color: "var(--sqrt-text-secondary)", margin: "4px 0 0" }}>infrastructure for tokens.</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", marginTop: 16 }}>Launching Q2.</p>
      </div>

      {/* title group — pinned bottom-left */}
      <div style={{ position: "absolute", left: 24, bottom: 24 }}>
        {/* empty block above headline */}
        <div style={{ width: 280, height: 100, background: "var(--sqrt-bg-space)", marginBottom: 8, marginLeft: 120 }} />
        {/* headline block */}
        <div style={{ background: "var(--sqrt-bg-space)", padding: 0, position: "relative" }}>
          {/* teal gradient strip */}
          <div style={{ width: 408, height: 16, display: "flex", marginBottom: 0 }}>
            <i style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
            <i style={{ flex: 1, background: "var(--color-support-teal-700)" }} />
            <i style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
            <i style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
            <i style={{ flex: 1, background: "var(--color-support-teal-100)" }} />
          </div>
          <h1 className="headline" style={{ fontSize: "var(--font-size-display-l)", lineHeight: "var(--font-line-height-display-l)", letterSpacing: "var(--font-letter-spacing-display-l)", marginTop: 16 }}>A launch is a moment</h1>
          <h1 className="headline" style={{ fontSize: "var(--font-size-display-l)", lineHeight: "var(--font-line-height-display-l)", letterSpacing: "var(--font-letter-spacing-display-l)", marginTop: 10 }}>Distribution is a process</h1>
          <h1 className="headline" style={{ fontSize: "var(--font-size-display-xl)", lineHeight: "var(--font-line-height-display-xl)", letterSpacing: "var(--font-letter-spacing-display-xl)", marginTop: 32, whiteSpace: "nowrap" }}>We built the process</h1>
        </div>
        {/* bottom decorative blocks */}
        <div style={{ display: "flex", gap: 0, marginTop: 0 }}>
          <div style={{ width: 240, height: 80, background: "var(--sqrt-bg-space)" }} />
          <div style={{ width: 400, height: 80, background: "var(--sqrt-bg-space)" }} />
          <div style={{ width: 80, height: 80, background: "var(--sqrt-bg-surface)" }} />
          <div style={{ width: 180, height: 80, background: "var(--sqrt-bg-overlay)" }} />
        </div>
      </div>
    </div>
  );
}
