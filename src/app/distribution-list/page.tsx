"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { base, sepolia } from "viem/chains";
import MainnetDistributionList from "@/components/MainnetDistributionList/MainnetDistributionList";
import { useDistributions } from "@/hooks/useDistributions";
import { chainNameToId, chainToSlug } from "@/utils/chain-utils";
import { formatPrice } from "@/utils/epoch-format";
import { roundUnits } from "@/utils/round-units";

const PAGE_SIZE = 10;

function DistributionListContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const connectedChainId = useChainId();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  // the URL is the source of truth for which chain the list shows
  const chainId = chainNameToId(searchParams.get("chain")) ?? connectedChainId;

  const [page, setPage] = useState(1);
  const { distributions, isLoading, error, total, totalPages } =
    useDistributions({ page, pageSize: PAGE_SIZE, chainId });

  // chain change → back to page 1
  useEffect(() => setPage(1), [chainId]);

  const onNetworkToggle = useCallback(() => {
    const target = chainId === base.id ? sepolia.id : base.id;
    router.replace(`/distribution-list?chain=${chainToSlug(target)}`, {
      scroll: false,
    });
    if (isConnected) switchChain({ chainId: target });
  }, [chainId, isConnected, router, switchChain]);

  const cards = distributions.map((d) => ({
    id: d.address,
    href: `/distribution/?address=${d.address}&chain=${chainToSlug(chainId)}`,
    name: d.tokenName,
    symbol: d.tokenSymbol,
    status: d.status,
    tokenAddress: d.tokenAddress,
    chainId,
    native: d.native,
    totalParticipation: roundUnits(
      d.totalParticipation,
      d.participationTokenDecimals,
    ),
    lastClearPrice:
      d.lastClearPrice !== null ? formatPrice(d.lastClearPrice) : "—",
    quoteSymbol: d.participationTokenSymbol,
    epochsCompleted: d.epochsCompleted.toLocaleString("en-US"),
    totalEpochs: d.totalEpochs.toLocaleString("en-US"),
    progressPct: d.totalEpochs > 0 ? (d.epochsCompleted / d.totalEpochs) * 100 : 0,
  }));

  return (
    <MainnetDistributionList
      distributions={cards}
      total={total}
      totalPages={totalPages}
      page={page}
      onPageChange={setPage}
      isLoading={isLoading}
      error={error}
      chainId={chainId}
      onNetworkToggle={onNetworkToggle}
    />
  );
}

export default function DistributionListPage() {
  return (
    <Suspense>
      <DistributionListContent />
    </Suspense>
  );
}
