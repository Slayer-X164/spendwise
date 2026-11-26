import type { ReactNode } from "react";

export function ChartTooltip({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none z-20 grid w-max max-w-36 gap-0.5 rounded-xl bg-neutral-800 px-3 py-2 text-xs text-white shadow-lg ${className}`}
    >
      <span className="font-medium text-neutral-300">{label}</span>
      {children}
    </div>
  );
}

export function BarChartTooltip({
  label,
  children,
  position,
  height,
}: {
  label: string;
  children: ReactNode;
  position: number;
  height: number;
}) {
  const horizontal = position < 30 ? "left-0" : position > 70 ? "right-0" : "left-0 -translate-x-1/2";
  const vertical = height > 55 ? "top-2" : "bottom-2";

  return (
    <div className="pointer-events-none absolute z-20" style={{ left: `${position}%`, bottom: `${height}%` }}>
      <ChartTooltip label={label} className={`absolute ${horizontal} ${vertical}`}>
        {children}
      </ChartTooltip>
    </div>
  );
}
