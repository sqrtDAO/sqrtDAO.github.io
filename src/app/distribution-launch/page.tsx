import { Suspense } from "react";
import DistributeWizard from "@/components/DistributeWizard/DistributeWizard";

// The wizard renders its own header: "Back to mainnet" behaves per step.
const DistributionLaunchPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <Suspense>
      <DistributeWizard />
    </Suspense>
  </div>
);

export default DistributionLaunchPage;
