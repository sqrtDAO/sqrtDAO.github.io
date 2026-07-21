"use client";

import { useState } from "react";
import TokenLaunch, {
  TokenDetails,
} from "@/components/TokenLaunch/TokenLaunch";
import DistributionWizard from "@/components/DistributionWizard/DistributionWizard";

// Flow steps for the token wizard overlay
type FlowStep = "launch" | "distribute";

export default function Page() {
  const [flow, setFlow] = useState<FlowStep>("launch");
  const [token, setToken] = useState<TokenDetails | null>(null);

  const onClose = () => document.location.replace("/");
  const onConfirm = () => {}; // TODO

  const onFinish = (_token: TokenDetails) => {
    console.log(`token details: ${_token}`);
    setToken(_token);
    setFlow("distribute");
  };

  return (
    <>
      {flow === "launch" && (
        <TokenLaunch onCancel={onClose} onFinish={onFinish} />
      )}

      {flow === "distribute" && (
        <DistributionWizard onClose={onClose} onConfirm={onConfirm} />
      )}
    </>
  );
}
