import { Target01Icon } from "@hugeicons/core-free-icons";
import type { CSSProperties } from "react";
import { cashflow2026, formatMoney, monthlyBudget } from "../data";
import CardHeading, { cardClass, cardTopClass } from "./CardHeading";

const safeToSpend = 81.71;
const spent = 64.2;
const progress = spent / safeToSpend;
const novemberExpense = cashflow2026[cashflow2026.length - 1].expense;
const gaugeCapClass = "absolute top-1/2 aspect-square w-(--gauge-stroke) -translate-y-1/2 rounded-full";

export default function TodayChart() {
  return (
    <section id="today" className={`${cardClass} flex min-h-80 flex-col bg-neutral-50`}>
      <div className={cardTopClass}>
        <CardHeading icon={Target01Icon}>Today</CardHeading>
        <time
          className="rounded-full bg-slate-100 px-3 py-2 font-medium whitespace-nowrap"
          dateTime="2026-11-23"
        >
          Mon, Nov 23
        </time>
      </div>

      <div
        className="mt-4 flex flex-1 flex-col justify-between gap-2 rounded-2xl bg-neutral-800 px-4 pt-4 pb-3 text-white"
      >
        <div className="flex justify-between gap-1.5 text-neutral-300">
          <span>Safe to spend today</span><strong>{formatMoney(safeToSpend)}</strong>
        </div>
        <div
          className="relative mt-auto aspect-[1.72] w-5/6 max-w-86 self-center @container [--gauge-stroke:9.5cqi]"
          style={{ "--gauge-angle": `${progress * 180}deg` } as CSSProperties}
        >
          <div className="absolute inset-x-0 top-0 aspect-square" aria-hidden="true">
            <i
              className="absolute inset-0 rounded-full
                [background:conic-gradient(from_270deg,#1257ff_var(--gauge-angle),#2b2d33_var(--gauge-angle)_180deg,transparent_180deg)]
                [mask-image:radial-gradient(farthest-side,transparent_calc(100%_-_var(--gauge-stroke)),#000_calc(100%_-_var(--gauge-stroke)_+_0.5px))]"
            />
            <i className={`${gaugeCapClass} left-0 bg-[#1257ff]`} />
            <i className={`${gaugeCapClass} right-0 bg-[#2b2d33]`} />
            <i className="absolute inset-0 rotate-(--gauge-angle)">
              <span className={`${gaugeCapClass} left-0 bg-[#1257ff] after:absolute after:inset-1/4 after:rounded-full after:bg-neutral-50`} />
            </i>
          </div>
          <div className="absolute inset-x-0 bottom-0 grid justify-items-center text-neutral-300">
            <span>Spent</span>
            <strong className="text-3xl leading-none font-bold tracking-tight text-white">
              {formatMoney(spent)}
            </strong>
          </div>
        </div>
      </div>

      <dl
        className="mt-3 flex justify-between gap-1.5
          [&_dt]:text-sm [&_dt]:whitespace-nowrap [&_dt]:text-slate-500
          [&_dd]:text-lg [&_dd]:font-semibold [&_dd]:tracking-tight [&_dd]:whitespace-nowrap"
      >
        <div><dt>Left today</dt><dd>{formatMoney(safeToSpend - spent)}</dd></div>
        <div><dt>Streak</dt><dd><span aria-hidden="true">🔥 </span>12 days</dd></div>
        <div><dt>Left in Nov</dt><dd>{formatMoney(monthlyBudget - novemberExpense)}</dd></div>
      </dl>
    </section>
  );
}
