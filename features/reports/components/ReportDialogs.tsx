import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";
import { useRef, useState, type ReactNode } from "react";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { formats, reportTypes, type ReportFormat, type ReportType } from "../data";
import type { ReportSchedule } from "../useReportHistory";

const controlClass = "min-h-10 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm";
const labelClass = "mb-1 block text-sm font-medium";
const primary = "min-h-10 cursor-pointer rounded-full bg-[#1257ff] px-4 text-sm font-semibold text-white hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600";
const secondary = "min-h-10 cursor-pointer rounded-full bg-neutral-200 px-4 text-sm font-semibold hover:bg-neutral-300 focus-visible:outline-2 focus-visible:outline-blue-600";

function ReportsDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <Dialog open onClose={onClose} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-neutral-900/50" />
      <div className="fixed inset-0 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-full max-w-sm rounded-3xl border border-neutral-300 bg-neutral-50 p-5 text-neutral-900 shadow-xl sm:p-6">
            <DialogTitle className="text-xl font-bold tracking-tight">{title}</DialogTitle>
            {children}
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}

const days = Array.from({ length: 31 }, (_, index) => ({ value: index + 1, label: `Day ${index + 1}` }));

export function ReportScheduleDialog({ schedule, initialType, initialFormat, onSave, onClose }: {
  schedule?: ReportSchedule;
  initialType: ReportType;
  initialFormat: ReportFormat;
  onSave: (schedule: ReportSchedule) => void;
  onClose: () => void;
}) {
  const [day, setDay] = useState(schedule?.day ?? 1);
  const [type, setType] = useState(schedule?.type ?? initialType);
  const [format, setFormat] = useState(schedule?.format ?? initialFormat);

  return (
    <ReportsDialog title="Schedule a report reminder" onClose={onClose}>
      <p className="mt-1 text-sm text-slate-600">Save a monthly reminder and import it into your calendar.</p>
      <form className="mt-4 grid gap-3" onSubmit={(event) => {
        event.preventDefault();
        onSave({ day, type, format, enabled: true });
      }}>
        <SelectListbox label="Report type" labelClassName={labelClass} buttonClassName={controlClass} options={reportTypes} value={type} onChange={setType} inlineOptions />
        <SelectListbox label="Day of the month" labelClassName={labelClass} buttonClassName={controlClass} options={days} value={day} onChange={setDay} inlineOptions />
        <SelectListbox label="Format" labelClassName={labelClass} buttonClassName={controlClass} options={formats.map((value) => ({ value, label: value }))} value={format} onChange={setFormat} inlineOptions />
        {day > 28 && <p className="text-xs text-slate-600">The reminder appears in months that have day {day}.</p>}
        <div className="mt-1 flex justify-end gap-2">
          <button type="button" className={secondary} onClick={onClose}>Cancel</button>
          <button type="submit" className={primary}>Save reminder</button>
        </div>
      </form>
    </ReportsDialog>
  );
}

export function ShareReportDialog({ title, summary, onClose }: { title: string; summary: string; onClose: () => void }) {
  const [status, setStatus] = useState("");
  const field = useRef<HTMLTextAreaElement>(null);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  async function copy() {
    try {
      await navigator.clipboard.writeText(summary);
      setStatus("Summary copied.");
    } catch {
      field.current?.focus();
      field.current?.select();
      setStatus("Summary selected. Copy it from the text field.");
    }
  }

  async function share() {
    try {
      await navigator.share({ title, text: summary });
    } catch (error) {
      if (!(error instanceof DOMException && error.name === "AbortError")) setStatus("Sharing is unavailable. Copy the summary to share it.");
    }
  }

  return (
    <ReportsDialog title="Share report summary" onClose={onClose}>
      <textarea ref={field} aria-label="Report summary" className="mt-4 min-h-36 w-full resize-y rounded-xl border border-neutral-300 bg-white px-3 py-2 text-sm" value={summary} readOnly />
      <p className="mt-1 text-xs text-slate-600" role="status">{status}</p>
      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <button type="button" className={secondary} onClick={onClose}>Done</button>
        <button type="button" className={primary} onClick={copy}>Copy summary</button>
        {canShare && <button type="button" className={secondary} onClick={share}>Share…</button>}
      </div>
    </ReportsDialog>
  );
}
