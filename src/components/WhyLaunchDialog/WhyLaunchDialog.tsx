"use client";

import { IconX } from "@tabler/icons-react";
import { IconButton } from "@/components/IconButton/IconButton";

type WhyLaunchDialogProps = {
  onClose: () => void;
};

const REASONS = [
  {
    lead: "It ",
    bold: "funds your work",
    rest: " over time. Money comes in every epoch, for the whole launch, not all at once on day one. So your funding lasts as long as you keep building.",
  },
  {
    lead: "It ",
    bold: "gets a fair price",
    rest: " and a real market. The price is set by the people who join, step by step, not by a bot in the first second. And the money backing your token gets locked in, so its market only grows.",
  },
  {
    lead: "It gives you a ",
    bold: "real community",
    rest: ". The people who join own your token. They want you to succeed, and they stick around to watch you build.",
  },
];

// Figma 12794:23982 (desktop) / 14467:103450 (mobile)
const WhyLaunchDialog = ({ onClose }: WhyLaunchDialogProps) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/90 p-2"
    onClick={onClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="why-launch-title"
  >
    <div
      className="flex w-full max-w-112.5 flex-col gap-2 overflow-hidden rounded-(--radius-l) bg-surface p-6"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between">
        <h2 id="why-launch-title" className="font-display text-h3 text-primary">
          Why launch a token?
        </h2>
        <IconButton variant="ghost" size="m" aria-label="Close" icon={<IconX size={24} />} onClick={onClose} />
      </div>
      <div className="flex flex-col gap-5.5 text-body leading-5.5 tracking-[0.01em] text-secondary">
        <p className="text-primary">
          A token can do three real jobs for your project, and you get all three from one launch here.
        </p>
        <ol className="flex list-decimal flex-col gap-5.5 ps-6">
          {REASONS.map(({ lead, bold, rest }) => (
            <li key={bold}>
              {lead}
              <strong className="font-bold text-primary">{bold}</strong>
              {rest}
            </li>
          ))}
        </ol>
      </div>
    </div>
  </div>
);

export default WhyLaunchDialog;
