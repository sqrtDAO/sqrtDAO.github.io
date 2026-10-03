"use client";

import Link from "next/link";
import { useChainId } from "wagmi";
import { IconChevronRight } from "@tabler/icons-react";
import type { Distribution } from "@/lib/fixtures/distributions";
import Status from "@/components/Status/Status";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import useTokenAvatar from "@/hooks/useTokenAvatar";
import { formatDate } from "@/utils/formatDate";
import { roundUnits } from "@/utils/round-units";
import { BODY_L, BODY_M, BODY_S } from "@/constants/typography";

export type DistributionCardProps = {
  distribution: Distribution;
  className?: string;
};

const Stat = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex min-w-0 flex-1 flex-col items-start justify-center whitespace-nowrap">
    <p className={`${BODY_S} text-secondary`}>{label}</p>
    {children}
  </div>
);

// Figma 14392:82966 — mobile DLP card. Avatar fetch mirrors TableRow (desktop row).
export default function DistributionCard({
  distribution,
  className,
}: DistributionCardProps) {
  const chainId = useChainId();
  const tokenAvatarUrl = useTokenAvatar(distribution.tokenAddress, chainId);

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
        <TokenAvatar
          seed={`${distribution.tokenName} ${distribution.tokenSymbol}`}
          imageUrl={tokenAvatarUrl ?? undefined}
          size={40}
          className="!rounded-full shrink-0"
        />
        <div className="flex min-w-0 flex-1 flex-col items-start justify-center gap-1">
          <div className="flex w-full items-center gap-2">
            <p className={`truncate ${BODY_L} text-primary`}>
              {distribution.tokenName}
            </p>
            <Status status={distribution.status} className="shrink-0" />
          </div>
          <p className={`w-full ${BODY_S} text-secondary`}>
            {distribution.tokenSymbol}
          </p>
        </div>
        <IconChevronRight
          className="shrink-0 text-tertiary"
          size={20}
          strokeWidth={1.75}
        />
      </div>

      <Stat label={`${distribution.participationTokenSymbol} total funded`}>
        <p className={`${BODY_L} text-primary`}>
          {roundUnits(
            distribution.totalParticipation,
            distribution.participationTokenDecimals,
          )}
        </p>
      </Stat>

      <Stat label="Epochs">
        <p className="flex items-baseline gap-1">
          <span className={`${BODY_L} text-primary`}>
            {distribution.epochsCompleted.toLocaleString("en-US")}
          </span>
          <span className={`${BODY_M} text-tertiary`}>
            /{distribution.totalEpochs.toLocaleString("en-US")}
          </span>
        </p>
      </Stat>

      <div className="flex w-full items-start gap-2">
        <Stat label="Started at">
          <p className={`${BODY_L} text-primary`}>
            {formatDate(distribution.startedAt)}
          </p>
        </Stat>
        <Stat label="Finished at">
          <p className={`${BODY_L} text-primary`}>
            {formatDate(distribution.finishedAt)}
          </p>
        </Stat>
      </div>
    </div>
  );
}
