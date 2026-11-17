"use client";

import { useEffect, type ReactNode } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useConnect } from "wagmi";
import { IconBrowser, IconQrcode, IconWallet, IconX } from "@tabler/icons-react";
import { closeWalletModal, useWalletModalOpen } from "@/hooks/useWalletModal";

type WalletOption = {
  key: string;
  label: string;
  hint: string;
  icon: ReactNode;
  onClick: () => void;
};

const WalletRow = ({ option, disabled }: { option: WalletOption; disabled: boolean }) => (
  <button
    type="button"
    onClick={option.onClick}
    disabled={disabled}
    className="flex w-full items-center gap-3 rounded-m border border-subtle bg-raised px-4 py-3 text-left transition-colors hover:enabled:border-strong disabled:opacity-50"
  >
    <span className="flex size-9 shrink-0 items-center justify-center rounded-s bg-surface text-primary">
      {option.icon}
    </span>
    <span className="flex min-w-0 flex-col">
      <span className="text-body-m text-primary">{option.label}</span>
      <span className="text-body-s text-secondary">{option.hint}</span>
    </span>
  </button>
);

const WalletModal = () => {
  const open = useWalletModalOpen();
  const { connectors, connectAsync, isPending } = useConnect();
  const { isConnected } = useAccount();
  const { open: openAppKit } = useAppKit();

  useEffect(() => {
    if (open && isConnected) closeWalletModal();
  }, [open, isConnected]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeWalletModal();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  if (!open) return null;

  const metamask = connectors.find((connector) => connector.id === "metaMaskSDK");
  const injected = connectors.find((connector) => connector.type === "injected");
  const hasInjectedProvider =
    typeof window !== "undefined" && Boolean((window as { ethereum?: unknown }).ethereum);

  const connectWith = (id: string) => {
    const connector = connectors.find((candidate) => candidate.id === id);
    if (!connector) return;
    // failures surface as a toast through WalletToastWatcher
    void connectAsync({ connector }).catch(() => {});
  };

  const options: WalletOption[] = [
    ...(metamask
      ? [
          {
            key: "metamask",
            label: "MetaMask",
            hint: "Browser extension or mobile app",
            icon: <IconWallet size={20} />,
            onClick: () => connectWith(metamask.id),
          },
        ]
      : []),
    {
      key: "walletconnect",
      label: "WalletConnect",
      hint: "Rabby, Trust Wallet and 290+ more",
      icon: <IconQrcode size={20} />,
      onClick: () => {
        closeWalletModal();
        openAppKit({ view: "Connect" });
      },
    },
    ...(injected && hasInjectedProvider
      ? [
          {
            key: "injected",
            label: "Browser wallet",
            hint: "Any extension in this browser",
            icon: <IconBrowser size={20} />,
            onClick: () => connectWith(injected.id),
          },
        ]
      : []),
  ];

  return (
    <div
      className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={closeWalletModal}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Connect wallet"
        className="w-full max-w-sm rounded-l border border-subtle bg-surface p-4 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-heading-s text-primary">Connect wallet</h2>
          <button
            type="button"
            aria-label="Close"
            onClick={closeWalletModal}
            className="rounded-s p-1 text-secondary hover:text-primary"
          >
            <IconX size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {options.map((option) => (
            <WalletRow key={option.key} option={option} disabled={isPending} />
          ))}
        </div>
        {isPending && (
          <p className="mt-3 text-body-s text-secondary">Waiting for your wallet…</p>
        )}
      </div>
    </div>
  );
};

export default WalletModal;
