import { Switch } from "@headlessui/react";
import { Calendar03Icon, Download04Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import CardHeading, { cardClass } from "@/features/dashboard/components/CardHeading";
import { formatReportDate, reportTypes } from "../data";
import { nextReportDate, type ReportExport, type ReportSchedule } from "../useReportHistory";

export function RecentExports({ exports, onDownload, busy }: {
  exports: ReportExport[];
  onDownload: (entry: ReportExport) => void;
  busy: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const visible = expanded ? exports : exports.slice(0, 4);

  return (
    <section aria-label="Recent exports" className={`${cardClass} grid min-w-0 gap-3 bg-neutral-50`}>
      <div className="flex flex-wrap items-center justify-between gap-1">
        <CardHeading icon={File01Icon}>Recent exports</CardHeading>
        {exports.length > 4 && (
          <button type="button" aria-expanded={expanded} aria-controls="recent-report-exports" onClick={() => setExpanded(!expanded)} className="cursor-pointer text-xs font-semibold text-blue-700 hover:underline focus-visible:outline-2">
            {expanded ? "Show less" : "View all"}
          </button>
        )}
      </div>
      {visible.length ? (
        <ul id="recent-report-exports" className="divide-y divide-slate-200">
          {visible.map((entry) => (
            <li key={entry.id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
              <div className="min-w-0 flex-1">
                <strong className="block text-xs font-semibold [overflow-wrap:anywhere] sm:text-sm">{entry.filename}</strong>
                <span className="text-xs text-slate-600">{formatReportDate(entry.document.date)} · {Math.max(1, Math.round(entry.bytes / 1024))} KB</span>
              </div>
              <button
                type="button"
                aria-label={`Download ${entry.filename}`}
                disabled={busy}
                onClick={() => onDownload(entry)}
                className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600 disabled:opacity-60"
              >
                <HugeiconsIcon icon={Download04Icon} className="size-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      ) : <p className="rounded-xl bg-slate-100 px-3 py-4 text-sm text-slate-600">Your downloaded reports will appear here.</p>}
    </section>
  );
}

export function ScheduledReport({
  schedule, today, onEdit, onToggle, onCalendar,
}: {
  schedule?: ReportSchedule;
  today: string;
  onEdit: () => void;
  onToggle: (enabled: boolean) => void;
  onCalendar: () => void;
}) {
  const label = reportTypes.find(({ value }) => value === schedule?.type)?.label;
  const next = schedule?.enabled ? formatReportDate(nextReportDate(schedule.day, today)) : null;

  return (
    <section aria-label="Scheduled report" className={`${cardClass} grid min-w-0 gap-3 border-neutral-800 bg-neutral-800 text-white`}>
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
        <HugeiconsIcon icon={Calendar03Icon} className="size-5 shrink-0 text-blue-300" aria-hidden="true" />
        Scheduled report
      </h2>
      {schedule ? (
        <>
          <p className="text-sm text-neutral-300">{label} · {schedule.format}<br />{next ? `Next reminder ${next}` : "Reminder paused"}</p>
          <div className="flex items-center justify-between gap-2 rounded-xl bg-neutral-700/60 p-2.5">
            <span className="text-sm">Monthly reminder</span>
            <Switch
              checked={schedule.enabled}
              onChange={onToggle}
              aria-label="Monthly report reminder"
              className="group inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-neutral-600 p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-300 data-checked:bg-[#1257ff]"
            >
              <span aria-hidden="true" className="size-5 rounded-full bg-white shadow-sm transition-transform group-data-checked:translate-x-5" />
            </Switch>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <button type="button" onClick={onEdit} className="min-h-9 cursor-pointer rounded-full bg-neutral-700 px-3 hover:bg-neutral-600 focus-visible:outline-2 focus-visible:outline-blue-300">Edit reminder</button>
            {schedule.enabled && <button type="button" onClick={onCalendar} className="min-h-9 cursor-pointer rounded-full bg-[#1257ff] px-3 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-300">Download calendar file</button>}
          </div>
        </>
      ) : (
        <>
          <p className="text-sm text-neutral-300">Set a monthly reminder to generate a report.</p>
          <button type="button" onClick={onEdit} className="min-h-9 w-fit cursor-pointer rounded-full bg-neutral-700 px-3 text-sm font-semibold hover:bg-neutral-600 focus-visible:outline-2 focus-visible:outline-blue-300">Set reminder</button>
        </>
      )}
    </section>
  );
}
