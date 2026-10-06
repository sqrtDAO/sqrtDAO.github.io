"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { formatUnits, maxUint256, parseUnits, type Address, zeroAddress } from "viem";
import {
  useAccount,
  useChainId,
  usePublicClient,
  useSwitchChain,
  useWalletClient,
} from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { IconLoader2 } from "@tabler/icons-react";
import { base, sepolia } from "viem/chains";
import { chainNameToId, chainToName } from "@/utils/chain-utils";
import MainnetDdp, { type MainnetDdpData } from "@/components/MainnetDdp/MainnetDdp";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";
import { Button } from "@/components/Button/Button";
import ClaimRootDialog from "@/components/ClaimRootDialog/ClaimRootDialog";
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
import { useInput, type UseInputReturn } from "@/hooks/useInput";
import {
  decimalOnlyModifier,
  numberOnlyModifier,
  type InputModifier,
} from "@/utils/modifier";
import { type InputValidator } from "@/utils/validator";
import { roundUnits, unitsToNumber } from "@/utils/round-units";
import { formatDateTime } from "@/utils/formatDate";
import { formatDuration } from "@/utils/formatDuration";
import { formatEpochTimestamp, formatPrice } from "@/utils/epoch-format";
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

// Values users type into metadata are free-form, so normalize to an absolute URL
// and drop empties/placeholders before rendering any <a href>.
const SOCIAL_JUNK = new Set([
  "",
  "#",
  "-",
  "n/a",
  "na",
  "none",
  "null",
  "undefined",
  "tbd",
]);
const absoluteUrl = (raw?: string): string | undefined => {
  const v = (raw ?? "").trim();
  if (SOCIAL_JUNK.has(v.toLowerCase())) return undefined;
  if (/^https?:\/\//i.test(v)) return v;
  if (!/\.[a-z]{2,}/i.test(v)) return undefined; // not a plausible domain
  return `https://${v.replace(/^\/+/, "")}`;
};

const EXPLORER_URLS: Record<number, string> = {
  [base.id]: "https://basescan.org",
  [sepolia.id]: "https://sepolia.etherscan.io",
};

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
  // basis points → percent, keeping fractions (2.5% stays 2.5%, not 2%)
  const round2 = (n: number) => Math.round(n * 100) / 100;
  const priceAnchorPct = priceAnchor ? Number(priceAnchor.shareBps) / 100 : 0;
  const protocolFeePct =
    shares.length > 0 ? Number(shares[shares.length - 1].shareBps) / 100 : 0;
  const founderSharePct = Math.max(
    0,
    round2(100 - (protocolFeePct + priceAnchorPct)),
  );
  return { priceAnchorPct, founderSharePct, protocolFeePct };
}

// Minimal UseInputReturn for derived/controlled inputs (no internal validation).
const makeInput = (
  value: string,
  onChange: (v: string) => void,
): UseInputReturn => ({
  value,
  onChange,
  error: null,
  setError: () => {},
  clearError: () => {},
  isGreenFlag: false,
  setGreenFlag: () => {},
  validate: () => true,
  reset: () => {},
});

