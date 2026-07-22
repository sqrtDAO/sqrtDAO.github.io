"use client";

import { useState } from "react";
import TokenLaunch, {
  TokenDetails,
} from "@/components/TokenLaunch/TokenLaunch";
import DistributionWizard, {
  DistributionDetails,
} from "@/components/DistributionWizard/DistributionWizard";

// Flow steps for the token wizard overlay
type FlowStep = "launch" | "distribute";

export default function Page() {
  const [flow, setFlow] = useState<FlowStep>("launch");
  const [token, setToken] = useState<TokenDetails | null>(null);

  const onCancel = () => document.location.replace("/");
  const onConfirm = (dd: DistributionDetails) => {
    console.log(`distributionDetails ${dd}`);
    // TODO
  };

  const onFinish = (_token: TokenDetails) => {
    console.log(`token details: ${_token}`);
    setToken(_token);
    setFlow("distribute");
  };

  return (
    <>
      {flow === "launch" && (
        <TokenLaunch onCancel={onCancel} onFinish={onFinish} />
      )}

      {flow === "distribute" && (
        <DistributionWizard
          token={token!}
          onCancel={onCancel}
          onFinish={onConfirm}
        />
      )}
    </>
  );
}
