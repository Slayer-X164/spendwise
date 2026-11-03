import { PreferenceHorizontalIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Transactions() {
  return (
    <div className="w-full h-full flex items-center gap-3">
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
    <div className=" h-full flex-3 bg-neutral-50 border border-neutral-300/70 rounded-xl p-4  flex flex-col items-center">
      <div className="w-full flex justify-between">
        <h2 className="capitalize font-medium text-sm w-full text-left">
          recent expenses
        </h2>
        <h2 className="flex items-center gap-1 text-sm border py-0.5 px-1.5 rounded-md border-neutral-300 text-neutral-600 cursor-pointer hover:bg-neutral-100">
          <HugeiconsIcon icon={PreferenceHorizontalIcon} className="size-4" />
          <span>Filter</span>
        </h2>
      </div>
      <div className="mt-1 w-full overflow-y-auto ">
        <table className=" w-full  ">
          <thead className="border-b border-neutral-300  h-6 sticky -top-0.5  ">
            <tr className="text-left capitalize text-xs">
              <th className="font-medium  py-2">s.n</th>
              <th className="font-medium  py-2">name</th>
              <th className="font-medium  py-2">price</th>
              <th className="font-medium py-2">mode</th>
              <th className="font-medium py-2">category</th>
              <th className="font-medium py-2">time</th>
            </tr>
          </thead>
          <tbody>
            {expenses.slice(0, 4).map((item) => (
              <tr
                key={item.id}
                className=" h-6 text-left text-sm font-normal text-neutral-600"
              >
                <td className="py-2">{item.id}</td>
                <td className="py-2">{item.name}</td>
                <td className="py-2">{item.price}</td>
                <td className="py-2">{item.pay}</td>
                <td className="py-2">{item.category}</td>
                <td className="py-2">{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
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
