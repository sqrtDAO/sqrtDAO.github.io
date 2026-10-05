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
import { IconButton } from "@/components/IconButton/IconButton";
import NetworkTag from "@/components/NetworkTag/NetworkTag";
import Status, { type DistributionStatus } from "@/components/Status/Status";
import TokenAvatar from "@/components/TokenAvatar/TokenAvatar";
import { BODY_L, BODY_M } from "@/constants/typography";

export type DistributionHeaderLinks = {
  website?: string;
  x?: string;
  github?: string;
  explorer?: string;
  uniswap?: string;
};

export type DistributionHeaderProps = {
  name: string;
  symbol: string;
  status: DistributionStatus;
  imageUrl?: string;
  creator: string;
  tokenAddress: string;
  distributionAddress: string;
  /** Absolute URLs. Anything missing simply isn't rendered. */
  links?: DistributionHeaderLinks;
  onShare?: () => void;
};

const UniswapIcon = ({ size }: { size: number }) => (
  <Image src="/mainnet/uniswap.svg" alt="" width={size} height={size} />
);

const ExternalBtn = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon?: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="sqrt-btn sqrt-btn--ghost sqrt-btn--m"
  >
    {icon && (
      <span className="sqrt-btn__icon" aria-hidden="true">
        {icon}
      </span>
    )}
    <span className="sqrt-btn__label">{label}</span>
  </a>
);

const ExternalIcon = ({
  href,
  label,
  icon,
}: {
  href: string;
  label: string;
  icon: React.ReactNode;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="icon-btn icon-btn--ghost icon-btn--m"
  >
    <span className="icon-btn__icon" aria-hidden="true">
      {icon}
    </span>
  </a>
);

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
  const links = props.links ?? {};
  const iconLinks = (size: number) =>
    [
      { label: "Uniswap", href: links.uniswap, icon: <UniswapIcon size={size} /> },
      { label: "X", href: links.x, icon: <IconBrandX size={size} /> },
      { label: "GitHub", href: links.github, icon: <IconBrandGithub size={size} /> },
    ].filter((link) => Boolean(link.href));

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
              {links.website && <ExternalBtn href={links.website} label="Website" />}
              {links.explorer && (
                <ExternalBtn
                  href={links.explorer}
                  label="Explorer"
                  icon={<IconExternalLink size={18} />}
                />
              )}
              {iconLinks(24).map(({ label, href, icon }) => (
                <ExternalIcon key={label} href={href!} label={label} icon={icon} />
              ))}
              <IconButton
                variant="ghost"
                size="m"
                aria-label="Share"
                icon={<IconShare3 size={24} />}
                onClick={props.onShare}
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
          {links.website && (
            <ExternalIcon href={links.website} label="Website" icon={<IconWorld size={16} />} />
          )}
          {iconLinks(16).map(({ label, href, icon }) => (
            <ExternalIcon key={label} href={href!} label={label} icon={icon} />
          ))}
          <IconButton
            variant="ghost"
            size="s"
            aria-label="Share"
            icon={<IconShare3 size={16} />}
            onClick={props.onShare}
          />
          {links.explorer && (
            <ExternalBtn
              href={links.explorer}
              label="Explorer"
              icon={<IconExternalLink size={18} />}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default DistributionHeader;