"use client";

import { useSyncExternalStore } from "react";

// The connect modal and the account modal are opened from components that only
// get a callback (header, wizards), so their state lives outside React like the
// toast store.
export type WalletDialogView = "connect" | "account";

let view: WalletDialogView | null = null;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const openWalletDialog = (next: WalletDialogView) => {
  view = next;
  emit();
};

export const closeWalletDialog = () => {
  view = null;
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

const getSnapshot = () => view;
const getServerSnapshot = () => null;

export const useWalletDialog = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
