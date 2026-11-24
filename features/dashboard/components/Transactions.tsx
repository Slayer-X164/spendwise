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
import CardHeading, { CardIcon, cardClass, cardTopClass, legendDotClass } from "./CardHeading";

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
      <div className={cardTopClass}>
        <CardHeading icon={HistoryIcon}>Recent transactions</CardHeading>
        <div className="flex items-center gap-2 print:hidden">
          <label className="flex w-52 items-center gap-2 rounded-full bg-slate-100 px-3 text-slate-500 focus-within:outline-2 focus-within:outline-blue-600 xl:w-60">
            <HugeiconsIcon icon={Search01Icon} aria-hidden="true" className={controlIconClass} />
            <input
              className="h-10 w-full min-w-0 bg-transparent text-neutral-900 placeholder:text-slate-500 focus-visible:outline-none!"
              type="search"
              aria-label="Search transactions"
              placeholder="Search transactions"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>
          <button
            type="button"
            className="inline-grid size-10 shrink-0 cursor-pointer place-items-center rounded-full bg-slate-100 hover:bg-neutral-200 hover:text-blue-600 data-[filtered=true]:bg-blue-100 data-[filtered=true]:text-blue-600"
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
            className="flex h-10 items-center gap-2 rounded-full bg-slate-100 px-3 font-semibold whitespace-nowrap hover:bg-neutral-200"
          >
            View all <HugeiconsIcon icon={ArrowRight01Icon} aria-hidden="true" className={controlIconClass} />
          </Link>
        </div>
      </div>

      <div className="mt-3">
        <table
          className="w-full border-separate border-spacing-0 text-left text-sm print:text-xs
            [&_:is(th,td)]:px-3 [&_:is(th,td)]:py-2.5"
          aria-label="Recent transactions"
        >
          <thead className="text-xs font-semibold tracking-wide text-slate-500 uppercase">
            <tr>
              <th scope="col" className="w-[26.3%]">Merchant</th>
              <th scope="col" className="w-[16%]">Category</th>
              <th scope="col" className="w-[11.5%]">Amount</th>
              <th scope="col" className="w-[15%]">Method</th>
              <th scope="col" className="w-[16%]">Date</th>
              <th scope="col">Status</th>
              <th scope="col" className="print:hidden"><span className="sr-only">Details</span></th>
            </tr>
          </thead>
          <tbody
            className="[&>tr:nth-child(even)>*]:bg-[#f4f5f8] [&>tr>:first-child]:rounded-l-xl [&>tr>:last-child]:rounded-r-xl"
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
          {merchant}
        </span>
      </th>
      <td><span className={cellItemClass}><i className={`${legendDotClass} ${dotClass}`} />{category}</span></td>
      <td className="font-semibold whitespace-nowrap">{formatMoney(amount)}</td>
      <td>
        <span className={cellItemClass}>
          <HugeiconsIcon icon={CreditCardIcon} aria-hidden="true" className={`${controlIconClass} text-slate-500`} />{method}
        </span>
      </td>
      <td className="whitespace-nowrap text-slate-500">{date}</td>
      <td>
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
          className="inline-grid size-7 cursor-pointer place-items-center rounded-full text-slate-500 hover:bg-neutral-200 hover:text-blue-600"
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
