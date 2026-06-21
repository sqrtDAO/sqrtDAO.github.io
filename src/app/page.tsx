"use client";

import { useEffect } from "react";
import HeroBackground from "@/components/HeroBackground/HeroBackground";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import HeroDesktop from "@/views/Hero/HeroDesktop";
import HeroTablet from "@/views/Hero/HeroTablet";
import HeroMobile from "@/views/Hero/HeroMobile";
import View2Desktop from "@/views/View2/View2Desktop";
import View2Tablet from "@/views/View2/View2Tablet";
import View2Mobile from "@/views/View2/View2Mobile";
import CTADesktop from "@/views/CTA/CTADesktop";
import CTATablet from "@/views/CTA/CTATablet";
import CTAMobile from "@/views/CTA/CTAMobile";
import "./landing.css";

export default function Page() {
  const bp = useBreakpoint();

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
      <main className="landing">

        <section className="view">
          {bp === "desktop" && <HeroDesktop />}
          {bp === "tablet" && <HeroTablet />}
          {bp === "mobile" && <HeroMobile />}
        </section>

        <section className="view">
          {bp === "desktop" && <View2Desktop />}
          {bp === "tablet" && <View2Tablet />}
          {bp === "mobile" && <View2Mobile />}
        </section>

        <section className="view">
          {bp === "desktop" && <CTADesktop />}
          {bp === "tablet" && <CTATablet />}
          {bp === "mobile" && <CTAMobile />}
        </section>

      </main>
    </>
  );
}
