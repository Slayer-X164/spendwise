import {
  ArrowLeft01Icon,
  ArrowRight01Icon,
  CreditCardIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardIcon, legendDotClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import { categories, formatLedgerDate, transactionsPerPage, type LedgerTransaction } from "../ledger";
import { TransactionStatus } from "./TransactionDetails";

const pageButtonClass = "grid size-9 shrink-0 cursor-pointer place-items-center rounded-full text-slate-600 hover:bg-slate-100 disabled:cursor-default disabled:opacity-40 aria-[current=page]:bg-neutral-800 aria-[current=page]:text-white";

export default function TransactionsTable({
  rows,
  page,
  onPageChange,
  selectedId,
  onSelect,
}: {
  rows: LedgerTransaction[];
  page: number;
  onPageChange: (page: number) => void;
  selectedId: number | null;
  onSelect: (transaction: LedgerTransaction) => void;
}) {
  const start = (page - 1) * transactionsPerPage;
  const visibleRows = rows.slice(start, start + transactionsPerPage);
  const pageCount = Math.ceil(rows.length / transactionsPerPage);
  const groupedRows = new Map<string, LedgerTransaction[]>();
  for (const transaction of visibleRows) {
    const group = groupedRows.get(transaction.date);
    if (group) group.push(transaction);
    else groupedRows.set(transaction.date, [transaction]);
  }
  const groups = [...groupedRows].map(([date, transactions]) => ({
    date,
    label: formatLedgerDate(date, true),
    total: formatMoney(rows.reduce((net, row) => row.date === date ? net + row.amount : net, 0)),
    transactions,
  }));

  return (
    <section className="min-w-0 scroll-m-4 md:rounded-3xl md:border md:border-neutral-300 md:bg-neutral-50 md:p-4 xl:p-5 print:break-inside-avoid" aria-label="Transaction ledger">
      {rows.length === 0 ? (
        <div className="rounded-3xl bg-neutral-50 p-4 py-12 text-center" role="status">
          <h2 className="font-semibold">No matching transactions</h2>
          <p className="mt-1 text-sm text-slate-500">Try a different search or clear your filters.</p>
        </div>
      ) : (
        <>
          <div className="grid gap-5 md:hidden print:hidden">
            {groups.map(({ date, label, total, transactions }) => (
              <section key={date} aria-label={label}>
                <div className="mb-2 flex items-center justify-between gap-2 px-1 text-sm font-semibold text-slate-600">
                  <h2><time dateTime={date}>{label}</time></h2>
                  <span className="tabular-nums text-slate-500">{total}</span>
                </div>
                <ul className="divide-y divide-slate-200/70 rounded-3xl bg-neutral-50 px-3 sm:px-4">
                  {transactions.map((transaction) => (
                    <MobileTransactionRow key={transaction.id} transaction={transaction} onSelect={() => onSelect(transaction)} />
                  ))}
                </ul>
              </section>
            ))}
          </div>

          <table className="hidden w-full border-separate border-spacing-0 text-left text-sm md:table print:table">
            <thead className="text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th scope="col" className="px-2 pb-2 font-semibold">Merchant</th>
                <th scope="col" className="px-2 pb-2 font-semibold">Category</th>
                <th scope="col" className="px-2 pb-2 font-semibold">Method</th>
                <th scope="col" className="px-2 pb-2 text-right font-semibold">Amount</th>
                <th scope="col" className="px-2 pb-2 font-semibold">Status</th>
              </tr>
            </thead>

            {groups.map(({ date, label, total, transactions }) => (
              <tbody key={date}>
                <tr>
                  <th scope="rowgroup" colSpan={5} className="border-b border-neutral-200 px-2 pt-4 pb-2 text-xs font-medium text-slate-600">
                    <div className="flex justify-between gap-2">
                      <time dateTime={date}>{label}</time>
                      <span className="tabular-nums">{total}</span>
                    </div>
                  </th>
                </tr>
                {transactions.map((transaction) => (
                  <TransactionRow
                    key={transaction.id}
                    transaction={transaction}
                    selected={selectedId === transaction.id}
                    onSelect={() => onSelect(transaction)}
                  />
                ))}
              </tbody>
            ))}
          </table>
        </>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 px-1 text-sm md:border-t md:border-neutral-200 md:px-0 md:pt-3">
        <p className="text-slate-500" role="status">
          {rows.length === 0 ? "0 transactions" : `Showing ${start + 1}–${start + visibleRows.length} of ${rows.length}`}
        </p>
        {pageCount > 1 && (
          <nav className="flex items-center gap-1" aria-label="Transaction pages">
            <button type="button" className={pageButtonClass} aria-label="Previous page" disabled={page === 1} onClick={() => onPageChange(page - 1)}>
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" aria-hidden="true" />
            </button>
            {Array.from({ length: pageCount }, (_, index) => index + 1).map((number) => (
              <button type="button" key={number} className={pageButtonClass} aria-label={`Page ${number}`} aria-current={page === number ? "page" : undefined} onClick={() => onPageChange(number)}>
                {number}
              </button>
            ))}
            <button type="button" className={pageButtonClass} aria-label="Next page" disabled={page === pageCount} onClick={() => onPageChange(page + 1)}>
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" aria-hidden="true" />
            </button>
          </nav>
        )}
      </div>
    </section>
  );
}

function MobileTransactionRow({
  transaction,
  onSelect,
}: {
  transaction: LedgerTransaction;
  onSelect: () => void;
}) {
  const { merchant, amount, method, category, status } = transaction;
  const { badge, icon } = categories[category];

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`View details for ${merchant}`}
        aria-haspopup="dialog"
        className="flex min-h-16 w-full cursor-pointer items-center gap-3 rounded-xl py-3 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600"
      >
        <CardIcon icon={icon} className={badge} size="size-11" />
        <span className="min-w-0 flex-1">
          <span className="block text-base leading-tight font-semibold">{merchant}</span>
          <span className="mt-1 block text-xs text-slate-500 sm:text-sm">{category} | {method}</span>
        </span>
        <span className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-base font-semibold whitespace-nowrap tabular-nums">{formatMoney(amount)}</span>
          {status === "Pending" && <TransactionStatus status={status} />}
        </span>
      </button>
    </li>
  );
}

function TransactionRow({
  transaction,
  selected,
  onSelect,
}: {
  transaction: LedgerTransaction;
  selected: boolean;
  onSelect: () => void;
}) {
  const { merchant, amount, method, category, status } = transaction;
  const { badge, dot, icon } = categories[category];

  return (
    <tr data-selected={selected} className="group hover:bg-blue-50  data-[selected=true]:bg-blue-500 data-[selected=true]:text-white">
      <th scope="row" className="rounded-l-xl font-semibold">
        <button
          type="button"
          onClick={onSelect}
          aria-label={`View details for ${merchant}`}
          aria-pressed={selected}
          className="flex min-h-14 w-full cursor-pointer items-center gap-2 rounded-l-xl p-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
        >
          <CardIcon icon={icon} className={badge} size="size-9" />
          <span className="min-w-0">
            <span className="block leading-tight">{merchant}</span>
          </span>
        </button>
      </th>
      <td className="px-2">
        <span className="flex items-center gap-2">
          <i className={`${legendDotClass} ${dot}`} aria-hidden="true" />{category}
        </span>
      </td>
      <td data-selected={selected} className="px-2 text-slate-600 data-[selected=true]:text-white">
        <span className="flex items-center gap-2 whitespace-nowrap ">
          <HugeiconsIcon icon={CreditCardIcon} className="size-4 shrink-0" aria-hidden="true" />{method}
        </span>
      </td>
      <td className="p-2 text-right font-semibold whitespace-nowrap tabular-nums">
        {formatMoney(amount)}
      </td>
      <td className="rounded-r-xl px-2">
        <TransactionStatus status={status} />
      </td>
    </tr>
  );
}
