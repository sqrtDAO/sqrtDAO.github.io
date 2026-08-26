"use client";

import type { ReactNode } from "react";
import { IconSquareCheck, IconInfoCircle, IconX } from "@tabler/icons-react";
import { dismissToast, type ToastInstance } from "@/hooks/useToast";

// Figma (node 8549:59829 etc.): only success gets a distinct icon (check-in-square).
// error/info/pending all render the same info-circle glyph — pending has no spinner,
// it's visually identical to info (state/info), only its dismiss behavior differs.
const TOAST_ICON: Record<ToastInstance["type"], ReactNode> = {
  success: <IconSquareCheck size={18} className="text-success" />,
  error: <IconInfoCircle size={18} className="text-danger" />,
  info: <IconInfoCircle size={18} className="text-info" />,
  pending: <IconInfoCircle size={18} className="text-info" />,
};

const TOAST_BORDER_CLASS: Record<ToastInstance["type"], string> = {
  success: "border-l-success",
  error: "border-l-danger",
  info: "border-l-info",
  pending: "border-l-info",
};

export type ToastProps = { toast: ToastInstance };

export default function Toast({ toast }: ToastProps) {
  return (
    <div
      role="status"
      className={`flex w-[360px] max-w-[calc(100vw-32px)] items-start gap-2 rounded-m border-l-[3px] bg-overlay p-3 shadow-[var(--shadow-slab)] ${TOAST_BORDER_CLASS[toast.type]}`}
    >
      <span className="mt-0.5 shrink-0">{TOAST_ICON[toast.type]}</span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <p className="m-0 text-body-s text-primary">{toast.message}</p>
        {toast.action && (
          <button
            type="button"
            onClick={toast.action.onClick}
            className="self-start bg-transparent p-0 text-body-s text-accent underline"
          >
            {toast.action.label}
          </button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss"
        onClick={() => dismissToast(toast.id)}
        className="shrink-0 bg-transparent p-0.5 text-tertiary"
      >
        <IconX size={16} />
      </button>
    </div>
  );
}
