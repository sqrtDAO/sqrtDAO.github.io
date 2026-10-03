import { useId } from "react";
import { BODY_S } from "@/constants/typography";

type Stat = { label: string; value: string };

type EpochChartLegendProps = {
  children?: React.ReactNode;
  /** Row above the block chart: total epochs, supply per epoch, duration, participants. */
  stats: Stat[];
  supplyRemaining: string;
  epochsLeft: string;
};

// Low → high volume, a 7-step sample of the chart's 9-stop violet ramp (lib/charts/bucketColor).
const SCALE = [
  "bg-(--color-charts-epochs-800)",
  "bg-(--color-charts-epochs-700)",
  "bg-(--color-charts-epochs-600)",
  "bg-(--color-charts-epochs-500)",
  "bg-(--color-charts-epochs-400)",
  "bg-(--color-charts-epochs-300)",
  "bg-(--color-charts-epochs-200)",
];

const StatItem = ({
  label,
  value,
  valueFirst = false,
}: Stat & { valueFirst?: boolean }) => (
  <p
    className={`flex gap-1 whitespace-nowrap ${BODY_S} ${valueFirst ? "flex-row-reverse justify-end" : ""}`}
  >
    <span className="text-tertiary">{label}</span>
    <span className="text-primary">{value}</span>
  </p>
);

// Same 4×12 block + amber glow as EpochBlockChart's current epoch (filter copied, chart is locked).
const CurrentSwatch = () => {
  const glowId = useId();
  return (
    <svg width={4} height={12} className="overflow-visible" aria-hidden="true">
      <defs>
        <filter id={glowId} x="-700%" y="-250%" width="1500%" height="600%">
          <feDropShadow
            dx="0"
            dy="0"
            stdDeviation="9"
            floodColor="var(--sqrt-action-primary-rest)"
            floodOpacity="0.4"
          />
        </filter>
      </defs>
      <rect
        width={4}
        height={12}
        rx={2}
        fill="var(--sqrt-action-primary-rest)"
        filter={`url(#${glowId})`}
      />
    </svg>
  );
};

const Keys = () => (
  <div className="flex items-center gap-6">
    <p
      className={`flex items-center gap-1 whitespace-nowrap ${BODY_S} text-tertiary`}
    >
      Current epoch
      <CurrentSwatch />
    </p>
    <p
      className={`flex items-center gap-1 whitespace-nowrap ${BODY_S} text-tertiary`}
    >
      Lowest
      {SCALE.map((bg) => (
        <span
          key={bg}
          className={`h-3 w-1 rounded-xs ${bg}`}
          aria-hidden="true"
        />
      ))}
      Highest
    </p>
  </div>
);

// Figma 12469:18197 + 12469:18211 (desktop) / 14411:87786 + 14411:87797 (mobile). Composes around the locked chart.
const Top = ({ stats }: { stats: Stat[] }) => (
  <div className="flex flex-col gap-1 xl:flex-row xl:gap-6">
    {stats.map((s) => (
      <StatItem key={s.label} {...s} />
    ))}
  </div>
);

const Bottom = ({
  supplyRemaining,
  epochsLeft,
}: Omit<EpochChartLegendProps, "stats">) => (
  <>
    <div className="hidden items-center justify-end gap-6 xl:flex">
      <Keys />
      <StatItem label="Supply remaining" value={supplyRemaining} />
      <StatItem label="Epochs left" value={epochsLeft} valueFirst />
    </div>
    <div className="flex flex-col gap-1 xl:hidden">
      <StatItem label="Supply remaining" value={supplyRemaining} />
      <StatItem label="Epochs left" value={epochsLeft} />
      <Keys />
    </div>
  </>
);

const EpochChartLegend = ({
  stats,
  supplyRemaining,
  epochsLeft,
  children,
}: EpochChartLegendProps) => (
  <div className="flex w-full flex-col gap-2 xl:gap-4">
    <Top stats={stats} />
    {children}
    <Bottom supplyRemaining={supplyRemaining} epochsLeft={epochsLeft} />
  </div>
);

export default EpochChartLegend;
