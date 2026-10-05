"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatUnits, maxUint256, parseUnits, type Address, zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useWalletClient,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { base } from "viem/chains";
import MainnetDdp, { type MainnetDdpData } from "@/components/MainnetDdp/MainnetDdp";
import type { DdpState } from "@/components/DistributionOverview/DistributionOverview";
import type { FundSplit } from "@/components/FundSplitBar/FundSplitBar";
import type { EpochData } from "@/lib/charts/types";
import { useDistributorData } from "@/hooks/useDistributorData";
import type {
  DistributionState,
  DistributorContractInfo,
  EpochInfo,
} from "@/hooks/useDistributorData";
import useTokenAvatar from "@/hooks/useTokenAvatar";
import { useInput } from "@/hooks/useInput";
import {
  decimalOnlyModifier,
  numberOnlyModifier,
  type InputModifier,
} from "@/utils/modifier";
import { type InputValidator } from "@/utils/validator";
import { roundUnits, unitsToNumber } from "@/utils/round-units";
import { formatDateTime } from "@/utils/formatDate";
import { formatDuration } from "@/utils/formatDuration";
import { fmtInt } from "@/utils/formatInt";
import { showToast } from "@/hooks/useToast";
import { isUserRejectedError } from "@/utils/wallet-error";
import { viewTransactionAction } from "@/utils/explorer-utils";
import {
  getDistributorV1Contract,
  getEthParticipationRouterContract,
  getTokenV1Contract,
} from "@/contracts/contracts";
import { tokenV1FactoryAbi } from "@/contracts/abis";
import { getAddresses } from "@/contracts/contract-addresses";

