import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { BODY_M } from "@/constants/typography";

export type PriceTrendProps = {
  trend: "up" | "down";
  /** Pre-formatted, e.g. "+25%". */
  value: string;
};

// Figma 15339:138079.
const PriceTrend = ({ trend, value }: PriceTrendProps) => {
  const up = trend === "up";
  const Icon = up ? IconTrendingUp : IconTrendingDown;
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap ${BODY_M} ${
        up
          ? "bg-(--sqrt-state-success-bg) text-success"
          : "bg-danger-bg text-danger"
      }`}
    >
      <Icon size={18} aria-hidden="true" />
      {value}
    </span>
  );
};

export default PriceTrend;
