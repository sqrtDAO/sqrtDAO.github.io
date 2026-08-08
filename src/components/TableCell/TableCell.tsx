import Status, { type DistributionStatus } from "@/components/Status/Status";

type BaseProps = { className?: string };

export type TableCellProps =
  | (BaseProps & { variant: "index"; value: number })
  | (BaseProps & { variant: "name"; name: string; ticker: string })
  | (BaseProps & { variant: "amount"; value: string; unit: string })
  | (BaseProps & { variant: "date"; date: string })
  | (BaseProps & {
      variant: "countdown";
      days: number;
      hours: number;
      minutes: number;
      seconds: number;
    })
  | (BaseProps & { variant: "status"; status: DistributionStatus });

const TimeSegment = ({ value, unit }: { value: number; unit: string }) => (
  <div className="flex items-baseline gap-1">
    <span className="text-body leading-[22px] text-primary">{value}</span>
    <span className="text-body-s leading-5 text-secondary">{unit}</span>
  </div>
);

const TimeDivider = () => <span aria-hidden="true" className="h-6 w-px bg-muted" />;

export default function TableCell(props: TableCellProps) {
  const { variant, className } = props;
  const base = `flex w-full items-center ${className ?? ""}`;

  switch (variant) {
    case "index":
      return (
        <div className={`${base} justify-center px-2 py-3`}>
          <span className="text-body-l leading-6 text-tertiary">{props.value}</span>
        </div>
      );
    case "name":
      return (
        <div className={`${base} gap-1 px-4 py-3`}>
          <span className="text-body-l leading-6 text-primary">{props.name}</span>
          <span className="text-body-s leading-5 text-secondary">{props.ticker}</span>
        </div>
      );
    case "amount":
      return (
        <div className={`${base} gap-1 px-4 py-3`}>
          <span className="text-body leading-[22px] text-primary">{props.value}</span>
          <span className="text-body leading-[22px] text-tertiary">{props.unit}</span>
        </div>
      );
    case "date":
      return (
        <div className={`${base} px-4 py-3`}>
          <span className="text-body leading-[22px] text-primary">{props.date}</span>
        </div>
      );
    case "countdown":
      return (
        <div className={`${base} gap-2 px-4 py-3`}>
          <TimeSegment unit="D" value={props.days} />
          <TimeDivider />
          <TimeSegment unit="H" value={props.hours} />
          <TimeDivider />
          <TimeSegment unit="M" value={props.minutes} />
          <TimeDivider />
          <TimeSegment unit="S" value={props.seconds} />
        </div>
      );
    case "status":
      return (
        <div className={`${base} px-4 py-2`}>
          <Status status={props.status} />
        </div>
      );
  }
}
