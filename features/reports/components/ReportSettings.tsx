import { Checkbox, Field, Label, Radio, RadioGroup } from "@headlessui/react";
import { Calendar03Icon, File01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CardHeading, { cardClass } from "@/features/dashboard/components/CardHeading";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { formats, reportIncludes, reportPeriods, reportTypes, type ReportFormat, type ReportOptions } from "../data";

export default function ReportSettings({
  options, onChange, format, onFormat, onGenerate, busy,
}: {
  options: ReportOptions;
  onChange: (options: ReportOptions) => void;
  format: ReportFormat;
  onFormat: (format: ReportFormat) => void;
  onGenerate: () => void;
  busy: boolean;
}) {
  const includes = options.type === "tax" ? [] : reportIncludes;

  return (
    <section aria-label="Report settings" className={`${cardClass} grid min-w-0 gap-4 bg-neutral-50 print:hidden`}>
      <CardHeading icon={File01Icon}>Report settings</CardHeading>
      <RadioGroup value={options.type} onChange={(type) => onChange({ ...options, type })} className="grid gap-2">
        <Label className="text-xs font-semibold text-slate-600">Report type</Label>
        {reportTypes.map(({ value, label, description }) => (
          <Radio
            key={value}
            value={value}
            className="group flex min-w-0 cursor-pointer items-center gap-2.5 rounded-2xl border border-slate-200 px-3 py-2.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 data-checked:border-blue-500 data-checked:bg-blue-50"
          >
            <i aria-hidden="true" className="grid size-4 shrink-0 place-items-center rounded-full border-2 border-slate-300 group-data-checked:border-blue-600 group-data-checked:bg-blue-600 group-data-checked:after:size-1.5 group-data-checked:after:rounded-full group-data-checked:after:bg-white" />
            <span className="min-w-0">
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-xs text-slate-600">{description}</span>
            </span>
          </Radio>
        ))}
      </RadioGroup>

      <div className="relative">
        <HugeiconsIcon icon={Calendar03Icon} className="pointer-events-none absolute bottom-3 left-3 z-10 size-4 text-blue-600" aria-hidden="true" />
        <SelectListbox
          label="Period"
          labelClassName="mb-2 block text-xs font-semibold text-slate-600"
          buttonClassName="min-h-10 w-full rounded-xl bg-slate-100 py-2 pr-3 pl-9 text-sm font-medium hover:bg-slate-200"
          options={reportPeriods.map(({ value, label, range, mode }) => ({ value, label: mode === "Month" ? range : label }))}
          value={options.period}
          onChange={(period) => onChange({ ...options, period })}
        />
      </div>

      {!!includes.length && (
        <fieldset className="grid gap-2">
          <legend className="mb-2 text-xs font-semibold text-slate-600">Include</legend>
          {includes.map(({ key, label }) => (
            <Field key={key} className="flex items-center gap-2.5">
              <Checkbox
                checked={options.include[key]}
                onChange={(checked) => onChange({ ...options, include: { ...options.include, [key]: checked } })}
                className="group grid size-4.5 shrink-0 cursor-pointer place-items-center rounded border border-slate-300 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 data-checked:border-blue-600 data-checked:bg-blue-600"
              >
                <HugeiconsIcon icon={Tick02Icon} className="invisible size-3.5 text-white group-data-checked:visible" aria-hidden="true" />
              </Checkbox>
              <Label className="cursor-pointer text-sm font-medium">{label}</Label>
            </Field>
          ))}
          <label className="flex items-center gap-2.5 text-sm text-slate-500">
            <input type="checkbox" disabled className="size-4.5 shrink-0 accent-blue-600" />
            <span>Receipts <span className="block text-xs">No attachments available</span></span>
          </label>
        </fieldset>
      )}

      <RadioGroup value={format} onChange={onFormat} className="grid gap-2">
        <Label className="text-xs font-semibold text-slate-600">Format</Label>
        <div className="grid grid-cols-3 gap-1 rounded-full bg-slate-100 p-1">
          {formats.map((value) => (
            <Radio key={value} value={value} className="grid min-h-8 cursor-pointer place-items-center rounded-full px-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 focus-visible:outline-2 focus-visible:outline-blue-600 data-checked:bg-neutral-800 data-checked:text-white">
              {value}
            </Radio>
          ))}
        </div>
      </RadioGroup>
      <button type="button" disabled={busy} onClick={onGenerate} className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1257ff] px-3 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-60">
        <HugeiconsIcon icon={File01Icon} className="size-4" aria-hidden="true" />
        Generate report
      </button>
    </section>
  );
}
