import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import LaunchWizard from "@/components/LaunchWizard/LaunchWizard";

const TokenLaunchPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader />
    <LaunchWizard />
  </div>
);

export default TokenLaunchPage;
