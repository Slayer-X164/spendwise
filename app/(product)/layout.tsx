import type { Metadata } from "next";
import Sidebar from "@/components/ui/Sidebar";
import Header from "@/components/ui/Header";
import { Suspense } from "react";
import TabLoading from "@/components/ui/TabLoading";

export const metadata: Metadata = {
  title: "Spendwise",
  description: "Money tracker and analytics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <>
      <Header />
      <div className="flex flex-row">
        <Sidebar />
        <div className="bg-neutral-200/70 flex-1 rounded-xl sm:rounded-l-xl  p-2 sm:p-3">
          <Suspense fallback={<TabLoading/>}>{children}</Suspense>
        </div>
      </div>
    </>
  );
}
