"use client";

import { IconBrain, IconSwords } from "@tabler/icons-react";

export default function View2Mobile() {
  return (
    <div style={{ width: "100%", padding: "0 16px", display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Row 1 — Core Idea */}
      <div>
        <div style={{ background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 12, padding: "16px 12px" }}>
          <IconBrain size={32} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
          <h2 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)" }}>Core Idea</h2>
        </div>
        <div style={{ background: "var(--sqrt-bg-surface)", padding: "16px 12px", marginTop: 2 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>Satoshi never sold Bitcoin. The <span style={{ color: "var(--sqrt-text-accent)" }}>fairest distribution</span> in crypto history didn&apos;t happen in a single block.</p>
        </div>
      </div>
      {/* Row 2 — We're building */}
      <div>
        <div style={{ background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 12, padding: "16px 12px" }}>
          <IconSwords size={32} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
          <h2 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)" }}>We&apos;re building</h2>
        </div>
        <div style={{ background: "var(--sqrt-bg-surface)", padding: "16px 12px", marginTop: 2 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>A platform to distributes your token in slow, timed releases. not one violent launch.</p>
        </div>
      </div>
    </div>
  );
}
