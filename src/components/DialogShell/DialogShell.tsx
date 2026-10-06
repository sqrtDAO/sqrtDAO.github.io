"use client";

import { useEffect, useId } from "react";
import { IconX } from "@tabler/icons-react";
import { IconButton } from "@/components/IconButton/IconButton";

type DialogShellProps = {
  title: string;
  /** Header content under the title, 8px below it. */
  subtitle?: React.ReactNode;
  onClose: () => void;
  children?: React.ReactNode;
};

// Shared 450-wide DDP dialog frame: Figma 12047:111926 / 12053:112067 / 12057:114348.
const DialogShell = ({
  title,
  subtitle,
  onClose,
  children,
}: DialogShellProps) => {
  const titleId = useId();
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/90 p-2"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <div
        className="flex max-h-full w-full max-w-112.5 flex-col gap-6 overflow-y-auto rounded-(--radius-l) bg-surface p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h2 id={titleId} className="font-display text-h3 text-primary">
              {title}
            </h2>
            <IconButton
              variant="ghost"
              size="m"
              aria-label="Close"
              icon={<IconX size={24} />}
              onClick={onClose}
            />
          </div>
          {subtitle}
        </div>
        {children}
      </div>
    </div>
  );
};

export default DialogShell;
