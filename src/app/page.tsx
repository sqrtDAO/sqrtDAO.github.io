"use client";

import { useEffect, useState } from "react";
import HeroBackground from "@/components/HeroBackground/HeroBackground";
import { useBreakpoint } from "@/hooks/useBreakpoint";
import HeroDesktop from "@/views/Hero/HeroDesktop";
import HeroTablet from "@/views/Hero/HeroTablet";
import HeroMobile from "@/views/Hero/HeroMobile";
import View2Desktop from "@/views/View2/View2Desktop";
import View2Tablet from "@/views/View2/View2Tablet";
import View2AMobile from "@/views/View2/View2AMobile";
import View2BMobile from "@/views/View2/View2BMobile";
import CTADesktop from "@/views/CTA/CTADesktop";
import CTATablet from "@/views/CTA/CTATablet";
import CTAMobile from "@/views/CTA/CTAMobile";
import TokenRouter from "@/components/TokenRouter/TokenRouter";
import TokenImport from "@/components/TokenImport/TokenImport";
import TokenLaunch from "@/components/TokenLaunch/TokenLaunch";
import DistributionWizard from "@/components/DistributionWizard/DistributionWizard";
import "./landing.css";

// Flow steps for the token wizard overlay
type FlowStep = "none" | "router" | "import" | "launch" | "distribute";

export default function Page() {
  const bp = useBreakpoint();
  const [flow, setFlow] = useState<FlowStep>("none");

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
          {bp === "mobile" && <View2AMobile />}
        </section>

        {bp === "mobile" && (
          <section className="view">
            <View2BMobile />
          </section>
        )}

        <section className="view">
          {bp === "desktop" && <CTADesktop onGetStarted={() => setFlow("router")} />}
          {bp === "tablet" && <CTATablet onGetStarted={() => setFlow("router")} />}
          {bp === "mobile" && <CTAMobile onGetStarted={() => setFlow("router")} />}
        </section>

      </main>

      {/* Token wizard overlay — steps: router → import */}
      {flow === "router" && (
        <TokenRouter
          onClose={() => setFlow("none")}
          onLaunch={() => setFlow("launch")}
          onDistribute={() => setFlow("import")}
        />
      )}

      {flow === "import" && (
        <TokenImport
          onBack={() => setFlow("router")}
          onConfirm={() => setFlow("distribute")}
        />
      )}

      {flow === "launch" && (
        <TokenLaunch
          onClose={() => setFlow("none")}
          onDistribute={() => setFlow("distribute")}
        />
      )}

      {flow === "distribute" && (
        <DistributionWizard
          onClose={() => setFlow("none")}
          onConfirm={() => setFlow("none")}
        />
      )}
    </>
  );
}
