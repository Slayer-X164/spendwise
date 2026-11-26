import { ChartColumnIcon } from "@hugeicons/core-free-icons";
import { formatMoney } from "@/features/dashboard/data";
import AnalyticsPanel from "./AnalyticsPanel";
import { BarChartTooltip } from "./ChartTooltip";
import type { SpendingBucket } from "../data";
import useChartSelection from "../useChartSelection";

const series = [
  { label: "Over limit", swatch: "bg-red-600" },
  { label: "Within limit", swatch: "bg-blue-200" },
  { label: "Latest", swatch: "bg-neutral-800" },
];

export default function SpendingChart({
  title,
  periodLabel,
  buckets,
}: {
  title: string;
  periodLabel: string;
  buckets: SpendingBucket[];
}) {
  const { active, pointProps } = useChartSelection();
  const lastIndex = buckets.length - 1;
  const limit = buckets.reduce((sum, bucket) => sum + bucket.budget, 0) / buckets.length;
  const step = Math.ceil(Math.max(limit, ...buckets.map(({ spend }) => spend)) / 150) * 50;
  const scale = 3 * step;
  const tickValues = [0, step, 2 * step, scale];
  const labelIndexes = [...new Set([0, Math.floor(lastIndex / 2), lastIndex])];
  const points = buckets.map(({ label, spend }) => {
    const difference = spend - limit;
    const overLimit = difference > 0;
    return {
      label,
      height: spend / scale * 100,
      overLimit,
      amount: `${formatMoney(spend)} spent`,
      budgetDetail: difference === 0 ? "At avg. limit" : `${formatMoney(Math.abs(difference))} ${overLimit ? "over" : "under"} avg. limit`,
    };
  });
  const point = active === null ? null : points[active];

  return (
    <AnalyticsPanel title={title} icon={ChartColumnIcon} action={<span className="rounded-full bg-neutral-50 px-3 py-1.5 text-xs font-medium text-blue-700 xl:bg-slate-100 xl:text-neutral-800">{periodLabel}</span>}>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-slate-600">
        {series.map(({ label, swatch }) => (
          <span key={label} className="flex items-center gap-1.5"><i className={`size-2 rounded-full ${swatch}`} aria-hidden="true" />{label}</span>
        ))}
        <span className="flex items-center gap-1.5"><i className="w-4 border-t-2 border-dashed border-neutral-600" aria-hidden="true" />Avg. limit {formatMoney(limit)}</span>
      </div>

      <div className="relative mt-5 h-36 sm:h-48 xl:h-68">
        {tickValues.map((value) => (
          <div key={value} className="pointer-events-none absolute inset-x-0 hidden items-center gap-1 sm:flex" style={{ bottom: `${value / scale * 100}%` }} aria-hidden="true">
            <span className="w-12 translate-y-1/2 text-right text-xs text-slate-500">{formatMoney(value, true)}</span>
            <i className="flex-1 border-t border-slate-200" />
          </div>
        ))}
        <div className="relative flex h-full gap-0.5 sm:ml-14 sm:gap-1 xl:gap-1.5">
          {points.map(({ label, height, overLimit, amount, budgetDetail }, index) => {
            const isLatest = index === lastIndex;
            const color = overLimit ? "bg-red-600" : isLatest ? "bg-neutral-800" : "bg-blue-200";

            return (
              <button
                type="button"
                key={label}
                {...pointProps(index)}
                aria-label={`${label}, ${amount}, ${budgetDetail}${isLatest ? ", latest" : ""}`}
                className="relative h-full min-w-0 flex-1 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                <span
                  className={`absolute inset-x-0 bottom-0 rounded-b-sm rounded-t-lg ${color} ${isLatest && overLimit ? "ring-1 ring-neutral-800 ring-inset" : ""} ${active === index ? "brightness-90" : ""}`}
                  style={{ height: `${height}%` }}
                  aria-hidden="true"
                />
              </button>
            );
          })}
          {active !== null && point && (
            <BarChartTooltip label={point.label} position={(active + 0.5) / points.length * 100} height={point.height}>
              <strong className="tabular-nums">{point.amount}</strong>
              <span className={point.overLimit ? "text-red-300" : "text-neutral-300"}>{point.budgetDetail}</span>
            </BarChartTooltip>
          )}
        </div>
        <div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-neutral-600 sm:left-14" style={{ bottom: `${limit / scale * 100}%` }} aria-hidden="true" />
      </div>

      <div className="mt-2 flex justify-between gap-2 text-xs text-slate-500 sm:ml-14" aria-hidden="true">
        {labelIndexes.map((index) => <span key={index}>{buckets[index].label}</span>)}
      </div>
    </AnalyticsPanel>
  );
}
