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
import { useWalletClient, usePublicClient } from "wagmi";
import {
  decodeEventLog,
  encodeFunctionData,
  encodePacked,
  zeroAddress,
} from "viem";
import { EMPTY_PERMIT2 } from "@/lib/utils/permit2";
import { getAddresses } from "@/contracts/contract-addresses";
import { factoryV1Abi, transferToHookAbi } from "@/contracts/abis";
import { quickSqrtPriceX96 } from "@/lib/utils/sqrtPricex96";
import { showToast } from "@/hooks/useToast";
import { isUserRejectedError } from "@/utils/wallet-error";
import { viewTransactionAction as viewTxAction } from "@/utils/explorer-utils";

// Flow steps for the token wizard overlay
type FlowStep = "launch" | "distribute";

export default function Page() {
  const [flow, setFlow] = useState<FlowStep>("launch");
  const [token, setToken] = useState<TokenDetails | null>(null);

  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();

  const onCancel = () => document.location.replace("/");
  const onDistributionConfirm = async (dd: DistributionDetails) => {
    // WARNING: Do NOT use try catch here, caller is doing it

    const factory = getFactoryV1Contract(walletClient!);
    const participationToken = getTokenV1Contract(
      walletClient!,
      dd.participationToken,
    );
    const addresses = getAddresses(walletClient!.chain.id);

    const _sqrtPriceX96 = quickSqrtPriceX96(
      dd.initialParticipationLiquidity,
      dd.initialDistributionLiquidity,
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

    const toastId = "distribution-launch";
    showToast("deploy.pending", { id: toastId });

    let txHash: `0x${string}`;
    try {
      txHash = await participationToken.write.approve(
        [factory.address, dd.initialParticipationLiquidity],
        { account: walletClient!.account, chain: walletClient!.chain },
      );
    } catch (e) {
      showToast(isUserRejectedError(e) ? "deploy.rejected" : "deploy.failed", { id: toastId });
      throw e;
    }

    const approveReceipt = await publicClient!.waitForTransactionReceipt({
      hash: txHash,
    });
    if (approveReceipt.status === "reverted") {
      showToast("approve.failed", { id: toastId, action: viewTxAction(walletClient!.chain.id, txHash) });
      throw "approve failed";
    }

    let hash: `0x${string}`;
    try {
      hash = await factory.write.createTokenAndLiquidityAndDistribution(
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
        {
          account: walletClient!.account,
          chain: walletClient!.chain,
          // for example  in this tx: 0x09783847d8c387114aa8a82f369fe97cd664daaa39e9772fb7426f2c6e9ec6c1
          // 8,354,157 gas used I set this to 10M
          gas: BigInt(10_000_000),
        },
      );
    } catch (e) {
      showToast(isUserRejectedError(e) ? "deploy.rejected" : "deploy.failed", { id: toastId });
      throw e;
    }

    const receipt = await publicClient!.waitForTransactionReceipt({ hash });

    if (receipt.status === "reverted") {
      showToast("deploy.failed", { id: toastId, action: viewTxAction(walletClient!.chain.id, hash) });
      throw 'transaction "createTokenAndLiquidityAndDistribution" failed ';
    }

    showToast("deploy.success", {
      id: toastId,
      params: { symbol: token!.symbol },
      action: viewTxAction(walletClient!.chain.id, hash),
    });
    showToast("launch.success", { action: viewTxAction(walletClient!.chain.id, hash) });

    for (const log of receipt.logs) {
      try {
        const event = decodeEventLog({
          abi: factoryV1Abi,
          data: log.data,
          topics: log.topics,
        });
        if (event.eventName === "NewDistributor") {
          const distributor = (event.args as { distributor: `0x${string}` })
            .distributor;
          // brief pause so the success toasts are visible before the full-page
          // navigation below wipes the (in-memory) toast state
          setTimeout(() => {
            document.location.href = `/distribution/?address=${distributor}`;
          }, 1500);
          return;
        }
      } catch {}
    }
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
