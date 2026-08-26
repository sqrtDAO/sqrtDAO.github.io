"use client";

import { useState } from "react";
import DistributionList from "@/components/DistributionList/DistributionList";
import { useDistributions } from "@/hooks/useDistributions";

const PAGE_SIZE = 10;

export default function DistributionListPage() {
  const [page, setPage] = useState(1);
  const { distributions, isLoading, error, total, totalPages } =
    useDistributions({ page, pageSize: PAGE_SIZE });

  return (
    <DistributionList
      distributions={distributions}
      isLoading={isLoading}
      error={error}
      total={total}
      totalPages={totalPages}
      page={page}
      onPageChange={setPage}
    />
  );
}
