"use client";

import Image from "next/image";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import type { Address } from "viem";
import Logo from "@/components/Logo/Logo";
import Status, { type DistributionStatus } from "@/components/Status/Status";
import useTokenAvatar from "@/hooks/useTokenAvatar";
import { BODY_L, BODY_M, BODY_S } from "@/constants/typography";

export type MainnetDistributionCardProps = {
  href: string;
  name: string;
  symbol: string;
  status: DistributionStatus;
  imageUrl?: string;
  /** On-chain token + chain; when set the avatar is resolved from metadata. */
  tokenAddress?: Address;
  chainId?: number;
  /** Launched via sqrtDAO — shows the logo mark next to the name. */
  native: boolean;
  /** Pre-formatted amounts. */
  totalParticipation: string;
  lastClearPrice: string;
  quoteSymbol: string;
  epochsCompleted: string;
  totalEpochs: string;
  /** 0–100. */
  progressPct: number;
};

// Rest boxes are 70% black; hover/press turns them solid.
const BOX =
  "bg-black/70 px-2 py-1.5 group-hover:bg-black group-active:bg-black";
const LABEL = `${BODY_S} text-tertiary xl:text-body xl:leading-5.5 xl:tracking-[0.01em]`;
const VALUE = `${BODY_L} text-primary xl:text-h4 xl:leading-none xl:font-medium xl:tracking-normal`;
const UNIT = `${BODY_S} text-secondary xl:text-body xl:leading-5.5 xl:tracking-[0.01em]`;

const Metric = ({
  label,
  value,
  unit,
  className = "",
}: {
  label: string;
  value: string;
  unit: string;
  className?: string;
}) => (
  <div
    className={`${BOX} flex flex-col justify-center gap-1 whitespace-nowrap ${className}`}
  >
    <p className={LABEL}>{label}</p>
    <p className="flex items-center gap-1">
      <span className={VALUE}>{value}</span>
      <span className={UNIT}>{unit}</span>
    </p>
  </div>
);

// Figma 15438:138449 — rest / hovered+pressed × desktop (392) / mobile (358).
const MainnetDistributionCard = (props: MainnetDistributionCardProps) => {
  const avatar = useTokenAvatar(props.tokenAddress, props.chainId);
  const imageUrl =
    avatar ?? props.imageUrl ?? "/mainnet/token-avatar-placeholder.png";
  return (
    <Link
    href={props.href}
    className="group relative block aspect-square overflow-hidden bg-black"
  >
    <Image
      src={imageUrl}
      alt=""
      fill
      sizes="(min-width: 1280px) 392px, 100vw"
      className="object-cover"
    />
    <div className="absolute inset-x-0 top-44.5 bottom-0 bg-linear-to-t from-canvas to-transparent group-hover:hidden group-active:hidden" />
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-2 xl:p-4">
      <div
        className={`${BOX} flex items-center justify-between gap-2 self-start group-hover:self-stretch group-active:self-stretch`}
      >
        <div className="flex min-w-0 flex-col">
          <div className="flex items-baseline gap-4">
            <p className="flex items-center gap-1">
              <span className="truncate font-display text-h3 text-primary">
                {props.name}
              </span>
              {props.native && (
                <span className="flex size-6 shrink-0 items-center justify-center group-hover:hidden group-active:hidden">
                  <Logo variant="sign" width={16} height={12} />
                </span>
              )}
            </p>
            <Status status={props.status} className="shrink-0" />
          </div>
          <p className={`${BODY_M} text-secondary`}>{props.symbol}</p>
        </div>
        <IconChevronRight
          size={24}
          className="hidden shrink-0 text-primary group-hover:block group-active:block"
          aria-hidden="true"
        />
      </div>
      <div className="flex gap-1">
        <Metric
          label="Total participation"
          value={props.totalParticipation}
          unit={props.quoteSymbol}
          className="min-w-0 flex-1"
        />
        <Metric
          label="Last clear price"
          value={props.lastClearPrice}
          unit={props.quoteSymbol}
        />
      </div>
      <div className={`${BOX} flex flex-col gap-1`}>
        <p className="flex items-center gap-1 whitespace-nowrap xl:items-baseline">
          <span className={LABEL}>Epochs</span>
          <span className={`${BODY_L} text-primary`}>
            {props.epochsCompleted}
          </span>
          <span className={`${BODY_L} text-tertiary`}>
            /{props.totalEpochs}
          </span>
        </p>
        <div className="relative h-1.5 overflow-hidden bg-live-bg xl:h-2">
          {/* Dynamic width — the one inline style. */}
          <div
            className="absolute inset-y-0 left-0 bg-live"
            style={{ width: `${props.progressPct}%` }}
          />
        </div>
      </div>
    </div>
    {/* Hover border overlays the image so the card doesn't shift. */}
    <div className="pointer-events-none absolute inset-0 hidden border-2 border-action group-hover:block group-active:block" />
  </Link>
  );
};

export default MainnetDistributionCard;
