"use client";

export default function HeroMobile() {
  return (
    <div style={{ width: "100%", padding: "0 16px", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* info card */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "20px 16px" }}>
        <img src="/logo.svg" alt="sqrtDAO" width="100" style={{ marginBottom: 16 }} />
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-accent)", margin: 0 }}>Launch and distribute</p>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-secondary)", margin: "2px 0 0" }}>infrastructure for tokens.</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", marginTop: 10 }}>Launching Q2.</p>
      </div>
      {/* headline block */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "20px 16px" }}>
        <div style={{ width: 140, height: 8, display: "flex", marginBottom: 16 }}>
          <i style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-700)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
          <i style={{ flex: 1, background: "var(--color-support-teal-100)" }} />
        </div>
        <h1 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)" }}>A launch is a moment</h1>
        <h1 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)", marginTop: 6 }}>Distribution is a process</h1>
        <h1 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)", marginTop: 16 }}>We built the process</h1>
      </div>
    </div>
  );
}
