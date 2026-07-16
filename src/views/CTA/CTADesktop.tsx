"use client";

import { Button } from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import { IconBrandX, IconBrandDiscord } from "@tabler/icons-react";

export default function CTADesktop({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <div style={{ width: 912, position: "relative" }}>
      {/* subtract shape — SVG L with two cutout holes */}
      <svg width="912" height="581" viewBox="0 0 912 581" fill="none" style={{ position: "absolute", left: 0, top: 0 }}>
        <path d="M197 125H912V581H0V0H197V125ZM653 429H781V301H653V429ZM501 277H629V149H501V277Z" fill="var(--sqrt-bg-space)" />
      </svg>
      {/* teal gradient strip */}
      <div style={{ position: "absolute", left: 194, top: 115, height: 10, display: "flex" }}>
        <div style={{ width: 57, background: "var(--color-support-teal-900)" }} />
        <div style={{ width: 156, background: "var(--color-support-teal-700)" }} />
        <div style={{ width: 57, background: "var(--color-support-teal-500)" }} />
        <div style={{ width: 57, background: "var(--color-support-teal-300)" }} />
      </div>
      {/* detail label */}
      <p style={{ position: "absolute", left: 11, top: 11, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", margin: 0 }}>sqrtDAO launches Q2.</p>
      {/* logo */}
      <Logo width={124} style={{ position: "absolute", left: 11, top: 132 }} />
      {/* kickers */}
      <p style={{ position: "absolute", left: 13, top: 218, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: 0 }}>You will set the token parameters.</p>
      <p style={{ position: "absolute", left: 13, top: 247, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: 0 }}>The protocol runs the rest.</p>
      {/* headline */}
      <h2 className="headline" style={{ position: "absolute", left: 13, top: 284, fontSize: "var(--font-size-display-l)", lineHeight: "var(--font-line-height-display-l)", letterSpacing: "var(--font-letter-spacing-display-l)" }}>Be in the first cohort.</h2>
      {/* buttons */}
      <div style={{ position: "absolute", left: 8, top: 416, display: "flex", gap: 16, flexWrap: "wrap" }}>
        <Button variant="primary" leadingIcon={<IconBrandX />} onClick={() => window.open("https://x.com/DAOsqrt", "_blank", "noopener,noreferrer")}>Follow on X</Button>
        <Button variant="secondary" leadingIcon={<IconBrandDiscord />} onClick={() => window.open("https://discord.gg/hsW64egPRJ", "_blank", "noopener,noreferrer")}>Join Discord</Button>
        {onGetStarted && (
          <Button variant="outline" onClick={onGetStarted}>Launch your token</Button>
        )}
      </div>
      {/* bottom text */}
      <p style={{ position: "absolute", left: 14, top: 480, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: 0 }}>Owned by no one. Controlled by the protocol.</p>
      {/* spacer for container height */}
      <div style={{ height: 581 }} />
    </div>
  );
}
