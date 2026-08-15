"use client";

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import type { Distribution } from "@/lib/fixtures/distributions";
import Status from "@/components/Status/Status";
import { formatDate } from "@/utils/formatDate";

export type DistributionCardProps = {
  distribution: Distribution;
  className?: string;
};

export default function DistributionCard({
  distribution,
  className,
}: DistributionCardProps) {
  return (
    <div
      className={`relative flex w-full flex-col gap-4 border border-muted bg-black p-4 ${className ?? ""}`}
    >
      <Link
        aria-label={`View ${distribution.tokenName} distribution`}
        className="absolute inset-0"
        href={`/distribution/?address=${distribution.address}`}
        target="_blank"
        rel="noopener noreferrer"
      />
      <div className="flex items-center gap-2">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
          <p className="w-full text-body-l leading-6 text-primary">
            {distribution.tokenName}
          </p>
          <p className="w-full text-body-s leading-5 text-secondary">
            {distribution.tokenSymbol}
          </p>
        </div>
        <Status status={distribution.status} />
        <IconChevronRight className="shrink-0 text-tertiary" size={20} strokeWidth={1.75} />
      </div>

      <div className="flex flex-col items-start justify-center whitespace-nowrap">
        <p className="text-body-s leading-5 text-secondary">
          {distribution.participationTokenSymbol} total funded
        </p>
        <p className="text-body-l leading-6 text-primary">
          {distribution.totalParticipation.toLocaleString("en-US")}
        </p>
      </div>

      <div className="flex flex-col items-start justify-center whitespace-nowrap">
        <p className="text-body-s leading-5 text-secondary">Epochs</p>
        <div className="flex items-center justify-between gap-1 text-body leading-[22px]">
          <span className="text-primary">
            {distribution.epochsCompleted.toLocaleString("en-US")}
          </span>
          <span className="text-tertiary">
            /{distribution.totalEpochs.toLocaleString("en-US")}
          </span>
        </div>
      </div>

      <div className="flex w-full items-start gap-2 whitespace-nowrap">
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
          <p className="text-body-s leading-5 text-secondary">Started at</p>
          <p className="text-body-l leading-6 text-primary">
            {formatDate(distribution.startedAt)}
          </p>
        </div>
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center">
          <p className="text-body-s leading-5 text-secondary">Finished at</p>
          <p className="text-body-l leading-6 text-primary">
            {formatDate(distribution.finishedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
