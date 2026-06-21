"use client";

import { Button } from "@/components/Button/Button";
import { IconBrandX, IconBrandDiscord } from "@tabler/icons-react";

export default function CTATablet() {
  return (
    <div style={{ width: 720, margin: "0 auto" }}>
      <div style={{ background: "var(--sqrt-bg-space)", padding: "32px 24px", display: "flex", flexDirection: "column", gap: 0 }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", margin: 0 }}>sqrtDAO launches Q2.</p>
        <img src="/logo.svg" alt="sqrtDAO" width="100" style={{ marginTop: 24 }} />
        {/* teal strip */}
        <div style={{ width: 200, height: 8, display: "flex", marginTop: 24 }}>
          <div style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
          <div style={{ flex: 3, background: "var(--color-support-teal-700)" }} />
          <div style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
          <div style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: "24px 0 0" }}>You will set the token parameters.</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: "4px 0 0" }}>The protocol runs the rest.</p>
        <h2 className="headline" style={{ fontSize: "var(--font-size-display-m)", lineHeight: "var(--font-line-height-display-m)", letterSpacing: "var(--font-letter-spacing-display-m)", marginTop: 8 }}>Be in the first cohort.</h2>
        <div style={{ display: "flex", gap: 16, marginTop: 32 }}>
          <Button variant="primary" leadingIcon={<IconBrandX />}>Follow on X</Button>
          <Button variant="secondary" leadingIcon={<IconBrandDiscord />}>Join Discord</Button>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", marginTop: 16 }}>Owned by no one. Controlled by the protocol.</p>
      </div>
    </div>
  );
}
