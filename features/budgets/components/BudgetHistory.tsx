import { ChartColumnIcon } from "@hugeicons/core-free-icons";
import { BarChartTooltip } from "@/features/analytics/components/ChartTooltip";
import useChartSelection from "@/features/analytics/useChartSelection";
import CardHeading, { cardClass, legendDotClass } from "@/features/dashboard/components/CardHeading";
import { formatMoney } from "@/features/dashboard/data";

type HistoryPoint = { label: string; spend: number; limit: number };

const legend = [
  { label: "Within budget", color: "bg-blue-200" },
  { label: "Selected month", color: "bg-neutral-800" },
  { label: "Over budget", color: "bg-red-600" },
];

export default function BudgetHistory({ months, selectedLimit }: { months: HistoryPoint[]; selectedLimit: number }) {
  const { active, pointProps } = useChartSelection();
  const selected = active === null ? null : months[active];
  const scale = Math.max(selectedLimit, ...months.map(({ spend }) => spend), 1) * 1.15;

  return (
    <section aria-label="Budget history" className={`${cardClass} flex min-w-0 flex-col bg-neutral-50`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <CardHeading icon={ChartColumnIcon}>Budget history</CardHeading>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-600">
          {legend.map(({ label, color }) => (
            <span key={label} className="flex items-center gap-1.5"><i className={`${legendDotClass} ${color}`} aria-hidden="true" />{label}</span>
          ))}
          <span className="flex items-center gap-1.5">
            <i className="w-4 border-t-2 border-dashed border-neutral-600" aria-hidden="true" />
            Selected limit {formatMoney(selectedLimit, Number.isInteger(selectedLimit))}
          </span>
        </div>
      </div>

      <div className="relative mt-5 flex h-32 gap-2 sm:h-40 xl:h-44">
        {months.map(({ label, spend, limit }, index) => {
          const current = index === months.length - 1;
          const over = spend > limit;
          const color = over ? "bg-red-600" : current ? "bg-neutral-800" : "bg-blue-200";

          return (
            <button
              key={label}
              type="button"
              {...pointProps(index)}
              aria-label={`${label}, ${formatMoney(spend)} spent of ${formatMoney(limit)}${over ? ", over budget" : ""}`}
              className="flex h-full min-w-0 flex-1 cursor-pointer items-end justify-center rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <span
                aria-hidden="true"
                className={`w-2/3 max-w-10 rounded-lg ${color} ${active === index ? "brightness-90" : ""}`}
                style={{ height: `${spend / scale * 100}%` }}
              />
            </button>
          );
        })}
        <div className="pointer-events-none absolute inset-x-0 border-t-2 border-dashed border-neutral-600" style={{ bottom: `${selectedLimit / scale * 100}%` }} aria-hidden="true" />
        {selected && active !== null && (
          <BarChartTooltip label={selected.label} position={(active + 0.5) / months.length * 100} height={selected.spend / scale * 100}>
            <strong>{formatMoney(selected.spend)} spent</strong>
            <span className={selected.spend > selected.limit ? "text-red-300" : "text-neutral-300"}>
              {formatMoney(selected.limit, Number.isInteger(selected.limit))} limit
            </span>
          </BarChartTooltip>
        )}
      </div>
      <div className="mt-2 flex gap-2 text-xs font-medium text-slate-600" aria-hidden="true">
        {months.map(({ label }, index) => (
          <span key={label} className={`flex-1 text-center ${index === months.length - 1 ? "font-semibold text-neutral-900" : ""}`}>{label.split(" ")[0]}</span>
        ))}
      </div>
    </section>
  );
}
