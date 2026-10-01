import Link from "next/link";
import { IconX } from "@tabler/icons-react";
import "@/components/IconButton/IconButton.css";

type WizardShellProps = {
  /** Omit on terminal screens (e.g. distribution status) that have no close button. */
  closeHref?: string;
  /** Router/import use the roomier 64px desktop rhythm; wizards use 32px. */
  spacious?: boolean;
  children: React.ReactNode;
};

// Shared page frame for mainnet flows: 584px column, outline close button on top.
export const WizardShell = ({ closeHref, spacious = false, children }: WizardShellProps) => (
  <main
    className={`mx-auto flex w-full flex-col items-center gap-8 px-4 py-8 xl:max-w-146 xl:px-0 ${spacious ? "xl:gap-12 xl:py-16" : ""}`}
  >
    {closeHref && (
      <div className="flex w-full">
        <Link href={closeHref} aria-label="Close" className="icon-btn icon-btn--outline icon-btn--m">
          <span className="icon-btn__icon" aria-hidden="true">
            <IconX size={24} />
          </span>
        </Link>
      </div>
    )}
    {children}
  </main>
);

export const WizardTitle = ({ title, description }: { title: string; description?: string }) => (
  <div className="flex w-full flex-col gap-2">
    <h1 className="font-display text-h2 font-semibold tracking-[-0.01em] text-primary">{title}</h1>
    {description && <p className="text-body-l leading-6 tracking-[0.02em] text-secondary">{description}</p>}
  </div>
);
