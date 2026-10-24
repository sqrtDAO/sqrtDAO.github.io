import type { Metadata } from "next";

// App flow, not content: the page renders client-side (and only after an RPC
// check), so there is nothing to rank. Keep link equity flowing, drop the URL.
export const metadata: Metadata = {
  title: "Explore distributions",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
