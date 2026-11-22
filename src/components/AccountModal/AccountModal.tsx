"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { IconCheck, IconCopy, IconLogout } from "@tabler/icons-react";
import DialogShell from "@/components/DialogShell/DialogShell";
import { Button } from "@/components/Button/Button";
import { closeWalletDialog, useWalletDialog } from "@/hooks/useWalletDialog";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import { LIVE_CHAINS, chainToName, chainToSlug, ecosystemOf } from "@/utils/chain-utils";
import { BODY_M, BODY_S } from "@/constants/typography";

const AccountModal = () => {
  const open = useWalletDialog() === "account";
  const { address, chainId, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const switchTo = useSwitchNetwork();
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);

  if (!open || !isConnected || !address) return null;

  const close = () => {
    setCopied(false);
    closeWalletDialog();
  };

  const copy = async () => {
    await navigator.clipboard?.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  // The page's `?chain=` is what the app reads, so follow whichever network the
  // wallet ends up on. A refused switch leaves both the wallet and the URL alone.
  const select = async (target: number) => {
    if (target !== chainId && !(await switchTo(target))) return;
    const params = new URLSearchParams(window.location.search);
    params.set("chain", chainToSlug(target));
    router.replace(`${pathname}?${params}`, { scroll: false });
    close();
  };

  return (
    <DialogShell
      title="Wallet"
      subtitle={
        <span className={`${BODY_S} text-secondary`}>
          {connector?.name ?? "Connected"}
          {chainId === undefined
            ? ""
            : ` · ${ecosystemOf(chainId) ? chainToName(chainId) : "unsupported network"}`}
        </span>
      }
      onClose={close}
    >
      <button
        type="button"
        onClick={copy}
        className="flex items-center justify-between gap-3 rounded-m border border-subtle bg-raised px-4 py-3 text-left hover:border-strong"
      >
        <span className={`${BODY_S} break-all text-primary`}>{address}</span>
        {copied ? (
          <IconCheck size={18} className="shrink-0 text-secondary" />
        ) : (
          <IconCopy size={18} className="shrink-0 text-secondary" />
        )}
      </button>

      <div className="flex flex-col gap-2">
        <p className={`${BODY_S} text-secondary`}>Network</p>
        {LIVE_CHAINS.map((chain) => {
          const active = chain.id === chainId;
          return (
            <button
              key={chain.id}
              type="button"
              onClick={() => void select(chain.id)}
              className={`flex items-center justify-between gap-3 rounded-m border px-4 py-3 text-left transition-colors ${
                active
                  ? "border-strong bg-raised"
                  : "border-subtle bg-raised hover:border-strong"
              }`}
            >
              <span className={`${BODY_M} text-primary`}>{chain.name}</span>
              {active ? <IconCheck size={18} className="text-primary" /> : null}
            </button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="m"
        className="self-start"
        leadingIcon={<IconLogout size={18} />}
        onClick={() => {
          disconnect();
          close();
        }}
      >
        Disconnect
      </Button>
    </DialogShell>
  );
};

export default AccountModal;
