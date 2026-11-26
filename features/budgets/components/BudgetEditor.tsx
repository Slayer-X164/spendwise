import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useState, type FormEvent } from "react";
import { dashboardCurrency } from "@/features/dashboard/data";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { maxBudgetLimit, roundMoney, type BudgetCategory, type CategoryLimit } from "../data";

export type BudgetEditorMode = { type: "add" } | { type: "edit"; name?: string };

const fieldClass = "min-h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-base focus-visible:outline-2 focus-visible:outline-blue-600 sm:text-sm";

export default function BudgetEditor({
  mode,
  categories,
  monthLabel,
  onSave,
  onClose,
}: {
  mode: BudgetEditorMode;
  categories: BudgetCategory[];
  monthLabel: string;
  onSave: (entry: CategoryLimit) => void;
  onClose: () => void;
}) {
  const adding = mode.type === "add";
  const [selectedName, setSelectedName] = useState(mode.type === "edit" ? mode.name ?? categories[0].name : "");
  const [error, setError] = useState("");
  const current = categories.find(({ name }) => name === selectedName);

  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = adding ? String(fields.get("category") ?? "").trim() : selectedName;
    const limit = roundMoney(Number(fields.get("limit")));

    if (adding && !name) {
      setError("Enter a category name.");
    } else if (adding && categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) {
      setError("This category already has a budget for the selected month.");
    } else if (!Number.isFinite(limit) || limit <= 0 || limit > maxBudgetLimit) {
      setError("Enter a valid monthly limit.");
    } else {
      onSave({ name, limit });
    }
  }

  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-neutral-900/50" />
      <div className="fixed inset-0 grid place-items-center overflow-y-auto p-4">
        <DialogPanel className="w-full max-w-sm rounded-3xl border border-neutral-300 bg-neutral-50 p-5 text-neutral-900 shadow-xl sm:p-6">
          <DialogTitle className="text-xl font-semibold tracking-tight">{adding ? "New category budget" : "Edit category budget"}</DialogTitle>
          <p className="mt-1 text-sm text-slate-600">{monthLabel}</p>
          <form onSubmit={save} className="mt-4 grid gap-4">
            {adding ? (
              <label className="grid gap-1 text-sm font-medium">
                Category name
                <input data-autofocus className={fieldClass} name="category" required maxLength={32} placeholder="e.g. Travel" />
              </label>
            ) : (
              <SelectListbox
                label="Category"
                labelClassName="mb-1 block text-sm font-medium"
                buttonClassName={fieldClass}
                options={categories.map(({ name }) => ({ label: name, value: name }))}
                value={selectedName}
                onChange={(name) => {
                  setSelectedName(name);
                  setError("");
                }}
                inlineOptions
              />
            )}

            <label className="grid gap-1 text-sm font-medium">
              Monthly limit ({dashboardCurrency})
              <input
                key={selectedName}
                name="limit"
                className={fieldClass}
                type="number"
                inputMode="decimal"
                defaultValue={current?.limit}
                required
                min={0.01}
                max={maxBudgetLimit}
                step={0.01}
              />
            </label>
            {error && <p className="text-sm font-medium text-red-700" role="alert">{error}</p>}
            <div className="flex justify-end gap-2 text-sm font-semibold">
              <button type="button" onClick={onClose} className="min-h-10 cursor-pointer rounded-full bg-neutral-200 px-4 hover:bg-neutral-300">Cancel</button>
              <button type="submit" className="min-h-10 cursor-pointer rounded-full bg-[#1257ff] px-4 text-white hover:bg-blue-700">
                {adding ? "Add budget" : "Save limit"}
              </button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
