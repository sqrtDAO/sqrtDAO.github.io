const USES = [
  {
    title: "Ownership",
    text: "Holders own a piece of the project and its future upside.",
  },
  {
    title: "Access",
    text: "The token unlocks your product, an API, or a private community.",
  },
  {
    title: "Governance",
    text: "Holders vote on the decisions you choose to put to them.",
  },
  {
    title: "Rewards",
    text: "Pay early users, contributors, and testers for real work.",
  },
  {
    title: "Payments",
    text: "The token is the unit people spend inside your product.",
  },
  {
    title: "Membership",
    text: "A visible badge that someone backed you early.",
  },
];

export default function TokenUsesPanel() {
  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {USES.map((use, i) => (
        <li key={use.title} className="rounded-l border border-subtle bg-raised p-5">
          <span className="font-display text-caption font-semibold text-accent">
            {String(i + 1).padStart(2, "0")}
          </span>
          <p className="mt-1 font-display text-body font-semibold text-primary">{use.title}</p>
          <p className="mt-1 text-body-s leading-relaxed text-secondary">{use.text}</p>
        </li>
      ))}
    </ul>
  );
}
