import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import DistributeWizard from "@/components/DistributeWizard/DistributeWizard";

const MainnetDistributePage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader showNetworkSwitch={false} />
    <DistributeWizard />
  </div>
);

export default MainnetDistributePage;
