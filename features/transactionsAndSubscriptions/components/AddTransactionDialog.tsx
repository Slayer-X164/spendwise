"use client";

import { useActionState, useRef, useState, type ReactNode } from "react";
import { createTransaction } from "../actions";
import {
  EXPENSE_CATEGORIES,
  PAYMENT_MODES,
  type TransactionActionState,
} from "../schema";

const initialState: TransactionActionState = { success: false };
const fieldClass = "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm";
const errorClass = "text-sm font-medium text-red-700";

function ExpenseForm({ today, onClose }: { today: string; onClose: () => void }) {
  const [data, action, isPending] = useActionState(createTransaction, initialState);

  return (
    <>
      <h2 id="add-expense-heading" className="text-xl font-semibold">Add Expense</h2>
      {data.success ? (
        <div className="mt-4 flex flex-col items-start gap-4">
          <p role="status">Expense details validated.</p>
          <button type="button" onClick={onClose} className="rounded-full bg-blue-600 px-4 py-2 font-medium text-white">
            Done
          </button>
        </div>
      ) : (
        <form action={action} className="mt-4 flex flex-col gap-3">
          <label className="grid gap-1 text-sm font-medium">
            Name
            <input className={fieldClass} name="name" placeholder="e.g. Lunch" defaultValue={data.fields?.name} />
            {data.errors?.name && <span className={errorClass}>{data.errors.name}</span>}
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Amount
            <input className={fieldClass} name="price" inputMode="decimal" placeholder="0.00" defaultValue={data.fields?.price} />
            {data.errors?.price && <span className={errorClass}>{data.errors.price}</span>}
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Payment method
            <select className={fieldClass} name="mode" defaultValue={data.fields?.mode ?? "cash"}>
              {PAYMENT_MODES.slice(1).map((mode) => <option key={mode} value={mode}>{mode}</option>)}
            </select>
            {data.errors?.mode && <span className={errorClass}>{data.errors.mode}</span>}
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Category
            <select className={fieldClass} name="category" defaultValue={data.fields?.category ?? "food"}>
              {EXPENSE_CATEGORIES.slice(1).map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
            {data.errors?.category && <span className={errorClass}>{data.errors.category}</span>}
          </label>
          <label className="grid gap-1 text-sm font-medium">
            Date
            <input className={fieldClass} name="date" type="date" defaultValue={data.fields?.date ?? today} />
            {data.errors?.date && <span className={errorClass}>{data.errors.date}</span>}
          </label>
          {data.message && !data.errors && <p className={errorClass} role="alert">{data.message}</p>}
          <div className="mt-2 flex justify-end gap-2 text-sm font-semibold">
            <button type="button" onClick={onClose} className="rounded-full bg-neutral-100 px-4 py-2">Cancel</button>
            <button type="submit" disabled={isPending} className="rounded-full bg-blue-600 px-4 py-2 text-white disabled:opacity-60">
              {isPending ? "Submitting…" : "Add expense"}
            </button>
          </div>
        </form>
      )}
    </>
  );
}

export default function AddTransactionDialog({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [formKey, setFormKey] = useState(0);
  const [today, setToday] = useState("");

  function openDialog() {
    setToday(new Date().toLocaleDateString("en-CA"));
    dialog.current?.showModal();
  }

  return (
    <>
      <button type="button" className={className} aria-haspopup="dialog" onClick={openDialog}>
        {children}
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="add-expense-heading"
        className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-3xl bg-neutral-50 p-6 text-neutral-950 shadow-xl backdrop:bg-neutral-800/50"
        onClose={() => setFormKey((key) => key + 1)}
      >
        <ExpenseForm key={formKey} today={today} onClose={() => dialog.current?.close()} />
      </dialog>
    </>
  );
}
