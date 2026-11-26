import { Calendar03Icon, TradeUpIcon, Wallet01Icon } from "@hugeicons/core-free-icons";
import { CardIcon, cardClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import { formatPercent, type AnalyticsData } from "../data";

const colors = {
  blue: "bg-blue-100 text-blue-700",
  green: "bg-green-100 text-green-800",
  amber: "bg-amber-100 text-amber-800",
  red: "bg-red-100 text-red-800",
  grey: "bg-slate-100 text-slate-600",
};

function MiniBars({ values }: { values: number[] }) {
  const bars = values.slice(-8);
  const max = Math.max(1, ...bars);
  return (
    <div className="hidden h-8 shrink-0 items-end gap-0.5 lg:flex" aria-hidden="true">
      {bars.map((value, index) => (
        <span
          key={index}
          className={`w-1.5 rounded-t-sm ${index === bars.length - 1 ? "bg-blue-600" : "bg-blue-200"}`}
          style={{ height: `${Math.max(value / max * 100, 8)}%` }}
        />
      ))}
    </div>
  );
}

export default function AnalyticsSummary({ data }: { data: AnalyticsData }) {
  const spendChange = data.comparison ? data.spend - data.comparison.spend : undefined;
  const savingsChange = data.comparison ? data.savingsRate - data.comparison.savingsRate : undefined;
  const dailyDifference = data.average - data.dailyBudget;
  const top = data.categoryTotals[0];

  const metrics = [
    {
      label: "Total spent", icon: Wallet01Icon, value: formatMoney(data.spend), money: true,
      detail: spendChange === undefined ? "No prior period" : `${formatMoney(Math.abs(spendChange), true)} ${spendChange > 0 ? "more" : "less"} vs prior`,
      color: spendChange === undefined ? colors.grey : spendChange > 0 ? colors.amber : colors.green,
      comparison: spendChange !== undefined,
      bars: data.buckets.map(({ spend }) => spend),
    },
    {
      label: "Savings rate", icon: TradeUpIcon, value: formatPercent(data.savingsRate),
      detail: savingsChange === undefined ? "Share of income saved" : `${savingsChange >= 0 ? "+" : "−"}${Math.abs(savingsChange).toFixed(1)} pts vs prior`,
      color: savingsChange === undefined ? colors.grey : savingsChange < 0 ? colors.amber : colors.green,
      comparison: savingsChange !== undefined,
      bars: data.days.map(({ income, spend }) => Math.max(income - spend, 0)),
    },
    {
      label: "Avg. daily spend", icon: Calendar03Icon, value: formatMoney(data.average), money: true,
      detail: `${formatMoney(Math.abs(dailyDifference), true)} ${dailyDifference > 0 ? "over" : "under"} daily limit`,
      color: dailyDifference > 0 ? colors.red : colors.green,
      bars: data.days.map(({ spend }) => spend),
    },
    {
      label: "Top category", icon: top.icon, value: top.name, compactValue: top.shortName,
      detail: `${formatPercent(top.amount / data.spend * 100)} of spending`,
      color: colors.blue,
    },
  ];

  return (
    <section aria-label="Analytics summary" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {metrics.map(({ label, icon, value, compactValue, detail, color, bars, money, comparison }) => {
        const [whole, fraction] = money ? value.split(".") : [value];

        return (
          <div key={label} className={`${cardClass} flex flex-col gap-3 bg-neutral-50 sm:gap-4`}>
            <h2 className="flex items-center justify-between gap-2 text-xs font-semibold text-slate-600 sm:text-sm">
              <span className="flex min-w-0 items-center gap-2 leading-tight">
                <CardIcon icon={icon} />
                {label}
              </span>
              {bars && <MiniBars values={bars} />}
            </h2>
            <p className="text-xl leading-none font-bold tracking-tight tabular-nums sm:text-2xl xl:text-3xl">
              {compactValue ? (
                <><span className="sm:hidden">{compactValue}</span><span className="hidden sm:inline">{whole}</span></>
              ) : (
                <>{whole}{fraction && <span className="text-sm text-neutral-500 sm:text-base">.{fraction}</span>}</>
              )}
            </p>
            <span
              className={`mt-auto w-fit rounded-full px-2 py-1 text-xs font-medium leading-tight sm:px-2.5 ${color}`}
              title={comparison ? "Compared with the same number of days in the previous period" : undefined}
            >
              {detail}
            </span>
          </div>
        );
      })}
    </section>
  );
}
