import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, type FormEvent } from "react";
import { dashboardCurrency } from "@/features/dashboard/data";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { goalCategoryOptions, maxGoalAmount, money, type Contribution, type GoalCategory, type GoalPlan, type GoalProgress } from "../data";

export type GoalDialogMode = "create" | "edit" | "contribute";

const fieldClass = "min-h-10 w-full min-w-0 rounded-xl border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-blue-600 sm:text-sm";
const labelClass = "grid min-w-0 gap-1 text-sm font-medium";

export default function GoalDialog({
  mode,
  goal,
  today,
  onSavePlan,
  onSaveContribution,
  onClose,
}: {
  mode: GoalDialogMode;
  goal?: GoalProgress;
  today: string;
  onSavePlan: (plan: GoalPlan) => string | undefined;
  onSaveContribution: (contribution: Contribution) => string | undefined;
  onClose: () => void;
}) {
  const [category, setCategory] = useState<GoalCategory>(goal?.category ?? "general");
  const [error, setError] = useState<string>();
  const contributing = mode === "contribute";
  const title = mode === "create" ? "New goal" : contributing ? "Add funds" : "Edit goal";

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const value = (name: string) => String(fields.get(name) ?? "").trim();
    const amount = (name: string) => Math.round(Number(value(name)) * 100);

    if (contributing) {
      const entry = { amount: amount("amount"), date: value("date"), label: value("label") || "Manual contribution" };
      setError(onSaveContribution(entry));
    } else {
      const name = value("name");
      if (!name) {
        setError("Enter a goal name.");
        return;
      }
      setError(onSavePlan({ name, category, target: amount("target"), monthly: amount("monthly"), deadline: value("deadline") }));
    }
  }

  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-neutral-900/50" />
      <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
        <DialogPanel className="w-full max-w-sm rounded-3xl border border-neutral-300 bg-neutral-50 p-5 text-neutral-900 shadow-xl sm:p-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
          {contributing && goal && <p className="mt-1 text-sm text-slate-600">{goal.name} · {money(goal.remaining)} remaining</p>}
          <form onSubmit={save} className="mt-4 grid gap-3">
            {contributing ? (
              <>
                <label className={labelClass}>
                  Amount ({dashboardCurrency})
                  <input data-autofocus name="amount" className={fieldClass} type="number" inputMode="decimal" required min={0.01} step={0.01} max={(goal?.remaining ?? 0) / 100} />
                </label>
                <label className={labelClass}>
                  Contribution date
                  <input name="date" className={fieldClass} type="date" defaultValue={today} max={today} required />
                </label>
                <label className={labelClass}>
                  Note (optional)
                  <input name="label" className={fieldClass} maxLength={48} placeholder="e.g. Payday savings" />
                </label>
              </>
            ) : (
              <>
                <label className={labelClass}>
                  Goal name
                  <input data-autofocus name="name" className={fieldClass} maxLength={48} defaultValue={goal?.name} required placeholder="e.g. Summer trip" />
                </label>
                <SelectListbox
                  label="Category"
                  labelClassName="mb-1 block text-sm font-medium"
                  buttonClassName={fieldClass}
                  options={goalCategoryOptions}
                  value={category}
                  onChange={setCategory}
                  inlineOptions
                />
                <label className={labelClass}>
                  Target amount ({dashboardCurrency})
                  <input name="target" className={fieldClass} type="number" inputMode="decimal" required min={0.01} max={maxGoalAmount} step={0.01} defaultValue={goal ? goal.target / 100 : undefined} />
                </label>
                <label className={labelClass}>
                  Target date
                  <input name="deadline" className={fieldClass} type="date" defaultValue={goal?.deadline} required />
                </label>
                <label className={labelClass}>
                  Planned monthly contribution ({dashboardCurrency})
                  <input name="monthly" className={fieldClass} type="number" inputMode="decimal" min={0} max={maxGoalAmount} step={0.01} defaultValue={goal ? goal.monthly / 100 : undefined} placeholder="0.00" />
                </label>
              </>
            )}
            {error && <p role="alert" className="text-sm font-medium text-red-700">{error}</p>}
            <div className="mt-1 flex justify-end gap-2 text-sm font-semibold">
              <button type="button" onClick={onClose} className="min-h-10 cursor-pointer rounded-full bg-neutral-200 px-4 hover:bg-neutral-300">Cancel</button>
              <button type="submit" className="min-h-10 cursor-pointer rounded-full bg-[#1257ff] px-4 text-white hover:bg-blue-700">
                {mode === "create" ? "Create goal" : contributing ? "Record contribution" : "Save changes"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
