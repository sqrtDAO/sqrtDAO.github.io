"use client";

import Image from "next/image";
import type { Address } from "viem";
import Input from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import EcosystemLabel from "@/components/EcosystemLabel/EcosystemLabel";
import EcosystemPicker from "@/components/EcosystemPicker/EcosystemPicker";
import { WizardTitle } from "@/components/WizardShell/WizardShell";
import { BODY_M, BODY_S } from "@/constants/typography";
import { useAvatarImage } from "@/hooks/useAvatarImage";
import type { UseInputReturn } from "@/hooks/useInput";
import useTokenAvatar from "@/hooks/useTokenAvatar";
import { roundUnits } from "@/utils/round-units";

export type ImportedToken = {
  address: Address;
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: bigint;
  balance: bigint;
};

type ImportTokenProps = {
  address: UseInputReturn;
  onAddressChange: (value: string) => void;
  chainId: number;
  onChainChange: (chainId: number) => void;
  token: ImportedToken | null;
  loading: boolean;
  error: string | null;
  onImport: () => void;
  onConfirm: () => void;
};

const Stat = ({ label, value, symbol }: { label: string; value: string; symbol: string }) => (
  <div className="flex flex-1 flex-col gap-1 xl:gap-1.5">
    <p className={`${BODY_M} text-secondary`}>{label}</p>
    <p className="flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-h4 leading-none font-medium text-primary">{value}</span>
      <span className={`${BODY_S} text-secondary`}>{symbol}</span>
    </p>
  </div>
);

// Figma 11318:97245 (desktop) / 14469:103622 (mobile)
const TokenCard = ({ token, chainId }: { token: ImportedToken; chainId: number }) => {
  // Resolve the token's on-chain avatar. Non-TokenV1 ERC-20s simply have no
  // readable avatar, so the branded placeholder stays as the fallback.
  const avatar = useTokenAvatar(token.address, chainId);
  const { src, onError } = useAvatarImage(avatar ?? undefined);
  const avatarSrc = src ?? "/mainnet/token-avatar-placeholder.png";

  return (
    <div className="flex w-full flex-col gap-4 bg-surface p-4 xl:flex-row xl:p-6">
      <div className="flex items-center gap-4 xl:items-start">
        <Image
          src={avatarSrc}
          alt=""
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-full"
          onError={src ? onError : undefined}
        />
        <div className="flex flex-col gap-1 xl:hidden">
          <TokenName token={token} chainId={chainId} />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-4">
        <div className="hidden flex-col gap-1 xl:flex">
          <TokenName token={token} chainId={chainId} />
        </div>
        <div className="flex flex-col gap-4 xl:flex-row xl:gap-0">
          <Stat label="Token total Supply" value={roundUnits(token.totalSupply, token.decimals)} symbol={token.symbol} />
          <Stat label="Your token balance" value={roundUnits(token.balance, token.decimals)} symbol={token.symbol} />
        </div>
      </div>
    </div>
  );
};

const TokenName = ({ token, chainId }: { token: ImportedToken; chainId: number }) => (
  <>
    <p className="flex flex-wrap items-center gap-2 text-body-l leading-6 tracking-[0.02em] text-primary">
      {token.name}
      <EcosystemLabel chainId={chainId} />
    </p>
    <p className={`${BODY_S} text-secondary`}>{token.decimals} Decimals</p>
  </>
);

// Figma 11318:97231 / 16780:43386 (desktop) · 14484:103660 / 16807:116164 (mobile)
const ImportToken = (props: ImportTokenProps) => {
  const onPaste = async () => {
    try {
      props.onAddressChange((await navigator.clipboard.readText()).trim());
    } catch {
      // Clipboard permission denied — user can still type.
    }
  };

  return (
    <div className="flex w-full flex-col gap-8 xl:items-end">
      <div className="flex w-full flex-col gap-8">
        <WizardTitle
          title="Import Existing Token"
          description="Paste the contract address of the token you want to distribute."
        />
        <EcosystemPicker variant="minimal" value={props.chainId} onChange={props.onChainChange} />
      </div>

      <div className="flex w-full flex-col items-center gap-6 xl:gap-2">
        <div className="flex w-full flex-col items-center gap-6 xl:flex-row xl:items-start xl:gap-4">
          <div className="w-full xl:flex-1">
            <Input
              state={props.address}
              label="Token contract address"
              placeholder="0x…"
              onChange={props.onAddressChange}
              showPaste
              onPaste={onPaste}
            />
          </div>
          <Button
            variant="primary"
            size="m"
            disabled={props.loading || !!props.token}
            onClick={props.onImport}
            // label (22px) + gap (8px): stays level with the field when an error shows below it
            className="xl:mt-7.5"
          >
            {props.loading ? "Loading…" : props.token ? "Check address" : "Import token"}
          </Button>
        </div>
        {props.error && <p className={`w-full ${BODY_M} text-danger`}>{props.error}</p>}
        {props.token && <TokenCard token={props.token} chainId={props.chainId} />}
      </div>

      {props.token && (
        <Button variant="primary" size="m" onClick={props.onConfirm} className="w-full xl:w-auto">
          Confirm
        </Button>
      )}
    </div>
  );
};

export default ImportToken;
