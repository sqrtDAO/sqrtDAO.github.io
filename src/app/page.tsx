"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import HeroBackground from "@/components/HeroBackground/HeroBackground";
import { Button } from "@/components/Button/Button";
import { IconBrain, IconSwords, IconBrandX, IconBrandDiscord } from "@tabler/icons-react";
import "./landing.css";

export default function Page() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const fit = () => {
      const s = Math.min(1, (window.innerWidth - 48) / 1920, (window.innerHeight - 40) / 1135);
      root.style.setProperty("--s", String(s));
      root.style.setProperty("--stage-ready", "visible");
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useEffect(() => {
    const onTilt = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest(".card") as HTMLElement | null;
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `rotateY(${(px * 8).toFixed(2)}deg) rotateX(${(-py * 8).toFixed(2)}deg)`;
    };
    const onOut = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest(".card") as HTMLElement | null;
      if (card) card.style.transform = "";
    };
    document.addEventListener("pointermove", onTilt);
    document.addEventListener("pointerout", onOut);
    return () => {
      document.removeEventListener("pointermove", onTilt);
      document.removeEventListener("pointerout", onOut);
    };
  }, []);

  return (
    <>
      <HeroBackground />
      <main className="landing" ref={ref}>

        {/* VIEW 1 - HERO */}
        <section className="view" style={{ alignItems: "start", paddingTop: 0 }}>
          <div className="stage" style={{ transformOrigin: "center top" }}>
            {/* empty block top */}
            <div style={{ position: "absolute", left: 212, top: 277, width: 280, height: 151, background: "var(--sqrt-bg-space)" }} />
            {/* empty block mid-right */}
            <div style={{ position: "absolute", left: 1089, top: 758, width: 234, height: 128, background: "var(--sqrt-bg-space)" }} />
            {/* L-shape — upper rect */}
            <div style={{ position: "absolute", left: 60, top: 428, width: 1042, height: 456, background: "var(--sqrt-bg-space)", display: "flex", flexDirection: "column", justifyContent: "flex-start", padding: 0 }}>
              <h1 className="headline" style={{ fontSize: "var(--font-size-display-l)", lineHeight: "var(--font-line-height-display-l)", letterSpacing: "var(--font-letter-spacing-display-l)", marginTop: 62 }}>A launch is a moment</h1>
              <h1 className="headline" style={{ fontSize: "var(--font-size-display-l)", lineHeight: "var(--font-line-height-display-l)", letterSpacing: "var(--font-letter-spacing-display-l)", marginTop: 16 }}>Distribution is a process</h1>
              <h1 className="headline" style={{ fontSize: "var(--font-size-display-xl)", lineHeight: "var(--font-line-height-display-xl)", letterSpacing: "var(--font-letter-spacing-display-xl)", marginTop: 52, whiteSpace: "nowrap" }}>We built the process</h1>
            </div>
            {/* L-shape — lower left foot */}
            <div style={{ position: "absolute", left: 60, top: 884, width: 240, height: 110, background: "var(--sqrt-bg-space)" }} />
            {/* L-shape — lower right fill */}
            <div style={{ position: "absolute", left: 300, top: 884, width: 548, height: 110, background: "var(--sqrt-bg-space)" }} />
            {/* small square — solid surface */}
            <div style={{ position: "absolute", left: 848, top: 884, width: 110, height: 110, background: "var(--sqrt-bg-surface)" }} />
            {/* wide block — solid overlay */}
            <div style={{ position: "absolute", left: 958, top: 884, width: 240, height: 110, background: "var(--sqrt-bg-overlay)" }} />
            {/* info card */}
            <div className="card tilt" style={{ position: "absolute", left: 1428, top: 124, width: 432, height: 299, background: "var(--sqrt-bg-space)", borderRadius: 0, border: "none", padding: "32px 20px 24px" }}>
              <img src="/logo.svg" alt="sqrtDAO" width="201" style={{ marginBottom: 24 }} />
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)", color: "var(--sqrt-text-accent)", margin: 0 }}>Launch and distribute</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)", color: "var(--sqrt-text-secondary)", margin: "4px 0 0" }}>infrastructure for tokens.</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", marginTop: 16 }}>Launching Q2.</p>
            </div>
            {/* teal gradient strip */}
            <div style={{ position: "absolute", left: 60, top: 428, width: 408, height: 21, display: "flex", zIndex: 1 }}>
              <i style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-700)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-100)" }} />
            </div>
          </div>
        </section>

        {/* VIEW 2 */}
        <section className="view">
          <div className="stage">
            {/* Row 1 — Core Idea */}
            <div className="v2-row" style={{ position: "absolute", left: 428, top: 276 }}>
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
            <div className="v2-row" style={{ position: "absolute", left: 428, top: 427 }}>
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
        </section>

        {/* VIEW 3 - CTA */}
        <section className="view">
          <div className="stage">
            {/* subtract shape */}
            <svg width="912" height="581" viewBox="0 0 912 581" fill="none" style={{ position: "absolute", left: 516, top: 279 }}>
              <path d="M197 125H912V581H0V0H197V125ZM653 429H781V301H653V429ZM501 277H629V149H501V277Z" fill="var(--sqrt-bg-space)" />
            </svg>
            {/* teal gradient strip */}
            <div style={{ position: "absolute", left: 710, top: 394, height: 10, display: "flex" }}>
              <div style={{ width: 57.33, background: "var(--color-support-teal-900)" }} />
              <div style={{ width: 156, background: "var(--color-support-teal-700)" }} />
              <div style={{ width: 57.33, background: "var(--color-support-teal-500)" }} />
              <div style={{ width: 57.33, background: "var(--color-support-teal-300)" }} />
            </div>
            {/* detail label */}
            <p style={{ position: "absolute", left: 527, top: 290, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-s)", lineHeight: "var(--font-line-height-body-s)", color: "var(--sqrt-text-secondary)", margin: 0 }}>sqrtDAO launches Q2.</p>
            {/* logo */}
            <img src="/logo.svg" alt="sqrtDAO" width="124" style={{ position: "absolute", left: 527, top: 411 }} />
            {/* kickers — h4, text-secondary, 32px below logo */}
            <p style={{ position: "absolute", left: 529, top: 497, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: 0 }}>You will set the token parameters.</p>
            <p style={{ position: "absolute", left: 529, top: 526, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", margin: 0 }}>The protocol runs the rest.</p>
            {/* headline — 8px below kickers */}
            <h2 className="headline" style={{ position: "absolute", left: 529, top: 563, fontSize: "var(--font-size-display-l)", lineHeight: "var(--font-line-height-display-l)", letterSpacing: "var(--font-letter-spacing-display-l)" }}>Be in the first cohort.</h2>
            {/* buttons */}
            <div style={{ position: "absolute", left: 524, top: 695, display: "flex", gap: 16 }}>
              <Button variant="primary" leadingIcon={<IconBrandX />}>Follow on X</Button>
              <Button variant="secondary" leadingIcon={<IconBrandDiscord />}>Join Discord</Button>
            </div>
            {/* bottom text — body-l, text-primary, 16px below buttons */}
            <p style={{ position: "absolute", left: 530, top: 759, fontFamily: "var(--font-sans)", fontSize: "var(--font-size-body-l)", lineHeight: "var(--font-line-height-body-l)", color: "var(--sqrt-text-primary)", margin: 0 }}>Owned by no one. Controlled by the protocol.</p>
          </div>
        </section>

      </main>
    </>
  );
}
