import {
  ArrowUp02Icon,
  Calendar03Icon,
  ReceiptTextIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { CardIcon, cardClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import { formatLedgerDate, type LedgerTransaction } from "../ledger";

export default function TransactionsSummaryCards({
  rows,
  days,
}: {
  rows: LedgerTransaction[];
  days: number;
}) {
  const expenses = rows.filter(({ amount }) => amount < 0);
  const total = expenses.reduce((sum, { amount }) => sum - amount, 0);
  const largest = expenses.reduce<LedgerTransaction | undefined>(
    (current, transaction) => !current || transaction.amount < current.amount ? transaction : current,
    undefined,
  );

  const cards = [
    { label: "Total spent", icon: Wallet01Icon, value: formatMoney(total), detail: `${expenses.length} expenses` },
    { label: "Average per day", icon: Calendar03Icon, value: formatMoney(days ? total / days : 0), detail: days ? `Over ${days} ${days === 1 ? "day" : "days"}` : "No activity" },
    { label: "Largest expense", icon: ArrowUp02Icon, value: formatMoney(largest ? -largest.amount : 0), detail: largest ? formatLedgerDate(largest.date) : "No expenses", merchant: largest?.merchant },
    { label: "Transactions", icon: ReceiptTextIcon, value: String(rows.length), detail: `${rows.filter(({ status }) => status === "Completed").length} completed` },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4" aria-label="Transaction summary">
      {cards.map(({ label, icon, value, detail, merchant }) => {
        const [whole, fraction] = value.split(".");

        return (
          <div key={label} className={`${cardClass} flex flex-col gap-3 bg-neutral-50 sm:gap-4`}>
            <h2 className="flex items-center gap-2 text-sm font-semibold leading-tight text-slate-600">
              <CardIcon icon={icon} />
              {label}
            </h2>
            <p className="text-xl leading-none font-bold tracking-tight tabular-nums sm:text-3xl">
              {whole}{fraction && <span className="text-sm text-neutral-500 sm:text-lg">.{fraction}</span>}
            </p>
            <span
              className="w-fit max-w-full truncate rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"
              title={merchant ? `${merchant} · ${detail}` : undefined}
            >
              {merchant ? `${merchant} · ${detail}` : detail}
            </span>
          </div>
        );
      })}
    </section>
  );
}
