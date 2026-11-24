"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import { IconCheck, IconCopy, IconLoader2, IconLogout } from "@tabler/icons-react";
import DialogShell from "@/components/DialogShell/DialogShell";
import { Button } from "@/components/Button/Button";
import {
  closeWalletDialog,
  openWalletDialog,
  useWalletDialog,
} from "@/hooks/useWalletDialog";
import { useSwitchNetwork, type SwitchResult } from "@/hooks/useSwitchNetwork";
import { addChain } from "@/lib/wallet/add-chain";
import { preferWalletConnectTransport } from "@/lib/wallet/prefs";
import {
  LIVE_CHAINS,
  chainNameToId,
  chainToName,
  chainToSlug,
  ecosystemOf,
} from "@/utils/chain-utils";
import { BODY_M, BODY_S } from "@/constants/typography";

const ADD_TIMEOUT_MS = 25_000;

const pageChainId = () => {
  if (typeof window === "undefined") return undefined;
  return chainNameToId(new URLSearchParams(window.location.search).get("chain"));
};

const chainDetails = (chainId: number) => {
  const chain = LIVE_CHAINS.find((candidate) => candidate.id === chainId);
  if (!chain) return "";
  const explorer = chain.blockExplorers?.default.url;
  return [
    `Chain ID ${chain.id}`,
    chain.name,
    chain.nativeCurrency.symbol,
    chain.rpcUrls.default.http[0],
    explorer,
  ]
    .filter(Boolean)
    .join(" · ");
};

type Failed = { chainId: number; status: SwitchResult; detail?: string };

const AccountModal = () => {
  const open = useWalletDialog() === "account";
  const { address, chainId, connector, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const switchTo = useSwitchNetwork();
  const router = useRouter();
  const pathname = usePathname();
  const [copied, setCopied] = useState(false);
  const [copiedDetails, setCopiedDetails] = useState(false);
  const [pendingChain, setPendingChain] = useState<number | null>(null);
  const [addingChain, setAddingChain] = useState(false);
  const [failed, setFailed] = useState<Failed | null>(null);

  if (!open) return null;

  const close = () => {
    setCopied(false);
    setCopiedDetails(false);
    setPendingChain(null);
    setAddingChain(false);
    setFailed(null);
    closeWalletDialog();
  };

  const copy = async (text: string, done: (value: boolean) => void) => {
    await navigator.clipboard?.writeText(text);
    done(true);
    setTimeout(() => done(false), 1500);
  };

  // The page's `?chain=` is what the app reads, so follow whichever network the
  // wallet ends up on. A refused switch leaves both the wallet and the URL alone.
  const select = async (target: number) => {
    if (pendingChain !== null || addingChain) return;
    setFailed(null);

    if (target !== chainId) {
      setPendingChain(target);
      const outcome = await switchTo(target);
      setPendingChain(null);
      if (outcome.status !== "switched") {
        setFailed({ chainId: target, status: outcome.status, detail: outcome.detail });
        return;
      }
    }

    const params = new URLSearchParams(window.location.search);
    params.set("chain", chainToSlug(target));
    router.replace(`${pathname}?${params}`, { scroll: false });
    close();
  };

  // Wallets that never had the network (Robinhood on MetaMask) can only switch to
  // it after adding it — and after that they may still need a fresh connection
  // before the chain is part of the session, hence the reconnect next to it.
  const addNetwork = async (target: number) => {
    const chain = LIVE_CHAINS.find((candidate) => candidate.id === target);
    if (!chain || addingChain) return;

    setAddingChain(true);
    const added = await addChain(connector, chain, ADD_TIMEOUT_MS);
    setAddingChain(false);

    if (!added.ok) {
      setFailed((previous) =>
        previous ? { ...previous, detail: added.error ?? previous.detail } : previous,
      );
      return;
    }
    await select(target);
  };

  const reconnect = () => {
    close();
    disconnect();
    openWalletDialog("connect");
  };

  // MetaMask Connect goes through MetaMask's own relay. When it stops answering
  // (parked splash, "Request Failed"), WalletConnect is the way in — the same
  // wallet, a transport that has proven to work on this phone.
  const useWalletConnect = () => {
    preferWalletConnectTransport();
    reconnect();
  };

  // Rare, but possible: the wallet dropped the connection mid-flow (a revoked
  // permission, or the session re-create for a new network failed). Say so and
  // offer the only useful action instead of vanishing.
  if (!isConnected || !address) {
    return (
      <DialogShell
        title="Wallet"
        subtitle={<span className={`${BODY_S} text-secondary`}>Not connected</span>}
        onClose={close}
      >
        <p className={`${BODY_S} text-secondary`}>
          The wallet disconnected before the network change finished.
        </p>
        <Button variant="primary" size="m" className="self-start" onClick={reconnect}>
          Connect wallet
        </Button>
      </DialogShell>
    );
  }

  const activePage = pageChainId();
  const failedName = failed ? chainToName(failed.chainId) : "";
  const failedIsTestnet = failed ? Boolean(ecosystemOf(failed.chainId)?.testnet) : false;
  const advice = !failed
    ? ""
    : failed.status === "timeout"
      ? "It never answered — open it from your recent apps, the request should be waiting there, then try again."
      : failedIsTestnet
        ? `If it hides test networks, enable ${failedName} in the wallet settings (MetaMask: Settings → Advanced → Show test networks, Rabby: Settings → Enable testnets), then try again.`
        : `Your wallet probably doesn't have ${failedName} yet — add it below, or add it by hand with these details and reconnect.`;

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
        onClick={() => copy(address, setCopied)}
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
              disabled={pendingChain !== null || addingChain}
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
          <div className="flex flex-col gap-2 rounded-m border border-subtle bg-raised p-3">
            <p className={`${BODY_S} text-danger`}>
              Didn&apos;t switch to {failedName}. {advice}
            </p>
            {failed.detail ? (
              <p className={`${BODY_S} break-words text-secondary`}>Wallet said: {failed.detail}</p>
            ) : null}
            <div className="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="s"
                disabled={addingChain || pendingChain !== null}
                onClick={() => void addNetwork(failed.chainId)}
              >
                {addingChain ? "Adding…" : `Add ${failedName} to wallet`}
              </Button>
              <Button variant="outline" size="s" onClick={reconnect}>
                Reconnect wallet
              </Button>
              {connector?.type === "metaMask" ? (
                <Button variant="outline" size="s" onClick={useWalletConnect}>
                  Reconnect with WalletConnect
                </Button>
              ) : null}
              <Button
                variant="ghost"
                size="s"
                onClick={() => copy(chainDetails(failed.chainId), setCopiedDetails)}
              >
                {copiedDetails ? "Copied" : "Copy details"}
              </Button>
            </div>
            <p className={`${BODY_S} break-words text-secondary`}>
              {chainDetails(failed.chainId)}
            </p>
          </div>
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
