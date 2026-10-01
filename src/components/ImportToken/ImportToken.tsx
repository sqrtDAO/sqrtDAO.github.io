"use client";

import { useState } from "react";
import Image from "next/image";
import Input from "@/components/Input/Input";
import { Button } from "@/components/Button/Button";
import { useInput } from "@/hooks/useInput";
import { MAINNET_DISTRIBUTE_HREF } from "@/constants/links";
import { WizardShell, WizardTitle } from "@/components/WizardShell/WizardShell";

// Static stand-in for the chain read; teammate replaces with real token data.
const MOCK_TOKEN = { name: "Token name", decimals: 18, supply: "123,231", balance: "123,231", symbol: "Symbol" };

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="flex flex-1 flex-col gap-1 xl:gap-1.5">
    <p className="text-body leading-5.5 tracking-[0.01em] text-secondary">{label}</p>
    <p className="flex items-baseline gap-1 whitespace-nowrap">
      <span className="text-h4 leading-none font-medium text-primary">{value}</span>
      <span className="text-body-s leading-5 tracking-[0.01em] text-secondary">{MOCK_TOKEN.symbol}</span>
    </p>
  </div>
);

const Avatar = () => (
  <Image
    src="/mainnet/token-avatar-placeholder.png"
    alt=""
    width={56}
    height={56}
    className="size-14 shrink-0 rounded-full"
  />
);

const TokenName = () => (
  <div className="flex flex-col gap-1">
    <p className="text-body-l leading-6 tracking-[0.02em] text-primary">{MOCK_TOKEN.name}</p>
    <p className="text-body-s leading-5 tracking-[0.01em] text-secondary">{MOCK_TOKEN.decimals} Decimals</p>
  </div>
);

const Supply = () => <Stat label="Token total Supply" value={MOCK_TOKEN.supply} />;
const Balance = () => <Stat label="Your token balance" value={MOCK_TOKEN.balance} />;

// Figma 11318:97245 (desktop) / 14469:103622 (mobile)
const TokenCard = () => (
  <>
    <div className="hidden w-full gap-4 bg-surface p-6 xl:flex">
      <Avatar />
      <div className="flex flex-1 flex-col gap-4">
        <TokenName />
        <div className="flex">
          <Supply />
          <Balance />
        </div>
      </div>
    </div>
    <div className="flex w-full flex-col gap-4 bg-surface p-4 xl:hidden">
      <div className="flex items-center gap-4">
        <Avatar />
        <TokenName />
      </div>
      <Supply />
      <Balance />
    </div>
  </>
);

// Figma 11318:97231 (desktop) / 14484:103660 (mobile)
const ImportToken = () => {
  const address = useInput("");
  const [checked, setChecked] = useState(false);

  const onAddressChange = (value: string) => {
    address.onChange(value);
    setChecked(false);
  };

  const onPaste = async () => {
    try {
      onAddressChange((await navigator.clipboard.readText()).trim());
    } catch {
      // Clipboard permission denied — user can still type.
    }
  };

  const onCheckAddress = () => {
    /* TODO: teammate wires logic (validate address + read token) */
    setChecked(true);
  };

  const onConfirm = () => {
    /* TODO: teammate wires logic */
  };

  return (
    <WizardShell closeHref={MAINNET_DISTRIBUTE_HREF} spacious>

      <div className="flex w-full flex-col gap-8 xl:items-end">
        <WizardTitle
          title="Import Existing Token"
          description="Paste the contract address of the token you want to distribute."
        />

        <div className="flex w-full flex-col items-center gap-6 xl:gap-2">
          <div className="flex w-full flex-col items-center gap-6 xl:flex-row xl:items-end xl:gap-4">
            <div className="w-full xl:flex-1">
              <Input
                state={address}
                label="Token contract address"
                placeholder="e.g. 1FfmbHfnpaZjKFvyi1okTjJJusN455paPH"
                onChange={onAddressChange}
                showPaste
                onPaste={onPaste}
              />
            </div>
            <Button variant="primary" size="m" disabled={checked} onClick={onCheckAddress}>
              {checked ? "Check address" : "Import token"}
            </Button>
          </div>
          {checked && <TokenCard />}
        </div>

        {checked && (
          <Button variant="primary" size="m" onClick={onConfirm} className="w-full xl:w-auto">
            Confirm
          </Button>
        )}
      </div>
    </WizardShell>
  );
};

export default ImportToken;
