"use client";

import { Download04Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import { dashboardCurrency } from "@/features/dashboard/data";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { downloadCsv } from "@/lib/downloadCsv";
import { activityByPeriod, getAnalytics, periods, type AnalyticsPeriod } from "../data";
import { AnalyticsInsights, TopMerchants, WeekdaySpending } from "./AnalyticsHighlights";
import AnalyticsSummary from "./AnalyticsSummary";
import CategoryBreakdown from "./CategoryBreakdown";
import SpendingChart from "./SpendingChart";

const spendingTitle = { Week: "Daily spending", Month: "Daily spending", Quarter: "Weekly spending", Year: "Monthly spending" };

export default function AnalyticsView() {
  const [selection, setSelection] = useState<{ period: AnalyticsPeriod; index: number }>({ period: "Month", index: 0 });
  const { period, index } = selection;
  const data = getAnalytics(period, index);
  const periodOptions = activityByPeriod[period].map(({ label }, value) => ({ label, value }));

  function exportPeriod() {
    downloadCsv("spendwise-analytics.csv", [
      ["Date", `Spending (${dashboardCurrency})`, `Allocated income (${dashboardCurrency})`, `Budget (${dashboardCurrency})`],
      ...data.days.map(({ date, spend, income, budget }) => [date.toISOString().slice(0, 10), spend, income, Number(budget.toFixed(2))]),
    ]);
  }

  return (
    <main aria-label="Analytics" className="grid min-w-0 gap-4 sm:gap-5">
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 xl:flex xl:justify-between">
        <div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Analytics</h1>
          <p className="mt-1 text-sm text-slate-600">Spending and savings from demo activity.</p>
        </div>

        <div className="contents xl:flex xl:items-center xl:gap-3">
          <div role="group" aria-label="Analytics period" className="col-span-2 row-start-2 grid grid-cols-4 gap-1 rounded-full border border-neutral-300 bg-neutral-50 p-1 xl:flex">
            {periods.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={period === option}
                onClick={() => setSelection({ period: option, index: 0 })}
                className="min-h-9 cursor-pointer rounded-full px-2 text-sm font-medium text-slate-600 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-blue-600 aria-pressed:bg-neutral-800 aria-pressed:text-white sm:px-4"
              >
                {option}
              </button>
            ))}
          </div>
          <div className="col-span-2 row-start-3">
            <SelectListbox
              label="Analytics date range"
              value={index}
              options={periodOptions}
              onChange={(index) => setSelection({ period, index })}
              buttonClassName="min-h-10 rounded-full border border-neutral-300 bg-neutral-50 px-3 text-sm font-medium hover:bg-neutral-100"
            />
          </div>
          <button type="button" onClick={exportPeriod} aria-label="Export analytics as CSV" className="col-start-2 row-start-1 flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 px-3 text-sm font-semibold hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-blue-600">
            <HugeiconsIcon icon={Download04Icon} className="size-4" aria-hidden="true" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      <AnalyticsSummary data={data} />

      <div className="grid min-w-0 gap-4 sm:gap-5 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
        <SpendingChart key={`spending-${period}-${index}`} title={spendingTitle[period]} periodLabel={data.label} buckets={data.buckets} />
        <CategoryBreakdown key={`category-${period}-${index}`} label={data.label} total={data.spend} categories={data.categoryTotals} />
      </div>

      <div className="grid min-w-0 gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-3">
        <TopMerchants merchants={data.merchantTotals} />
        <WeekdaySpending key={`weekday-${period}-${index}`} weekdays={data.byWeekday} />
        <AnalyticsInsights data={data} />
      </div>
    </main>
  );
}
