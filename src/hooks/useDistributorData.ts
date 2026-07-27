import { type Address } from "viem";
import {
  getDistributorV1Contract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { Client } from "viem/tempo";
import { useEffect, useState } from "react";
import { usePublicClient, useWalletClient } from "wagmi";
import { wallet } from "viem/tempo/actions";

export type DistributorContractInfo = {
  distributionToken: Address;
  participationToken: Address;
  epochDuration: bigint;
  startingTimestamp: bigint;
  minParticipation: bigint;
  claimDelaySeconds: bigint;
  remainingRewards: bigint;
  numberOfEpochs: bigint;
  totalDistributionAmount: bigint;
  creator: Address;
  shares: readonly {
    readonly shareBps: bigint;
    readonly hook: {
      readonly contractAddress: Address;
      readonly callData: `0x${string}`;
    };
  }[];
  totalUniqueParticipants: bigint;
};

export type EpochInfo = {
  userParticipationAmount: bigint;
  totalParticipationAmount: bigint;
  uniqueParticipants: bigint;
  claimed: boolean;
  rewardAmount: bigint;
};

export function useDistributorData(contractAddress: Address) {
  const { data: walletClient } = useWalletClient();

  const [contractInfo, setContractInfo] = useState<
    DistributorContractInfo | undefined
  >(undefined);
  const [currentEpoch, setCurrentEpoch] = useState<number | undefined>(
    undefined,
  );

  const [tokenName, setTokenName] = useState<string | undefined>(undefined);
  const [tokenSymbol, setTokenSymbol] = useState<string | undefined>(undefined);
  const [participationTokenSymbol, setParticipationTokenSymbol] = useState<
    string | undefined
  >(undefined);

  const [epochs, setEpochs] = useState<readonly EpochInfo[] | undefined>(
    undefined,
  );

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    (async () => {
      if (!walletClient) return;
      setIsLoading(true);
      try {
        const distributor = getDistributorV1Contract(
          walletClient,
          contractAddress,
        );
        const info = await distributor.read.getContractInfo();
        setContractInfo(info);
        const currentEpoch =
          (Date.now() / 1000 - Number(info.startingTimestamp)) /
          Number(info.epochDuration);
        setCurrentEpoch(currentEpoch);

        const token = getTokenV1Contract(walletClient, info.distributionToken);
        setTokenName(await token.read.name());
        setTokenSymbol(await token.read.symbol());

        const pToken = getTokenV1Contract(
          walletClient,
          info.participationToken,
        );
        setParticipationTokenSymbol(await pToken.read.symbol());

        setEpochs(
          await distributor.read.getEpochInfo([
            walletClient.account.address,
            {
              from: BigInt(currentEpoch < 100 ? 0 : currentEpoch - 100),
              length: BigInt(currentEpoch + 100),
            },
          ]),
        );
      } catch (e) {
        setError("Error while loading on-chain data");
        console.error(e);
      }
      setIsLoading(false);
    })();
  }, [contractAddress, walletClient]);

  return {
    contractInfo: contractInfo as DistributorContractInfo | undefined,
    currentEpoch: currentEpoch as bigint | undefined,
    epochsInfo: epochs,
    tokenName,
    tokenSymbol,
    participationTokenSymbol,
    isLoading,
    error,
  };
}
