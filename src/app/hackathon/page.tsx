import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import HackathonNav from "@/components/Hackathon/HackathonNav";
import Hero from "@/components/Hackathon/Hero";
import HowToJoin from "@/components/Hackathon/HowToJoin";
import WhoItsFor from "@/components/Hackathon/WhoItsFor";
import Prizes from "@/components/Hackathon/Prizes";
import Judging from "@/components/Hackathon/Judging";
import Help from "@/components/Hackathon/Help";
import Faq from "@/components/Hackathon/Faq";
import FinalCta from "@/components/Hackathon/FinalCta";
import SnapDeck from "@/components/Hackathon/SnapDeck";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";

// Figma 17472:85963 (desktop) / 17573:92825 (mobile). html/body are overflow-hidden
// globally, so <main> is the scroll container (same as the landing page).
// Sections snap one per gesture with an LED-panel burnout between them (SnapDeck.tsx).
const HackathonPage = () => (
  <>
    <SmokeMeshBackground />
    <main className="relative z-10 h-dvh overflow-x-hidden overflow-y-auto">
      <HackathonNav />
      <SnapDeck>
        <Hero />
        <HowToJoin />
        <WhoItsFor />
        <Prizes />
        <Judging />
        <Help />
        <Faq />
        <FinalCta />
      </SnapDeck>
      <MainnetFooter placement="landing" />
    </main>
  </>
);

export default HackathonPage;
