import { BODY_S } from "@/constants/typography";

export type FundSplit = {
  priceAnchorPct: number;
  founderSharePct: number;
  protocolFeePct: number;
};

export const FUND_SPLIT_KEYS = [
  {
    key: "priceAnchorPct",
    label: "Price anchor",
    text: "text-(--color-support-teal-300)",
  },
  {
    key: "founderSharePct",
    label: "Founder share",
    text: "text-(--color-support-violet-300)",
  },
  { key: "protocolFeePct", label: "Protocol fee", text: "text-accent" },
] as const;

export const FundSplitKey = ({
  pct,
  label,
  text,
  gap = "gap-1",
}: {
  pct: number;
  label: string;
  text: string;
  gap?: string;
}) => (
  <p className={`flex items-center whitespace-nowrap ${gap} ${BODY_S} ${text}`}>
    <span className="font-bold">{pct}%</span>
    {label}
  </p>
);

// Figma 12057:112245 "chart". Fee slice is a fixed 8px marker, as drawn; founder slice is proportional.
const FundSplitBar = ({ split }: { split: FundSplit }) => (
  <div className="flex w-full flex-col gap-1">
    <div className="flex h-5 w-full items-center gap-1 overflow-hidden rounded-(--radius-s) border border-strong p-1">
      <span className="h-full flex-1 bg-(--color-support-teal-900)" />
      {split.founderSharePct > 0 && (
        // ponytail: founder fill is hidden in Figma (0%), violet-900 mirrors teal-900 — confirm the colour.
        <span
          className="h-full bg-(--color-support-violet-900)"
          style={{ width: `${split.founderSharePct}%` }}
        />
      )}
      <span className="h-full w-2 bg-(--color-alpha-amber-45)" />
    </div>
    <div className="flex flex-wrap items-center gap-x-4">
      {FUND_SPLIT_KEYS.map(({ key, label, text }) => (
        <FundSplitKey key={key} pct={split[key]} label={label} text={text} />
      ))}
    </div>
  </div>
);

export default FundSplitBar;
