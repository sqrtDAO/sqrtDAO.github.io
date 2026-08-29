"use client";

import Toast from "@/components/Toast/Toast";
import { useToastList } from "@/hooks/useToast";

export default function ToastContainer() {
  const toasts = useToastList();

  if (toasts.length === 0) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 top-[72px] z-50 md:top-[88px]">
      <div className="mx-auto flex max-w-[1320px] justify-end px-4 md:px-6">
        <div className="pointer-events-auto flex flex-col gap-2">
          {toasts.map((toast) => (
            <Toast key={toast.id} toast={toast} />
          ))}
        </div>
      </div>
    </div>
  );
}
