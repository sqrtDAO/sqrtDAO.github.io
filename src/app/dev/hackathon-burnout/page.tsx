import SmokeMeshBackground from "@/components/SmokeMeshBackground/SmokeMeshBackground";
import HackathonLayout from "@/app/hackathon/layout";
import HackathonNav from "@/components/Hackathon/HackathonNav";
import Prizes from "@/components/Hackathon/Prizes";
import Judging from "@/components/Hackathon/Judging";
import Help from "@/components/Hackathon/Help";
import BurnoutToggle from "./BurnoutToggle";

// Prototype: "LED wall burnout" on Judging only, between its real neighbours.
const BurnoutDevPage = () => (
  <HackathonLayout>
    <SmokeMeshBackground />
    <main className="relative z-10 h-dvh overflow-x-hidden overflow-y-auto">
      <HackathonNav />
      <Prizes />
      <BurnoutToggle>
        <Judging />
      </BurnoutToggle>
      <Help />
    </main>
  </HackathonLayout>
);

export default BurnoutDevPage;
