import { Suspense } from "react";
import LaunchWizard from "@/components/LaunchWizard/LaunchWizard";

// The wizard renders its own header: "Back to mainnet" behaves per step.
const TokenLaunchPage = () => (
  <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
    <Suspense>
      <LaunchWizard />
    </Suspense>
  </div>
);

export default TokenLaunchPage;
