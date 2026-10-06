import { Suspense } from "react";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import DistributeWizard from "@/components/DistributeWizard/DistributeWizard";

const MainnetDistributePage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <MainnetHeader showNetworkSwitch={false} />
    <Suspense>
      <DistributeWizard />
    </Suspense>
  </div>
);

export default MainnetDistributePage;
