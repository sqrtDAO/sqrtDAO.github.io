"use client";

import Logo from "@/components/Logo/Logo";

export default function HeroMobile() {
  return (
    <div style={{ width: "calc(100% + 48px)", marginLeft: -24, marginRight: -24, display: "flex", flexDirection: "column", alignItems: "stretch" }}>
      {/* L-shaped black region with content */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox="0 0 373 385"
          fill="none"
          style={{ width: "100%", height: "auto", display: "block" }}
          preserveAspectRatio="xMinYMin slice"
        >
          <path d="M192 0V108H373V385H0V0H192Z" fill="var(--sqrt-bg-space)" />
        </svg>

        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "0 16px" }}>
          {/* Logo in the narrow left arm */}
          <Logo width={124} style={{ marginTop: 36 }} />

          {/* Subheadlines */}
          <h2 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)", marginTop: 40 }}>A launch is a moment</h2>
          <h2 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)", marginTop: 4 }}>Distribution is a process</h2>

          {/* Main headline */}
          <h1 className="headline" style={{ fontSize: "var(--font-size-display-m)", lineHeight: "var(--font-line-height-display-m)", letterSpacing: "var(--font-letter-spacing-display-m)", marginTop: 24 }}>We built the process</h1>
        </div>
      </div>

      {/* Teal gradient strip — flush against L-shape, no gap */}
      <div style={{ display: "flex", height: 6, width: 123, marginLeft: 16 }}>
        <i style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
        <i style={{ flex: 1, background: "var(--color-support-teal-700)" }} />
        <i style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
        <i style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
        <i style={{ flex: 1, background: "var(--color-support-teal-100)" }} />
      </div>

      {/* Bottom info strip — flush against teal strip */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "12px 16px", position: "relative", paddingBottom: 44 }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", margin: 0 }}>
          <span style={{ color: "var(--sqrt-text-accent)" }}>Launch and distribute </span>
          <span style={{ color: "var(--sqrt-text-secondary)" }}>infrastructure for tokens.</span>
        </p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", marginTop: 8 }}>Launching Q2.</p>

        {/* Decorative blocks at bottom of info strip */}
        <div style={{ position: "absolute", bottom: 0, left: 123, right: 0, display: "flex", height: 32 }}>
          <div style={{ width: 79, background: "var(--sqrt-bg-surface)" }} />
          <div style={{ flex: 1, background: "var(--sqrt-bg-overlay)" }} />
        </div>
      </div>
    </div>
  );
}
