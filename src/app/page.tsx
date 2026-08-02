"use client";

import "./landing.css";
import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import LandingHero from "@/components/LandingHero/LandingHero";
import LandingProblem from "@/components/LandingProblem/LandingProblem";
import LandingHowItWorks from "@/components/LandingHowItWorks/LandingHowItWorks";
import LandingForFounders from "@/components/LandingForFounders/LandingForFounders";
import LandingForParticipants from "@/components/LandingForParticipants/LandingForParticipants";
import LandingHelpUsBuildIt from "@/components/LandingHelpUsBuildIt/LandingHelpUsBuildIt";

export default function Page() {
  const onGetStarted = () =>
    document.location.replace("/launch-and-distribute");

  return (
    <>
      <SmokeMeshBackground />
      <main className="relative z-10 h-dvh overflow-y-auto overflow-x-hidden">
        <LandingHero onTryItClick={onGetStarted} />
        <LandingProblem onTryItClick={onGetStarted} />
        <LandingHowItWorks />
        <LandingForFounders />
        <LandingForParticipants />
        <LandingHelpUsBuildIt onTryItClick={onGetStarted} />
      </main>
    </>
  );
}
