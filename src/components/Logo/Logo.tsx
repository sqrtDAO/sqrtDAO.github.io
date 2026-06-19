/* Placeholder wordmark — replace with the real sqrtDAO logo asset (svg/png in /public). */
export default function Logo({ dark = false }: { dark?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        fontFamily: "var(--font-family-display), system-ui, sans-serif",
        fontWeight: 700,
        fontSize: 22,
        letterSpacing: "0.01em",
        color: dark ? "var(--color-graphite-900)" : "var(--sqrt-text-primary)",
        lineHeight: 1,
      }}
    >
      <span style={{ color: "var(--sqrt-text-accent)", fontSize: 26 }}>√</span>
      sqrtDAO
    </span>
  );
}
