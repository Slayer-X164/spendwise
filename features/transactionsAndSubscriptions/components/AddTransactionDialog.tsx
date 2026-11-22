"use client";
import { useActionState } from "react";
import { createTransaction } from "../actions";
import {
  EXPENSE_CATEGORIES,
  PAYMENT_MODES,
  TransactionActionState,
} from "../schema";

const initialState: TransactionActionState = {
  success: false,
};
export default function AddTransactionDialog() {
  const [data, action, isPending] = useActionState(
    createTransaction,
    initialState,
  );
  console.log("data ", data);

  return (
    <section className="w-full min-h-full bg-neutral-700/50 z-50 fixed backdrop-blur-xs p-3 flex items-center justify-center">
      <div className="w-[380px]  bg-white rounded-2xl px-5 py-4 border-3 border-neutral-700/30">
        <h2 className="text-lg font-medium">Add Transaction</h2>
        <div>
          <form action={action} className="flex flex-col gap-4 py-4">
            {/* name */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="name"
                className="text-sm text-neutral-500 font-medium "
              >
                Name
              </label>
              <input
                name="name"
                type="text"
                defaultValue={data?.fields?.name ?? ""}
                placeholder="e.g. Food"
                className="border border-neutral-300 p-2 rounded-lg text-sm outline-none "
              />
              {data?.errors?.name && (
                <span className="text-sm text-red-500 font-medium">
                  {data?.errors?.name}
                </span>
              )}
            </div>
            {/* price */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="price"
                className="text-sm text-neutral-500 font-medium "
              >
                Price
              </label>
              <input
                name="price"
                type="text"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={data?.fields?.price ?? ""}
                className="border border-neutral-300 p-2 rounded-lg text-sm outline-none "
              />
            </div>
            {data?.errors?.price && (
              <span className="text-sm text-red-500 font-medium">
                {data?.errors?.price}
              </span>
            )}
            {/* mode */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="mode"
                className="text-sm text-neutral-500 font-medium "
              >
                Mode
              </label>
              <div className="border border-neutral-300 p-2 rounded-lg text-sm">
                <select
                  defaultValue={data?.fields?.mode ?? "cash"}
                  name="mode"
                  id="mode"
                  className="w-full outline-none"
                >
                  {PAYMENT_MODES.map((mode) => (
                    <option
                      key={mode}
                      value={mode == "select a payment mode" ? "" : mode}
                      disabled={mode == "select a payment mode" ? true : false}
                      className="bg-white p-4 w-full"
                    >
                      {mode}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {data?.errors?.mode && (
              <span className="text-sm text-red-500 font-medium">
                {data?.errors?.mode}
              </span>
            )}
            {/* Category */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="category"
                className="text-sm text-neutral-500 font-medium "
              >
                Category
              </label>
              <div className="border border-neutral-300 p-2 rounded-lg text-sm">
                <select
                  name="category"
                  id="category"
                  className="w-full outline-none"
                  defaultValue={data?.fields?.category ?? "food"}
                >
                  {EXPENSE_CATEGORIES.map((category) => (
                    <option
                      key={category}
                       value={category == "select a category" ? "" : category}
                      disabled={category == "select a category" ? true : false}
                      className="bg-white p-4 w-full"
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              {data?.errors?.category && (
                <span className="text-sm text-red-500 font-medium">
                  {data?.errors?.category}
                </span>
              )}
            </div>
            {/* Date */}
            <div className="flex flex-col gap-1">
              <label
                htmlFor="date"
                className="text-sm text-neutral-500 font-medium "
              >
                Date
              </label>
              <div className="border border-neutral-300 p-2 rounded-lg text-sm">
                <input
                  defaultValue={
                    data?.fields?.date ?? new Date().toLocaleDateString("en-CA")
                  }
                  name="date"
                  type="date"
                  className="text-sm outline-none w-full "
                />
              </div>
              {data?.errors?.date && (
                <span className="text-sm text-red-500 font-medium">
                  {data?.errors?.date}
                </span>
              )}
            </div>
            {/* buttons */}
            <div className="w-full flex items-center justify-end pt-5 gap-3 text-sm">
              <button className=" cursor-pointer active:scale-95 transition-all duration-100 border border-neutral-300 px-4 py-2 rounded-lg capitalize font-semibold text-neutral-700">
                cancel
              </button>
              <button
                disabled={isPending}
                className="disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer active:scale-95 transition-all duration-100  bg-blue-600 text-neutral-50 px-4 py-2 rounded-lg capitalize font-semibold "
              >
                {isPending ? (
                  <div className="w-full flex items-center gap-2 ">
                    <div className="rounded-full border-2 border-neutral-50 w-5 h-5 border-r-transparent border-dashed animate-spin"></div>
                    <span>Saving...</span>
                  </div>
                ) : (
                  <h3>save transaction</h3>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
