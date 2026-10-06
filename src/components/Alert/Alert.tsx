import type { ReactNode } from "react";
import { IconAlertSquareRounded, IconInfoCircle } from "@tabler/icons-react";
import { BODY_M } from "@/constants/typography";

const TONES = {
  info: {
    box: "bg-info-bg",
    accent: "border-info text-info",
    Icon: IconInfoCircle,
  },
  live: {
    box: "bg-live-bg",
    accent: "border-live text-live",
    Icon: IconAlertSquareRounded,
  },
};

export type AlertTone = keyof typeof TONES;

type AlertProps = {
  tone?: AlertTone;
  title: string;
  description?: ReactNode;
  /** Right-aligned button under the text (e.g. "Add to calendar"). */
  action?: ReactNode;
  className?: string;
};

// Figma 8305:54432 — tinted box; the 2.5px tone rule spans only the text row, the action sits below it.
const Alert = ({
  tone = "info",
  title,
  description,
  action,
  className = "",
}: AlertProps) => {
  const { box, accent, Icon } = TONES[tone];
  return (
    <div
      role="note"
      className={`flex w-full flex-col items-end gap-2 rounded-m py-3 ${box} ${className}`}
    >
      <div
        className={`flex w-full items-start gap-3 border-l-[2.5px] px-4 ${accent}`}
      >
        <Icon
          size={24}
          strokeWidth={1.75}
          className="shrink-0"
          aria-hidden="true"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <p className={`${BODY_M} font-bold`}>{title}</p>
          {description && (
            <p className="text-body-s leading-4.5 text-secondary">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && <div className="flex px-4">{action}</div>}
    </div>
  );
};

export default Alert;
