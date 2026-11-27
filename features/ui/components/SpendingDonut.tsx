import type { MouseEvent } from "react";
import { ChartTooltip } from "@/features/analytics/components/ChartTooltip";
import useChartSelection from "@/features/analytics/useChartSelection";
import { formatMoney } from "@/features/dashboard/data";

export default function SpendingDonut({
  total,
  categories,
  label,
  wholeTotal = false,
}: {
  total: number;
  categories: { name: string; color: string; amount: number }[];
  label: string;
  wholeTotal?: boolean;
}) {
  const { active, pointProps, setHovered, togglePin } = useChartSelection();
  const formatShare = (amount: number) => `${(amount / total * 100).toFixed(1)}%`;
  let offset = 0;
  const stops: string[] = [];
  const segmentEnds: number[] = [];
  for (const [index, { amount, color }] of categories.entries()) {
    const share = amount / total * 100;
    const beginning = offset;
    offset += share;
    const gap = Math.min(share / 3, 0.45);
    const fill = active === null || active === index
      ? color
      : `color-mix(in srgb, ${color} 40%, var(--color-neutral-50))`;
    stops.push(`${fill} ${beginning}% ${offset - gap}%, var(--color-neutral-50) ${offset - gap}% ${offset}%`);
    segmentEnds.push(offset);
  }
  const category = active === null ? null : categories[active];

  function segmentAtPointer({ currentTarget, clientX, clientY }: MouseEvent<HTMLDivElement>) {
    const bounds = currentTarget.getBoundingClientRect();
    const radius = bounds.width / 2;
    const x = clientX - bounds.left - radius;
    const y = clientY - bounds.top - radius;
    const distance = Math.hypot(x, y);
    if (distance < radius * 0.75 || distance > radius) return null;

    // The gradient starts at 12 o'clock and advances clockwise.
    const angle = (Math.atan2(x, -y) / (2 * Math.PI) + 1) % 1;
    const index = segmentEnds.findIndex((end) => angle * 100 < end);
    return index === -1 ? null : index;
  }

  return (
    <>
      <div
        className="relative mx-auto mt-1 grid size-40 cursor-pointer place-items-center rounded-full sm:size-44 xl:size-48"
        style={{ backgroundImage: `conic-gradient(${stops.join(", ")})` }}
        aria-hidden="true"
        onPointerMove={(event) => {
          if (event.pointerType !== "touch") setHovered(segmentAtPointer(event));
        }}
        onPointerLeave={() => setHovered(null)}
        onClick={(event) => {
          const index = segmentAtPointer(event);
          if (index !== null) togglePin(index);
        }}
      >
        <div className="flex size-3/4 cursor-default flex-col items-center justify-center rounded-full bg-neutral-50 px-2 text-center">
          <span className="text-xs font-medium text-slate-500">{label}</span>
          <strong className={`max-w-full leading-tight tracking-tight tabular-nums [overflow-wrap:anywhere] ${wholeTotal ? "text-2xl" : "text-lg sm:text-xl"}`}>{formatMoney(total, wholeTotal)}</strong>
        </div>
        {category && (
          <ChartTooltip label={category.name} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <strong className="tabular-nums">{formatMoney(category.amount)}</strong>
            <span className="text-neutral-300">{formatShare(category.amount)} of spending</span>
          </ChartTooltip>
        )}
      </div>
      <p className="sr-only">{label} spending {formatMoney(total)}</p>
      <ul className="mt-4 grid text-sm">
        {categories.map(({ name, color, amount }, index) => (
          <li key={name}>
            <button
              type="button"
              {...pointProps(index)}
              data-active={active === index}
              className="grid min-h-8 w-full cursor-pointer grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 rounded-lg px-2 text-left focus-visible:outline-2 focus-visible:outline-blue-600 data-[active=true]:bg-blue-50 sm:gap-3"
            >
              <span className="flex items-center gap-2 font-medium leading-tight">
                <i className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                {name}
              </span>
              <span className="text-right text-xs tabular-nums text-slate-500">{formatShare(amount)}</span>
              <strong className="min-w-17 text-right tabular-nums">{formatMoney(amount)}</strong>
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
