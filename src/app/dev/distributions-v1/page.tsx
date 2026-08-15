"use client";

import DistributionList from "@/components/DistributionList/DistributionList";
import { mockDistributions } from "@/lib/fixtures/distributions";

export default function DistributionsV1PreviewPage() {
  return <DistributionList distributions={mockDistributions} />;
}
