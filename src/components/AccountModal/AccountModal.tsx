"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { IconCheck, IconCopy, IconLoader2, IconLogout } from "@tabler/icons-react";
import DialogShell from "@/components/DialogShell/DialogShell";
import { Button } from "@/components/Button/Button";
import { closeWalletDialog, useWalletDialog } from "@/hooks/useWalletDialog";
import { useSwitchNetwork } from "@/hooks/useSwitchNetwork";
import {
  LIVE_CHAINS,
  chainNameToId,
  chainToName,
  chainToSlug,
  ecosystemOf,
} from "@/utils/chain-utils";
import { BODY_M, BODY_S } from "@/constants/typography";

const pageChainId = () => {
  if (typeof window === "undefined") return undefined;
  return chainNameToId(new URLSearchParams(window.location.search).get("chain"));
};

const AccountModal = () => {
  const open = useWalletDialog() === "account";
  const { address, chainId, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const switchTo = useSwitchNetwork();
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [pendingChain, setPendingChain] = useState<number | null>(null);
  const [failed, setFailed] = useState<{ chainId: number; timedOut: boolean } | null>(null);

  if (!open || !isConnected || !address) return null;

  const close = () => {
    setCopied(false);
    setPendingChain(null);
    setFailed(null);
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
    if (pendingChain !== null) return;
    setFailed(null);

    if (target !== chainId) {
      setPendingChain(target);
      const result = await switchTo(target);
      setPendingChain(null);
      if (result !== "switched") {
        setFailed({ chainId: target, timedOut: result === "timeout" });
        return;
      }
    }

    const params = new URLSearchParams(window.location.search);
    params.set("chain", chainToSlug(target));
    router.replace(`${pathname}?${params}`, { scroll: false });
    close();
  };

  const activePage = pageChainId();
  const failedName = failed ? chainToName(failed.chainId) : "";

  return (
    <DialogShell
      title="Wallet"
      subtitle={
        <span className={`${BODY_S} text-secondary`}>
          {connector?.name ?? "Connected"}
          {chainId === undefined
            ? ""
            : ` · ${ecosystemOf(chainId) ? chainToName(chainId) : "unsupported network"}`}
          {activePage !== undefined && activePage !== chainId
            ? ` · this page is on ${chainToName(activePage)}`
            : ""}
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
          const pending = chain.id === pendingChain;
          return (
            <button
              key={chain.id}
              type="button"
              disabled={pendingChain !== null}
              onClick={() => void select(chain.id)}
              className={`flex items-center justify-between gap-3 rounded-m border px-4 py-3 text-left transition-colors disabled:opacity-60 ${
                active ? "border-strong bg-raised" : "border-subtle bg-raised hover:border-strong"
              }`}
            >
              <span className={`${BODY_M} text-primary`}>{chain.name}</span>
              {pending ? (
                <IconLoader2 size={18} className="animate-spin text-secondary" />
              ) : active ? (
                <IconCheck size={18} className="text-primary" />
              ) : null}
            </button>
          );
        })}

        {failed ? (
          <p className={`${BODY_S} text-danger`}>
            Your wallet didn&apos;t switch to {failedName}.{" "}
            {failed.timedOut
              ? "It never answered — open it from your recent apps, the request should be waiting there, then try again."
              : ecosystemOf(failed.chainId)?.testnet
                ? `If it hides test networks, enable ${failedName} in the wallet settings (MetaMask: Settings → Advanced → Show test networks, Rabby: Settings → Enable testnets), then try again.`
                : "Try again, or pick the network inside your wallet."}
          </p>
        ) : null}
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
