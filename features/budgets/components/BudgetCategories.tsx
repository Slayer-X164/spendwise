import { Edit02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardIcon } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import type { BudgetCategory } from "../data";

const statusStyles = {
  over: { bar: "bg-red-600", percentage: "text-red-700", pill: "bg-red-100 text-red-800" },
  near: { bar: "bg-neutral-800", percentage: "text-neutral-900", pill: "bg-amber-100 text-amber-800" },
  under: { bar: "bg-[#1257ff]", percentage: "text-blue-700", pill: "bg-green-100 text-green-800" },
};

function CategoryCard({
  category,
  daysElapsed,
  onEdit,
}: {
  category: BudgetCategory;
  daysElapsed: number;
  onEdit: (name: string) => void;
}) {
  const { name, icon, spend, status, percentage, remaining, totalLimit } = category;
  const styles = statusStyles[status];
  const formattedLimit = formatMoney(totalLimit, Number.isInteger(totalLimit));
  const spent = formatMoney(spend);
  const balance = status === "over" ? `Over by ${formatMoney(-remaining)}` : `${formatMoney(remaining)} left`;
  const percent = `${Math.round(percentage)}%`;
  const pillClass = `w-fit rounded-full px-2 py-1 text-xs font-semibold ${styles.pill}`;

  return (
    <li className="group relative grid min-w-0 content-start gap-3 py-3 first:pt-0 last:pb-0 md:rounded-3xl md:border md:border-neutral-300 md:bg-neutral-50 md:p-4 md:first:pt-4 md:last:pb-4">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <CardIcon icon={icon} />
          <div className="min-w-0">
            <h3 className="text-sm leading-tight font-semibold [overflow-wrap:anywhere] sm:text-base">
              <button
                type="button"
                onClick={() => onEdit(name)}
                aria-label={`Edit ${name} budget`}
                className="cursor-pointer rounded text-left after:absolute after:inset-0 after:rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:after:rounded-3xl"
              >
                {name}
              </button>
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 md:hidden">{spent} of {formattedLimit}</p>
            <p className="mt-0.5 hidden text-xs text-slate-600 md:block">Monthly limit {formattedLimit}</p>
          </div>
        </div>
        <div className="grid justify-items-end gap-1 text-right md:hidden">
          <strong className={`text-sm tabular-nums ${styles.percentage}`}>{percent}</strong>
          <span className={pillClass}>{balance}</span>
        </div>
        <HugeiconsIcon icon={Edit02Icon} className="hidden size-4 text-slate-500 group-hover:text-blue-700 md:block" aria-hidden="true" />
      </div>

      <div className="hidden items-baseline justify-between gap-2 md:flex">
        <strong className="text-2xl tracking-tight tabular-nums">{spent}</strong>
        <strong className={`text-sm tabular-nums ${styles.percentage}`}>{percent}</strong>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
        <div className={`h-full rounded-full ${styles.bar}`} style={{ width: `${Math.min(percentage, 100)}%` }} />
      </div>

      <div className="hidden flex-wrap items-center justify-between gap-1 md:flex">
        <span className={pillClass}>{balance}</span>
        <span className="text-xs whitespace-nowrap text-slate-600">{formatMoney(spend / daysElapsed)}/day spent</span>
      </div>
    </li>
  );
}

export default function BudgetCategories({
  categories,
  daysElapsed,
  onEdit,
  onAdd,
}: {
  categories: BudgetCategory[];
  daysElapsed: number;
  onEdit: (name?: string) => void;
  onAdd: () => void;
}) {
  return (
    <section aria-labelledby="budget-categories" className="grid min-w-0 gap-3">
      <div className="flex items-center justify-between gap-2 px-1">
        <h2 id="budget-categories" className="text-lg font-semibold tracking-tight sm:text-xl">Categories</h2>
        <button type="button" onClick={() => onEdit()} className="min-h-9 cursor-pointer rounded px-1 text-sm font-semibold text-blue-700 hover:underline focus-visible:outline-2">
          Edit limits
        </button>
      </div>
      <div className="grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ul role="list" className="min-w-0 rounded-3xl border border-neutral-300 bg-neutral-50 p-4 max-md:divide-y max-md:divide-slate-200 md:contents">
          {categories.map((category) => <CategoryCard key={category.name} category={category} daysElapsed={daysElapsed} onEdit={onEdit} />)}
        </ul>
        <button
          type="button"
          onClick={onAdd}
          className="flex min-h-14 cursor-pointer items-center justify-center gap-2 rounded-3xl border-2 border-dashed border-slate-300 px-3 py-3 text-sm font-semibold text-slate-600 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 md:min-h-36 md:flex-col"
        >
          <span className="grid size-8 place-items-center rounded-full bg-neutral-50 text-blue-600 md:size-10">
            <HugeiconsIcon icon={PlusSignIcon} className="size-5" aria-hidden="true" />
          </span>
          Add category budget
        </button>
      </div>
    </section>
  );
}
