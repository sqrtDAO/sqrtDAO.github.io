"use client";

import { useSyncExternalStore } from "react";

// The wallet modal is opened from the header and from the wizards (which only
// get a callback), so its open state lives outside React like the toast store.
let isOpen = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((listener) => listener());

export const openWalletModal = () => {
  isOpen = true;
  emit();
};

export const closeWalletModal = () => {
  isOpen = false;
  emit();
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => isOpen;
const getServerSnapshot = () => false;

export const useWalletModalOpen = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
