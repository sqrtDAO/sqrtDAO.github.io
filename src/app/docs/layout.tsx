import type { Metadata } from "next";
import DocsShell from "@/components/Docs/DocsShell";

// Docs titles get their "| sqrtDAO docs" suffix in docMetadata() (as an
// absolute title) rather than from a template: Next does not apply a leaf
// layout's template to the page in the same segment, which silently dropped
// the suffix on /docs/. The default below covers any future page without
// its own metadata.
export const metadata: Metadata = {
  title: {
    default: "Documentation | sqrtDAO docs",
    template: "%s | sqrtDAO docs",
  },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return <DocsShell>{children}</DocsShell>;
}
