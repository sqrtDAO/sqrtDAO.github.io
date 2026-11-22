"use client";

import { useState, type ReactNode } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useConnect, useConnectors, type Connector } from "wagmi";
import {
  IconBrowser,
  IconExternalLink,
  IconLoader2,
  IconQrcode,
  IconWallet,
} from "@tabler/icons-react";
import DialogShell from "@/components/DialogShell/DialogShell";
import { Button } from "@/components/Button/Button";
import { DEEPLINK_WALLETS, findWallet, type WalletDefinition } from "@/constants/wallet";
import { useIsMobileBrowser } from "@/hooks/useIsMobileBrowser";
import { hasInjectedMetaMask, hasInjectedProvider } from "@/lib/wallet/detect";
import { closeWalletDialog, useWalletDialog } from "@/hooks/useWalletDialog";
import {
  metaMaskUniversalLink,
  openDeepLink,
  walletDeepLink,
} from "@/lib/wallet/deeplink";
import { onDisplayUri } from "@/lib/wallet/display-uri";
import { metaMaskTransport, preferWalletConnectTransport } from "@/lib/wallet/prefs";

type Pending = {
  kind: "metaMask" | "walletConnect" | "injected";
  label: string;
  wallet?: WalletDefinition;
};

type Row = {
  key: string;
  label: string;
  hint: string;
  icon: ReactNode;
  onClick: () => void;
};

const CONNECT_FAILED = "Approval didn't come through. Try again from your wallet.";

const IconForWallet = ({ id }: { id: string }) =>
  id === "walletconnect" ? <IconQrcode size={20} /> : <IconWallet size={20} />;

const RowButton = ({ row }: { row: Row }) => (
  <button
    type="button"
    onClick={row.onClick}
    className="flex w-full items-center gap-3 rounded-m border border-subtle bg-raised px-3 py-2.5 text-left transition-colors hover:border-strong"
  >
    <span className="flex size-8 shrink-0 items-center justify-center rounded-s bg-surface text-primary">
      {row.icon}
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="text-body-m text-primary">{row.label}</span>
      <span className="text-body-s text-secondary">{row.hint}</span>
    </span>
  </button>
);

const Waiting = ({ label }: { label: string }) => (
  <span className="inline-flex items-center gap-2 text-body-s text-secondary">
    <IconLoader2 size={16} className="animate-spin" />
    Waiting for {label}…
  </span>
);

const Qr = ({ uri }: { uri: string }) => (
  <div className="flex flex-col items-center gap-3">
    <div className="rounded-m bg-white p-3">
      <QRCodeSVG value={uri} size={196} level="M" />
    </div>
    <p className="text-center text-body-s text-secondary">
      Scan with MetaMask, Rabby or any WalletConnect wallet.
    </p>
  </div>
);

const OpenLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    className="flex items-center justify-between gap-3 rounded-m border border-subtle bg-raised px-4 py-3 text-body-m text-primary hover:border-strong"
  >
    {label}
    <IconExternalLink size={16} className="text-secondary" />
  </a>
);

const walletHref = (wallet: WalletDefinition, uri: string) =>
  wallet.link ? walletDeepLink(wallet.link, uri) : undefined;

/** Every wallet we can hand the pairing to directly from the phone browser. */
const WalletChoices = ({ uri }: { uri: string }) => (
  <div className="flex flex-col gap-2">
    {DEEPLINK_WALLETS.map((wallet) => {
      const href = walletHref(wallet, uri);
      return href ? <OpenLink key={wallet.id} href={href} label={wallet.label} /> : null;
    })}
  </div>
);