const STATE_TO_DDP: Record<DistributionState, DdpState> = {
  waiting: "upcoming",
  running: "live",
  ended: "finished",
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const fmtEpochDate = (timestamp: number, withTime: boolean): string => {
  const d = new Date(timestamp);
  const day = d.getDate();
  const month = MONTHS[d.getMonth()];
  if (withTime) {
    const time = d.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    return `${day} ${month}, ${time}`;
  }
  return `${day} ${month}, ${d.getFullYear()}`;
};

const fmtPrice = (price: number | null): string =>
  price == null ? "—" : parseFloat(price.toFixed(4)).toString();

function buildEpochs(
  contractInfo: DistributorContractInfo,
  currentEpoch: bigint,
  epochInfo: readonly EpochInfo[] | undefined,
  epochsFrom: bigint,
  distributionDecimals: number,
  participationDecimals: number,
): EpochData[] {
  if (!epochInfo || epochInfo.length === 0) return [];
  const numberOfEpochs = Number(contractInfo.numberOfEpochs);
  const epochDurationSec = Number(contractInfo.epochDuration);
  const startingTimestampSec = Number(contractInfo.startingTimestamp);
  const totalDistribution = Number(
    formatUnits(contractInfo.totalDistributionAmount, distributionDecimals),
  );
  const supplyPerEpoch = numberOfEpochs > 0 ? totalDistribution / numberOfEpochs : 0;
  const supplyPerEpochAmount =
    contractInfo.numberOfEpochs > 0n
      ? contractInfo.totalDistributionAmount / contractInfo.numberOfEpochs
      : 0n;
  const currentIdx = Number(currentEpoch);
  const fromIdx = Number(epochsFrom);

  const epochs: EpochData[] = [];
  for (let i = 0; i < epochInfo.length; i++) {
    const idx = fromIdx + i;
    const state: "passed" | "current" | "future" =
      idx < currentIdx ? "passed" : idx === currentIdx ? "current" : "future";
    const timestamp = (startingTimestampSec + idx * epochDurationSec) * 1000;
    const info = epochInfo[i];
    const volume = unitsToNumber(info.totalParticipationAmount, participationDecimals);
    const rewardAmount = unitsToNumber(info.rewardAmount, distributionDecimals);
    const supply = rewardAmount > 0 ? rewardAmount : supplyPerEpoch;
    const supplyAmount =
      info.rewardAmount > 0n ? info.rewardAmount : supplyPerEpochAmount;
    const clearPrice =
      state === "passed" && volume > 0 && rewardAmount > 0
        ? rewardAmount / volume
        : null;

    epochs.push({
      epoch: idx + 1,
      state,
      participationAmount: info.totalParticipationAmount,
      clearPrice,
      supply,
      supplyAmount,
      participants: Number(info.uniqueParticipants),
      participated: info.userParticipationAmount > 0n,
      userParticipationAmount: info.userParticipationAmount,
      claimed: info.claimed,
      timestamp,
    });
  }
  return epochs;
}

function computeShares(
  contractInfo: DistributorContractInfo,
  chainId: number,
): FundSplit {
  const shares = contractInfo.shares;
  const addresses = getAddresses(chainId);
  const priceAnchor = shares.find(
    (e) => e.hook.contractAddress === addresses.buyAndBurnHook,
  );
  const priceAnchorPct = Math.round(priceAnchor ? Number(priceAnchor.shareBps) / 100 : 0);
  const protocolFeePct =
    shares.length > 0 ? Math.round(Number(shares[shares.length - 1].shareBps)) / 100 : 0;
  const founderSharePct = Math.max(0, 100 - (protocolFeePct + priceAnchorPct));
  return { priceAnchorPct, founderSharePct, protocolFeePct };
}

const DistributionDetailV2 = ({ contractAddress }: { contractAddress: string }) => {
  const chainId = useChainId();
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient();
  const { openConnectModal } = useConnectModal();

  const {
    state,
    contractInfo,
    currentEpoch,
    epochsInfo,
    epochsFrom,
    tokenName,
    tokenSymbol,
    tokenDecimals,
    claimData,
    participationTokenSymbol,
    participationTokenDecimals,
    participationTokenBalance,
    refetch,
  } = useDistributorData(contractAddress as Address);

  const avatarUrl = useTokenAvatar(contractInfo?.distributionToken, chainId);

  const [metadata, setMetadata] = useState<Record<string, string>>({});
  const [native, setNative] = useState(true);
  const [claimState, setClaimState] = useState<"idle" | "claiming" | "done">("idle");

  useEffect(() => {
    if (!publicClient || !contractInfo) return;
    getTokenV1Contract(publicClient, contractInfo.distributionToken)
      .read.getAllMetadata()
      .then((entries) =>
        setMetadata(Object.fromEntries(entries.map((e) => [e.key, e.value]))),
      )
      .catch(() => {});
  }, [publicClient, contractInfo?.distributionToken]);

  useEffect(() => {
    if (!publicClient || !contractInfo || !chainId) return;
    publicClient
      .readContract({
        address: getAddresses(chainId).tokenFactory,
        abi: tokenV1FactoryAbi,
        functionName: "creatorOf",
        args: [contractInfo.distributionToken],
      })
      .then((creator) => setNative(creator !== zeroAddress))
      .catch(() => {});
  }, [publicClient, contractInfo?.distributionToken, chainId]);

  const ddpState: DdpState = state ? STATE_TO_DDP[state] : "upcoming";
  const running = ddpState === "live";

  const epochs = useMemo(
    () =>
      contractInfo && currentEpoch !== undefined
        ? buildEpochs(
            contractInfo,
            currentEpoch,
            epochsInfo,
            epochsFrom,
            tokenDecimals ?? 18,
            participationTokenDecimals ?? 18,
          )
        : [],
    [contractInfo, currentEpoch, epochsInfo, epochsFrom, tokenDecimals, participationTokenDecimals],
  );

  const currentEpochDisplay =
    currentEpoch !== undefined ? Number(currentEpoch) + 1 : null;
  const lastEpoch = contractInfo ? Number(contractInfo.numberOfEpochs) : 0;

  const stats = useMemo(() => {
    const total = contractInfo ? Number(contractInfo.numberOfEpochs) : 0;
    const currentIdx = currentEpoch !== undefined ? Number(currentEpoch) : 0;
    const closedCount = Math.min(Math.max(currentIdx, 0), total);
    const remainingCount = total - closedCount - (running ? 1 : 0);
    const supplyPerEpoch =
      contractInfo && contractInfo.numberOfEpochs > 0n
        ? contractInfo.totalDistributionAmount / contractInfo.numberOfEpochs
        : 0n;

    const closedInWindow = Math.min(
      Math.max(closedCount - Number(epochsFrom), 0),
      epochsInfo?.length ?? 0,
    );
    let windowClosedSupply = 0n;
    if (epochsInfo) {
      for (let i = 0; i < closedInWindow; i++) {
        windowClosedSupply +=
          epochsInfo[i].rewardAmount > 0n ? epochsInfo[i].rewardAmount : supplyPerEpoch;
      }
    }
    const closed = epochs.filter((e) => e.state === "passed");
    const last = closed.length > 0 ? closed[closed.length - 1] : null;
    return {
      totalEpochs: total,
      remainingCount,
      supplyPerEpoch,
      distributedSupplyAmount:
        BigInt(Math.max(closedCount - closedInWindow, 0)) * supplyPerEpoch +
        windowClosedSupply,
      current: epochs.find((e) => e.state === "current") ?? null,
      last,
    };
  }, [contractInfo, currentEpoch, running, epochs, epochsInfo, epochsFrom]);

  const displayEpoch = stats.current ?? stats.last ?? null;
  const lastClearPrice = stats.last?.clearPrice ?? null;

  const startTimestampMs = contractInfo ? Number(contractInfo.startingTimestamp) * 1000 : 0;
  const endTimestampMs = contractInfo
    ? (Number(contractInfo.startingTimestamp) +
        Number(contractInfo.numberOfEpochs) * Number(contractInfo.epochDuration)) *
      1000
    : 0;
  const currentEpochEndMs =
    contractInfo && currentEpoch !== undefined
      ? Number(
          contractInfo.startingTimestamp + (currentEpoch + 1n) * contractInfo.epochDuration,
        ) * 1000
      : 0;
  const countdownTargetMs =
    ddpState === "upcoming" ? startTimestampMs : ddpState === "finished" ? endTimestampMs : currentEpochEndMs;

  const claimDelayDays = contractInfo
    ? Math.round(Number(contractInfo.claimDelaySeconds) / 86400)
    : 0;

  // ---- participation inputs ----
  const participationDecimals = participationTokenDecimals ?? 18;

  const fromEpochModifier = useMemo<InputModifier>(
    () => (v) => {
      const digits = numberOnlyModifier(v);
      if (digits === "" || lastEpoch === 0) return digits;
      const n = parseInt(digits, 10);
      if (isNaN(n)) return "";
      return String(Math.min(n, lastEpoch));
    },
    [lastEpoch],
  );
  const fromEpochInput = useInput("", fromEpochModifier);
  const fromEpochNum = useMemo(() => {
    const min = currentEpochDisplay ?? 1;
    const n = parseInt(fromEpochInput.value, 10);
    if (isNaN(n) || n < 1) return min;
    return Math.min(Math.max(n, min), Math.max(lastEpoch, min));
  }, [fromEpochInput.value, currentEpochDisplay, lastEpoch]);

  const toEpochModifier = useMemo<InputModifier>(
    () => (v) => {
      const digits = numberOnlyModifier(v);
      if (digits === "" || lastEpoch === 0) return digits;
      const n = parseInt(digits, 10);
      if (isNaN(n)) return "";
      return String(Math.min(n, lastEpoch));
    },
    [lastEpoch],
  );
  const toEpochInput = useInput("", toEpochModifier);
  const toEpochNum = useMemo(() => {
    const n = parseInt(toEpochInput.value, 10);
    if (isNaN(n) || n < fromEpochNum) return fromEpochNum;
    return Math.min(n, Math.max(lastEpoch, fromEpochNum));
  }, [toEpochInput.value, fromEpochNum, lastEpoch]);
  const epochCountNum = toEpochNum - fromEpochNum + 1;

  useEffect(() => {
    if (currentEpochDisplay === null || lastEpoch === 0) return;
    const defaultEpoch = String(Math.min(currentEpochDisplay, lastEpoch));
    if (fromEpochInput.value === "") fromEpochInput.onChange(defaultEpoch);
    if (toEpochInput.value === "") toEpochInput.onChange(defaultEpoch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEpochDisplay, lastEpoch]);

  const amountIssues = useCallback(
    (parsed: bigint): string | null => {
      if (
        contractInfo &&
        contractInfo.minParticipation > 0n &&
        parsed / BigInt(epochCountNum) < contractInfo.minParticipation
      ) {
        return `Minimum participation is ${roundUnits(
          contractInfo.minParticipation,
          participationDecimals,
        )} ${participationTokenSymbol ?? ""} per epoch`;
      }
      if (
        isConnected &&
        participationTokenBalance !== undefined &&
        parsed > participationTokenBalance
      ) {
        return "Amount exceeds your wallet balance";
      }
      return null;
    },
    [
      contractInfo,
      epochCountNum,
      participationDecimals,
      participationTokenSymbol,
      isConnected,
      participationTokenBalance,
    ],
  );

  const amountModifier = useMemo<InputModifier>(
    () => (v) => {
      const cleaned = decimalOnlyModifier(v);
      if (cleaned === "" || !isConnected || participationTokenBalance === undefined) {
        return cleaned;
      }
      try {
        const parsed = parseUnits(cleaned, participationDecimals);
        if (parsed > participationTokenBalance) {
          return participationTokenBalance === 0n
            ? "0"
            : formatUnits(participationTokenBalance, participationDecimals);
        }
      } catch {
        // mid-edit value, pass through
      }
      return cleaned;
    },
    [isConnected, participationTokenBalance, participationDecimals],
  );

  const validateAmount = useMemo<InputValidator>(
    () => (v) => {
      const t = v.trim();
      if (t === "") return "Required";
      let parsed: bigint;
      try {
        parsed = parseUnits(t, participationDecimals);
      } catch {
        return "Invalid amount";
      }
      if (parsed === 0n) return "Must be greater than 0";
      return amountIssues(parsed);
    },
    [amountIssues, participationDecimals],
  );

  const amountInput = useInput("", amountModifier, validateAmount);
  const epochsInput = useInput("", numberOnlyModifier);
  const amountParsed = useMemo<bigint | null>(() => {
    try {
      return parseUnits(amountInput.value.trim(), participationDecimals);
    } catch {
      return null;
    }
  }, [amountInput.value, participationDecimals]);
  const amountLimitError = amountParsed !== null ? amountIssues(amountParsed) : null;

  const stepEpochs = (delta: number) => {
    const nextFrom = Math.max(1, Math.min(fromEpochNum + delta, lastEpoch));
    const count = Math.max(1, epochCountNum);
    fromEpochInput.onChange(String(nextFrom));
    toEpochInput.onChange(String(Math.min(lastEpoch, nextFrom + count - 1)));
  };

  // ---- actions ----
  const handleClaim = useCallback(async () => {
    if (!walletClient || !publicClient || !contractInfo || !claimData) return;
    if (claimData.claimableAmount === 0n) {
      showToast("claim.nothing");
      return;
    }
    const distributor = getDistributorV1Contract(walletClient, contractAddress as Address);
    const toastId = `claim-${contractAddress}`;
    setClaimState("claiming");
    showToast("claim.pending", { id: toastId, params: { symbol: tokenSymbol ?? "" } });
    try {
      const claimParams = claimData.ranges.map((r) => ({
        user: walletClient.account.address,
        range: { from: r.from, length: r.to - r.from + 1n },
      }));
      const hash = await distributor.write.claimMany([claimParams], {
        account: walletClient.account,
        chain: walletClient.chain,
      });
      const receipt = await publicClient.waitForTransactionReceipt({ hash });
      if (receipt.status === "reverted") {
        showToast("claim.failed", { id: toastId, action: viewTransactionAction(chainId, hash) });
        setClaimState("idle");
        return;
      }
      showToast("claim.success", {
        id: toastId,
        params: {
          amount: roundUnits(claimData.claimableAmount, tokenDecimals ?? 18),
          symbol: tokenSymbol ?? "",
        },
        action: viewTransactionAction(chainId, hash),
      });
      setClaimState("done");
      refetch();
    } catch (e) {
      showToast(isUserRejectedError(e) ? "claim.rejected" : "claim.failed", { id: toastId });
      setClaimState("idle");
    }
  }, [walletClient, publicClient, contractInfo, contractAddress, claimData, chainId, tokenSymbol, tokenDecimals, refetch]);

  const handleParticipate = useCallback(async (): Promise<boolean> => {
    if (!walletClient || !publicClient || !contractInfo || !amountParsed) return false;
    if (!amountInput.validate()) return false;
    const addresses = getAddresses(chainId);
    const isEth =
      addresses.ethParticipationRouter !== zeroAddress &&
      contractInfo.participationToken.toLowerCase() === addresses.weth.toLowerCase();
    const totalAmount = parseUnits(amountInput.value.trim(), participationDecimals);
    const amountPerEpoch = totalAmount / BigInt(epochCountNum);
    const range = { from: BigInt(fromEpochNum - 1), length: BigInt(epochCountNum) };
    const toastId = `participate-${contractAddress}`;
    try {
      if (isEth) {
        const router = getEthParticipationRouterContract(walletClient);
        showToast("participate.pending", { id: toastId, params: { epoch: fromEpochNum } });
        const hash = await router.write.participateWithETH(
          [contractAddress as Address, amountPerEpoch, range, walletClient.account.address, "0x"],
          {
            account: walletClient.account,
            chain: walletClient.chain,
            value: amountPerEpoch * BigInt(epochCountNum),
          },
        );
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "reverted") throw new Error("reverted");
      } else {
        const pToken = getTokenV1Contract(walletClient, contractInfo.participationToken);
        const allowance = await pToken.read.allowance([
          walletClient.account.address,
          contractAddress as Address,
        ]);
        showToast("participate.pending", { id: toastId, params: { epoch: fromEpochNum } });
        if (allowance < totalAmount) {
          const approveHash = await pToken.write.approve([contractAddress as Address, maxUint256], {
            account: walletClient.account,
            chain: walletClient.chain,
          });
          const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });
          if (approveReceipt.status === "reverted") throw new Error("approve failed");
        }
        const distributor = getDistributorV1Contract(walletClient, contractAddress as Address);
        const hash = await distributor.write.participate(
          [amountPerEpoch, range, walletClient.account.address, "0x"],
          { account: walletClient.account, chain: walletClient.chain },
        );
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === "reverted") throw new Error("reverted");
      }
      showToast(
        epochCountNum > 1 ? "participate.multiSuccess" : "participate.success",
        {
          id: toastId,
          params:
            epochCountNum > 1
              ? { n: epochCountNum, first: fromEpochNum, last: toEpochNum }
              : { epoch: fromEpochNum },
        },
      );
      amountInput.reset();
      epochsInput.reset();
      refetch();
      return true;
    } catch (e) {
      showToast(isUserRejectedError(e) ? "participate.rejected" : "participate.failed", { id: toastId });
      return false;
    }
  }, [
    walletClient,
    publicClient,
    contractInfo,
    amountParsed,
    amountInput,
    epochsInput,
    chainId,
    participationDecimals,
    epochCountNum,
    fromEpochNum,
    toEpochNum,
    contractAddress,
    refetch,
  ]);

  const onAddToWallet = useCallback(async () => {
    if (!walletClient || !contractInfo || !tokenSymbol) return;
    await walletClient
      .watchAsset({
        type: "ERC20",
        options: {
          address: contractInfo.distributionToken,
          symbol: tokenSymbol,
          decimals: tokenDecimals ?? 18,
        },
      })
      .catch(() => {});
  }, [walletClient, contractInfo, tokenSymbol, tokenDecimals]);

  const onShare = useCallback(() => {
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => showToast("copy.link"))
      .catch(() => showToast("generic.error"));
  }, []);

  const split = useMemo(
    () => (contractInfo ? computeShares(contractInfo, chainId) : { priceAnchorPct: 0, founderSharePct: 0, protocolFeePct: 0 }),
    [contractInfo, chainId],
  );

  const claimAvailableMs = useMemo(() => {
    if (!contractInfo) return 0;
    const lastEpochEndSec =
      Number(contractInfo.startingTimestamp) + toEpochNum * Number(contractInfo.epochDuration);
    return (lastEpochEndSec + Number(contractInfo.claimDelaySeconds)) * 1000;
  }, [contractInfo, toEpochNum]);

  const claimable = claimData?.claimableAmount ?? 0n;
  const showClaim = ddpState !== "upcoming" && (claimable > 0n || claimState === "done");

  const data: MainnetDdpData = {
    header: {
      name: tokenName ?? "—",
      symbol: tokenSymbol ?? "",
      creator: contractInfo?.owner ?? "—",
      tokenAddress: contractInfo?.distributionToken ?? "—",
      distributionAddress: contractAddress,
      imageUrl: avatarUrl ?? undefined,
      links: {
        website: metadata.website || undefined,
        x: metadata.x || undefined,
        github: metadata.github || undefined,
        explorer: contractInfo
          ? `${base.blockExplorers?.default.url}/token/${contractInfo.distributionToken}`
          : undefined,
        uniswap: contractInfo
          ? `https://app.uniswap.org/explore/tokens/base/${contractInfo.distributionToken}`
          : undefined,
      },
      onShare,
    },
    overview: {
      distributedSupply: roundUnits(stats.distributedSupplyAmount, tokenDecimals ?? 18),
      totalSupply: roundUnits(contractInfo?.totalDistributionAmount ?? 0n, tokenDecimals ?? 18),
      tokenSymbol: tokenSymbol ?? "",
      totalParticipation: roundUnits(contractInfo?.totalParticipation ?? 0n, participationDecimals),
      quoteSymbol: participationTokenSymbol ?? "",
      periodDate: formatDateTime(ddpState === "upcoming" ? startTimestampMs : endTimestampMs),
    },
    countdownTargetMs,
    epochStats: {
      epoch: displayEpoch ? `#${displayEpoch.epoch}` : "—",
      epochTime: displayEpoch ? fmtEpochDate(displayEpoch.timestamp, true) : "—",
      lastClearPrice: fmtPrice(lastClearPrice),
      participation: roundUnits(displayEpoch?.participationAmount ?? 0n, participationDecimals),
      participants: String(displayEpoch?.participants ?? 0),
      quoteSymbol: participationTokenSymbol ?? "",
    },
    legend: {
      stats: [
        { label: "Total epochs", value: fmtInt(stats.totalEpochs) },
        {
          label: "Supply per epoch (Flat release)",
          value: `${roundUnits(stats.supplyPerEpoch, tokenDecimals ?? 18)} ${tokenSymbol ?? ""}`,
        },
        { label: "Epoch duration", value: contractInfo ? formatDuration(Number(contractInfo.epochDuration)) : "—" },
        { label: "Unique participants", value: fmtInt(Number(contractInfo?.totalUniqueParticipants ?? 0n)) },
      ],
      supplyRemaining: `${roundUnits(stats.supplyPerEpoch * BigInt(Math.max(stats.remainingCount, 0)), tokenDecimals ?? 18)} ${tokenSymbol ?? ""}`,
      epochsLeft: fmtInt(Math.max(stats.remainingCount, 0)),
    },
    epochs,
    tokenSymbol: tokenSymbol ?? "",
    tokenDecimals: tokenDecimals ?? 18,
    quoteSymbol: participationTokenSymbol ?? "",
    quoteDecimals: participationDecimals,
    claiming: claimState === "claiming",
    split,
    claim: showClaim
      ? {
          state: claimState === "idle" ? "ready" : claimState,
          amount: roundUnits(claimable, tokenDecimals ?? 18),
          symbol: tokenSymbol ?? "",
          onClaim: handleClaim,
          onAddToWallet,
        }
      : undefined,
    participation: {
      quoteSymbol: participationTokenSymbol ?? "",
      walletBalance: `${roundUnits(participationTokenBalance ?? 0n, participationDecimals)} ${participationTokenSymbol ?? ""}`,
      claimDelay: `${claimDelayDays} days`,
      fromEpoch: String(fromEpochNum),
      toEpoch: String(toEpochNum),
      perEpochEstimate:
        amountParsed && epochCountNum > 0
          ? `≈ ${roundUnits(amountParsed / BigInt(epochCountNum), participationDecimals)} ${participationTokenSymbol ?? ""} per epoch`
          : "",
      amountState: amountInput,
      epochsState: epochsInput,
      rangeState: { from: fromEpochInput, to: toEpochInput },
      onStepEpochs: stepEpochs,
      amountError: amountLimitError ?? amountInput.error,
      onConnect: openConnectModal,
    },
    review: {
      amount: `${amountInput.value || "0"} ${participationTokenSymbol ?? ""}`,
      fromEpoch: fromEpochNum,
      toEpoch: toEpochNum,
      tokenSymbol: tokenSymbol ?? "",
      claimDelayDays,
      claimDate: formatDateTime(claimAvailableMs),
      onConfirm: handleParticipate,
      onAddToCalendar: () => {
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          `SUMMARY:Claim ${tokenSymbol ?? ""}`,
          `DTSTART:${new Date(claimAvailableMs).toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`,
          `DESCRIPTION:Claim your ${tokenSymbol ?? ""} share`,
          "END:VEVENT",
          "END:VCALENDAR",
        ].join("\r\n");
        const blob = new Blob([ics], { type: "text/calendar" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "claim.ics";
        a.click();
        URL.revokeObjectURL(a.href);
      },
    },
    about: metadata.description ?? "",
    epochDurationSec: contractInfo ? Number(contractInfo.epochDuration) : 0,
    lastClearPrice: lastClearPrice ?? 0,
  };

  return (
    <MainnetDdp
      variant={native ? "native" : "imported"}
      state={ddpState}
      connected={isConnected}
      data={data}
      epochActions={{
        onParticipate: (epoch) => {
          fromEpochInput.onChange(String(epoch));
          toEpochInput.onChange(String(epoch));
        },
        onClaim: () => {
          void handleClaim();
        },
      }}
    />
  );
};

export default DistributionDetailV2;
