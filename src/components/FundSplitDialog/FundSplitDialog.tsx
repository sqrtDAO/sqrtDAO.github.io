"use client";

import Alert from "@/components/Alert/Alert";
import DialogShell from "@/components/DialogShell/DialogShell";
import FundSplitBar, {
  FUND_SPLIT_KEYS,
  FundSplitKey,
  type FundSplit,
} from "@/components/FundSplitBar/FundSplitBar";
import { BODY_S } from "@/constants/typography";

const DESCRIPTIONS: Record<keyof FundSplit, string> = {
  priceAnchorPct:
    "A slice of each epoch's funds is used to buy the token and burn it. That steady buying supports the price from below, and burning shrinks supply over time, so the market the founder is building only gets stronger as the distribution runs.",
  founderSharePct:
    "The cut the founder takes to fund their work, paid a little each epoch, not in one upfront lump. A low share signals they're here for the long build; a high one, that they're taking more off the top. It's shown here so you can judge it before you join.",
  protocolFeePct:
    "The flat fee sqrtDAO takes to run the distribution. Fixed at 5%, the same for every launch, no hidden cuts, no surprises.",
};

// Figma 12047:111926
const FundSplitDialog = ({
  split,
  onClose,
}: {
  split: FundSplit;
  onClose: () => void;
}) => (
  <DialogShell title="Epoch fund split" onClose={onClose}>
    <FundSplitBar split={split} />
    {FUND_SPLIT_KEYS.map(({ key, label, text }) => (
      <div key={key} className="flex flex-col gap-2">
        <FundSplitKey pct={split[key]} label={label} text={text} gap="gap-2" />
        <p className={`${BODY_S} text-secondary`}>{DESCRIPTIONS[key]}</p>
      </div>
    ))}
    <Alert
      tone="info"
      title="Most of each epoch's funds go back into supporting the token, a small share funds the team, and a fixed fee runs the platform."
    />
  </DialogShell>
);

export default FundSplitDialog;
