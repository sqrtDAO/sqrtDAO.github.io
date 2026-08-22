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
  maxUint256,
  zeroAddress,
} from "viem";
import { EMPTY_PERMIT2 } from "@/lib/utils/permit2";
import { getAddresses } from "@/contracts/contract-addresses";
import {
  distributionV1FactoryAbi,
  factoryV1Abi,
  tokenV1Abi,
  tokenV1FactoryAbi,
  transferToHookAbi,
} from "@/contracts/abis";
import { quickSqrtPriceX96 } from "@/lib/utils/sqrtPricex96";
import { setupTokenAvatar } from "@/utils/avatar-api";

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

    if (!walletClient || !publicClient) throw "wallet not connected";

    const factory = getFactoryV1Contract(walletClient);
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

    const allowance = await participationToken.read.allowance([
      walletClient!.account.address,
      factory.address,
    ]);
    if (allowance < dd.initialParticipationLiquidity) {
      await publicClient!.simulateContract({
        address: dd.participationToken,
        abi: tokenV1Abi,
        functionName: "approve",
        args: [factory.address, maxUint256],
        account: walletClient!.account.address,
      });
      const txHash = await participationToken.write.approve(
        [factory.address, maxUint256],
        { account: walletClient!.account, chain: walletClient!.chain },
      );

      const approveReceipt = await publicClient!.waitForTransactionReceipt({
        hash: txHash,
      });
      if (approveReceipt.status === "reverted") throw "approve failed";
    }

    const config = {
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
    };
    const createTokenParams = [
      token!.name,
      token!.symbol,
      allocation,
      _sqrtPriceX96,
      dd.initialParticipationLiquidity,
      dd.initialDistributionLiquidity,
      config,
      buyBackAndBurnShareBps,
      EMPTY_PERMIT2,
    ] as const;
    await publicClient!.simulateContract({
      address: factory.address,
      abi: factoryV1Abi,
      functionName: "createTokenAndLiquidityAndDistribution",
      args: createTokenParams,
      account: walletClient!.account.address,
    });

    const hash = await factory.write.createTokenAndLiquidityAndDistribution(
      createTokenParams,
      {
        account: walletClient!.account,
        chain: walletClient!.chain,
        // for example  in this tx: 0x09783847d8c387114aa8a82f369fe97cd664daaa39e9772fb7426f2c6e9ec6c1
        // 8,354,157 gas used I set this to 10M
        gas: BigInt(10_000_000),
      },
    );

    const receipt = await publicClient!.waitForTransactionReceipt({ hash });

    if (receipt.status === "reverted")
      throw 'transaction "createTokenAndLiquidityAndDistribution" failed ';

    let distributor: `0x${string}` | undefined;
    let tokenAddress: `0x${string}` | undefined;
    for (const log of receipt.logs) {
      try {
        const event = decodeEventLog({
          abi: distributionV1FactoryAbi,
          data: log.data,
          topics: log.topics,
        });
        if (event.eventName === "NewDistributor") {
          distributor = (event.args as { distributor: `0x${string}` })
            .distributor;
        }
      } catch {}
      try {
        const event = decodeEventLog({
          abi: tokenV1FactoryAbi,
          data: log.data,
          topics: log.topics,
        });
        if (event.eventName === "NewToken") {
          tokenAddress = (event.args as { tokenAddress: `0x${string}` })
            .tokenAddress;
        }
      } catch {}
    }

    if (distributor) {
      // Avatar is optional: bind best-effort, never block the launch flow
      if (token!.avatarCid && tokenAddress) {
        await setupTokenAvatar(tokenAddress, token!.avatarCid).catch(() => {});
      }
      document.location.href = `/distribution/?address=${distributor}`;
      return;
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
