"use client";

import { IconBrain, IconSwords } from "@tabler/icons-react";

export default function View2Tablet() {
  return (
    <div style={{ width: 720, margin: "0 auto", display: "flex", flexDirection: "column", gap: 24 }}>
      {/* Row 1 — Core Idea */}
      <div>
        <div style={{ background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 16, padding: "20px 16px" }}>
          <IconBrain size={42} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
          <h2 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)" }}>Core Idea</h2>
        </div>
        <div style={{ background: "var(--sqrt-bg-surface)", padding: "20px 16px", marginTop: 2 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: 0 }}>Satoshi never sold Bitcoin. The <span style={{ color: "var(--sqrt-text-accent)" }}>fairest distribution</span> in crypto history didn&apos;t happen in a single block.</p>
        </div>
      </div>
      {/* Row 2 — We're building */}
      <div>
        <div style={{ background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 16, padding: "20px 16px" }}>
          <IconSwords size={42} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
          <h2 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)" }}>We&apos;re building</h2>
        </div>
        <div style={{ background: "var(--sqrt-bg-surface)", padding: "20px 16px", marginTop: 2 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: 0 }}>A platform to distributes your token in slow, timed releases. not one violent launch.</p>
        </div>
      </div>
    </div>
  );
}
