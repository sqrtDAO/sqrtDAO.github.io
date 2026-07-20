"use client";

import { Button } from "@/components/Button/Button";
import Logo from "@/components/Logo/Logo";
import { IconBrandX, IconBrandDiscord } from "@tabler/icons-react";

export default function CTAMobile({ onGetStarted }: { onGetStarted?: () => void }) {
  return (
    <div style={{ width: "calc(100% + 48px)", marginLeft: -24, marginRight: -24, display: "flex", flexDirection: "column", paddingRight: 16 }}>
      {/* Subtract shape with all content inside */}
      <div style={{ position: "relative" }}>
        <svg
          viewBox="0 0 374 440"
          fill="none"
          style={{ width: "100%", height: "auto", display: "block" }}
          preserveAspectRatio="xMinYMin meet"
        >
          <path
            d="M155.227 76.978H374V440H0V0H155.227V76.978ZM139 296.968H198.99V236.978H139V296.968ZM299 279.968H358.99V219.978H299V279.968Z"
            fill="var(--sqrt-bg-space)"
          />
        </svg>

        {/* Teal gradient strip — aligned to the right arm */}
        <div style={{ position: "absolute", top: "17.5%", right: 0, display: "flex", height: 7, width: "58.5%" }}>
          <div style={{ flex: 38, background: "var(--color-support-teal-900)" }} />
          <div style={{ flex: 105, background: "var(--color-support-teal-700)" }} />
          <div style={{ flex: 38, background: "var(--color-support-teal-500)" }} />
          <div style={{ flex: 38, background: "var(--color-support-teal-300)" }} />
        </div>

        {/* Content positioned over the shape */}
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", padding: "11px 16px" }}>
          {/* Detail label */}
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", margin: 0 }}>sqrtDAO launches Q2.</p>

          {/* Logo */}
          <Logo width={124} style={{ marginTop: 16 }} />

          {/* Kickers */}
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-secondary)", margin: "24px 0 0" }}>You will set the token parameters.</p>
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-secondary)", margin: "2px 0 0" }}>The protocol runs the rest.</p>

          {/* Headline */}
          <h2 className="headline" style={{ fontSize: "var(--font-size-h1)", lineHeight: "var(--font-line-height-h1)", marginTop: 8 }}>Be in the first cohort.</h2>

          {/* Buttons — center aligned, 16px gap */}
          <div style={{ display: "flex", gap: 16, marginTop: 24, justifyContent: "center" }}>
            <Button variant="primary" leadingIcon={<IconBrandX />} onClick={() => window.open("https://x.com/sqrtDAO", "_blank", "noopener,noreferrer")}>Follow on X</Button>
            <Button variant="secondary" leadingIcon={<IconBrandDiscord />} onClick={() => window.open("https://discord.gg/hsW64egPRJ", "_blank", "noopener,noreferrer")}>Join Discord</Button>
            {onGetStarted && (
              <Button variant="outline" onClick={onGetStarted}>Launch your token</Button>
            )}
          </div>

          {/* Bottom text */}
          <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body)", lineHeight: "var(--font-line-height-body)", color: "var(--sqrt-text-primary)", marginTop: 16 }}>No noise. First-access updates only.</p>
        </div>
      </div>
    </div>
  );
}
