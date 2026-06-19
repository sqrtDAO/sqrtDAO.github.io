"use client";

import { useEffect, useRef } from "react";
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

  useEffect(() => {
    const root = document.documentElement;
    const fit = () => {
      const s = Math.min(1, (window.innerWidth - 48) / 1536, (window.innerHeight - 40) / 768);
      root.style.setProperty("--s", String(s));
    };
    fit();
    window.addEventListener("resize", fit);

    let raf = 0;

    const loop = () => {
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

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
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
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
          <div className="stage"><div className="grid">
            <div className="block block--empty" style={pos("3 / 5", "1 / 2")} />
            <div className="block block--empty" style={pos("1 / 2", "2 / 3")} />
            <div className="card tilt" style={{ ...pos("9 / 13", "1 / 3"), background: "#000000" }}>
              <img src="/logo.svg" alt="sqrtDAO" width="201" style={{ marginBottom: 16 }} />
              <p className="kicker" style={{ color: "var(--sqrt-text-primary)", fontSize: 18 }}>Launch and distribute infrastructure for tokens.</p>
              <p className="detail" style={{ marginTop: 8, fontSize: 14 }}>Launching Q1.</p>
            </div>
            <div className="block" style={pos("1 / 7", "3 / 6")}>
              <div className="swatch" style={{ width: 220, marginBottom: 14 }}>{TEAL.map((c) => <i key={c} style={{ background: c }} />)}</div>
              <h1 className="headline headline--xl" style={{ fontSize: 56, lineHeight: 1.0 }}>A launch is a moment</h1>
              <h1 className="headline headline--xl" style={{ fontSize: 56, lineHeight: 1.0, marginTop: 6 }}>Distribution is a process</h1>
              <h1 className="headline headline--xl" style={{ fontSize: 56, lineHeight: 1.0, marginTop: 6 }}>We built the process</h1>
            </div>
            <div className="block block--empty" style={pos("6 / 8", "6 / 7")} />
          </div></div>
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
              <p className="detail">sqrtDAO launches Q1.</p>
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
