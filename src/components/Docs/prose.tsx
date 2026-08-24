import Link from "next/link";

type ElementProps = { children: React.ReactNode };

export const H2 = ({ id, children }: { id: string } & ElementProps) => (
  // padding, not margin: globals.css resets h1-h3 margins in unlayered CSS,
  // which beats any mt-* utility from @layer utilities
  <h2 id={id} className="pt-10 font-display text-h3 font-semibold text-primary">
    {children}
  </h2>
);

export const P = ({ children }: ElementProps) => (
  <p className="mt-5 text-body-l leading-relaxed text-secondary">{children}</p>
);

export const LI = ({ children }: ElementProps) => (
  <li className="text-body-l leading-relaxed">{children}</li>
);

export const Code = ({ children }: ElementProps) => (
  <code className="rounded-xs border border-subtle bg-raised px-1.5 py-0.5 font-mono text-body-s text-accent">
    {children}
  </code>
);

export const Callout = ({ children }: ElementProps) => (
  <div className="mt-8 rounded-l border border-subtle bg-raised p-5 leading-relaxed text-secondary">
    {children}
  </div>
);

export const DocLink = ({
  href,
  external,
  children,
}: { href: string; external?: boolean } & ElementProps) => {
  const className = "text-accent underline-offset-4 hover:underline";
  if (external)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
};
