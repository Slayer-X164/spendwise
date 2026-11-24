import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/features/ui/components/Header";
import TabLoading from "@/features/ui/components/TabLoading";

export const metadata: Metadata = {
  title: "Spendwise",
  description: "Money tracker and analytics",
};

export default function ProductLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh min-w-[1200px] text-neutral-900 print:min-w-0">
      <div className="mx-auto max-w-[2280px] border border-white/85 bg-neutral-600/8 p-4 shadow-2xl lg:p-4  print:border-0 print:bg-neutral-50 print:p-0 print:shadow-none">
        <Header />
        <Suspense fallback={<TabLoading />}>{children}</Suspense>
      </div>
    </div>
  );
}
