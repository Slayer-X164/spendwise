"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { budgetMonthOptions, getMonthlyBudget, type BudgetPreferences, type CategoryLimit } from "../data";
import useBudgetSettings, { updateBudgetSettings } from "../useBudgetSettings";
import BudgetCategories from "./BudgetCategories";
import BudgetEditor, { type BudgetEditorMode } from "./BudgetEditor";
import BudgetHistory from "./BudgetHistory";
import { BudgetAlerts, MonthlyOverview } from "./BudgetOverview";
import BudgetPreferenceCard from "./BudgetPreferences";

const cardColumns = "grid min-w-0 gap-3 sm:gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]";

export default function BudgetView() {
  const [monthIndex, setMonthIndex] = useState(0);
  const [editor, setEditor] = useState<BudgetEditorMode | null>(null);
  const settings = useBudgetSettings();
  const month = getMonthlyBudget(monthIndex, settings);
  const history = budgetMonthOptions
    .slice(monthIndex, monthIndex + 6)
    .reverse()
    .map(({ value }) => {
      const { label, spend, limit } = getMonthlyBudget(value, settings);
      return { label, spend, limit };
    });

  function addBudget() {
    setEditor({ type: "add" });
  }

  function editBudget(name?: string) {
    setEditor({ type: "edit", name });
  }

  function saveBudget(entry: CategoryLimit) {
    updateBudgetSettings((current) => {
      const limits = current.limits[month.label] ?? [];
      return {
        ...current,
        limits: { ...current.limits, [month.label]: [...limits.filter(({ name }) => name !== entry.name), entry] },
      };
    });
    setEditor(null);
  }

  function changePreference(key: keyof BudgetPreferences, value: boolean) {
    updateBudgetSettings((current) => ({ ...current, preferences: { ...current.preferences, [key]: value } }));
  }

  return (
    <main aria-label="Budgets" className="grid min-w-0 gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 sm:gap-3">
        <div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Budgets</h1>
          <p className="mt-1 hidden text-sm text-slate-600 sm:block">
            {month.fullLabel}{month.daysLeft > 0 && ` · ${month.daysLeft} ${month.daysLeft === 1 ? "day" : "days"} left`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SelectListbox
            label="Budget month"
            value={monthIndex}
            options={budgetMonthOptions}
            onChange={setMonthIndex}
            buttonClassName="min-h-10 rounded-full border border-neutral-300 bg-neutral-50 px-3 text-sm font-medium hover:bg-neutral-100"
          />
          <button
            type="button"
            onClick={addBudget}
            aria-haspopup="dialog"
            className="flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1257ff] px-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4"
          >
            <HugeiconsIcon icon={PlusSignIcon} className="size-5 sm:size-4" aria-hidden="true" />
            <span className="sr-only sm:not-sr-only">New budget</span>
          </button>
        </div>
      </div>

      <div className={cardColumns}>
        <MonthlyOverview month={month} />
        <BudgetAlerts month={month} reminder={settings.preferences.dailyReminder} onEdit={editBudget} />
      </div>

      <BudgetCategories categories={month.categories} daysElapsed={month.daysElapsed} onAdd={addBudget} onEdit={editBudget} />

      <div className={cardColumns}>
        <BudgetHistory key={month.label} months={history} selectedLimit={month.limit} />
        <BudgetPreferenceCard values={settings.preferences} onChange={changePreference} />
      </div>

      {editor && (
        <BudgetEditor
          mode={editor}
          categories={month.categories}
          monthLabel={month.fullLabel}
          onSave={saveBudget}
          onClose={() => setEditor(null)}
        />
      )}
    </main>
  );
}
