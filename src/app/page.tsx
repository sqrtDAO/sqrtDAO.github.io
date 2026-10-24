import type { Metadata } from "next";
import Landing from "@/components/Landing/Landing";
import "./landing.css";

// Global CSS imports must stay inside app/ — hence here, not in Landing.tsx.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Page() {
  return <Landing />;
}
