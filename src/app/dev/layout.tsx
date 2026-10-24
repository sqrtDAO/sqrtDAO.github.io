import type { Metadata } from "next";

// Preview routes are stripped from the deploy artifact (see deploy.yml); this
// keeps them out of the index even if that step ever fails.
export const metadata: Metadata = {
  title: "Dev previews",
  robots: { index: false, follow: false },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
