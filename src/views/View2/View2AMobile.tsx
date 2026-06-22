"use client";

import { IconBrain } from "@tabler/icons-react";

export default function View2AMobile() {
  return (
    <div style={{ width: "calc(100% + 48px)", marginLeft: -24, marginRight: -24, display: "flex", flexDirection: "column", paddingLeft: 16, alignSelf: "flex-start", paddingTop: 52 }}>
      {/* Title bar */}
      <div style={{ background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 12, padding: "10px 12px" }}>
        <IconBrain size={32} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
        <h2 className="headline" style={{ fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)" }}>Core Idea</h2>
      </div>

      {/* Surface card — stuck to title */}
      <div style={{ background: "var(--sqrt-bg-surface)", padding: "16px 12px" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>
          Satoshi never sold Bitcoin.<br />
          The <span style={{ color: "var(--sqrt-text-accent)" }}>fairest distribution</span> in crypto history didn&apos;t happen in a single block.
        </p>
      </div>

      {/* Description — 180px below */}
      <div style={{ background: "var(--sqrt-bg-space)", padding: "6px 24px", marginTop: 180, display: "flex", flexDirection: "column", gap: 10 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>
          Satoshi released it slowly, earned over time, by the people who showed up and did the work.
        </p>

        <h3 className="headline" style={{ fontSize: "var(--font-size-h2)", lineHeight: "var(--font-line-height-h2)" }}>
          Somewhere along the way, the industry forgot.
        </h3>

        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", margin: 0 }}>
          Now most tokens are priced in their first minute by bots, by whales, by whoever&apos;s fastest.<br />
          sqrtDAO brings slow distribution back.
        </p>
      </div>
    </div>
  );
}
