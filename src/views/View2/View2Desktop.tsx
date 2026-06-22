"use client";

import { IconBrain, IconSwords } from "@tabler/icons-react";

export default function View2Desktop() {
  return (
    <div style={{ width: 1192, display: "flex", flexDirection: "column", gap: 32 }}>
      {/* Row 1 — Core Idea */}
      <div className="v2-row">
        <div style={{ width: 508, height: 119, background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 16, padding: "0 8px", flexShrink: 0 }}>
          <IconBrain size={54} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
          <h2 className="headline" style={{ fontSize: "var(--font-size-display-m)", lineHeight: "var(--font-line-height-display-m)", letterSpacing: "var(--font-letter-spacing-display-m)" }}>Core Idea</h2>
        </div>
        <div style={{ background: "var(--sqrt-bg-surface)", width: 404, height: 119, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: 0 }}>Satoshi never sold Bitcoin.<br />The <span style={{ color: "var(--sqrt-text-accent)" }}>fairest distribution</span> in crypto history<br />didn&apos;t happen in a single block.</p>
        </div>
        <div className="v2-hover" style={{ width: 280, padding: "4px 16px", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: "0 0 16px" }}>Satoshi released it slowly, earned over time, by the people who showed up and did the work.</p>
          <h3 className="headline" style={{ fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)" }}>Somewhere along the way, the industry forgot.</h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: "16px 0 0" }}>Now most tokens are priced in their first minute by bots, by whales, by whoever&apos;s fastest.<br />sqrtDAO brings slow distribution back.</p>
        </div>
      </div>
      {/* Row 2 — We're building */}
      <div className="v2-row">
        <div style={{ width: 508, height: 119, background: "var(--sqrt-bg-space)", display: "flex", alignItems: "center", gap: 16, padding: "0 8px", flexShrink: 0 }}>
          <IconSwords size={54} stroke={1.4} style={{ color: "var(--sqrt-text-accent)", flexShrink: 0 }} />
          <h2 className="headline" style={{ fontSize: "var(--font-size-display-m)", lineHeight: "var(--font-line-height-display-m)", letterSpacing: "var(--font-letter-spacing-display-m)" }}>We&apos;re building</h2>
        </div>
        <div style={{ background: "var(--sqrt-bg-surface)", width: 404, height: 119, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 24px", flexShrink: 0 }}>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: 0 }}>A platform to distributes your token in<br />slow, timed releases.<br />not one violent launch.</p>
        </div>
        <div className="v2-hover" style={{ width: 280, padding: "4px 16px", flexShrink: 0 }}>
          <h3 className="headline" style={{ fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)" }}>Price discovers itself gradually.</h3>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: "16px 0 0" }}>Newcomers aren&apos;t punished for being early.<br />No single whale takes the whole supply at once.<br />And the backing you put in can&apos;t be pulled.<br />Not by us, not by anyone.</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: "16px 0 0" }}>That&apos;s not a promise. That&apos;s the protocol.</p>
        </div>
      </div>
    </div>
  );
}
