import {
  Activity01Icon,
  Alert02Icon,
  Calendar03Icon,
  DiscountTag02Icon,
  SparklesIcon,
  TradeUpIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { CardIcon, cardClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";
import { formatPercent, type AnalyticsData } from "../data";
import useChartSelection from "../useChartSelection";
import AnalyticsPanel from "./AnalyticsPanel";
import { BarChartTooltip } from "./ChartTooltip";

export function TopMerchants({ merchants }: { merchants: AnalyticsData["merchantTotals"] }) {
  return (
    <AnalyticsPanel title="Top merchants" icon={DiscountTag02Icon}>
      <div
        role="region"
        aria-label="Merchant rankings"
        tabIndex={0}
        className="max-h-72 overflow-y-auto pr-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        <ul className="grid gap-3">
          {merchants.map(({ name, amount, icon }, index) => (
            <li key={name} className="grid gap-1.5">
              <div className="flex items-center justify-between gap-2">
                <span className="flex min-w-0 items-center gap-2 text-sm font-medium">
                  <CardIcon icon={icon} tone="light" size="size-8" />
                  {name}
                </span>
                <strong className="shrink-0 text-sm tabular-nums">{formatMoney(amount)}</strong>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-slate-200" aria-hidden="true">
                <div className={`h-full rounded-full ${index === 0 ? "bg-[#1257ff]" : "bg-blue-300"}`} style={{ width: `${amount / merchants[0].amount * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AnalyticsPanel>
  );
}

export function WeekdaySpending({ weekdays }: { weekdays: AnalyticsData["byWeekday"] }) {
  const { active, pointProps } = useChartSelection();
  const max = Math.max(...weekdays.map(({ amount }) => amount), 1);
  const day = active === null ? null : weekdays[active];

  return (
    <AnalyticsPanel title="Spend by weekday" icon={Calendar03Icon} action={<span className="rounded-full bg-neutral-50 px-3 py-1.5 text-xs font-medium text-slate-600 xl:bg-slate-100">Avg. per day</span>}>
      <div className="relative">
        <ul className="grid min-w-0 grid-cols-7 gap-1 sm:gap-2 xl:gap-3">
          {weekdays.map(({ label, amount, hasData }, index) => (
            <li key={label} className="min-w-0">
              <button
                type="button"
                {...pointProps(index)}
                aria-label={`${label}, ${hasData ? `${formatMoney(amount)} average spending` : "no activity"}`}
                className="grid w-full cursor-pointer justify-items-center gap-1.5 rounded-lg text-center text-xs focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <span className="flex h-32 w-full items-end px-1 sm:h-40 xl:h-44" aria-hidden="true">
                  <span
                    className={`block w-full rounded-lg ${amount === max ? "bg-[#1257ff]" : "bg-blue-200"} ${active === index ? "brightness-90" : ""}`}
                    style={{ height: `${amount / max * 100}%` }}
                  />
                </span>
                <span className="font-medium text-slate-600" aria-hidden="true">
                  <span className="sm:hidden">{label[0]}</span>
                  <span className="hidden sm:inline">{label.slice(0, 3)}</span>
                </span>
                <span className="whitespace-nowrap tabular-nums text-slate-500">{hasData ? formatMoney(amount, true) : "–"}</span>
              </button>
            </li>
          ))}
        </ul>
        {active !== null && day && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 sm:h-40 xl:h-44">
            <BarChartTooltip label={day.label} position={(active + 0.5) / weekdays.length * 100} height={day.amount / max * 100}>
              <strong className="tabular-nums">{day.hasData ? `${formatMoney(day.amount)} average` : "No activity"}</strong>
            </BarChartTooltip>
          </div>
        )}
      </div>
    </AnalyticsPanel>
  );
}

export function AnalyticsInsights({ data }: { data: AnalyticsData }) {
  const highest = data.byWeekday.reduce((best, day) => day.amount > best.amount ? day : best);
  const budgetDifference = data.spend - data.budget;
  const insights = [
    { title: `${highest.label} is the highest-spend day`, text: `Average spending is ${formatMoney(highest.amount)} on that weekday.`, icon: Activity01Icon },
    {
      title: budgetDifference > 0 ? "Spending is over budget" : "Spending is within budget",
      text: `${formatMoney(Math.abs(budgetDifference))} ${budgetDifference > 0 ? "over" : "left in"} the budget for this period.`,
      icon: Alert02Icon,
    },
    {
      title: data.savingsRate >= 0 ? "Income saved" : "Spending exceeds income",
      text: data.savingsRate >= 0
        ? `You kept ${formatPercent(data.savingsRate)} of your allocated income this period.`
        : `Spending exceeded allocated income by ${formatMoney(data.spend - data.income)}.`,
      icon: TradeUpIcon,
    },
  ];

  return (
    <section aria-label="Insights" className={`${cardClass} flex flex-col gap-3 border-neutral-800 bg-neutral-800 text-white md:max-xl:col-span-2`}>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight sm:text-xl">
        <CardIcon icon={SparklesIcon} className="bg-[#1257ff] text-white" />
        Insights
      </h2>
      <span className="bg-blue-600 rounded-full text-neutral-50 px-4 py-1">Pro</span>
      </div>
      <ul className="divide-y divide-neutral-700">
        {insights.map(({ title, text, icon }) => (
          <li key={title} className="flex items-start gap-3 py-3">
            <CardIcon icon={icon} className="bg-neutral-700/50 text-blue-300" size="size-8" />
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-300 sm:text-sm">{text}</p>
            </div>
          </li>
        ))}
      </ul>
      <Link href="/dashboard" className="mt-auto flex min-h-10 items-center justify-center rounded-full bg-[#1257ff] px-4 text-sm font-semibold hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2">
        Unloack all insights
      </Link>
    </section>
  );
}
