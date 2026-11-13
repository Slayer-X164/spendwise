import { Suspense } from "react";
import TabChangeButtons from "@/components/transactions_page/TabChangeButtons";
import TransactionsTab from "@/components/transactions_page/TransactionsTab";
import SubscriptionsTab from "@/components/transactions_page/SubscriptionsTab";
import TabLoading from "@/components/ui/TabLoading";

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
