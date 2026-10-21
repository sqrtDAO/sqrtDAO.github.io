import type { Metadata } from "next";
import MainnetHeader from "@/components/MainnetHeader/MainnetHeader";
import MainnetFooter from "@/components/MainnetFooter/MainnetFooter";

export const metadata: Metadata = {
  title: { default: "sqrtDAO blog", template: "%s | sqrtDAO blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-dvh flex-col">
      <MainnetHeader showWallet={false} />
      <main className="flex-1 overflow-y-auto">
        <div className="flex min-h-full flex-col">
          <div className="flex-1">{children}</div>
          <MainnetFooter />
        </div>
      </main>
    </div>
  );
}
