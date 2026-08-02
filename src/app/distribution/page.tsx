"use client";

import { Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { isAddress } from "viem";
import DistributionDetail from "@/components/DistributionDetail/DistributionDetail";

function DistributionContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  if (!address || !isAddress(address)) notFound();
  return <DistributionDetail contractAddress={address} />;
}

export default function DistributionPage() {
  return (
    <Suspense>
      <DistributionContent />
    </Suspense>
  );
}
