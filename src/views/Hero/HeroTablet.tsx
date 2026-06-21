"use client";

export default function HeroTablet() {
  return (
    <div style={{ width: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
      {/* info card */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "24px 20px", display: "flex", gap: 20, alignItems: "flex-start" }}>
        <img src="/logo.svg" alt="sqrtDAO" width="120" style={{ flexShrink: 0 }} />
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-accent)", margin: 0 }}>Launch and distribute</p>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: "4px 0 0" }}>infrastructure for tokens.</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", marginTop: 12 }}>Launching Q2.</p>
        </div>
      </div>
      {/* headline block */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "24px 20px" }}>
        {/* teal gradient strip */}
        <div style={{ width: 200, height: 10, display: "flex", marginBottom: 20 }}>
          <i style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-700)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-100)" }} />
        </div>
        <h1 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)" }}>A launch is a moment</h1>
        <h1 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)", marginTop: 8 }}>Distribution is a process</h1>
        <h1 className="headline" style={{ fontSize: "var(--font-size-display-m)", lineHeight: "var(--font-line-height-display-m)", letterSpacing: "var(--font-letter-spacing-display-m)", marginTop: 24 }}>We built the process</h1>
      </div>
      {/* bottom decorative row */}
      <div style={{ display: "flex", gap: 4 }}>
        <div style={{ width: 80, height: 48, background: "var(--sqrt-bg-surface)" }} />
        <div style={{ width: 140, height: 48, background: "var(--sqrt-bg-overlay)" }} />
      </div>
    </div>
  );
}
