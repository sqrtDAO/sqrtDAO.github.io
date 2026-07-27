import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import LandingHero from "@/components/LandingHero/LandingHero";
import LandingProblem from "@/components/LandingProblem/LandingProblem";
import LandingHowItWorks from "@/components/LandingHowItWorks/LandingHowItWorks";
import LandingForFounders from "@/components/LandingForFounders/LandingForFounders";
import LandingForParticipants from "@/components/LandingForParticipants/LandingForParticipants";
import LandingHelpUsBuildIt from "@/components/LandingHelpUsBuildIt/LandingHelpUsBuildIt";

// V.1 landing page rebuild (Figma "Landing V.4") — isolated dev preview, desktop-first
// (Phase 1: layout skeleton only, no glitch reveal yet). Excluded from the production
// static export via the existing `rm -rf out/dev` deploy step. Not wired to "/" —
// see DECISIONS.md.
export default function LandingV1PreviewPage() {
  return (
    <>
      <SmokeMeshBackground />
      <main className="relative z-10 h-screen overflow-y-auto overflow-x-hidden">
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