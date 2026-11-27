import { TradeUpIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useId } from "react";
import { BarChartTooltip } from "@/features/analytics/components/ChartTooltip";
import useChartSelection from "@/features/analytics/useChartSelection";
import CardHeading, { cardClass, legendDotClass } from "@/features/dashboard/components/CardHeading";
import { dashboardCurrency } from "@/features/dashboard/data";
import { formatGoalDate, money, type getSavingsHistory } from "../data";

const axisMoney = new Intl.NumberFormat("en", { style: "currency", currency: dashboardCurrency, notation: "compact", maximumFractionDigits: 1 });

export default function SavingsGrowth({ history }: { history: ReturnType<typeof getSavingsHistory> }) {
  const { active, pointProps } = useChartSelection();
  const fillId = useId();
  const { points, currentSavings, thisMonth } = history;
  const current = points.findLastIndex(({ projected }) => !projected);
  const last = points[points.length - 1];
  const max = Math.max(400, ...points.map(({ amount }) => amount));
  const magnitude = 10 ** Math.floor(Math.log10(max / 4));
  const step = Math.ceil(max / 4 / magnitude) * magnitude;
  const scale = step * 4;
  const bottom = (amount: number) => 4 + amount / scale * 92;
  const x = (index: number) => (index + 0.5) / points.length * 100;
  const coordinates = points.map(({ amount }, index) => `${x(index)},${100 - bottom(amount)}`);
  const actual = coordinates.slice(0, current + 1).join(" ");
  const projected = coordinates.slice(current).join(" ");
  const selected = active === null ? null : points[active];

  return (
    <section aria-label="Savings growth" className={`${cardClass} grid min-w-0 gap-4 bg-neutral-50`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardHeading icon={TradeUpIcon}>Savings growth</CardHeading>
        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-slate-600">
          <span className="flex items-center gap-1.5"><i aria-hidden="true" className={`${legendDotClass} bg-[#1257ff]`} />Actual</span>
          <span className="flex items-center gap-1.5"><i aria-hidden="true" className="w-3 border-t-2 border-dashed border-blue-500" />Projected</span>
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-center gap-2">
          <strong className="text-2xl leading-tight font-bold tracking-tight tabular-nums sm:text-3xl">{money(currentSavings)}</strong>
          {thisMonth > 0 && (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-800">
              <HugeiconsIcon icon={TradeUpIcon} className="size-3.5" aria-hidden="true" />
              +{money(thisMonth)} this month
            </span>
          )}
        </div>
        <p className="mt-1 text-xs text-slate-600 sm:text-sm">Projected to reach {money(last.amount)} by {formatGoalDate(last.date, "month")} at your planned contribution rate.</p>
      </div>

      <div>
        <div className="relative ml-9 h-36 sm:ml-12 sm:h-44 xl:h-52">
          {[0, 1, 2, 3, 4].map((tick) => (
            <div key={tick} className="pointer-events-none absolute inset-x-0 border-t border-slate-200" style={{ bottom: `${bottom(tick * step)}%` }} aria-hidden="true">
              <span className="absolute top-0 right-full mr-1.5 -translate-y-1/2 whitespace-nowrap text-[10px] text-slate-500 sm:mr-2 sm:text-xs">{axisMoney.format(tick * step / 100)}</span>
            </div>
          ))}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none absolute inset-0 size-full" aria-hidden="true">
            <defs>
              <linearGradient id={fillId} x1="0" x2="0" y1="0" y2="1" gradientUnits="objectBoundingBox">
                <stop stopColor="#1257ff" stopOpacity=".2" />
                <stop offset="100%" stopColor="#1257ff" stopOpacity=".02" />
              </linearGradient>
            </defs>
            <polygon points={`${x(0)},96 ${actual} ${x(current)},96`} fill={`url(#${fillId})`} />
            <polyline points={actual} fill="none" stroke="#1257ff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
            <polyline points={projected} fill="none" stroke="#6693fa" strokeWidth="2.5" strokeDasharray="3 5" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </svg>
          <div className="absolute inset-0 grid grid-cols-9">
            {points.map(({ date, amount, projected }, index) => (
              <button
                key={date}
                type="button"
                {...pointProps(index)}
                aria-label={`${formatGoalDate(date, "month")}, ${money(amount)} ${projected ? "projected" : "saved"}`}
                className="relative min-w-0 cursor-pointer rounded-md focus-visible:outline-2 focus-visible:outline-blue-600"
              >
                {(active === index || index === current || index === points.length - 1) && (
                  <span
                    className={`absolute left-1/2 size-3 -translate-x-1/2 translate-y-1/2 rounded-full border-2 bg-neutral-50 sm:size-3.5 ${projected ? "border-blue-400" : "border-blue-600"}`}
                    style={{ bottom: `${bottom(amount)}%` }}
                    aria-hidden="true"
                  />
                )}
              </button>
            ))}
          </div>
          {selected && active !== null && (
            <BarChartTooltip label={formatGoalDate(selected.date, "month")} position={x(active)} height={bottom(selected.amount)}>
              <strong className="tabular-nums">{money(selected.amount)} {selected.projected ? "projected" : "saved"}</strong>
            </BarChartTooltip>
          )}
        </div>
        <div className="mt-1 grid grid-cols-9 pl-9 text-center text-[10px] font-medium text-slate-600 sm:pl-12 sm:text-xs" aria-hidden="true">
          {points.map(({ date }, index) => (
            <span key={date} className={`${index % 2 ? "invisible sm:visible" : ""} ${index === current ? "text-neutral-900" : ""}`}>
              {formatGoalDate(date, "month").split(" ")[0]}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
