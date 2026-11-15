const MECHANISMS = [
  {
    name: "Staking",
    flow: ["Lock tokens", "Earn rewards"],
    note: "Rewards come from a pool you fund, so the payout is planned and visible.",
  },
  {
    name: "Buy-back & burn",
    flow: ["Use revenue", "Buy token", "Burn it"],
    note: "Supply shrinks. Every holder owns a slightly larger slice without lifting a finger.",
  },
  {
    name: "Revenue share",
    flow: ["Project earns", "Pay holders"],
    note: "A direct cut of real income, split in proportion to what each person holds.",
  },
];

const chip = "rounded-xs border border-subtle bg-canvas px-2 py-1 text-caption text-secondary";

export default function PayoutPanel() {
  return (
    <div className="mt-5 grid gap-3 sm:grid-cols-3">
      {MECHANISMS.map((mechanism) => (
        <div key={mechanism.name} className="rounded-l border border-subtle bg-raised p-5">
          <p className="font-display text-body font-semibold text-primary">{mechanism.name}</p>
          <div className="mt-3 flex flex-wrap items-center gap-1.5">
            {mechanism.flow.map((step, i) => (
              <span key={step} className="flex items-center gap-1.5">
                <span className={chip}>{step}</span>
                {i < mechanism.flow.length - 1 && (
                  <span aria-hidden className="text-caption text-tertiary">
                    →
                  </span>
                )}
              </span>
            ))}
          </div>
          <p className="mt-3 text-body-s leading-relaxed text-secondary">{mechanism.note}</p>
        </div>
      ))}
    </div>
  );
}
