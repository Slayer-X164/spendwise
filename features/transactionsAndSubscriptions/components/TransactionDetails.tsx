import { Cancel01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardIcon } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import { categories, formatLedgerDate, type LedgerTransaction } from "../ledger";

export function TransactionStatus({ status }: { status: LedgerTransaction["status"] }) {
  const color = status === "Completed" ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800";

  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${color}`}>{status}</span>;
}

export default function TransactionDetails({
  transaction,
  onClose,
}: {
  transaction: LedgerTransaction;
  onClose: () => void;
}) {
  const category = categories[transaction.category];
  const [whole, fraction] = formatMoney(transaction.amount).split(".");
  const metadata = [
    { label: "Category", value: transaction.category },
    { label: "Date", value: formatLedgerDate(transaction.date) },
    { label: "Payment", value: transaction.method },
  ];

  return (
    <>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold tracking-tight sm:text-lg">Transaction details</h2>
        <button type="button" onClick={onClose} aria-label="Close transaction details" className="grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-neutral-200">
          <HugeiconsIcon icon={Cancel01Icon} className="size-4" aria-hidden="true" />
        </button>
      </div>

      <div className="flex flex-col items-center gap-3 pb-5 pt-6 text-center">
        <CardIcon icon={category.icon} className={category.badge} size="size-14" />
        <h3 className="text-lg leading-tight font-semibold">{transaction.merchant}</h3>
        <p className="text-4xl font-bold leading-none tracking-tight tabular-nums">
          {whole}<span className="text-xl text-neutral-500">.{fraction}</span>
        </p>
        <TransactionStatus status={transaction.status} />
      </div>

      <dl className="grid gap-3 border-y border-neutral-200 py-4 text-sm">
        {metadata.map(({ label, value }) => (
          <div key={label} className="flex justify-between gap-3">
            <dt className="text-slate-500">{label}</dt>
            <dd className="text-right font-medium">{value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-4">
        <h3 className="mb-2 text-sm font-semibold">Receipt</h3>
        <div className="flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-4 text-sm text-slate-600">
          <HugeiconsIcon icon={File01Icon} className="size-4 shrink-0" aria-hidden="true" />
          No receipt attached
        </div>
      </div>
    </>
  );
}
