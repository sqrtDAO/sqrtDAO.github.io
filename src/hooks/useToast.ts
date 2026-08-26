import { useSyncExternalStore } from "react";
import { TOAST_MESSAGES, type ToastMessageKey, type ToastType } from "@/constants/toastMessages";
import { formatToastCopy } from "@/utils/toastCopy";

export type ToastAction = { label: string; onClick: () => void };

export type ToastInstance = {
  id: string;
  type: ToastType;
  message: string;
  action?: ToastAction;
};

type ShowToastOptions = {
  params?: Record<string, string | number>;
  action?: ToastAction;
  // pass the same id across a pending call and its success/error follow-up
  // to update one toast in place instead of stacking a new one.
  id?: string;
};

const DISMISS_MS = 8000;

let toasts: ToastInstance[] = [];
const listeners = new Set<() => void>();
const timers = new Map<string, ReturnType<typeof setTimeout>>();

const emit = () => listeners.forEach((listener) => listener());

const clearDismissTimer = (id: string) => {
  const timer = timers.get(id);
  if (timer) {
    clearTimeout(timer);
    timers.delete(id);
  }
};

export const dismissToast = (id: string) => {
  clearDismissTimer(id);
  toasts = toasts.filter((toast) => toast.id !== id);
  emit();
};

const scheduleDismiss = (id: string) => {
  clearDismissTimer(id);
  timers.set(
    id,
    setTimeout(() => dismissToast(id), DISMISS_MS)
  );
};

export const showToast = (key: ToastMessageKey, options?: ShowToastOptions) => {
  const def = TOAST_MESSAGES[key];
  const id = options?.id ?? key;
  const instance: ToastInstance = {
    id,
    type: def.type,
    message: formatToastCopy(def.copy, options?.params),
    action: options?.action,
  };

  const existingIndex = toasts.findIndex((toast) => toast.id === id);
  toasts =
    existingIndex >= 0
      ? [...toasts.slice(0, existingIndex), instance, ...toasts.slice(existingIndex + 1)]
      : [...toasts, instance];
  emit();

  // pending toasts stay until explicitly replaced by a success/error call with the same id
  if (def.type === "pending") {
    clearDismissTimer(id);
  } else {
    scheduleDismiss(id);
  }

  return id;
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getSnapshot = () => toasts;
const EMPTY_TOASTS: ToastInstance[] = [];
const getServerSnapshot = () => EMPTY_TOASTS;

export const useToastList = () => useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
