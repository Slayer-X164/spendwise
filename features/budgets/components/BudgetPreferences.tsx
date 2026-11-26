import { Description, Field, Label, Switch } from "@headlessui/react";
import { Settings02Icon } from "@hugeicons/core-free-icons";
import CardHeading, { cardClass } from "@/features/dashboard/components/CardHeading";
import { warningThreshold, type BudgetPreferences as Preferences } from "../data";

const options = [
  { key: "nearLimitAlerts", label: `Alert at ${warningThreshold}%`, description: "Show an alert when a category nears its limit." },
  { key: "rollover", label: "Roll over unused", description: "Add last month’s unspent allocation to this month." },
  { key: "dailyReminder", label: "Daily limit reminder", description: "Show your daily allowance in the Alerts card." },
] satisfies { key: keyof Preferences; label: string; description: string }[];

export default function BudgetPreferences({ values, onChange }: {
  values: Preferences;
  onChange: (key: keyof Preferences, checked: boolean) => void;
}) {
  return (
    <section aria-label="Budget preferences" className={`${cardClass} flex flex-col gap-2 bg-neutral-50 sm:gap-3`}>
      <CardHeading icon={Settings02Icon}>Preferences</CardHeading>
      <div className="divide-y divide-slate-200">
        {options.map(({ key, label, description }) => (
          <Field key={key} className="flex items-center justify-between gap-3 py-3 last:pb-0">
            <div>
              <Label className="cursor-pointer text-sm font-semibold">{label}</Label>
              <Description className="mt-0.5 text-xs text-slate-600 sm:text-sm">{description}</Description>
            </div>
            <Switch
              checked={values[key]}
              onChange={(checked) => onChange(key, checked)}
              className="group inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-slate-300 p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 data-checked:bg-[#1257ff]"
            >
              <span aria-hidden="true" className="size-5 rounded-full bg-white shadow-sm transition-transform group-data-checked:translate-x-5" />
            </Switch>
          </Field>
        ))}
      </div>
    </section>
  );
}
