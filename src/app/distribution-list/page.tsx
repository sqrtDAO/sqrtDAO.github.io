"use client";

import DistributionList from "@/components/DistributionList/DistributionList";
import { useDistributions } from "@/hooks/useDistributions";

export default function DistributionListPage() {
  const { distributions, isLoading, error } = useDistributions();

  return (
    <DistributionList
      distributions={distributions}
      isLoading={isLoading}
      error={error}
    />
  );
}
