"use client";

import "@/app/landing.css";
import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import LandingCtas from "@/components/LandingCtas/LandingCtas";
import LandingHero from "@/components/LandingHero/LandingHero";
import LandingProblem from "@/components/LandingProblem/LandingProblem";
import LandingHowItWorks from "@/components/LandingHowItWorks/LandingHowItWorks";
import LandingForFounders from "@/components/LandingForFounders/LandingForFounders";
import LandingForParticipants from "@/components/LandingForParticipants/LandingForParticipants";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";

// Mainnet landing — Figma 10694:90661 (desktop) / 10694:91237 (mobile). No "Help us build it"; the mainnet footer closes the page.
const MainnetLandingPage = () => (
  <>
    <SmokeMeshBackground />
    <main className="relative z-10 h-dvh overflow-x-hidden overflow-y-auto">
      <LandingHero ctas={<LandingCtas />} />
      <LandingProblem ctas={<LandingCtas />} />
      <LandingHowItWorks />
      <LandingForFounders />
      <LandingForParticipants />
      {/* Desktop: Figma overlaps the footer onto the last 1100px section (footer top at y=781). */}
      <div className="xl:-mt-79.5">
        <MainnetFooter placement="landing" />
      </div>
    </main>
  </>
);

export default MainnetLandingPage;
