import type { Metadata } from "next";
import { Suspense } from "react";
import BottomNavigation from "@/features/ui/components/BottomNavigation";
import Header from "@/features/ui/components/Header";
import TabLoading from "@/features/ui/components/TabLoading";

export const metadata: Metadata = {
  title: "Spendwise",
  description: "Money tracker and analytics",
};

export default function ProductLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-dvh min-w-0 text-neutral-900">
      <div className="mx-auto min-h-dvh max-w-[2280px] bg-neutral-600/8 p-3 sm:p-4 max-xl:pb-[calc(7rem+env(safe-area-inset-bottom))] xl:border xl:border-white/85 xl:shadow-2xl print:border-0 print:bg-neutral-50 print:p-0 print:shadow-none">
        <Header />
        <Suspense fallback={<TabLoading />}>{children}</Suspense>
        <BottomNavigation />
      </div>
    </div>
  );
}
