import type { Metadata } from "next";
import Sidebar from "@/features/ui/components/Sidebar";
import Header from "@/features/ui/components/Header";
import { Suspense } from "react";
import TabLoading from "@/features/ui/components/TabLoading";
import AddTransactionDialog from "@/features/transactionsAndSubscriptions/components/AddTransactionDialog";

export const metadata: Metadata = {
  title: "Spendwise",
  description: "Money tracker and analytics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <main className="flex h-dvh w-full flex-col overflow-hidden">
      <AddTransactionDialog/>
      <Header />
      <div className="flex flex-row w-full h-full min-h-0">
        <Sidebar />
        <div className="bg-neutral-200/70 border border-neutral-300/70 flex-1 min-h-0 min-w-0 rounded-xl sm:rounded-l-xl  p-2 sm:p-3 overflow-y-auto">
          <Suspense fallback={<TabLoading/>}>{children}</Suspense>
        </div>
      </div>
    </main >
  );
}
