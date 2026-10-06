"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useChainId } from "wagmi";
import MainnetDistributionList from "@/components/MainnetDistributionList/MainnetDistributionList";
import { useDistributions } from "@/hooks/useDistributions";
import { chainNameToId, chainToSlug } from "@/utils/chain-utils";
import { formatPrice } from "@/utils/epoch-format";
import { roundUnits } from "@/utils/round-units";

const PAGE_SIZE = 10;

function DistributionListContent() {
  const searchParams = useSearchParams();
  const connectedChainId = useChainId();
  const chainId = chainNameToId(searchParams.get("chain")) ?? connectedChainId;

  const [page, setPage] = useState(1);
  const { distributions, isLoading, error, total, totalPages } =
    useDistributions({ page, pageSize: PAGE_SIZE, chainId });

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
