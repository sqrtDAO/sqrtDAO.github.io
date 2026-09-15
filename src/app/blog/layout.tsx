import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import BlogFooter from "@/components/Blog/BlogFooter";

export const metadata: Metadata = {
  title: { default: "sqrtDAO blog", template: "%s | sqrtDAO blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <Header />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <div className="flex-1">{children}</div>
          <BlogFooter />
        </div>
      </main>
    </div>
  );
}