const DistributionDetailV2 = ({
  contractAddress,
  chainSlug,
}: {
  contractAddress: string;
  chainSlug?: string | null;
}) => {
  const connectedChainId = useChainId();
  // chain is mandatory: an unknown/missing ?chain= is an error, not a fallback
  const chainId = chainNameToId(chainSlug);
  const { address, isConnected } = useAccount();
  const { data: walletClient } = useWalletClient();
  const publicClient = usePublicClient(chainId ? { chainId } : undefined);
  const { openConnectModal } = useConnectModal();
  const { switchChain } = useSwitchChain();
  const sameChain = isConnected && chainId !== undefined && connectedChainId === chainId;

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
    isLoading,
    error,
    refetch,
  } = useDistributorData(contractAddress as Address, chainId);

  const avatarUrl = useTokenAvatar(contractInfo?.distributionToken, chainId);

  const [metadata, setMetadata] = useState<Record<string, string>>({});
  // optimistic default: only claim "Created on sqrtDAO" once creatorOf confirms it
  const [native, setNative] = useState(false);
  const [claimState, setClaimState] = useState<
    "idle" | "claiming" | "done" | "error"
  >("idle");
  const [participateState, setParticipateState] = useState<
    "idle" | "approving" | "participating" | "error"
  >("idle");
  const [claimRootOpen, setClaimRootOpen] = useState(true);

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
    if (!publicClient || !contractInfo || chainId === undefined) return;
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

  // Auto-switch the wallet to the distribution's chain (once per visit).
  const autoSwitched = useRef(false);
  useEffect(() => {
    if (!isConnected || chainId === undefined || connectedChainId === chainId) return;
    if (autoSwitched.current) return;
    autoSwitched.current = true;
    switchChain({ chainId });
  }, [isConnected, chainId, connectedChainId, switchChain]);

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
  // Countdown always targets the END of the distribution (not the current epoch).
  const countdownTargetMs =
    ddpState === "upcoming" ? startTimestampMs : endTimestampMs;

  // Restore the old DDP's self-refreshing: re-read when the sale starts, and at
  // every epoch boundary, so the page moves upcoming → live → next epoch on its own.
  useEffect(() => {
    if (!contractInfo) return;
    const delay = Number(contractInfo.startingTimestamp) * 1000 - Date.now();
    if (delay <= 0) return;
    const id = setTimeout(refetch, delay);
    return () => clearTimeout(id);
  }, [contractInfo, refetch]);

  useEffect(() => {
    if (currentEpochEndMs <= 0 || ddpState !== "live") return;
    const delay = currentEpochEndMs - Date.now();
    if (delay <= 0) {
      refetch();
      return;
    }
    const id = setTimeout(refetch, delay);
    return () => clearTimeout(id);
  }, [currentEpochEndMs, ddpState, refetch]);

  const claimDelayDays = contractInfo
    ? Math.round(Number(contractInfo.claimDelaySeconds) / 86400)
    : 0;

  // ---- participation inputs ----
  const participationDecimals = participationTokenDecimals ?? 18;

  // ---- synced epoch range: one source of truth = (start, count) ----
  // "Spread across" edits count, "From" edits start, "To" edits start+count-1,
  // and the +/- steppers edit count. All three inputs stay in lockstep.
  const minStartEpoch = Math.min(currentEpochDisplay ?? 1, Math.max(lastEpoch, 1));
  const [rangeStart, setRangeStart] = useState<number | null>(null);
  const [rangeCount, setRangeCount] = useState<number | null>(null);

  const fromEpochNum = Math.min(
    Math.max(rangeStart ?? minStartEpoch, minStartEpoch),
    Math.max(lastEpoch, 1),
  );
  const epochCountNum = Math.min(
    Math.max(rangeCount ?? 1, 1),
    Math.max(lastEpoch - fromEpochNum + 1, 1),
  );
  const toEpochNum = fromEpochNum + epochCountNum - 1;

  const applyRange = useCallback(
    (start: number, count: number) => {
      const s = Math.min(Math.max(start, minStartEpoch), Math.max(lastEpoch, 1));
      const c = Math.min(Math.max(count, 1), Math.max(lastEpoch - s + 1, 1));
      setRangeStart(s);
      setRangeCount(c);
    },
    [minStartEpoch, lastEpoch],
  );

  const onFromEpochChange = (v: string) => {
    const n = parseInt(numberOnlyModifier(v), 10);
    if (!isNaN(n)) applyRange(n, epochCountNum);
  };
  const onToEpochChange = (v: string) => {
    const n = parseInt(numberOnlyModifier(v), 10);
    if (isNaN(n)) return;
    const end = Math.min(Math.max(n, fromEpochNum), Math.max(lastEpoch, 1));
    applyRange(fromEpochNum, end - fromEpochNum + 1);
  };
  const onCountChange = (v: string) => {
    const n = parseInt(numberOnlyModifier(v), 10);
    if (!isNaN(n)) applyRange(fromEpochNum, n);
  };
  const stepEpochs = (delta: number) => applyRange(fromEpochNum, epochCountNum + delta);

  const fromEpochInput = makeInput(String(fromEpochNum), onFromEpochChange);
  const toEpochInput = makeInput(String(toEpochNum), onToEpochChange);
  const epochsInput = makeInput(String(epochCountNum), onCountChange);

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
  const amountParsed = useMemo<bigint | null>(() => {
    try {
      return parseUnits(amountInput.value.trim(), participationDecimals);
    } catch {
      return null;
    }
  }, [amountInput.value, participationDecimals]);
  const amountLimitError = amountParsed !== null ? amountIssues(amountParsed) : null;

  // ---- actions ----
  const handleClaim = useCallback(async () => {
    if (!walletClient || !publicClient || !contractInfo || !claimData) return;
    if (chainId === undefined) return;
    if (!sameChain) {
      showToast("network.wrong", { params: { chain: chainToName(chainId) } });
      return;
    }
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
        setClaimState("error");
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
      setClaimState("error");
    }
  }, [walletClient, publicClient, contractInfo, contractAddress, claimData, chainId, tokenSymbol, tokenDecimals, refetch, sameChain]);

  const handleParticipate = useCallback(async (): Promise<boolean> => {
    if (!walletClient || !publicClient || !contractInfo) return false;
    if (!amountParsed) {
      amountInput.validate();
      showToast("participate.invalidAmount");
      return false;
    }
    if (chainId === undefined) return false;
    if (!sameChain) {
      showToast("network.wrong", { params: { chain: chainToName(chainId) } });
      return false;
    }
    // meaningfully tell the user why participation can't proceed right now
    if (ddpState !== "live") {
      showToast(ddpState === "upcoming" ? "participate.notStarted" : "participate.ended");
      return false;
    }
    if (fromEpochNum - 1 < Number(currentEpoch ?? 0)) {
      showToast("participate.epochClosed", { params: { epoch: fromEpochNum } });
      return false;
    }
    if (!amountInput.validate()) {
      showToast("participate.invalidAmount");
      return false;
    }
    const addresses = getAddresses(chainId);
    const isEth =
      addresses.ethParticipationRouter !== zeroAddress &&
      contractInfo.participationToken.toLowerCase() === addresses.weth.toLowerCase();
    // mark busy before the first await so the UI reacts immediately
    setParticipateState(isEth ? "participating" : "approving");
    const totalAmount = parseUnits(amountInput.value.trim(), participationDecimals);
    const amountPerEpoch = totalAmount / BigInt(epochCountNum);
    const range = { from: BigInt(fromEpochNum - 1), length: BigInt(epochCountNum) };
    const toastId = `participate-${contractAddress}`;
    try {
      if (isEth) {
        const router = getEthParticipationRouterContract(walletClient);
        setParticipateState("participating");
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
        if (allowance < totalAmount) {
          setParticipateState("approving");
          const approveHash = await pToken.write.approve([contractAddress as Address, maxUint256], {
            account: walletClient.account,
            chain: walletClient.chain,
          });
          const approveReceipt = await publicClient.waitForTransactionReceipt({ hash: approveHash });
          if (approveReceipt.status === "reverted") throw new Error("approve failed");
        }
        setParticipateState("participating");
        showToast("participate.pending", { id: toastId, params: { epoch: fromEpochNum } });
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
      setParticipateState("idle");
      refetch();
      return true;
    } catch (e) {
      setParticipateState(isUserRejectedError(e) ? "idle" : "error");
      showToast(
        isUserRejectedError(e) ? "participate.rejected" : "participate.failed",
        { id: toastId },
      );
      if (!isUserRejectedError(e)) {
        showToast("tx.reverted", {
          id: `${toastId}-reason`,
          params: { reason: revertReason(e) },
        });
      }
      return false;
    }
  }, [
    walletClient,
    publicClient,
    contractInfo,
    amountParsed,
    amountInput,
    chainId,
    participationDecimals,
    epochCountNum,
    fromEpochNum,
    toEpochNum,
    contractAddress,
    refetch,
    sameChain,
    ddpState,
    currentEpoch,
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
    () =>
      contractInfo && chainId !== undefined
        ? computeShares(contractInfo, chainId)
        : { priceAnchorPct: 0, founderSharePct: 0, protocolFeePct: 0 },
    [contractInfo, chainId],
  );

  const claimAvailableMs = useMemo(() => {
    if (!contractInfo) return 0;
    const lastEpochEndSec =
      Number(contractInfo.startingTimestamp) + toEpochNum * Number(contractInfo.epochDuration);
    return (lastEpochEndSec + Number(contractInfo.claimDelaySeconds)) * 1000;
  }, [contractInfo, toEpochNum]);

  // chain is mandatory in the URL
  if (chainId === undefined) {
    return (
      <DdpMessage
        title="Unknown chain"
        message="This link is missing a valid ?chain= parameter. Append ?chain=base or ?chain=sepolia."
      />
    );
  }

  if (error) {
    return (
      <DdpMessage
        title="Couldn't load this distribution"
        message={error}
        onRetry={refetch}
      />
    );
  }

  // wait for ALL page data before rendering, so nothing below needs null defaults
  if (
    isLoading ||
    !contractInfo ||
    currentEpoch === undefined ||
    tokenSymbol === undefined ||
    tokenDecimals === undefined ||
    participationTokenSymbol === undefined ||
    participationTokenDecimals === undefined
  ) {
    return <DdpLoading chainId={chainId} />;
  }

  const claimable = claimData?.claimableAmount ?? 0n;
  const showClaim =
    ddpState !== "upcoming" &&
    sameChain &&
    (claimable > 0n || claimState === "done" || claimState === "error");

  const data: MainnetDdpData = {
    header: {
      name: tokenName ?? "—",
      symbol: tokenSymbol,
      creator: contractInfo.owner,
      tokenAddress: contractInfo.distributionToken,
      distributionAddress: contractAddress,
      imageUrl: avatarUrl ?? undefined,
      network: chainToName(chainId),
      links: {
        website: absoluteUrl(metadata.website),
        x: absoluteUrl(metadata.x),
        github: absoluteUrl(metadata.github),
        explorer: EXPLORER_URLS[chainId]
          ? `${EXPLORER_URLS[chainId]}/token/${contractInfo.distributionToken}`
          : undefined,
        uniswap:
          chainId === base.id
            ? `https://app.uniswap.org/explore/tokens/base/${contractInfo.distributionToken}`
            : undefined,
      },
      onShare,
    },
    overview: {
      distributedSupply: roundUnits(stats.distributedSupplyAmount, tokenDecimals),
      totalSupply: roundUnits(contractInfo.totalDistributionAmount, tokenDecimals),
      tokenSymbol,
      totalParticipation: roundUnits(contractInfo.totalParticipation, participationDecimals),
      quoteSymbol: participationTokenSymbol,
      periodDate: formatDateTime(ddpState === "upcoming" ? startTimestampMs : endTimestampMs),
    },
    countdownTargetMs,
    epochStats: {
      epoch: displayEpoch ? `#${displayEpoch.epoch}` : "—",
      epochTime: displayEpoch ? formatEpochTimestamp(displayEpoch.timestamp, true) : "—",
      lastClearPrice: formatPrice(lastClearPrice),
      participation: roundUnits(displayEpoch?.participationAmount ?? 0n, participationDecimals),
      participants: String(displayEpoch?.participants ?? 0),
      quoteSymbol: participationTokenSymbol,
    },
    legend: {
      stats: [
        { label: "Total epochs", value: fmtInt(stats.totalEpochs) },
        {
          label: "Supply per epoch (Flat release)",
          value: `${roundUnits(stats.supplyPerEpoch, tokenDecimals)} ${tokenSymbol}`,
        },
        { label: "Epoch duration", value: formatDuration(Number(contractInfo.epochDuration)) },
        { label: "Unique participants", value: fmtInt(Number(contractInfo.totalUniqueParticipants)) },
      ],
      supplyRemaining: `${roundUnits(stats.supplyPerEpoch * BigInt(Math.max(stats.remainingCount, 0)), tokenDecimals)} ${tokenSymbol}`,
      epochsLeft: fmtInt(Math.max(stats.remainingCount, 0)),
    },
    epochs,
    tokenSymbol,
    tokenDecimals,
    quoteSymbol: participationTokenSymbol,
    quoteDecimals: participationDecimals,
    claiming: claimState === "claiming",
    split,
    claim: showClaim
      ? {
          state: claimState === "idle" ? "ready" : claimState,
          amount: roundUnits(claimable, tokenDecimals),
          symbol: tokenSymbol,
          onClaim: handleClaim,
          onAddToWallet,
        }
      : undefined,
    participation: {
      quoteSymbol: participationTokenSymbol,
      walletBalance: `${roundUnits(participationTokenBalance ?? 0n, participationDecimals)} ${participationTokenSymbol}`,
      claimDelay: `${claimDelayDays} days`,
      fromEpoch: String(fromEpochNum),
      toEpoch: String(toEpochNum),
      perEpochEstimate:
        amountParsed && epochCountNum > 0
          ? `≈ ${roundUnits(amountParsed / BigInt(epochCountNum), participationDecimals)} ${participationTokenSymbol} per epoch`
          : "",
      amountState: amountInput,
      epochsState: epochsInput,
      rangeState: { from: fromEpochInput, to: toEpochInput },
      onStepEpochs: stepEpochs,
      amountError: amountLimitError ?? amountInput.error,
      rangeError: null,
      onConnect: () => {
        if (isConnected && !sameChain) switchChain({ chainId });
        else openConnectModal?.();
      },
      connectLabel:
        isConnected && !sameChain
          ? `Switch to ${chainToName(chainId)}`
          : undefined,
      state: participateState,
    },
    review: {
      amount:
        amountParsed !== null
          ? `${roundUnits(amountParsed, participationDecimals)} ${participationTokenSymbol}`
          : `0 ${participationTokenSymbol}`,
      fromEpoch: fromEpochNum,
      toEpoch: toEpochNum,
      tokenSymbol,
      claimDelayDays,
      claimDate: formatDateTime(claimAvailableMs),
      onConfirm: handleParticipate,
      state: participateState,
      onAddToCalendar: () => {
        const ics = [
          "BEGIN:VCALENDAR",
          "VERSION:2.0",
          "BEGIN:VEVENT",
          `SUMMARY:Claim ${tokenSymbol}`,
          `DTSTART:${new Date(claimAvailableMs).toISOString().replace(/[-:.]/g, "").slice(0, 15)}Z`,
          `DESCRIPTION:Claim your ${tokenSymbol} share`,
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
    epochDurationSec: Number(contractInfo.epochDuration),
    lastClearPrice,
  };

  return (
    <>
      <MainnetDdp
        variant={native ? "native" : "imported"}
        state={ddpState}
        connected={sameChain}
        chainId={chainId}
        data={data}
        epochActions={{
          onParticipate: (epoch) => {
            applyRange(epoch, 1);
          },
          onClaim: () => {
            void handleClaim();
          },
        }}
      />
      {/* ROOT-faucet prompt is Sepolia-only; on Base there is no ROOT token. */}
      {chainId === sepolia.id && claimRootOpen && (
        <ClaimRootDialog onClose={() => setClaimRootOpen(false)} />
      )}
    </>
  );
};

// Full-page spinner shown until every read has resolved.
function DdpLoading({ chainId }: { chainId: number }) {
  return (
    <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
      <MainnetHeader lockedChainId={chainId} />
      <div className="flex flex-1 items-center justify-center">
        <IconLoader2 size={32} className="animate-spin text-tertiary" />
      </div>
      <MainnetFooter />
    </div>
  );
}

function DdpMessage({
  title,
  message,
  onRetry,
}: {
  title: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex h-dvh flex-col overflow-y-auto bg-canvas">
      <MainnetHeader />
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-h3 text-primary">{title}</h1>
          <p className="max-w-120 text-body leading-6 text-secondary">{message}</p>
        </div>
        {onRetry && (
          <Button variant="primary" size="m" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
      <MainnetFooter />
    </div>
  );
}

// Pulls the human reason out of a viem contract error so users see why a tx failed.
const revertReason = (e: unknown): string => {
  const err = e as { shortMessage?: string; message?: string };
  const msg = err.shortMessage ?? err.message ?? String(e);
  const afterReason = msg.match(/reason:\s*([^\n]+)/);
  if (afterReason) return afterReason[1].trim();
  return msg.split("\n")[0];
};

export default DistributionDetailV2;
