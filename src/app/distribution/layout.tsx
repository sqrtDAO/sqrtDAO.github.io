import type { Metadata } from "next";

// Distribution pages are addressed by ?address=&chain= — unbounded URLs whose
// content is loaded client-side from the chain, so they must not be indexed.
export const metadata: Metadata = {
  title: "Distribution",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
