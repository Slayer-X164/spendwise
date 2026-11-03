import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Transactions() {
  return (
    <div className="w-full min-w-0 h-full flex flex-col lg:flex-row items-stretch gap-3">
      <ExpensesList />
      <SubscriptionsList />
    </div>
  );
}

function ExpensesList() {
  const expenses = [
    {
      id: 1,
      name: "Adidas Ultraboost 4.0",
      price: 35.0,
      pay: "Cash",
      category: "Shopping",
      time: "Today",
    },
    {
      id: 2,
      name: "iPhone 15 Pro Max 256GB",
      price: 999.0,
      pay: "Credit",
      category: "Electronics",
      time: "Yesterday",
    },
    {
      id: 3,
      name: "MacBook Pro 14 M2 - 16GB",
      price: 1999.0,
      pay: "Credit",
      category: "Electronics",
      time: "26/08/2026",
    },
    {
      id: 4,
      name: "Lunch",
      price: 6.48,
      pay: "Bank",
      category: "Food",
      time: "04/08/2026",
    },
    {
      id: 5,
      name: "Angular Courses",
      price: 60.48,
      pay: "Debit",
      category: "Education",
      time: "15/08/2026",
    },
    {
      id: 6,
      name: "Netflix Subscription",
      price: 15.99,
      pay: "Credit",
      category: "Entertainment",
      time: "02/11/2026",
    },
    {
      id: 7,
      name: "Petrol",
      price: 12.5,
      pay: "UPI",
      category: "Transportation",
      time: "01/11/2026",
    },
    {
      id: 8,
      name: "Grocery Shopping",
      price: 85.75,
      pay: "UPI",
      category: "Groceries",
      time: "31/10/2026",
    },
    {
      id: 9,
      name: "Electricity Bill",
      price: 42.0,
      pay: "Bank",
      category: "Utilities",
      time: "29/10/2026",
    },
    {
      id: 10,
      name: "Gym Membership",
      price: 29.99,
      pay: "Debit",
      category: "Health & Fitness",
      time: "28/10/2026",
    },
  ];

  return (
    <div className="w-full lg:flex-3 min-w-0 h-full bg-neutral-50 border border-neutral-300/70 rounded-xl p-4 flex flex-col">

      {/* Header */}
      <div className="w-full flex items-center justify-between gap-2">
        <h2 className="capitalize font-medium text-sm">
          Recent Expenses
        </h2>

        <button className="flex items-center gap-1 text-sm border py-1 px-2 rounded-md border-neutral-300 text-neutral-600 cursor-pointer hover:bg-neutral-100 shrink-0">
          <HugeiconsIcon
            icon={PreferenceHorizontalIcon}
            className="size-4"
          />
          <span>Filter</span>
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block mt-3 w-full min-w-0 overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead className="border-b border-neutral-300 sticky top-0">
            <tr className="text-left capitalize text-xs">
              <th className="font-medium py-2 pr-3">S.N</th>
              <th className="font-medium py-2 pr-3">Name</th>
              <th className="font-medium py-2 pr-3">Price</th>
              <th className="font-medium py-2 pr-3">Mode</th>
              <th className="font-medium py-2 pr-3">Category</th>
              <th className="font-medium py-2">Time</th>
            </tr>
          </thead>

          <tbody>
            {expenses.slice(0, 4).map((item) => (
              <tr
                key={item.id}
                className="text-left text-sm font-normal text-neutral-600 border-b border-neutral-100 last:border-0"
              >
                <td className="py-3 pr-3">{item.id}</td>
                <td className="py-3 pr-3 min-w-[150px]">
                  {item.name}
                </td>
                <td className="py-3 pr-3 whitespace-nowrap tabular-nums">
                  ${item.price.toFixed(2)}
                </td>
                <td className="py-3 pr-3 whitespace-nowrap">
                  {item.pay}
                </td>
                <td className="py-3 pr-3 whitespace-nowrap">
                  {item.category}
                </td>
                <td className="py-3 whitespace-nowrap">
                  {item.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Expense Cards */}
      <div className="md:hidden mt-3 flex flex-col divide-y divide-neutral-200">
        {expenses.slice(0, 4).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 py-3"
          >
            {/* Expense Details */}
            <div className="flex items-center gap-3 min-w-0">
              <div className="size-9 shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center text-xs font-medium text-neutral-500">
                {item.id}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-800 truncate">
                  {item.name}
                </p>

                <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                  <span>{item.category}</span>
                  <span>·</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            {/* Price and Payment */}
            <div className="shrink-0 text-right">
              <p className="text-sm font-medium text-neutral-800 tabular-nums">
                ${item.price.toFixed(2)}
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                {item.pay}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

function SubscriptionsList() {
  return (
    <div className="flex-1 bg-neutral-50 border border-neutral-300/70 rounded-xl p-4  flex flex-col h-full">
      <h2 className="capitalize font-medium text-sm w-full text-left">
        subscriptions
      </h2>
    </div>
  );
}
