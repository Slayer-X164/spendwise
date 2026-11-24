"use client";

import {
  ArrowRight01Icon,
  Car01Icon,
  CreditCardIcon,
  Film01Icon,
  HistoryIcon,
  InformationCircleIcon,
  PreferenceHorizontalIcon,
  Restaurant01Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { useState } from "react";
import type { DashboardTransaction } from "@/types/dashboard/DashboardTypes";
import { formatMoney } from "../data";
import CardHeading, { CardIcon, cardClass, legendDotClass } from "./CardHeading";

const transactions: DashboardTransaction[] = [
  { merchant: "Daily Brew Coffee", category: "Food & Dining", amount: -6.5, method: "Visa •• 4821", date: "Today, 08:42 AM", status: "Completed" },
  { merchant: "RideGo", category: "Transport", amount: -18.2, method: "Visa •• 4821", date: "Today, 09:15 AM", status: "Completed" },
  { merchant: "Green Bowl Café", category: "Food & Dining", amount: -39.5, method: "Apple Pay", date: "Today, 01:05 PM", status: "Pending" },
  { merchant: "Metro Grocery", category: "Food & Dining", amount: -86.4, method: "Debit •• 1190", date: "Yesterday, 06:30 PM", status: "Completed" },
  { merchant: "Netflix", category: "Entertainment", amount: -15.49, method: "Visa •• 4821", date: "Yesterday, 12:00 AM", status: "Completed" },
];

const categoryStyles = {
  "Food & Dining": { icon: Restaurant01Icon, dotClass: "bg-[#1257ff]", iconClass: "bg-[#e7eeff] text-[#1257ff]" },
  Transport: { icon: Car01Icon, dotClass: "bg-[#121315]", iconClass: "bg-[#e8e9eb] text-[#121315]" },
  Entertainment: { icon: Film01Icon, dotClass: "bg-[#39404d]", iconClass: "bg-[#e6e7eb] text-[#39404d]" },
};

const popoverClass = "m-0 w-60 rounded-2xl border border-slate-200 bg-neutral-50 p-4 text-left text-sm text-neutral-900 shadow-xl [inset:auto] [right:anchor(right)] [top:calc(anchor(bottom)_+_0.5rem)] [position-try-fallbacks:flip-block,flip-inline,flip-block_flip-inline]";
const filterLabelClass = "mt-2.5 grid gap-1.5 [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-slate-300 [&>select]:p-1.5";
const cellItemClass = "flex items-center gap-2 whitespace-nowrap";
const controlIconClass = "size-4 shrink-0";

export default function Transactions() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const query = search.trim().toLowerCase();
  const visibleTransactions = transactions.filter((transaction) => {
    const searchableText = [transaction.merchant, transaction.category, transaction.method].join(" ").toLowerCase();
    return searchableText.includes(query) &&
      (!category || transaction.category === category) &&
      (!status || transaction.status === status);
  });

  return (
    <section className={`${cardClass} bg-neutral-50 pb-4 xl:pb-4`}>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 md:flex md:justify-between md:gap-2.5">
        <CardHeading icon={HistoryIcon}>Recent transactions</CardHeading>
        <div className="contents md:flex md:items-center md:gap-2 print:hidden">
          <label className="col-start-1 row-start-2 flex w-full min-w-0 items-center gap-2 rounded-full bg-slate-100 px-3 text-slate-500 focus-within:outline-2 focus-within:outline-blue-600 md:w-52 xl:w-60">
            <HugeiconsIcon icon={Search01Icon} aria-hidden="true" className={controlIconClass} />
            <input
              className="h-10 w-full min-w-0 bg-transparent text-base text-neutral-900 placeholder:text-slate-500 focus-visible:outline-none! md:text-sm"
              type="search"
              aria-label="Search transactions"
              placeholder="Search transactions"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="col-start-2 row-start-2 inline-grid size-10 shrink-0 cursor-pointer place-items-center justify-self-end rounded-full bg-slate-100 hover:bg-neutral-200 hover:text-blue-600 data-[filtered=true]:bg-blue-100 data-[filtered=true]:text-blue-600"
            aria-label="Filter transactions"
            data-filtered={Boolean(category || status)}
            popoverTarget="transaction-filters"
          >
            <HugeiconsIcon icon={PreferenceHorizontalIcon} aria-hidden="true" className="size-4" />
          </button>
          <div id="transaction-filters" popover="auto" className={popoverClass}>
            <strong>Filter transactions</strong>
            <label className={filterLabelClass}>
              Category
              <select value={category} onChange={(event) => setCategory(event.target.value)}>
                <option value="">All categories</option>
                {Object.keys(categoryStyles).map((label) => <option key={label}>{label}</option>)}
              </select>
            </label>
            <label className={filterLabelClass}>
              Status
              <select value={status} onChange={(event) => setStatus(event.target.value)}>
                <option value="">All statuses</option>
                <option>Completed</option>
                <option>Pending</option>
              </select>
            </label>
            <button type="button" className="mt-3 cursor-pointer font-semibold text-blue-600" onClick={() => { setCategory(""); setStatus(""); }}>Clear filters</button>
          </div>
          <Link
            href="/transactions"
            className="col-start-2 row-start-1 flex h-10 items-center gap-1 rounded-full px-1 text-xs font-semibold whitespace-nowrap text-blue-600 hover:bg-neutral-200 md:gap-2 md:bg-slate-100 md:px-3 md:text-sm md:text-inherit"
          >
            View all <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden="true" className={controlIconClass} />
          </Link>
        </div>
      </div>

      <div className="mt-3">
        <table
          className="w-full border-separate border-spacing-0 text-left text-sm print:text-xs
            [&_:is(th,td)]:px-1 [&_:is(th,td)]:py-2.5 lg:[&_:is(th,td)]:px-3"
          aria-label="Recent transactions"
        >
          <thead className="sr-only text-xs font-semibold tracking-wide text-slate-500 uppercase lg:not-sr-only print:not-sr-only">
            <tr>
              <th scope="col" className="lg:w-[26.3%]">Merchant</th>
              <th scope="col" className="hidden w-[16%] lg:table-cell print:table-cell">Category</th>
              <th scope="col" className="lg:w-[11.5%]">Amount</th>
              <th scope="col" className="hidden w-[15%] lg:table-cell print:table-cell">Method</th>
              <th scope="col" className="hidden w-[16%] lg:table-cell print:table-cell">Date</th>
              <th scope="col" className="hidden lg:table-cell print:table-cell">Status</th>
              <th scope="col" className="print:hidden"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody
            className="max-lg:[&>tr:not(:last-child)>*]:border-b max-lg:[&>tr:not(:last-child)>*]:border-slate-200
              lg:[&>tr:nth-child(even)>*]:bg-[#f4f5f8] lg:[&>tr>:first-child]:rounded-l-xl lg:[&>tr>:last-child]:rounded-r-xl"
          >
            {visibleTransactions.map((transaction) => <TransactionRow key={transaction.merchant} transaction={transaction} />)}
          </tbody>
        </table>
        {!visibleTransactions.length && <p className="px-2 py-4 text-slate-500" role="status">No transactions match your search and filters.</p>}
      </div>
    </section>
  );
}

function TransactionRow({ transaction }: { transaction: DashboardTransaction }) {
  const { merchant, category, amount, method, date, status } = transaction;
  const { icon, dotClass, iconClass } = categoryStyles[category];
  const popoverId = `transaction-${merchant.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <tr>
      <th scope="row">
        <span className="flex items-center gap-2 font-semibold">
          <CardIcon icon={icon} className={iconClass} size="size-9" />
          <span>
            <span className="block">{merchant}</span>
            <span className="block text-xs font-normal text-slate-500 lg:hidden print:hidden">
              {category} · {date.split(", ")[1] ?? date}
            </span>
          </span>
        </span>
      </th>
      <td className="hidden lg:table-cell print:table-cell">
        <span className={cellItemClass}><i className={`${legendDotClass} ${dotClass}`} />{category}</span>
      </td>
      <td className="text-right font-semibold whitespace-nowrap lg:text-left">
        {formatMoney(amount)}
        {status === "Pending" && (
          <span className="mt-1 block rounded-full bg-amber-100 px-2 py-0.5 text-center text-xs text-amber-800 lg:hidden print:hidden">
            {status}
          </span>
        )}
      </td>
      <td className="hidden lg:table-cell print:table-cell">
        <span className={cellItemClass}>
          <HugeiconsIcon icon={CreditCardIcon} aria-hidden="true" className={`${controlIconClass} text-slate-500`} />{method}
        </span>
      </td>
      <td className="hidden whitespace-nowrap text-slate-500 lg:table-cell print:table-cell">{date}</td>
      <td className="hidden lg:table-cell print:table-cell">
        <span
          className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-semibold whitespace-nowrap text-green-800 data-[pending=true]:bg-amber-100 data-[pending=true]:text-amber-800"
          data-pending={status === "Pending"}
        >
          {status}
        </span>
      </td>
      <td className="w-[1%] text-center print:hidden">
        <button
          type="button"
          className="inline-grid size-9 cursor-pointer place-items-center rounded-full text-slate-500 hover:bg-neutral-200 hover:text-blue-600 lg:size-7"
          aria-label={`Details for ${merchant}`}
          popoverTarget={popoverId}
        >
          <HugeiconsIcon icon={InformationCircleIcon} aria-hidden="true" className="size-4" />
        </button>
        <div className={popoverClass} id={popoverId} popover="auto">
          <strong>{merchant}</strong>
          <dl className="mt-2.5 grid gap-1.5 [&>div]:flex [&>div]:justify-between [&>div]:gap-2.5 [&_dt]:text-slate-500 [&_dd]:text-right">
            <div><dt>Category</dt><dd>{category}</dd></div>
            <div><dt>Amount</dt><dd>{formatMoney(amount)}</dd></div>
            <div><dt>Method</dt><dd>{method}</dd></div>
            <div><dt>Date</dt><dd>{date}</dd></div>
            <div><dt>Status</dt><dd>{status}</dd></div>
          </dl>
        </div>
      </td>
    </tr>
  );
}
