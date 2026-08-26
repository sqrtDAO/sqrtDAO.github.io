"use client";

import { useState } from "react";
import DistributionList from "@/components/DistributionList/DistributionList";
import { mockDistributions } from "@/lib/fixtures/distributions";

export default function DistributionsV1PreviewPage() {
  const [page, setPage] = useState(1);
  return (
    <DistributionList
      distributions={mockDistributions}
      total={mockDistributions.length}
      totalPages={1}
      page={page}
      onPageChange={setPage}
    />
  );
}
