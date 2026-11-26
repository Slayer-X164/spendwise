import { Alert02Icon, ArrowRight01Icon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CardHeading, { cardClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import type { MonthlyBudget } from "../data";

export function MonthlyOverview({ month }: { month: MonthlyBudget }) {
  const percentage = month.spend / month.limit * 100;
  const overBudget = month.remaining < 0;
  const spentCategories = month.categories.filter(({ spend }) => spend > 0);
  const [whole, fractional] = formatMoney(month.spend).split(".");
  const days = `${month.daysLeft} ${month.daysLeft === 1 ? "day" : "days"}`;
  const reset = month.daysLeft ? `Resets ${month.resetLabel}` : "Month ended";

  return (
    <section aria-label="Monthly overview" className={`${cardClass} flex min-w-0 flex-col gap-4 bg-neutral-50 sm:gap-6`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardHeading icon={Wallet01Icon}>Monthly overview</CardHeading>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium whitespace-nowrap text-slate-600">{reset}</span>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-x-2 gap-y-3">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-600">Spent so far</p>
          <p className="text-4xl leading-none font-bold tracking-tight tabular-nums sm:text-5xl xl:text-6xl">
            {whole}<span className="text-xl text-neutral-500 sm:text-2xl xl:text-3xl">.{fractional}</span>
          </p>
        </div>
        <div className="text-right">
          <p className="mb-1 text-xs font-medium text-slate-600 sm:text-sm">Total budget</p>
          <p className="text-xl leading-none font-bold tracking-tight tabular-nums sm:text-2xl xl:text-3xl">{formatMoney(month.limit, Number.isInteger(month.limit))}</p>
        </div>
      </div>

      <div>
        <div className="h-4 overflow-hidden rounded-full bg-slate-200 sm:h-5" aria-hidden="true">
          {overBudget ? <div className="h-full bg-red-600" /> : (
            <div className="flex h-full overflow-hidden rounded-full" style={{ width: `${Math.min(100, percentage)}%` }}>
              {spentCategories.map(({ name, color, spend }) => (
                <span
                  key={name}
                  className="h-full border-r-2 border-neutral-50 last:border-r-0"
                  style={{ width: `${spend / month.spend * 100}%`, backgroundColor: color }}
                />
              ))}
            </div>
          )}
        </div>
        <div className="mt-2 flex flex-wrap justify-between gap-1 text-xs sm:text-sm">
          <strong className={overBudget ? "text-red-700" : "text-neutral-900"}>{Math.round(percentage)}% used</strong>
          <span className="text-slate-600">{month.daysLeft ? `${days} left` : month.fullLabel}</span>
        </div>
      </div>

      <dl className="mt-auto grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        <div className="min-w-0 rounded-xl  border  border-neutral-300 p-2">
          <dt className="text-xs text-slate-600">{overBudget ? "Over budget" : "Remaining"}</dt>
          <dd className={`mt-1 text-lg leading-tight font-bold tabular-nums [overflow-wrap:anywhere] sm:text-xl ${overBudget ? "text-red-700" : ""}`}>{formatMoney(Math.abs(month.remaining))}</dd>
        </div>
        <div className="min-w-0 hidden sm:block rounded-xl border border-neutral-300 p-2">
          <dt className="text-xs text-slate-600">Safe per day</dt>
          <dd className="mt-1 text-lg leading-tight font-bold text-blue-700 tabular-nums [overflow-wrap:anywhere] sm:text-xl">{month.daysLeft ? formatMoney(month.safePerDay) : "—"}</dd>
        </div>
        <div className=" min-w-0 rounded-xl flex-1  border  border-neutral-300 p-2">
          <dt className="text-xs text-slate-600">Days left</dt>
          <dd className="mt-1 text-lg leading-tight font-bold sm:text-xl">{days}</dd>
        </div>
      </dl>
    </section>
  );
}

export function BudgetAlerts({
  month,
  reminder,
  onEdit,
}: {
  month: MonthlyBudget;
  reminder: boolean;
  onEdit: (name?: string) => void;
}) {
  return (
    <section aria-labelledby="budget-alerts" className={`${cardClass} flex flex-col gap-3 border-neutral-800 bg-neutral-800 text-white sm:gap-4`}>
      <div className="flex items-center justify-between gap-2">
        <h2 id="budget-alerts" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <HugeiconsIcon icon={Alert02Icon} className="size-5 shrink-0 text-red-400" aria-hidden="true" />
          Alerts
        </h2>
        <span className="rounded-full bg-neutral-700 px-2.5 py-1 text-xs font-medium whitespace-nowrap">{month.alerts.length} active</span>
      </div>

      {month.alerts.length ? (
        <ul className="max-h-56 divide-y divide-neutral-700 overflow-y-auto">
          {month.alerts.map(({ name, remaining, percentage, totalLimit, status }) => {
            const over = status === "over";
            return (
              <li key={name}>
                <button type="button" onClick={() => onEdit(name)} className="group flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-lg px-0.5 py-2 text-left focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-300">
                  <span className={`min-h-6 w-1 shrink-0 self-stretch rounded-full ${over ? "bg-red-500" : percentage >= 95 ? "bg-amber-400" : "bg-blue-400"}`} aria-hidden="true" />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm [overflow-wrap:anywhere] group-hover:underline">{over ? `${name} is over budget` : `${name} at ${Math.round(percentage)}%`}</strong>
                    <span className="block text-xs text-neutral-300 sm:text-sm">
                      {over ? `${formatMoney(-remaining)} above your ${formatMoney(totalLimit, Number.isInteger(totalLimit))} limit` : `${formatMoney(remaining)} left in this category`}
                    </span>
                  </span>
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4 shrink-0 text-neutral-400" aria-hidden="true" />
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-xl bg-neutral-700/50 px-3 py-4 text-sm text-neutral-200">No category alerts for this month.</p>
      )}

      {reminder && month.daysLeft > 0 && (
        <p className="rounded-xl bg-neutral-700 px-3 py-2 text-sm text-neutral-200">
          Daily allowance reminder · <strong>{formatMoney(month.safePerDay)}</strong> per day
        </p>
      )}
      <button type="button" onClick={() => onEdit()} className="mt-auto min-h-10 cursor-pointer rounded-full bg-[#1257ff] px-4 text-sm font-semibold text-white shadow-md shadow-blue-700/25 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300">
        Adjust limits
      </button>
    </section>
  );
}
