
import {
  Search01Icon,
  ArrowDown01Icon,
  Download04Icon,
  Add01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function TransactionsTable() {
  const expenses = [
    { id: 1, name: "Adidas Ultraboost 4.0", price: 35, pay: "Cash", category: "Shopping", time: "Today" },
    { id: 2, name: "iPhone 15 Pro Max 256GB", price: 999, pay: "Credit", category: "Electronics", time: "Yesterday" },
    { id: 3, name: "MacBook Pro 14 M2 - 16GB", price: 1999, pay: "Credit", category: "Electronics", time: "03/11/2026" },
    { id: 4, name: "Lunch", price: 6.48, pay: "Bank", category: "Food", time: "02/11/2026" },
    { id: 5, name: "Angular Courses", price: 60.48, pay: "Debit", category: "Education", time: "01/11/2026" },
    { id: 6, name: "Netflix Subscription", price: 15.99, pay: "Credit", category: "Entertainment", time: "30/10/2026" },
    { id: 7, name: "Petrol", price: 12.5, pay: "UPI", category: "Transportation", time: "29/10/2026" },
    { id: 8, name: "Grocery Shopping", price: 85.75, pay: "UPI", category: "Groceries", time: "28/10/2026" },
  ];

  const categoryColors: Record<string, string> = {
    Shopping: "bg-pink-500",
    Electronics: "bg-sky-500",
    Food: "bg-orange-500",
    Education: "bg-violet-500",
    Entertainment: "bg-fuchsia-500",
    Transportation: "bg-purple-500",
    Groceries: "bg-emerald-500",
  };

  const buttonStyle =
    "h-9 px-3 flex items-center justify-center gap-2 rounded-lg border border-neutral-200 bg-neutral-50 text-neutral-600 text-xs font-medium hover:bg-neutral-200 transition-colors whitespace-nowrap";

  return (
    <div className="w-full min-w-0 rounded-xl border border-neutral-200 bg-neutral-50 ">

      {/* Toolbar */}
      <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4 border-b border-neutral-200">

        {/* Search */}
          <div className="h-9 py-3 flex items-center gap-2 px-3 rounded-lg border border-neutral-200 bg-neutral-50 flex-1 sm:flex-none sm:w-48">
            <HugeiconsIcon
              icon={Search01Icon}
              size={16}
              className="text-neutral-400 shrink-0"
            />
            <input
              placeholder="Search by name"
              className="w-full min-w-0 text-xs outline-none placeholder:text-neutral-400 text-neutral-700"
            />
          </div>

        <div className="flex flex-wrap items-center gap-2">



          {/* Category Filter */}
          <div className="relative">
            <select className={`${buttonStyle} appearance-none pr-8 cursor-pointer`}>
              <option>All categories</option>
              <option>Shopping</option>
              <option>Electronics</option>
              <option>Food</option>
              <option>Education</option>
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
            />
          </div>

          {/* Mode Filter */}
          <div className="relative">
            <select className={`${buttonStyle} appearance-none pr-8 cursor-pointer`}>
              <option>All modes</option>
              <option>Cash</option>
              <option>Credit</option>
              <option>Debit</option>
              <option>UPI</option>
              <option>Bank</option>
            </select>
            <HugeiconsIcon
              icon={ArrowDown01Icon}
              size={14}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"
            />
          </div>

          {/* Export */}
          <button className={buttonStyle}>
            <HugeiconsIcon icon={Download04Icon} size={15} />
            Export CSV
          </button>

          {/* Add Transaction */}
          <button className="h-9 px-3 flex items-center justify-center gap-2 rounded-lg bg-blue-600 hover:bg-neutral-700 text-white text-xs font-medium transition-colors whitespace-nowrap">
            <HugeiconsIcon icon={Add01Icon} size={16} />
            Add transaction
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[750px] text-sm">

          <thead className="bg-neutral-50/70">
            <tr className="text-left text-xs text-neutral-500 border-b border-neutral-200">
              <th className="font-medium px-4 py-3 w-[7%]">S.N</th>
              <th className="font-medium px-4 py-3 w-[29%]">Name</th>
              <th className="font-medium px-4 py-3 w-[12%]">Price</th>
              <th className="font-medium px-4 py-3 w-[12%]">Mode</th>
              <th className="font-medium px-4 py-3 w-[20%]">Category</th>
              <th className="font-medium px-4 py-3 w-[15%]">
                <div className="flex items-center gap-1">
                  Time
                  <span className="text-blue-600">↓</span>
                </div>
              </th>
              <th className="px-4 py-3 w-[5%]"></th>
            </tr>
          </thead>

          <tbody>
            {expenses.map((item, index) => (
              <tr
                key={item.id}
                className="border-b border-neutral-100 last:border-0 hover:bg-neutral-200/40 transition-colors"
              >
                <td className="px-4 py-4 text-neutral-500 text-xs tabular-nums">
                  {index + 1}
                </td>

                <td className="px-4 py-4 font-medium text-neutral-800 text-xs">
                  {item.name}
                </td>

                <td className="px-4 py-4 text-neutral-800 font-medium text-xs whitespace-nowrap tabular-nums">
                  ₹{item.price.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>

                <td className="px-4 py-4 text-neutral-600 text-xs">
                  {item.pay}
                </td>

                <td className="px-4 py-4">
                  <div className="flex items-center gap-2 text-xs text-neutral-700 whitespace-nowrap">
                    <span
                      className={`size-2 rounded-full shrink-0 ${
                        categoryColors[item.category] || "bg-neutral-400"
                      }`}
                    />
                    {item.category}
                  </div>
                </td>

                <td className="px-4 py-4 text-neutral-600 text-xs whitespace-nowrap">
                  {item.time}
                </td>

                <td className="px-4 py-4">
                  <button className="size-8 flex items-center justify-center rounded-md text-neutral-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                    <HugeiconsIcon icon={Delete02Icon} size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-neutral-200">

        <p className="text-xs text-neutral-500">
          Showing 1–8 of 14
        </p>

        <div className="flex items-center gap-1">
          <button className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500">
            ‹
          </button>

          <button className="size-8 rounded-lg text-xs font-medium bg-blue-600 text-white shadow-sm shadow-blue-600/20">
            1
          </button>

          <button className="size-8 rounded-lg text-xs font-medium border border-neutral-200 text-neutral-600 hover:bg-neutral-200">
            2
          </button>

          <button className="size-8 rounded-lg border border-neutral-200 flex items-center justify-center text-neutral-500">
            ›
          </button>
        </div>
      </div>
    </div>
  );
}
