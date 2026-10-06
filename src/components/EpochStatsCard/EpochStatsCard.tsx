import { BODY_S } from "@/constants/typography";

export type EpochStatsCardProps = {
  /** The locked EpochComboChart, sized by this card. */
  children: React.ReactNode;
  /** "Current epoch" while live, "Last epoch" once finished. */
  epochLabel: string;
  epoch: string;
  epochTime: string;
  lastClearPrice: string;
  participation: string;
  participants: string;
  quoteSymbol: string;
};

// Mobile body-m / h4 medium, desktop body-l / display h3.
const LABEL =
  "text-body leading-5.5 tracking-[0.01em] text-secondary xl:text-body-l xl:leading-6 xl:tracking-[0.02em]";
const VALUE =
  "text-h4 leading-none font-medium text-primary xl:font-display xl:text-h3 xl:font-normal";
const UNIT = "text-body-l leading-6 tracking-[0.02em]";

const Data = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1 whitespace-nowrap xl:h-15.75">
    <p className={LABEL}>{label}</p>
    {children}
  </div>
);

// Swatches copy EpochComboChart's colours; the price line is re-tinted amber below.
const KEYS = [
  {
    label: "Current epoch",
    swatch: "h-3 w-0.5 rounded-t-xs bg-(--color-alpha-amber-45)",
  },
  { label: "Participated epoch", swatch: "h-3 w-0.5 rounded-t-xs bg-infra" },
  {
    label: "Participation",
    swatch: "h-3 w-0.5 rounded-t-xs bg-(--color-alpha-steel-12)",
  },
  { label: "Price", swatch: "h-px w-3 bg-(--sqrt-action-primary-rest)" },
];

const Legend = () => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-5 py-1">
    {KEYS.map(({ label, swatch }) => (
      <p
        key={label}
        className={`flex items-center whitespace-nowrap ${BODY_S} text-tertiary`}
      >
        <span
          className="flex size-5 items-center justify-center"
          aria-hidden="true"
        >
          <span className={swatch} />
        </span>
        {label}
      </p>
    ))}
  </div>
);

// Figma 12057:112198 (desktop) / 14639:105703 (mobile). Composes around the locked combo chart.
const EpochStatsCard = (props: EpochStatsCardProps) => (
  <div className="flex flex-col gap-4 rounded-(--radius-l) bg-canvas px-4 py-3 xl:flex-row xl:items-center xl:gap-6 xl:px-6 xl:py-5">
    <div className="flex flex-col gap-2 xl:w-78 xl:shrink-0 xl:gap-6">
      <Data label={props.epochLabel}>
        <p className="flex items-baseline justify-between text-primary">
          <span className={VALUE}>{props.epoch}</span>
          <span className="text-body leading-5.5 tracking-[0.01em] xl:text-body-l xl:leading-6 xl:tracking-[0.02em]">
            {props.epochTime}
          </span>
        </p>
      </Data>
      <Data label="Last clear price">
        <p className="flex items-baseline gap-2 text-primary">
          <span className={VALUE}>{props.lastClearPrice}</span>
          <span className={UNIT}>{props.quoteSymbol}</span>
        </p>
      </Data>
      <Data label="Participation this epoch">
        <p className="flex items-baseline gap-1">
          <span className={VALUE}>{props.participation}</span>
          <span className={`${UNIT} text-primary`}>{props.quoteSymbol}</span>
          <span className={`${UNIT} text-secondary`}>by</span>
          <span className={VALUE}>{props.participants}</span>
          <span className={`${UNIT} text-secondary`}>participants</span>
        </p>
      </Data>
      <p className={`py-2.5 ${BODY_S} text-primary`}>
        The clear price is set when the epoch closes, everyone in the epoch gets
        the same price.
      </p>
    </div>
    <div className="flex min-w-0 flex-1 flex-col self-stretch">
      <div className="relative h-80 xl:h-auto xl:flex-1">
        {/* The locked chart reads its price-line colour from --sqrt-text-primary on its own root;
            override it to amber here, and restore it for the tooltip text inside. */}
        <div className="absolute inset-0 [--sqrt-text-primary:var(--sqrt-action-primary-rest)] [&_.chart-tooltip]:[--sqrt-text-primary:var(--color-slate-200)]">
          {props.children}
        </div>
      </div>
      <Legend />
    </div>
  </div>
);

export default EpochStatsCard;