const WalletModal = () => {
  const open = useWalletDialog() === "connect";
  const { connectAsync } = useConnect();
  const connectors = useConnectors();
  const mobile = useIsMobileBrowser();
  const [pending, setPending] = useState<Pending | null>(null);
  const [uri, setUri] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reset = () => {
    setPending(null);
    setUri(null);
    setError(null);
  };

  const close = () => {
    closeWalletDialog();
    reset();
  };

  const metaMaskConnector = connectors.find((connector) => connector.type === "metaMask");
  const walletConnectConnector = connectors.find((connector) => connector.type === "walletConnect");
  // EIP-6963 wallets announce themselves by name; `id: "injected"` is wagmi's
  // generic fallback (a dapp browser's `window.ethereum`) and would otherwise
  // show up as a second, anonymous row next to the wallet it actually is.
  const injectedConnectors = connectors.filter(
    (connector) => connector.type === "injected" && connector.id !== "injected",
  );
  const fallbackInjected = connectors.find(
    (connector) => connector.type === "injected" && connector.id === "injected",
  );

  const injectedFor = (wallet?: WalletDefinition) =>
    wallet?.rdns
      ? injectedConnectors.find((connector) =>
          wallet.rdns?.some((rdns) => connector.rdns === rdns || connector.id === rdns),
        )
      : undefined;

  const injectedRabby = injectedFor(findWallet("rabby"));

  const backToList = () => {
    setPending(null);
    setUri(null);
    setError(CONNECT_FAILED);
  };

  const connectInjected = async (connector: Connector, label: string) => {
    setError(null);
    setUri(null);
    setPending({ kind: "injected", label });
    try {
      await connectAsync({ connector });
      close();
    } catch {
      backToList();
    }
  };

  const connectMetaMask = async () => {
    if (!metaMaskConnector) return connectWalletConnect(findWallet("metamask"));
    setError(null);
    setUri(null);
    setPending({ kind: "metaMask", label: "MetaMask" });
    // MetaMask Connect announces the deeplink it wants to open; keep the App
    // Link version so the user can reopen the app without losing the page.
    const off = onDisplayUri(metaMaskConnector, (deeplink) =>
      setUri(metaMaskUniversalLink(deeplink)),
    );
    try {
      await connectAsync({ connector: metaMaskConnector });
      close();
    } catch {
      // Stay on the waiting screen: that is where the WalletConnect fallback is.
      setError(CONNECT_FAILED);
    } finally {
      off();
    }
  };

  const connectWalletConnect = async (wallet?: WalletDefinition) => {
    if (!walletConnectConnector) return;
    setError(null);
    setUri(null);
    setPending({ kind: "walletConnect", label: wallet?.label ?? "your wallet", wallet });
    // The pairing URI arrives a moment after the session proposal is created.
    // On mobile hand it straight to the requested wallet; on desktop the modal
    // renders it as a QR.
    const off = onDisplayUri(walletConnectConnector, (pairingUri) => {
      setUri(pairingUri);
      if (!mobile || !wallet?.link) return;
      const link = walletDeepLink(wallet.link, pairingUri);
      if (link) openDeepLink(link);
    });
    try {
      await connectAsync({ connector: walletConnectConnector });
      close();
    } catch {
      // A rejected proposal can't be reused, so ask for a fresh pairing.
      backToList();
    } finally {
      off();
    }
  };

  // Rows adapt to where the app runs: an installed extension is used directly,
  // the mobile browser hands the pairing to the wallet app, and a desktop
  // without the extension scans a QR.
  const rows: Row[] = [
    {
      key: "metamask",
      label: "MetaMask",
      hint: "Extension or mobile app",
      icon: <IconWallet size={20} />,
      onClick: () => {
        // Mobile goes through MetaMask Connect (its own relay, no WalletConnect
        // hop). A desktop extension is plain injected — no SDK chunk, no chance
        // of MetaMask's own install modal opening behind ours. Everything else
        // is a WalletConnect QR the phone can scan.
        if (mobile && metaMaskTransport() === "connect") void connectMetaMask();
        else if (!mobile && hasInjectedMetaMask() && fallbackInjected)
          void connectInjected(fallbackInjected, "MetaMask");
        else void connectWalletConnect(findWallet("metamask"));
      },
    },
    ...injectedConnectors
      .filter((connector) => connector !== injectedRabby)
      .map((connector) => ({
        key: connector.uid,
        label: connector.name,
        hint: "Browser wallet",
        icon: <IconBrowser size={20} />,
        onClick: () => void connectInjected(connector, connector.name),
      })),
    ...(fallbackInjected && injectedConnectors.length === 0 && hasInjectedProvider()
      ? [
          {
            key: "browser-wallet",
            label: "Browser wallet",
            hint: "The wallet this browser provides",
            icon: <IconBrowser size={20} />,
            onClick: () => void connectInjected(fallbackInjected, "Browser wallet"),
          },
        ]
      : []),
    {
      key: "rabby",
      label: "Rabby",
      hint: injectedRabby ? "Browser extension" : "Extension or mobile app",
      icon: <IconWallet size={20} />,
      onClick: () =>
        injectedRabby
          ? void connectInjected(injectedRabby, "Rabby")
          : void connectWalletConnect(findWallet("rabby")),
    },
    {
      key: "walletconnect",
      label: mobile ? "Other wallets" : "WalletConnect",
      hint: mobile ? "Trust, Rainbow, Zerion and more" : "Any other wallet, scan a QR",
      icon: <IconForWallet id="walletconnect" />,
      onClick: () => void connectWalletConnect(),
    },
  ];

  if (!open) return null;

  if (pending) {
    const waitingForUri = pending.kind !== "injected" && !uri;

    return (
      <DialogShell title={`Connect ${pending.label}`} onClose={close}>
        <div className="flex flex-col gap-4">
          {error ? <p className="text-body-s text-danger">{error}</p> : null}

          {pending.kind === "walletConnect" && uri ? (
            mobile ? (
              pending.wallet && walletHref(pending.wallet, uri) ? (
                <OpenLink
                  href={walletHref(pending.wallet, uri)!}
                  label={`Open ${pending.wallet.label}`}
                />
              ) : (
                <WalletChoices uri={uri} />
              )
            ) : (
              <Qr uri={uri} />
            )
          ) : null}

          {pending.kind === "metaMask" && uri ? (
            <OpenLink href={uri} label="Open MetaMask" />
          ) : null}

          {pending.kind === "injected" ? null : waitingForUri ? (
            <Waiting label={pending.label} />
          ) : (
            <p className="text-body-s text-secondary">
              Approve the request in your wallet, then come back to this tab.
            </p>
          )}

          {pending.kind === "metaMask" && mobile ? (
            <button
              type="button"
              onClick={() => {
                preferWalletConnectTransport();
                void connectWalletConnect(findWallet("metamask"));
              }}
              className="self-start text-body-s text-secondary underline hover:text-primary"
            >
              MetaMask didn&apos;t open? Connect through WalletConnect instead
            </button>
          ) : null}
        </div>

        <Button variant="secondary" size="m" onClick={close} className="self-start">
          Cancel
        </Button>
      </DialogShell>
    );
  }

  return (
    <DialogShell
      title="Connect wallet"
      subtitle={
        <p className="text-body-s text-secondary">
          {mobile
            ? "Pick your wallet. It opens in its app, then you come back here."
            : "Use a browser extension, or scan a QR with your phone."}
        </p>
      }
      onClose={close}
    >
      {error ? <p className="text-body-s text-danger">{error}</p> : null}
      <div className="flex flex-col gap-2">
        {rows.map((row) => (
          <RowButton key={row.key} row={row} />
        ))}
      </div>
    </DialogShell>
  );
};

export default WalletModal;
