"use client";

import { Download04Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { cardClass } from "@/features/dashboard/components/CardHeading";
import { dashboardCurrency, formatMoney } from "@/features/dashboard/data";
import { getLedgerPeriod, getTransactionDateRange, transactions, transactionsPerPage, type LedgerTransaction } from "../ledger";
import AddTransactionDialog from "./AddTransactionDialog";
import TransactionDetails from "./TransactionDetails";
import TransactionsFilters, { emptyFilters, type TransactionFilters } from "./TransactionsFilters";
import TransactionsSummaryCards from "./TransactionsSummaryCards";
import TransactionsTable from "./TransactionsTable";

const actionClass = "flex min-h-10 cursor-pointer items-center justify-center gap-2 rounded-full px-4 text-sm font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";

function csvCell(value: string | number) {
  if (typeof value === "number") return String(value);
  const safeValue = /^\s*[=+\-@]/.test(value) ? `'${value}` : value;
  return `"${safeValue.replaceAll('"', '""')}"`;
}

function exportTransactions(rows: LedgerTransaction[]) {
  const csv = [
    ["Merchant", "Date", "Category", "Payment method", `Amount (${dashboardCurrency})`, "Status"],
    ...rows.map(({ merchant, date, category, method, amount, status }) => [merchant, date, category, method, amount, status]),
  ].map((row) => row.map(csvCell).join(",")).join("\r\n");

  const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "spendwise-transactions.csv";
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

export default function TransactionsView() {
  const [filters, setFilters] = useState(emptyFilters);
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(4);
  const detailsDialog = useRef<HTMLDialogElement>(null);
  const query = filters.search.trim().toLowerCase();
  const dateRange = filters.dateRange ? getTransactionDateRange(filters.dateRange, new Date()) : undefined;
  const rows = transactions.filter(({ merchant, amount, category, method, date, status }) =>
    (!filters.category || category === filters.category) &&
    (!filters.method || method === filters.method) &&
    (!dateRange || (date >= dateRange.from && date <= dateRange.to)) &&
    (!filters.status || status === filters.status) &&
    [merchant, String(amount), formatMoney(amount)].some((value) => value.toLowerCase().includes(query))
  );
  const period = getLedgerPeriod(rows);
  const firstIndex = (page - 1) * transactionsPerPage;
  const selectedTransaction = rows.slice(firstIndex, firstIndex + transactionsPerPage).find(({ id }) => id === selectedId);

  function changeFilters(nextFilters: TransactionFilters) {
    setFilters(nextFilters);
    setPage(1);
  }

  function selectTransaction(transaction: LedgerTransaction) {
    if (window.matchMedia("(min-width: 80rem)").matches) {
      setSelectedId(selectedId === transaction.id ? null : transaction.id);
      return;
    }

    setSelectedId(transaction.id);
    detailsDialog.current?.showModal();
  }

  return (
    <div className="grid min-w-0 gap-3 sm:gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Transactions</h1>
          <p className="mt-1 text-sm text-slate-600">
            {period.label && <>{period.label} · </>}
            {rows.length} {rows.length === 1 ? "transaction" : "transactions"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className={`${actionClass} border border-neutral-300 bg-neutral-50 hover:bg-neutral-100 disabled:cursor-default disabled:opacity-50`}
            disabled={rows.length === 0}
            onClick={() => exportTransactions(rows)}
          >
            <HugeiconsIcon icon={Download04Icon} className="size-4" aria-hidden="true" />
            Export CSV
          </button>
          <AddTransactionDialog className={`${actionClass} bg-[#1257ff] text-white shadow-md shadow-blue-600/25 hover:bg-blue-700`}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" aria-hidden="true" />
            Add transaction
          </AddTransactionDialog>
        </div>
      </div>

      <TransactionsSummaryCards rows={rows} days={period.days} />
      <TransactionsFilters filters={filters} onChange={changeFilters} />

      <div className={`grid min-w-0 items-start gap-4 ${selectedTransaction ? "xl:grid-cols-[minmax(0,1fr)_19rem]" : ""}`}>
        <TransactionsTable rows={rows} page={page} onPageChange={setPage} selectedId={selectedId} onSelect={selectTransaction} />
        {selectedTransaction && (
          <aside className={`${cardClass} sticky top-4 hidden bg-neutral-50 xl:block`} aria-label="Selected transaction">
            <TransactionDetails transaction={selectedTransaction} onClose={() => setSelectedId(null)} />
          </aside>
        )}
      </div>

      <dialog
        ref={detailsDialog}
        aria-label="Transaction details"
        onClose={() => setSelectedId(null)}
        className={`${cardClass} m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-sm overflow-y-auto bg-neutral-50 text-neutral-900 shadow-xl backdrop:bg-neutral-900/50`}
      >
        {selectedTransaction && (
          <TransactionDetails transaction={selectedTransaction} onClose={() => detailsDialog.current?.close()} />
        )}
      </dialog>
    </div>
  );
}
