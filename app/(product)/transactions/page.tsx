import TabChangeButtons from "@/components/transactions_page/TabChangeButtons";

export default async function transactions({
  searchParams,
}: {
  searchParams: Promise<{ tab: "transactions" | "subscriptions" }>;
}) {

  const { tab } = await searchParams;
  return (
    <main className="flex flex-col w-full h-full items-start gap-4 ">
      <TabChangeButtons/>
      {tab == "transactions" ? (
        <div>this is Transactions tab</div>
      ) : (
        <div>this is Subscriptions tab</div>
      )}
    </main>
  );
}
