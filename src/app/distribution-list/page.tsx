"use client";

import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import MainnetDistributionList from "@/components/MainnetDistributionList/MainnetDistributionList";
import { DISTRIBUTION_LIST } from "@/constants/links";
import { useActiveChainId } from "@/hooks/useActiveChain";
import { useDistributions } from "@/hooks/useDistributions";
import { MAINNET_ECOSYSTEMS, chainToSlug, isTestnet } from "@/utils/chain-utils";
import { formatPrice } from "@/utils/epoch-format";
import { roundUnits } from "@/utils/round-units";

const PAGE_SIZE = 10;
const SHOW_ALL = "Show all";

function DistributionListContent() {
  const router = useRouter();
  // ?chain= filters; without it the wallet decides testnet vs. all of mainnet.
  const { urlChainId, chainId } = useActiveChainId();
  const testnet = isTestnet(chainId);
  const filterChainId = testnet ? chainId : urlChainId;
  const chainIds = filterChainId
    ? [filterChainId]
    : MAINNET_ECOSYSTEMS.map((e) => e.chain!.id);

  // page resets to 1 whenever the filter changes
  const [paging, setPaging] = useState({ filter: filterChainId, page: 1 });
  const page = paging.filter === filterChainId ? paging.page : 1;
  const setPage = (p: number) => setPaging({ filter: filterChainId, page: p });
  const { distributions, isLoading, error, total, totalPages } =
    useDistributions({ page, pageSize: PAGE_SIZE, chainIds });

  const ecosystem = MAINNET_ECOSYSTEMS.find((e) => e.chain!.id === urlChainId);
  const onEcosystemChange = (name: string) => {
    const picked = MAINNET_ECOSYSTEMS.find((e) => e.name === name);
    router.replace(picked ? `${DISTRIBUTION_LIST}?chain=${picked.slug}` : DISTRIBUTION_LIST, {
      scroll: false,
    });
  };

  const cards = distributions.map((d) => ({
    id: `${d.chainId}-${d.address}`,
    href: `/distribution/?address=${d.address}&chain=${chainToSlug(d.chainId)}`,
    name: d.tokenName,
    symbol: d.tokenSymbol,
    status: d.status,
    tokenAddress: d.tokenAddress,
    chainId: d.chainId,
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
      ecosystemFilter={
        testnet
          ? undefined
          : {
              value: ecosystem?.name ?? SHOW_ALL,
              options: [SHOW_ALL, ...MAINNET_ECOSYSTEMS.map((e) => e.name)],
              onChange: onEcosystemChange,
            }
      }
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
