"use client";

import Image from "next/image";
import {
  IconBrandGithub,
  IconBrandX,
  IconExternalLink,
  IconShare3,
  IconWorld,
} from "@tabler/icons-react";
import AddressTag from "@/components/AddressTag/AddressTag";
import { Button } from "@/components/Button/Button";
import { IconButton } from "@/components/IconButton/IconButton";
import NetworkTag from "@/components/NetworkTag/NetworkTag";
import Status, { type DistributionStatus } from "@/components/Status/Status";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import { BODY_L, BODY_M } from "@/constants/typography";

export type DistributionHeaderProps = {
  name: string;
  symbol: string;
  status: DistributionStatus;
  imageUrl?: string;
  creator: string;
  tokenAddress: string;
  distributionAddress: string;
};

const onOpen = (link: string) => () => {
  /* TODO: teammate wires project links (website / explorer / dex / X / GitHub) */
  void link;
};
const onShare = () => {
  /* TODO: teammate wires onShare */
};

const UniswapIcon = ({ size }: { size: number }) => (
  <Image src="/mainnet/uniswap.svg" alt="" width={size} height={size} />
);

const iconLinks = (size: number) => [
  { label: "Uniswap", icon: <UniswapIcon size={size} /> },
  { label: "X", icon: <IconBrandX size={size} /> },
  { label: "GitHub", icon: <IconBrandGithub size={size} /> },
];

const Address = ({ label, value }: { label: string; value: string }) => (
  <div className="flex min-w-0 flex-1 flex-col gap-1 xl:flex-none">
    <p className={`${BODY_M} text-tertiary`}>{label}</p>
    <AddressTag value={value} className="self-start" />
  </div>
);

const NameRow = ({ name, symbol, status }: DistributionHeaderProps) => (
  <div className="flex flex-col gap-1 xl:gap-2">
    <div className="flex items-center gap-2 xl:items-end">
      <h1 className="text-h4 leading-none font-medium text-primary">{name}</h1>
      <NetworkTag />
      <Status status={status} className="shrink-0" />
    </div>
    <p className={`${BODY_L} text-secondary`}>{symbol}</p>
  </div>
);

// Figma 12057:112125 (desktop) / 14639:105596 (mobile).
const DistributionHeader = (props: DistributionHeaderProps) => {
  const seed = `${props.name} ${props.symbol}`;
  return (
    <>
      <div className="hidden items-center gap-4 border-b border-muted pb-4 xl:flex">
        <TokenAvatar
          seed={seed}
          imageUrl={props.imageUrl}
          size={130}
          className="!rounded-m !border-muted"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex items-center justify-between gap-4">
            <NameRow {...props} />
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="m" onClick={onOpen("website")}>
                Website
              </Button>
              <Button
                variant="ghost"
                size="m"
                leadingIcon={<IconExternalLink size={18} />}
                onClick={onOpen("explorer")}
              >
                Explorer
              </Button>
              {iconLinks(24).map(({ label, icon }) => (
                <IconButton
                  key={label}
                  variant="ghost"
                  size="m"
                  aria-label={label}
                  icon={icon}
                  onClick={onOpen(label)}
                />
              ))}
              <IconButton
                variant="ghost"
                size="m"
                aria-label="Share"
                icon={<IconShare3 size={24} />}
                onClick={onShare}
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <Address label="Creator address" value={props.creator} />
            <Address
              label="Token contract address"
              value={props.tokenAddress}
            />
            <Address
              label="Distribution address"
              value={props.distributionAddress}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-b border-muted p-4 xl:hidden">
        <div className="flex items-center gap-4">
          <TokenAvatar
            seed={seed}
            imageUrl={props.imageUrl}
            size={56}
            className="!rounded-full shrink-0"
          />
          <NameRow {...props} />
        </div>
        <div className="flex gap-4">
          <Address label="Creator address" value={props.creator} />
          <Address
            label="Distribution address"
            value={props.distributionAddress}
          />
        </div>
        <div className="flex items-center gap-2">
          {[
            { label: "Website", icon: <IconWorld size={16} /> },
            ...iconLinks(16),
          ].map(({ label, icon }) => (
            <IconButton
              key={label}
              variant="ghost"
              size="s"
              aria-label={label}
              icon={icon}
              onClick={onOpen(label)}
            />
          ))}
          <IconButton
            variant="ghost"
            size="s"
            aria-label="Share"
            icon={<IconShare3 size={16} />}
            onClick={onShare}
          />
          <Button
            variant="ghost"
            size="m"
            leadingIcon={<IconExternalLink size={18} />}
            onClick={onOpen("explorer")}
          >
            Explorer
          </Button>
        </div>
      </div>
    </>
  );
};

export default DistributionHeader;
