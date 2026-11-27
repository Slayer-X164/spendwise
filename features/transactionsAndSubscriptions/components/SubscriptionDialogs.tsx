import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, type FormEvent, type ReactNode } from "react";
import { dashboardCurrency } from "@/features/dashboard/data";
import SelectListbox from "@/features/ui/components/SelectListbox";
import {
  billingOptions,
  formatChargeDate,
  maxSubscriptionPrice,
  subscriptionCategories,
  subscriptionMoney,
  subscriptionNameKey,
  trackingOptions,
  type DetectedSubscription,
  type Subscription,
  type SubscriptionPlan,
} from "../subscriptionData";
import SubscriptionMark from "./SubscriptionMark";

const fieldClass = "min-h-10 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-blue-600 sm:text-sm";
const labelClass = "grid min-w-0 gap-1 text-sm font-medium";
const selectLabelClass = "mb-1 block text-sm font-medium";
const primaryButton = "min-h-10 cursor-pointer rounded-full bg-[#1257ff] px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
const secondaryButton = "min-h-10 cursor-pointer rounded-full bg-neutral-200 px-4 text-sm font-semibold hover:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-blue-600";

function SubscriptionDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-neutral-900/50" />
      <div className="fixed inset-0 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-full max-w-md rounded-3xl border border-neutral-300 bg-neutral-50 p-5 text-neutral-900 shadow-xl sm:p-6">
            <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

export function SubscriptionEditor({
  initial,
  editing,
  today,
  onSave,
  onClose,
}: {
  initial?: SubscriptionPlan;
  editing: boolean;
  today: string;
  onSave: (plan: SubscriptionPlan) => string | undefined;
  onClose: () => void;
}) {
  const [category, setCategory] = useState(initial?.category ?? "Other");
  const [cycle, setCycle] = useState(initial?.cycle ?? "monthly");
  const [status, setStatus] = useState(initial?.status ?? "active");
  const [error, setError] = useState<string>();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const value = (name: string) => String(form.get(name) ?? "").trim();
    const name = value("name");
    if (!name) {
      setError("Enter a service name.");
      return;
    }

    setError(onSave({
      name,
      plan: value("plan"),
      category,
      cycle,
      status,
      price: Math.round(Number(value("price")) * 100),
      chargeDate: value("chargeDate"),
      lastUsed: value("lastUsed"),
    }));
  }

  return (
    <SubscriptionDialog title={editing ? "Edit subscription" : "Add subscription"} onClose={onClose}>
      <form onSubmit={submit} className="mt-4 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Service name
            <input name="name" className={fieldClass} data-autofocus required maxLength={64} defaultValue={initial?.name} placeholder="e.g. Spotify" />
          </label>
          <label className={labelClass}>
            Plan (optional)
            <input name="plan" className={fieldClass} maxLength={48} defaultValue={initial?.plan} placeholder="e.g. Premium" />
          </label>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <SelectListbox label="Category" labelClassName={selectLabelClass} buttonClassName={fieldClass} options={subscriptionCategories} value={category} onChange={setCategory} inlineOptions />
          <SelectListbox label="Billing cycle" labelClassName={selectLabelClass} buttonClassName={fieldClass} options={billingOptions} value={cycle} onChange={setCycle} inlineOptions />
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className={labelClass}>
            Charge amount ({dashboardCurrency})
            <input
              name="price"
              className={fieldClass}
              type="number"
              inputMode="decimal"
              min={0.01}
              max={maxSubscriptionPrice}
              step={0.01}
              required
              defaultValue={initial ? initial.price / 100 : undefined}
              placeholder="0.00"
            />
          </label>
          <label className={labelClass}>
            Next charge date
            <input name="chargeDate" className={fieldClass} type="date" min="1900-01-01" max="9999-12-31" required defaultValue={initial?.chargeDate ?? today} />
          </label>
        </div>

        {editing && (
          <div className="grid gap-3 sm:grid-cols-2">
            <label className={labelClass}>
              Last used (optional)
              <input name="lastUsed" className={fieldClass} type="date" min="1900-01-01" max={today} defaultValue={initial?.lastUsed} />
            </label>
            <SelectListbox label="Tracking status" labelClassName={selectLabelClass} buttonClassName={fieldClass} options={trackingOptions} value={status} onChange={setStatus} inlineOptions />
          </div>
        )}
        {status === "canceled" && (
          <p className="text-sm text-slate-600">Cancel the plan with the provider to stop future charges.</p>
        )}
        {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
        <div className="mt-1 flex flex-wrap justify-end gap-2">
          <button type="button" onClick={onClose} className={secondaryButton}>Cancel</button>
          <button type="submit" className={primaryButton}>{editing ? "Save changes" : "Add subscription"}</button>
        </div>
      </form>
    </SubscriptionDialog>
  );
}

export function SubscriptionDetection({
  matches,
  tracked,
  onReview,
  onAdd,
  onClose,
}: {
  matches: DetectedSubscription[];
  tracked: Subscription[];
  onReview: (subscription: Subscription) => void;
  onAdd: (plan: SubscriptionPlan) => void;
  onClose: () => void;
}) {
  return (
    <SubscriptionDialog title="Detected subscriptions" onClose={onClose}>
      <p className="mt-1 text-sm text-slate-600">
        {matches.length ? "Review possible recurring charges found in your completed transactions." : "No likely recurring charges were found in your completed transactions."}
      </p>
      {!!matches.length && (
        <ul className="mt-4 max-h-72 divide-y divide-slate-200 overflow-y-auto">
          {matches.map(({ key, plan, lastCharge }) => {
            const existing = tracked.find(({ name }) => subscriptionNameKey(name) === key);
            return (
              <li key={key} className="flex flex-wrap items-center gap-2.5 py-3">
                <SubscriptionMark name={plan.name} />
                <div className="min-w-24 flex-1">
                  <strong className="block text-sm [overflow-wrap:anywhere]">{plan.name}</strong>
                  <p className="text-xs text-slate-600">
                    {subscriptionMoney(plan.price)} on {formatChargeDate(lastCharge)}
                  </p>
                  {existing && <span className="text-xs font-medium text-green-800">Already tracked</span>}
                </div>
                {existing ? (
                  <button type="button" className={secondaryButton} onClick={() => onReview(existing)}>Review</button>
                ) : (
                  <button type="button" className={primaryButton} onClick={() => onAdd(plan)}>Review and add</button>
                )}
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-4 flex justify-end">
        <button type="button" className={secondaryButton} onClick={onClose}>Done</button>
      </div>
    </SubscriptionDialog>
  );
}
