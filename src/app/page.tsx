"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import HeroBackground from "@/components/HeroBackground/HeroBackground";
import Logo from "@/components/Logo/Logo";
import { Button } from "@/components/Button/Button";
import { IconDroplet, IconLock, IconScale, IconBrandX, IconBrandDiscord } from "@tabler/icons-react";
import "./landing.css";

const TEAL = ["#1A4D48", "#2E7D74", "#52B8AE", "#9FE1CB", "#E0F2F0"];
const ROSE = ["#25131A", "#552F3A", "#8A4F5E", "#C4879A", "#F5E8EB"];

const pos = (c: string, r: string): React.CSSProperties => ({ gridColumn: c, gridRow: r });

export default function Page() {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = document.documentElement;
    const fit = () => {
      const s = Math.min(1, (window.innerWidth - 48) / 1920, (window.innerHeight - 40) / 1135);
      root.style.setProperty("--s", String(s));
      root.style.setProperty("--stage-ready", "1");
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
        <section className="view">
          <div className="stage">
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
            {/* small square */}
            <div style={{ position: "absolute", left: 848, top: 884, width: 110, height: 110, background: "var(--sqrt-bg-surface)" }} />
            {/* wide block */}
            <div style={{ position: "absolute", left: 958, top: 884, width: 240, height: 110, background: "var(--sqrt-bg-overlay)" }} />
            {/* info card */}
            <div className="card tilt" style={{ position: "absolute", left: 1428, top: 124, width: 432, height: 299, background: "var(--sqrt-bg-space)", borderRadius: 0, border: "none", padding: "32px 20px 24px" }}>
              <img src="/logo.svg" alt="sqrtDAO" width="201" style={{ marginBottom: 24 }} />
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)", color: "var(--sqrt-text-accent)", margin: 0 }}>Launch and distribute</p>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 500, fontSize: "var(--font-size-h3)", lineHeight: "var(--font-line-height-h3)", color: "var(--sqrt-text-secondary)", margin: "4px 0 0" }}>infrastructure for tokens.</p>
              <p style={{ fontFamily: "var(--font-sans)", fontSize: "var(--font-size-h4)", lineHeight: "var(--font-line-height-h4)", color: "var(--sqrt-text-secondary)", marginTop: 16 }}>Launching Q2.</p>
            </div>
            {/* teal gradient strip — painted last to sit on top of L-shape black fill */}
            <div style={{ position: "absolute", left: 60, top: 428, width: 408, height: 21, display: "flex", zIndex: 1 }}>
              <i style={{ flex: 1, background: "var(--color-support-teal-900)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-700)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-500)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-300)" }} />
              <i style={{ flex: 1, background: "var(--color-support-teal-100)" }} />
            </div>
          </div>
        </section>

        {/* VIEW 2 - LIQUIDITY */}
        <section className="view">
          <div className="stage"><div className="grid">
            <div className="block" style={pos("1 / 4", "1 / 2")}>
              <h2 className="headline headline--m" style={{ display: "flex", alignItems: "center", gap: 12 }}><IconDroplet size={30} stroke={1.6} /> Liquidity in</h2>
            </div>
            <div className="block" style={pos("1 / 5", "2 / 3")}>
              <h2 className="headline headline--m" style={{ display: "flex", alignItems: "center", gap: 12 }}><IconLock size={30} stroke={1.6} /> It cannot come back out.</h2>
            </div>
            <div className="card tilt" style={pos("5 / 8", "2 / 3")}>
              <p className="detail">The token&apos;s backing is permanent from the moment the first epoch closes.</p>
            </div>
            <div className="block" style={pos("1 / 5", "3 / 6")}>
              <h2 className="headline headline--l">That&apos;s not a promise.</h2>
              <h2 className="headline headline--l" style={{ marginTop: 4 }}>That&apos;s the protocol.</h2>
            </div>
            <div className="card tilt" style={pos("5 / 8", "3 / 5")}>
              <p className="detail"><b>98.6% of tokens on the largest platforms are worthless.</b></p>
              <p className="detail" style={{ marginTop: 8 }}>Not bad ideas, just bad mechanisms.</p>
            </div>
            <div className="block" style={pos("8 / 12", "4 / 6")}>
              <h2 className="headline headline--m" style={{ display: "flex", alignItems: "center", gap: 14 }}><IconScale size={34} stroke={1.6} /><span>No founder can pull it.<br />No exception. No override.</span></h2>
            </div>
          </div></div>
        </section>

        {/* VIEW 3 - ACCESS */}
        <section className="view">
          <div className="stage"><div className="grid">
            <div className="block" style={pos("3 / 7", "3 / 5")}>
              <p className="headline headline--m" style={{ fontWeight: 500 }}>You don&apos;t need a VC allocation.</p>
              <p className="headline headline--m" style={{ fontWeight: 500, marginTop: 10 }}>You don&apos;t need to know anyone at the platform.</p>
            </div>
            <div className="block" style={pos("7 / 10", "3 / 5")}>
              <h2 className="headline headline--l">You just need to show up.</h2>
            </div>
          </div></div>
        </section>

        {/* VIEW 4 - CTA */}
        <section className="view">
          <div className="stage"><div className="grid">
            <div className="block" style={pos("4 / 6", "1 / 2")}>
              <p className="detail">sqrtDAO launches Q2.</p>
            </div>
            <div className="block block--empty" style={pos("8 / 10", "2 / 3")} />
            <div className="block" style={pos("4 / 10", "2 / 6")}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 18 }}>
                <Logo />
                <div className="swatch" style={{ width: 180 }}>{TEAL.map((c) => <i key={c} style={{ background: c }} />)}</div>
              </div>
              <p className="kicker">You will set the token parameters.</p>
              <p className="kicker">The protocol runs the rest.</p>
              <h2 className="headline headline--l" style={{ margin: "16px 0 22px" }}>Be in the first cohort.</h2>
              <div className="cta-row">
                <Button variant="primary" leadingIcon={<IconBrandX />}>Follow on X</Button>
                <Button variant="secondary" leadingIcon={<IconBrandDiscord />}>Join Discord</Button>
              </div>
              <p className="detail" style={{ marginTop: 16 }}>No noise. First-access updates only.</p>
            </div>
            <div className="block block--empty" style={pos("9 / 11", "4 / 5")} />
            <div className="swatch" style={{ ...pos("4 / 6", "6 / 7"), height: 8, alignSelf: "start" }}>{ROSE.map((c) => <i key={c} style={{ background: c }} />)}</div>
          </div></div>
        </section>

      </main>
    </>
  );
}
