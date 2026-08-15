export type DistributionStatus = "live" | "upcoming" | "ended";

export type StatusProps = {
  status: DistributionStatus;
  className?: string;
};

const STATUS_LABEL: Record<DistributionStatus, string> = {
  live: "Live",
  upcoming: "Upcoming",
  ended: "Finished",
};

const STATUS_CLASSES: Record<DistributionStatus, string> = {
  live: "bg-status-live text-on-amber",
  upcoming: "bg-status-upcoming text-primary",
  ended: "bg-status-ended text-tertiary",
};

export default function Status({ status, className }: StatusProps) {
  return (
    <span
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-pill px-1.5 text-body-s leading-5 ${STATUS_CLASSES[status]}${className ? ` ${className}` : ""}`}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
