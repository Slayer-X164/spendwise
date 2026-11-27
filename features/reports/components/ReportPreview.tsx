import Image from "next/image";
import { BarChartTooltip } from "@/features/analytics/components/ChartTooltip";
import useChartSelection from "@/features/analytics/useChartSelection";
import { cardClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import SpendingDonut from "@/features/ui/components/SpendingDonut";
import { formatLedgerDate } from "@/features/transactionsAndSubscriptions/ledger";
import { formatReportDate, type Report } from "../data";

function CashflowTrend({ trend }: { trend: Report["trend"] }) {
  const { active, pointProps } = useChartSelection();
  const point = active === null ? null : trend[active];
  const max = Math.max(1, ...trend.map(({ income, spend }) => Math.max(income, spend)));

  return (
    <div className="grid gap-2">
      <div className="flex items-center gap-4 text-xs text-slate-600">
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-[#1257ff]" aria-hidden="true" />Income</span>
        <span className="flex items-center gap-1.5"><i className="size-2 rounded-full bg-neutral-800" aria-hidden="true" />Expenses</span>
      </div>
      <div className="relative flex h-32 items-end gap-1 border-b border-slate-200 sm:h-40">
        {trend.map(({ label, income, spend }, index) => (
          <button
            key={label}
            type="button"
            {...pointProps(index)}
            aria-label={`${label}, income ${formatMoney(income)}, expenses ${formatMoney(spend)}`}
            className="flex h-full min-w-0 flex-1 cursor-pointer items-end justify-center gap-0.5 rounded-lg px-0.5 focus-visible:outline-2 focus-visible:outline-blue-600 sm:gap-1"
          >
            <i className="w-2/5 max-w-6 rounded-t-md bg-[#1257ff]" style={{ height: `${income / max * 90}%` }} aria-hidden="true" />
            <i className="w-2/5 max-w-6 rounded-t-md bg-neutral-800" style={{ height: `${spend / max * 90}%` }} aria-hidden="true" />
          </button>
        ))}
        {point && active !== null && (
          <BarChartTooltip label={point.label} position={(active + 0.5) / trend.length * 100} height={Math.max(point.income, point.spend) / max * 90}>
            <span>Income {formatMoney(point.income)}</span>
            <span>Expenses {formatMoney(point.spend)}</span>
          </BarChartTooltip>
        )}
      </div>
      <div className="flex gap-1 text-center text-[10px] text-slate-600 sm:text-xs" aria-hidden="true">
        {trend.map(({ label, shortLabel }, index) => (
          <span key={label} className={`flex-1 ${trend.length > 6 && index % 2 ? "invisible sm:visible" : ""}`}>{shortLabel}</span>
        ))}
      </div>
    </div>
  );
}

function ReportProgress({ values }: { values: { name: string; used: number }[] }) {
  return (
    <ul className="grid gap-2 text-xs sm:text-sm">
      {values.map(({ name, used }) => (
        <li key={name} className="grid grid-cols-[minmax(5.5rem,1fr)_minmax(0,3fr)_3rem] items-center gap-2">
          <span className="font-medium [overflow-wrap:anywhere]">{name}</span>
          <span className="h-2 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
            <span className={`block h-full rounded-full ${used > 100 ? "bg-red-600" : "bg-[#1257ff]"}`} style={{ width: `${Math.min(100, used)}%` }} />
          </span>
          <strong className={`text-right tabular-nums ${used > 100 ? "text-red-700" : ""}`}>{Math.round(used)}%</strong>
        </li>
      ))}
    </ul>
  );
}

function AmountList({ rows }: { rows: { name: string; amount: number }[] }) {
  return (
    <ul className="divide-y divide-slate-200 text-sm">
      {rows.map(({ name, amount }) => (
        <li key={name} className="flex items-center justify-between gap-2 py-2">
          <span>{name}</span>
          <strong className="tabular-nums">{formatMoney(amount)}</strong>
        </li>
      ))}
    </ul>
  );
}

export default function ReportPreview({ report, today }: { report: Report; today: string }) {
  const { title, totals, options, period, trend, categories, budgets, goals, ledger, taxCategories } = report;
  const isTax = options.type === "tax";

  return (
    <article aria-label="Report preview" className={`${cardClass} grid min-w-0 content-start gap-5 bg-neutral-50 sm:gap-6 sm:p-6 xl:p-7 print:border-0 print:bg-white print:p-0 print:[print-color-adjust:exact]`}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 text-lg font-bold tracking-tight sm:text-xl">
          <Image src="/brand/logo.png" width={36} height={36} alt="" className="size-8" />
          SpendWise
        </div>
        <div className="min-w-0 sm:text-right">
          <h2 className="text-lg font-bold tracking-tight sm:text-xl">{title}</h2>
          <p className="text-xs text-slate-600">{period.range} · {isTax ? "Transaction ledger" : "Sample activity"}</p>
        </div>
      </div>

      <dl className="grid min-w-0 grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3">
        {totals.map(({ label, amount }, index) => {
          const [whole, fraction] = formatMoney(amount).split(".");
          return (
            <div key={label} className={`min-w-0 rounded-2xl px-3 py-3 sm:p-4 ${index === 2 ? "col-span-2 bg-[#1257ff] text-white sm:col-span-1" : "bg-slate-100"}`}>
              <dt className={`text-xs leading-tight ${index === 2 ? "text-blue-50" : "text-slate-600"}`}>{label}</dt>
              <dd className="mt-1 text-lg leading-none font-bold tracking-tight tabular-nums [overflow-wrap:anywhere] xl:text-xl">
                {whole}<span className={`text-xs ${index === 2 ? "text-blue-100" : "text-slate-600"}`}>.{fraction}</span>
              </dd>
            </div>
          );
        })}
      </dl>

      {isTax ? (
        <section aria-label="Ledger expenses by category" className="grid gap-2">
          <h3 className="text-sm font-semibold sm:text-base">Ledger expenses by category</h3>
          <p className="text-xs text-slate-600">Totals count completed transactions.</p>
          {taxCategories.length ? <AmountList rows={taxCategories} /> : <p className="text-sm text-slate-600">No completed expenses in this period.</p>}
        </section>
      ) : options.type === "cashflow" ? (
        <section aria-label="Monthly cashflow" className="grid gap-2">
          <h3 className="text-sm font-semibold sm:text-base">Monthly cashflow</h3>
          {options.include.charts ? <CashflowTrend key={period.value} trend={trend} /> : (
            <ul className="divide-y divide-slate-200 text-sm">
              {trend.map(({ label, income, spend }) => (
                <li key={label} className="flex flex-wrap justify-between gap-2 py-2">
                  <strong>{label}</strong>
                  <span className="text-slate-600">Income {formatMoney(income)} · Expenses {formatMoney(spend)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (options.include.charts || options.type === "categories") && (
        <section aria-label="Spending by category" className="grid gap-2">
          <h3 className="text-sm font-semibold sm:text-base">Spending by category</h3>
          {options.include.charts ? <SpendingDonut key={period.value} total={totals[1].amount} categories={categories} label="Total" wholeTotal sideBySide /> : <AmountList rows={categories} />}
        </section>
      )}

      {!!budgets.length && (
        <section aria-label="Budget status" className="grid gap-3">
          <h3 className="text-sm font-semibold sm:text-base">Budget status</h3>
          <ReportProgress values={budgets.map(({ name, spend, limit }) => ({ name, used: spend / limit * 100 }))} />
        </section>
      )}
      {!!goals.length && (
        <section aria-label="Current goal progress" className="grid gap-3">
          <h3 className="text-sm font-semibold sm:text-base">Current goal progress</h3>
          <ReportProgress values={goals.map(({ name, percentage }) => ({ name, used: percentage }))} />
        </section>
      )}

      {(options.include.transactions || isTax) && (
        <section aria-label="Largest ledger transactions" className="grid gap-2">
          <div className="flex flex-wrap items-baseline justify-between gap-1">
            <h3 className="text-sm font-semibold sm:text-base">Largest ledger transactions</h3>
            {ledger.length > 5 && <span className="text-xs text-slate-600">5 of {ledger.length} shown · full list in export</span>}
          </div>
          {!isTax && ledger.length > 0 && <p className="text-xs text-slate-600">These entries come from the separate sample ledger in Transactions.</p>}
          {ledger.length ? (
            <ul className="divide-y divide-slate-200 border-t border-slate-200 text-xs sm:text-sm">
              {ledger.slice(0, 5).map(({ id, merchant, date, category, amount }) => (
                <li key={id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-0.5 py-2 sm:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)_auto]">
                  <span className="font-semibold [overflow-wrap:anywhere]">{merchant}</span>
                  <span className="col-start-1 row-start-2 text-xs text-slate-600 sm:col-auto sm:row-auto">
                    <time dateTime={date}>{formatLedgerDate(date)}</time> · {category}
                  </span>
                  <strong className="col-start-2 row-start-1 text-right tabular-nums sm:col-auto sm:row-auto">{formatMoney(amount)}</strong>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-slate-600">No ledger transactions in this period.</p>}
        </section>
      )}

      <p className="border-t border-slate-200 pt-3 text-xs text-slate-600">Previewed {formatReportDate(today)} · SpendWise</p>
    </article>
  );
}
