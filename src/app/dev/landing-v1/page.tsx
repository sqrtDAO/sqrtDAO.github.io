"use client";

import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import LandingHero from "@/components/LandingHero/LandingHero";
import LandingProblem from "@/components/LandingProblem/LandingProblem";
import LandingHowItWorks from "@/components/LandingHowItWorks/LandingHowItWorks";
import LandingForFounders from "@/components/LandingForFounders/LandingForFounders";
import LandingForParticipants from "@/components/LandingForParticipants/LandingForParticipants";
import LandingHelpUsBuildIt from "@/components/LandingHelpUsBuildIt/LandingHelpUsBuildIt";

// Same overlay flow as the production "/" page (src/app/page.tsx) — every
// "Try it on testnet" / "Try now" CTA opens this, not a route change (the
// app has no standalone testnet page; TokenLaunch/DistributionWizard are the
// launch experience everywhere else too).

// V.1 landing page rebuild (Figma "Landing V.4") — isolated dev preview. Excluded
// from the production static export via the existing `rm -rf out/dev` deploy step.
// Not wired to "/" — see DECISIONS.md. h-dvh (not h-screen/100vh) so mobile browser
// chrome showing/hiding doesn't clip content or leave a dead gap.
export default function LandingV1PreviewPage() {
  return (
    <>
      <SmokeMeshBackground />
      <main className="relative z-10 h-dvh overflow-y-auto overflow-x-hidden">
        <LandingHero />
        <LandingProblem />
        <LandingHowItWorks />
        <LandingForFounders />
        <LandingForParticipants />
        <LandingHelpUsBuildIt />
      </main>
    </>
  );
}
