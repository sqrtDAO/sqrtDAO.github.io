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
import Burnout from "@/components/Hackathon/Burnout";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";

// Figma 17472:85963 (desktop) / 17573:92825 (mobile). html/body are overflow-hidden
// globally, so <main> is the scroll container (same as the landing page).
// Every section is an "LED wall burnout" (Burnout.tsx): pins, lights up, holds, burns out in place.
const HackathonPage = () => (
  <>
    <SmokeMeshBackground />
    <main className="relative z-10 h-dvh overflow-x-hidden overflow-y-auto">
      <HackathonNav />
      <Burnout enter={false}>
        <Hero />
      </Burnout>
      <Burnout>
        <HowToJoin />
      </Burnout>
      <Burnout>
        <WhoItsFor />
      </Burnout>
      <Burnout>
        <Prizes />
      </Burnout>
      <Burnout>
        <Judging />
      </Burnout>
      <Burnout>
        <Help />
      </Burnout>
      <Burnout>
        <Faq />
      </Burnout>
      <Burnout>
        <FinalCta />
      </Burnout>
      <MainnetFooter placement="landing" />
    </main>
  </>
);

export default HackathonPage;
