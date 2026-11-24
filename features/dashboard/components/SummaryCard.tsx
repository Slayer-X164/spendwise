"use client";

import {
  ArrowDown02Icon,
  ArrowReloadHorizontalIcon,
  ArrowUp02Icon,
  PlusSignIcon,
  TradeDownIcon,
  TradeUpIcon,
  ViewIcon,
  ViewOffIcon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import AddTransactionDialog from "@/features/transactionsAndSubscriptions/components/AddTransactionDialog";
import { cashflow2026, dashboardCurrency, formatMoney, monthlyBudget } from "../data";
import CardHeading, { cardClass, cardTopClass, legendDotClass } from "./CardHeading";
import SelectPill from "./SelectPill";

const accounts = [
  { label: "All accounts", balance: 12480.5, gain: 8.2 },
  { label: "Checking", balance: 4800.5, gain: 4.1 },
  { label: "Savings", balance: 7680, gain: 10.9 },
];

const months = cashflow2026.slice(-2);

const categories = [
  { label: "Food & Dining", shortLabel: "Food", share: [27, 29], color: "#1257ff" },
  { label: "Shopping", shortLabel: "Shopping", share: [23, 22], color: "#6e99f8" },
  { label: "Bills", shortLabel: "Bills", share: [18, 18], color: "#9199ab" },
  { label: "Transport", share: [11, 12], color: "#121315" },
  { label: "Entertainment", share: [8, 7], color: "#b3caf9" },
  { label: "Health", share: [7, 7], color: "#39404d" },
  { label: "Other", share: [6, 5], color: "#cfd4de" },
];

const balanceTiles = [
  { count: 1, color: "bg-[#d3e0fc]" },
  { count: 1, color: "bg-[#d3e0fc]" },
  { count: 2, color: "bg-[#b4cbfb]" },
  { count: 3, color: "bg-[#90b0ff]" },
  { count: 4, color: "bg-[#4d80fb]" },
  { count: 5, color: "bg-[#1257ff]" },
];

const summaryClass = `${cardClass} flex min-h-60 flex-col xl:min-h-64`;
const amountClass = "leading-none font-bold tracking-tight whitespace-nowrap tabular-nums";
const balanceAmountSize = "text-4xl xl:text-5xl ";
const valueRowClass = "flex items-center gap-2 ";
const trendClass = "flex w-fit shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap [&>svg]:size-3.5";
const actionClass = "flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2 py-1.5 text-sm font-semibold whitespace-nowrap disabled:cursor-not-allowed [&>svg]:size-4 [&>svg]:shrink-0";

function Amount({ amount, balance = false }: { amount: number; balance?: boolean }) {
  const [integer, fraction] = formatMoney(amount).split(".");

  return (
    <span className={`${amountClass} ${balance ? balanceAmountSize :"text-4xl"}`}>
      {integer}<small className="text-xl font-semibold tracking-tight text-neutral-600">.{fraction}</small>
    </span>
  );
}

function TotalBalance() {
  const [visible, setVisible] = useState(true);
  const [accountIndex, setAccountIndex] = useState(0);
  const { balance, gain } = accounts[accountIndex];

  return (
    <section className={`${summaryClass} bg-neutral-50 border border-neutral-300   pb-4 xl:pb-4 print:col-span-2`}>
      <div className={cardTopClass}>
        <CardHeading icon={Wallet01Icon}>Total balance</CardHeading>
        <div className="flex items-center gap-2">
          <SelectPill aria-label="Balance currency">
            <option value={dashboardCurrency}>🇮🇳 {dashboardCurrency}</option>
          </SelectPill>
          <SelectPill
            aria-label="Balance account"
            value={accountIndex}
            onChange={(event) => setAccountIndex(Number(event.target.value))}
          >
            {accounts.map(({ label }, index) => <option key={label} value={index}>{label}</option>)}
          </SelectPill>
        </div>
      </div>

      <div className="relative my-1.5 grid flex-1 content-center gap-3 xl:gap-4">
        <div className={valueRowClass}>
          {visible ? <Amount amount={balance} balance /> : (
            <span className={`${amountClass} ${balanceAmountSize}`} aria-label="Balance hidden">••••••</span>
          )}
          <button
            className="inline-grid size-9 shrink-0 cursor-pointer place-items-center rounded-full bg-slate-100 hover:bg-neutral-200 hover:text-blue-600"
            type="button"
            aria-label={visible ? "Hide balance" : "Show balance"}
            onClick={() => setVisible(!visible)}
          >
            <HugeiconsIcon icon={visible ? ViewIcon : ViewOffIcon} aria-hidden="true" className="size-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <span className={`${trendClass} bg-green-100 text-green-800`}>
            <HugeiconsIcon icon={ArrowUp02Icon} aria-hidden="true" /> {gain}%
          </span>
          <span>Balance up this month, great progress.</span>
        </div>
        <div className="pointer-events-none absolute right-0 bottom-2 flex items-end gap-0.5" aria-hidden="true">
          {balanceTiles.map(({ count, color }, column) => (
            <div key={column} className="grid gap-0.5">
              {Array.from({ length: count }, (_, tile) => (
                <i key={tile} className={`size-2.5 rounded-sm ${color}`} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2 print:hidden">
        <AddTransactionDialog className={`${actionClass} bg-[#1257ff] text-white shadow-lg shadow-blue-600/38 hover:bg-blue-700 `}>
          <HugeiconsIcon icon={PlusSignIcon} aria-hidden="true" /> Add Expense
        </AddTransactionDialog>
        <button type="button" className={`${actionClass} bg-neutral-800 text-white`} disabled title="Income entry is unavailable">
          <HugeiconsIcon icon={ArrowDown02Icon} aria-hidden="true" /> Add Income
        </button>
        <button type="button" className={`${actionClass} bg-slate-100`} disabled title="Transfers are unavailable">
          <HugeiconsIcon icon={ArrowReloadHorizontalIcon} aria-hidden="true" /> Transfer
        </button>
      </div>
    </section>
  );
}

function MonthlySummary({ type }: { type: "income" | "expense" }) {
  const [monthIndex, setMonthIndex] = useState(months.length - 1);
  const month = months[monthIndex];
  const previous = cashflow2026[cashflow2026.indexOf(month) - 1][type];
  const amount = month[type];
  const difference = amount - previous;
  const income = type === "income";
  const trendIsPositive = income ? difference >= 0 : difference <= 0;
  const growth = (Math.abs(difference / previous) * 100).toFixed(1);
  const salary = monthIndex === 1 ? 4350 : 4000;

  return (
    <section className={`${summaryClass} bg-neutral-50 border border-neutral-300 `} id={income ? undefined : "expense"}>
      <div className={cardTopClass}>
        <CardHeading
          icon={income ? ArrowDown02Icon : ArrowUp02Icon}
          tone={income ? "blue" : "dark"}
        >
          {income ? "Income" : "Expense"}
        </CardHeading>
        <SelectPill
          tone="white"
          aria-label={income ? "Income month" : "Expense month"}
          value={monthIndex}
          onChange={(event) => setMonthIndex(Number(event.target.value))}
        >
          {months.map(({ month }, index) => <option key={month} value={index}>{month} 2026</option>)}
        </SelectPill>
      </div>

      <div className={`${valueRowClass} mt-5`}>
        <Amount amount={amount} />
        <span className={`${trendClass} bg-neutral-50 ${trendIsPositive ? "text-green-800" : "text-red-800"}`}>
          <HugeiconsIcon icon={difference >= 0 ? TradeUpIcon : TradeDownIcon} aria-hidden="true" />
          {difference >= 0 ? "+" : "−"}{formatMoney(Math.abs(difference), true)}
        </span>
      </div>

      {income ? (
        <>
          <p className="mt-4 w-fit rounded-full bg-neutral-50 px-3 py-2">
            Income {difference >= 0 ? "grew" : "fell"} <strong>{growth}%</strong> from last month.
          </p>
          <dl
            className="mt-4 flex gap-6
              [&>div]:border-l-2 [&>div]:pl-2.5
              [&_dt]:text-slate-500 [&_dd]:text-lg [&_dd]:font-semibold [&_dd]:tracking-tight"
          >
            <div className="border-[#1257ff]"><dt>Salary</dt><dd>{formatMoney(salary, true)}</dd></div>
            <div><dt>Freelance</dt><dd>{formatMoney(amount - salary, true)}</dd></div>
          </dl>
        </>
      ) : (
        <>
          <p className="mt-4 text-slate-500">
            vs last month · {Math.round(amount / monthlyBudget * 100)}% of {formatMoney(monthlyBudget, true)} budget
          </p>
          <div className="mt-3 flex h-3 gap-0.5 overflow-hidden rounded-full" aria-label="Expense breakdown">
            {categories.map(({ label, share, color }) => (
              <span
                key={label}
                className="basis-0"
                style={{ flexGrow: share[monthIndex], backgroundColor: color }}
                title={`${label} ${share[monthIndex]}%`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex justify-between gap-1 text-xs font-semibold">
            {categories.slice(0, 3).map(({ label, shortLabel, share }) => (
              <span key={label}>{shortLabel} {share[monthIndex]}%</span>
            ))}
            <span className="text-slate-500" title={categories.slice(3).map(({ label, share }) => `${label} ${share[monthIndex]}%`).join(", ")}>+4 more</span>
          </div>
          <div className="mt-3 flex items-center gap-3">
            {categories.slice(0, 3).map(({ label, color }) => (
              <span key={label} className="flex items-center gap-1.5">
                <i className={legendDotClass} style={{ backgroundColor: color }} />{label}
              </span>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default function SummaryCards() {
  return (
    <div className="grid grid-cols-[1.25fr_1fr_1fr] gap-4 print:grid-cols-2">
      <TotalBalance />
      <MonthlySummary type="income" />
      <MonthlySummary type="expense" />
    </div>
  );
}
