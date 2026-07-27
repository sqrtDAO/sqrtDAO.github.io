"use client";

import { useState } from "react";
import TokenLaunch, {
  TokenDetails,
} from "@/components/TokenLaunch/TokenLaunch";
import DistributionWizard, {
  DistributionDetails,
} from "@/components/DistributionWizard/DistributionWizard";
import {
  getFactoryV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { useWalletClient } from "wagmi";
import { encodeFunctionData, encodePacked, zeroAddress } from "viem";
import { EMPTY_PERMIT2 } from "@/lib/utils/permit2";
import { quickSqrtPriceX96 } from "@/lib/utils/sqrtPricex96";
import { getAddresses } from "@/contracts/contract-addresses";
import { transferToHookAbi } from "@/contracts/abis";

// Flow steps for the token wizard overlay
type FlowStep = "launch" | "distribute";

export default function Page() {
  const [flow, setFlow] = useState<FlowStep>("launch");
  const [token, setToken] = useState<TokenDetails | null>(null);

  const { data: walletClient } = useWalletClient();

  const onCancel = () => document.location.replace("/");
  const onDistributionConfirm = async (dd: DistributionDetails) => {
    console.log(`distributionDetails ${dd}`);

    const factory = getFactoryV1Contract(walletClient!);
    const participationToken = getTokenV1Contract(
      walletClient!,
      dd.participationToken,
    );
    const addresses = getAddresses(walletClient!.chain.id);

    await participationToken.write.approve(
      [factory.address, dd.initialParticipationLiquidity],
      { account: walletClient!.account, chain: walletClient!.chain },
    );

    const _sqrtPriceX96 = quickSqrtPriceX96(
      Number(dd.initialParticipationLiquidity),
      Number(dd.initialDistributionLiquidity),
      await participationToken.read.decimals(),
      18,
    );

    const emissionFunction = {
      emissionContract: addresses.fixedEmission,
      curveConfig: encodePacked(["uint256"], [dd.releasePerEpoch]),
    };

    const factoryAllocation =
      dd.totalDistributionAmount + dd.initialDistributionLiquidity;
    const userAllocation = token!.totalSupply - factoryAllocation;
    const allocation = [
      { recipient: factory.address, amount: factoryAllocation },
      { recipient: walletClient!.account.address, amount: userAllocation },
    ];

    // fee and buyBackAndBurn shares will be injected automatically on contract
    // so we only need to add founder share
    const shares = [];
    if (dd.founderShareBps !== BigInt(0)) {
      shares.push({
        shareBps: dd.founderShareBps,
        hook: {
          contractAddress: addresses.transferToHook,
          callData: encodeFunctionData({
            abi: transferToHookAbi,
            functionName: "transferTo",
            args: [dd.participationToken, dd.founderShareReceiver],
          }),
        },
      });
    }
    const buyBackAndBurnShareBps =
      BigInt(10000) - (dd.founderShareBps + dd.protocolFeeBps);

    factory.write.createTokenAndLiquidityAndDistribution(
      [
        token!.name,
        token!.symbol,
        allocation,
        BigInt(_sqrtPriceX96),
        dd.initialParticipationLiquidity,
        dd.initialDistributionLiquidity,
        {
          distributionToken: zeroAddress,
          participationToken: dd.participationToken,
          epochDuration: dd.epochDuration,
          startTimestamp: dd.startTime,
          minParticipation: dd.minimumParticipation,
          claimDelaySeconds: dd.claimDelay,
          allowFutureEpochParticipation: true,
          shares: shares,
          emissionFunction,
          allowlistSigner: zeroAddress,
          allowlistDeadline: BigInt(0),
          numberOfEpochs: dd.numberOfEpochs,
          totalDistributionAmount: dd.totalDistributionAmount,
        },
        buyBackAndBurnShareBps,
        EMPTY_PERMIT2,
      ],
      { account: walletClient!.account, chain: walletClient!.chain },
    );
  };

  const onTokenFinish = (_token: TokenDetails) => {
    console.log(`token details: ${_token}`);
    setToken(_token);
    setFlow("distribute");
  };

  return (
    <>
      {flow === "launch" && (
        <TokenLaunch onCancel={onCancel} onFinish={onTokenFinish} />
      )}

      {flow === "distribute" && (
        <DistributionWizard
          token={token!}
          onCancel={onCancel}
          onFinish={onDistributionConfirm}
        />
      )}
    </>
  );
}
