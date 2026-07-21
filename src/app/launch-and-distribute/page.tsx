"use client";

import { useState } from "react";
import TokenLaunch from "@/components/TokenLaunch/TokenLaunch";
import DistributionWizard from "@/components/DistributionWizard/DistributionWizard";

// Flow steps for the token wizard overlay
type FlowStep = "launch" | "distribute";

export default function Page() {
  const [flow, setFlow] = useState<FlowStep>("launch");

  const onClose = () => document.location.replace("/");
  const onConfirm = () => {}; // TODO

  return (
    <>
      {flow === "launch" && (
        <TokenLaunch
          onClose={onClose}
          onDistribute={() => setFlow("distribute")}
        />
      )}

      {flow === "distribute" && (
        <DistributionWizard onClose={onClose} onConfirm={onConfirm} />
      )}
    </>
  );
}
