"use client";

import Image from "next/image";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import type { Address } from "viem";
import EcosystemLabel from "@/components/EcosystemLabel/EcosystemLabel";
import Logo from "@/components/Logo/Logo";
import Status, { type DistributionStatus } from "@/components/Status/Status";
import useTokenAvatar from "@/hooks/useTokenAvatar";
import { useAvatarImage } from "@/hooks/useAvatarImage";
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

// Rest boxes are 70% black; hover/focus/press turns them solid.
const EASE = "duration-300 ease-out motion-reduce:transition-none";
const BOX = "bg-black/70 px-2 py-1.5 group-on:bg-black";
const FADE_BOX = `${BOX} transition-colors ${EASE}`;
const NATIVE_HINT = "Launched natively on sqrtDAO";
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
    className={`${FADE_BOX} flex flex-col justify-center gap-1 whitespace-nowrap ${className}`}
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
  // Avatar metadata is usually `ipfs://<cid>`; resolve it through gateways
  // (never hand ipfs:// to <img>) and fall back to the branded placeholder.
  const { src, onError } = useAvatarImage(avatar ?? props.imageUrl);
  const imageUrl = src ?? "/mainnet/token-avatar-placeholder.png";
  return (
    <Link
    href={props.href}
    className="group relative block aspect-square overflow-hidden bg-black outline-none"
  >
    <Image
      src={imageUrl}
      alt=""
      fill
      sizes="(min-width: 1280px) 392px, 100vw"
      className={`object-cover transition-transform ${EASE} group-on:scale-105`}
      onError={src ? onError : undefined}
    />
    <div className={`absolute inset-x-0 top-[45%] bottom-0 bg-linear-to-t from-canvas to-transparent transition-opacity ${EASE} group-on:opacity-0`} />
    <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 p-2 xl:p-4">
      {/* Width eases from hug → full where `interpolate-size` is supported; snaps elsewhere. */}
      <div
        className={`${BOX} flex w-fit max-w-full items-center justify-between gap-2 transition-[width,background-color] [interpolate-size:allow-keywords] ${EASE} group-on:w-full`}
      >
        <div className="flex min-w-0 flex-col items-start">
          <EcosystemLabel chainId={props.chainId} />
          <div className="flex max-w-full min-w-0 items-baseline gap-4">
            <p className="flex min-w-0 items-center gap-1">
              <span className="truncate font-display text-h3 text-primary">
                {props.name}
              </span>
              {props.native && (
                <span
                  role="img"
                  aria-label={NATIVE_HINT}
                  className="group/native relative flex size-6 shrink-0 items-center justify-center"
                >
                  <Logo variant="sign" width={16} height={12} />
                  <span className="pointer-events-none absolute bottom-full left-1/2 mb-1 -translate-x-1/2 translate-y-1 rounded-s bg-overlay px-2 py-1 text-body-s leading-4 whitespace-nowrap text-primary opacity-0 transition duration-200 group-hover/native:translate-y-0 group-hover/native:opacity-100">
                    {NATIVE_HINT}
                  </span>
                </span>
              )}
            </p>
            <Status status={props.status} className="shrink-0" />
          </div>
          <p className={`${BODY_M} text-secondary`}>{props.symbol}</p>
        </div>
        <IconChevronRight
          size={24}
          className={`w-0 shrink-0 -translate-x-2 text-primary opacity-0 transition-all ${EASE} group-on:w-6 group-on:translate-x-0 group-on:opacity-100`}
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
      <div className={`${FADE_BOX} flex flex-col gap-1`}>
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
    <div className={`pointer-events-none absolute inset-0 border-2 border-action opacity-0 transition-opacity ${EASE} group-on:opacity-100`} />
  </Link>
  );
};

export default MainnetDistributionCard;
