import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import LaunchWizard from "@/components/LaunchWizard/LaunchWizard";

const MainnetLaunchPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader />
    <LaunchWizard />
  </div>
);

export default MainnetLaunchPage;
