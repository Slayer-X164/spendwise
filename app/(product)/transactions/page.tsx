import { Suspense } from "react";
import TabChangeButtons from "@/features/transactionsAndSubscriptions/components/TabChangeButtons";

import SubscriptionsTab from "@/features/transactionsAndSubscriptions/components/SubscriptionsTab";
import TabLoading from "@/features/ui/components/TabLoading";
import TransactionsTab from "@/features/transactionsAndSubscriptions/components/TransactionsTab";

type TransactionsPageProps = {
  searchParams: Promise<{ tab: "subscriptions" }>;
};

export default function TransactionsPage({
  searchParams,
}: TransactionsPageProps) {
  return (
    <main className="flex flex-col w-full h-full items-start gap-2 sm:gap-3">
      <TabChangeButtons />
      <Suspense fallback={<TabLoading/>}>
        <TabContent searchParams={searchParams} />
      </Suspense>
    </main>
  );
}

async function TabContent({ searchParams }: TransactionsPageProps) {
  const { tab } = await searchParams;

  return tab === "subscriptions" ? <SubscriptionsTab /> : <TransactionsTab/>;
}
