import { type Address, zeroAddress } from "viem";
import {
  useReadDistributorV1GetContractInfo,
  useReadDistributorV1GetEpochInfo,
  useReadDistributorV1CurrentEpoch,
} from "@/contracts/abis";
import { useReadTokenV1Name, useReadTokenV1Symbol } from "@/contracts/abis";

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
  shares: readonly { readonly shareBps: bigint; readonly hook: { readonly contractAddress: Address; readonly callData: `0x${string}` } }[];
  totalUniqueParticipants: bigint;
};

export type EpochInfo = {
  userParticipationAmount: bigint;
  totalParticipationAmount: bigint;
  uniqueParticipants: bigint;
  claimed: boolean;
  rewardAmount: bigint;
};

export function useDistributorData(contractAddress?: Address) {
  const enabled = !!contractAddress;

  const { data: contractInfo, isLoading: infoLoading, error: infoError } =
    useReadDistributorV1GetContractInfo({
      address: contractAddress,
      query: { enabled },
    });

  const { data: currentEpoch, isLoading: epochLoading } =
    useReadDistributorV1CurrentEpoch({
      address: contractAddress,
      query: { enabled },
    });

  const numberOfEpochs = (contractInfo as DistributorContractInfo | undefined)?.numberOfEpochs;

  const { data: epochInfo, isLoading: epochsLoading } =
    useReadDistributorV1GetEpochInfo({
      address: contractAddress,
      args: [zeroAddress, { from: BigInt(0), length: numberOfEpochs ?? BigInt(0) }],
      query: { enabled: enabled && !!numberOfEpochs && numberOfEpochs > BigInt(0) },
    });

  const distributionToken = (contractInfo as DistributorContractInfo | undefined)?.distributionToken;

  const { data: tokenName } = useReadTokenV1Name({
    address: distributionToken,
    query: { enabled: !!distributionToken },
  });

  const { data: tokenSymbol } = useReadTokenV1Symbol({
    address: distributionToken,
    query: { enabled: !!distributionToken },
  });

  const participationToken = (contractInfo as DistributorContractInfo | undefined)?.participationToken;

  const { data: quoteSymbol } = useReadTokenV1Symbol({
    address: participationToken,
    query: { enabled: !!participationToken },
  });

  return {
    contractInfo: contractInfo as DistributorContractInfo | undefined,
    currentEpoch: currentEpoch as bigint | undefined,
    epochInfo: epochInfo as EpochInfo[] | undefined,
    tokenName,
    tokenSymbol,
    quoteSymbol,
    isLoading: infoLoading || epochLoading || epochsLoading,
    error: infoError,
  };
}
