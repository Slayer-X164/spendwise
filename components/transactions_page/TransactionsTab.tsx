import TransactionSummaryCards from "./TransactionsSummaryCards";
import TransactionsTable from "./TransactionsTable";

export default function TransactionsTab() {
  return (
    <div className="w-full h-full flex flex-col gap-3">
      <TransactionSummaryCards/>
      <TransactionsTable/>
    </div>
  );
}




