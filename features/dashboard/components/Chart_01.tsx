"use client";

import { ChartColumnIcon } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { cashflow2026, formatMoney } from "../data";
import CardHeading, { cardClass, cardTopClass, legendDotClass } from "./CardHeading";
import SelectPill from "./SelectPill";

const year = 2026;
const latestMonth = cashflow2026[cashflow2026.length - 1];
const maximumIncome = Math.max(...cashflow2026.map(({ income }) => income));
const tooltipRowClass = "flex items-center justify-between gap-2";
const columnClass = "w-2/5 max-w-7 rounded-t-xl rounded-b-lg";
const ranges = [
  { value: 3, label: "3 MONTHS" },
  { value: 6, label: "6 MONTHS" },
];

export default function CashflowChart() {
  const [range, setRange] = useState(6);
  const [selected, setSelected] = useState(latestMonth);
  const [hovered, setHovered] = useState<typeof latestMonth | null>(null);
  const [showMonthDetails, setShowMonthDetails] = useState(false);
  const active = hovered ?? selected;
  const visibleMonths = cashflow2026.slice(-range);

  return (
    <section id="cashflow" className={`${cardClass} flex flex-col bg-neutral-50 xl:min-h-80`}>
      <div className={`${cardTopClass} max-lg:flex-col max-lg:items-start`}>
        <CardHeading icon={ChartColumnIcon}>Cashflow</CardHeading>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 max-lg:w-full max-lg:justify-between xl:flex-nowrap">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><i className={`${legendDotClass} bg-[#1257ff]`} />Income</span>
            <span className="flex items-center gap-1.5"><i className={`${legendDotClass} bg-neutral-800`} />Expense</span>
          </div>
          <div className="flex items-center gap-2">
            <SelectPill label="Cashflow year" defaultValue={year} options={[{ value: year, label: String(year) }]} />
            <SelectPill
              label="Cashflow range"
              value={range}
              options={ranges}
              onChange={(months) => {
                setRange(months);
                setSelected(latestMonth);
                setHovered(null);
                setShowMonthDetails(false);
              }}
            />
          </div>
        </div>
      </div>

      <div
        className="mt-4 flex flex-1 items-end justify-around gap-2 pb-1 xl:mt-auto xl:min-h-48"
        onMouseLeave={() => setHovered(null)}
      >
        {visibleMonths.map((entry) => {
          const { month, income, expense } = entry;
          return (
            <div className="group relative grid min-w-0 flex-1 justify-items-center" key={month} data-active={active === entry}>
              <button
                type="button"
                className="grid w-full cursor-pointer justify-items-center rounded-xl pt-1 font-semibold text-slate-500 group-data-[active=true]:text-neutral-900"
                aria-label={`${month} ${year}, income ${formatMoney(income)}, expense ${formatMoney(expense)}`}
                aria-pressed={selected === entry}
                onMouseEnter={() => setHovered(entry)}
                onFocus={() => setHovered(entry)}
                onBlur={() => setHovered(null)}
                onClick={() => {
                  setSelected(entry);
                  setShowMonthDetails(true);
                }}
              >
                <span
                  className="flex h-28 w-full items-end justify-center gap-1 xl:h-32"
                  aria-hidden="true"
                >
                  <i className={`${columnClass} bg-[#d3dffc] group-data-[active=true]:bg-[#1257ff]`} style={{ height: `${income / maximumIncome * 100}%` }} />
                  <i className={`${columnClass} bg-[#dcdfe6] group-data-[active=true]:bg-neutral-800`} style={{ height: `${expense / maximumIncome * 100}%` }} />
                </span>
                <span className="pt-2 text-xs">{month}</span>
              </button>

              {active === entry && (
                <div
                  className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden w-36 -translate-x-1/2 gap-1 xl:grid
                    rounded-xl bg-neutral-800 px-3 py-2 text-xs text-white shadow-xl
                    group-first:left-0 group-first:translate-x-0 group-last:right-0 group-last:left-auto group-last:translate-x-0"
                  aria-hidden="true"
                >
                  <p className="font-semibold text-neutral-300">{month} {year}</p>
                  <div className={tooltipRowClass}>
                    <span className={tooltipRowClass}><i className={`${legendDotClass} bg-[#5788ff]`} />Income</span>
                    <strong>{formatMoney(income, true)}</strong>
                  </div>
                  <div className={tooltipRowClass}>
                    <span className={tooltipRowClass}><i className={`${legendDotClass} bg-neutral-50`} />Expense</span>
                    <strong>{formatMoney(expense, true)}</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showMonthDetails && (
        <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 rounded-xl bg-slate-100 px-3 py-2 text-xs xl:hidden" role="status">
          <strong>{selected.month} {year}</strong>
          <span>Income {formatMoney(selected.income, true)}</span>
          <span>Expense {formatMoney(selected.expense, true)}</span>
        </p>
      )}
    </section>
  );
}
