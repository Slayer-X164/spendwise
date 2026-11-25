import { Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { categories, dateRangeOptions, transactions } from "../ledger";

export const emptyFilters = { search: "", category: "", method: "", dateRange: "", status: "" };
export type TransactionFilters = typeof emptyFilters;

const allOption = (label: string) => ({ value: "", label });
const toOption = (value: string) => ({ value, label: value });

const fields = [
  { key: "category", label: "Category", options: [allOption("All categories"), ...Object.keys(categories).map(toOption)] },
  { key: "method", label: "Payment method", options: [allOption("All methods"), ...[...new Set(transactions.map(({ method }) => method))].sort().map(toOption)] },
  { key: "dateRange", label: "Date range", options: [allOption("All dates"), ...dateRangeOptions] },
  { key: "status", label: "Status", options: [allOption("Any status"), ...["Completed", "Pending"].map(toOption)] },
] as const;

export default function TransactionsFilters({
  filters,
  onChange,
}: {
  filters: TransactionFilters;
  onChange: (filters: TransactionFilters) => void;
}) {
  return (
    <section className="flex flex-wrap items-center gap-2.5" aria-label="Transaction filters">
      <label className="flex min-h-10 w-full min-w-0 items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 focus-within:ring-2 focus-within:ring-blue-600 sm:w-64 lg:w-72">
        <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
        <input
          type="search"
          aria-label="Search transactions"
          placeholder="Search merchant or amount"
          className="min-w-0 flex-1 bg-transparent py-2 text-base outline-none placeholder:text-slate-500 sm:text-sm"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
        />
      </label>
      {fields.map(({ key, label, options }) => (
        <SelectListbox
          key={key}
          label={label}
          options={options}
          value={filters[key]}
          onChange={(value) => onChange({ ...filters, [key]: value })}
          buttonClassName="min-h-10 rounded-full border border-neutral-300 bg-neutral-50 px-3 text-sm font-medium hover:bg-neutral-100"
        />
      ))}
      {Object.values(filters).some(Boolean) && (
        <button type="button" onClick={() => onChange(emptyFilters)} className="min-h-10 cursor-pointer px-2 text-sm font-semibold text-blue-700 hover:underline">
          Clear all
        </button>
      )}
    </section>
  );
}
