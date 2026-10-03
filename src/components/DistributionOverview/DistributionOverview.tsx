import { BODY_L, BODY_S } from "@/constants/typography";

export type DdpState = "upcoming" | "live" | "finished";

export type DistributionOverviewProps = {
  state: DdpState;
  /** Pre-formatted amounts. */
  distributedSupply: string;
  totalSupply: string;
  tokenSymbol: string;
  totalParticipation: string;
  quoteSymbol: string;
  /** Start date when upcoming, end date otherwise, e.g. "12:45, 21 June, 2026". */
  periodDate: string;
  countdown: { days: number; hours: number; minutes: number; seconds: number };
};

const H2 = "font-display text-h2 leading-none font-semibold tracking-[-0.01em]";

const Stat = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="flex flex-1 flex-col gap-1">
    <p className={`${BODY_L} text-secondary`}>{label}</p>
    <p className="flex items-baseline gap-1 whitespace-nowrap">{children}</p>
  </div>
);

const Unit = ({ children }: { children: React.ReactNode }) => (
  <span className={`${BODY_L} text-secondary`}>{children}</span>
);

const Countdown = ({
  countdown,
}: Pick<DistributionOverviewProps, "countdown">) => {
  const segments: [string, number][] = [
    ["D", countdown.days],
    ["H", countdown.hours],
    ["M", countdown.minutes],
    ["S", countdown.seconds],
  ];
  return (
    <div className="flex flex-1 items-stretch gap-4 px-5 py-4">
      {segments.flatMap(([unit, value], i) => [
        i > 0 && (
          <span
            key={`d-${unit}`}
            className="flex w-2 justify-center"
            aria-hidden="true"
          >
            <span className="w-px bg-subtle" />
          </span>
        ),
        <p
          key={unit}
          className="flex flex-1 items-baseline justify-center gap-1 whitespace-nowrap"
        >
          <span className={`${H2} text-primary`}>{value}</span>
          <Unit>{unit}</Unit>
        </p>,
      ])}
    </div>
  );
};

// Figma 12057:112159 (desktop) / 14639:105628 (mobile); upcoming 10672:78327, finished 10672:78209.
const DistributionOverview = (props: DistributionOverviewProps) => {
  const upcoming = props.state === "upcoming";
  const date = (
    <p className={`flex gap-1 whitespace-nowrap ${BODY_S}`}>
      <span className="text-tertiary">{upcoming ? "Starts" : "Ends"}</span>
      <span className="text-primary">{props.periodDate}</span>
    </p>
  );
  const title = upcoming ? "Distribution starts in" : "Distribution period";

  return (
    <div className="flex flex-col gap-6 xl:gap-4">
      {!upcoming && (
        <div className="flex flex-col gap-6 xl:flex-row xl:gap-4">
          <Stat label="Distributed supply">
            <span className={`${H2} text-primary`}>
              {props.distributedSupply}
            </span>
            <Unit>/</Unit>
            <span className="font-display text-h3 leading-none text-secondary">
              {props.totalSupply}
            </span>
            <Unit>{props.tokenSymbol}</Unit>
          </Stat>
          <Stat label="Total participation">
            <span className={`${H2} text-primary`}>
              {props.totalParticipation}
            </span>
            <Unit>{props.quoteSymbol}</Unit>
          </Stat>
        </div>
      )}

      <div className="flex flex-col gap-1 xl:flex-row xl:items-center xl:gap-6">
        <div className="flex items-center justify-between xl:w-50 xl:flex-col xl:items-start xl:gap-1">
          <p className={`${BODY_L} whitespace-nowrap text-secondary`}>
            {title}
          </p>
          {date}
        </div>
        {props.state === "finished" ? (
          <p className={`${H2} text-danger`}>This distribution is finished!</p>
        ) : (
          <Countdown countdown={props.countdown} />
        )}
      </div>
    </div>
  );
};

export default DistributionOverview;
