"use client";

import { Button } from "@/components/Button/Button";
import { IconBrandX, IconBrandDiscord } from "@tabler/icons-react";

export default function CTAMobile() {
  return (
    <div style={{ width: "100%", padding: "0 16px" }}>
      <div style={{ background: "var(--sqrt-bg-space)", padding: "24px 16px", display: "flex", flexDirection: "column" }}>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", margin: 0 }}>sqrtDAO launches Q2.</p>
        <img src="/logo.svg" alt="sqrtDAO" width="80" style={{ marginTop: 20 }} />
        <div style={{ width: 120, height: 6, display: "flex", marginTop: 20 }}>
          <div style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
          <div style={{ flex: 3, background: "var(--color-support-teal-700)" }} />
          <div style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
          <div style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-secondary)", margin: "20px 0 0" }}>You will set the token parameters.</p>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-secondary)", margin: "2px 0 0" }}>The protocol runs the rest.</p>
        <h2 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)", marginTop: 8 }}>Be in the first cohort.</h2>
        <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
          <Button variant="primary" leadingIcon={<IconBrandX />}>Follow on X</Button>
          <Button variant="secondary" leadingIcon={<IconBrandDiscord />}>Join Discord</Button>
        </div>
        <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", marginTop: 16 }}>Owned by no one. Controlled by the protocol.</p>
      </div>
    </div>
  );
}
