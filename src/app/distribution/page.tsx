"use client";

import { Suspense } from "react";
import { useSearchParams, notFound } from "next/navigation";
import { isAddress } from "viem";
import DistributionDetailV2 from "@/components/DistributionDetailV2/DistributionDetailV2";

function DistributionContent() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address");
  const chain = searchParams.get("chain");
  if (!address || !isAddress(address)) notFound();
  return <DistributionDetailV2 contractAddress={address} chainSlug={chain} />;
}

export default function DistributionPage() {
  return (
    <Suspense>
      <DistributionContent />
    </Suspense>
  );
}
