"use client";

import { IconSwords } from "@tabler/icons-react";

export default function View2BMobile() {
  return (
    <div style={{ width: "calc(100% + 48px)", marginLeft: -24, marginRight: -24, display: "flex", flexDirection: "column", paddingLeft: 16, alignSelf: "flex-start", paddingTop: 52 }}>
      {/* Title bar */}
      <div style={{ background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px" }}>
        <IconSwords size={32} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
        <h2 className="headline" style={{ fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)" }}>We&apos;re building</h2>
      </div>

      {/* Surface card — stuck to title */}
      <div style={{ background: "var(--sqrt-bg-surface)", padding: "16px 12px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>
          A platform to distributes your token in slow, timed releases.<br />
          not one violent launch.
        </p>
      </div>

      {/* Description — 180px below */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "6px 24px", marginTop: 180, display: "flex", flexDirection: "column", gap: 10 }}>
        <h3 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)" }}>
          Price discovers itself gradually.
        </h3>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>
          Newcomers aren&apos;t punished for being early.<br />
          No single whale takes the whole supply at once.<br />
          And the backing you put in can&apos;t be pulled.<br />
          Not by us, not by anyone.
        </p>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>
          That&apos;s not a promise. That&apos;s the protocol.
        </p>
      </div>
    </div>
  );
}
