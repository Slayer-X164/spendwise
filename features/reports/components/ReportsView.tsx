"use client";

import { Calendar03Icon, Download04Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import useBudgetSettings from "@/features/budgets/useBudgetSettings";
import { formatMoney } from "@/features/dashboard/data";
import useGoals from "@/features/goals/useGoals";
import { downloadFile } from "@/lib/downloadFile";
import { localDate } from "@/lib/useLocalDate";
import { defaultReportOptions, getExportDocument, getReport, reportTypes, type ReportFormat, type ReportOptions } from "../data";
import { getReportFile } from "../exportReport";
import useReportHistory, { nextReportDate, updateReportHistory, type ReportExport, type ReportSchedule } from "../useReportHistory";
import { ReportScheduleDialog, ShareReportDialog } from "./ReportDialogs";
import ReportPreview from "./ReportPreview";
import ReportSettings from "./ReportSettings";
import { RecentExports, ScheduledReport } from "./ReportSidebar";

const actionClass = "flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:gap-2 sm:px-4 sm:text-sm";
const secondaryAction = `${actionClass} border border-neutral-300 bg-neutral-50 hover:bg-neutral-200`;

export default function ReportsView() {
  const [options, setOptions] = useState<ReportOptions>(defaultReportOptions);
  const [format, setFormat] = useState<ReportFormat>("PDF");
  const [dialog, setDialog] = useState<"schedule" | "share" | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const { exports, schedule } = useReportHistory();
  const budget = useBudgetSettings();
  const { goals, today } = useGoals();
  const report = getReport(options, budget, goals, today);

  async function exportReport(entry?: ReportExport) {
    setBusy(true);
    setError("");
    try {
      const document = entry?.document ?? getExportDocument(report, localDate());
      const fileFormat = entry?.format ?? format;
      const filename = entry?.filename ?? `spendwise-${options.type}-${report.period.from}.${fileFormat.toLowerCase()}`;
      const file = await getReportFile(document, fileFormat);
      downloadFile(filename, file);
      if (!entry) {
        const id = Array.from(crypto.getRandomValues(new Uint32Array(4)), (value) => value.toString(16)).join("-");
        updateReportHistory((current) => ({
          ...current,
          exports: [{ id, filename, format: fileFormat, document, bytes: file.size }, ...current.exports].slice(0, 12),
        }));
      }
      setNotice(`${fileFormat} download started.`);
    } catch {
      setError("The report could not be exported. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function saveReminder(next: ReportSchedule) {
    updateReportHistory((current) => ({ ...current, schedule: next }));
    setDialog(null);
    setNotice("Monthly reminder saved.");
  }

  function toggleReminder(enabled: boolean) {
    updateReportHistory((current) => current.schedule ? { ...current, schedule: { ...current.schedule, enabled } } : current);
  }

  function downloadCalendar() {
    if (!schedule?.enabled) return;
    const title = reportTypes.find(({ value }) => value === schedule.type)?.label ?? "Report";
    const date = nextReportDate(schedule.day, localDate()).replaceAll("-", "");
    const stamp = new Date().toISOString().slice(0, 19).replaceAll(/[-:]/g, "") + "Z";
    const event = [
      "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//SpendWise//Report Reminder//EN", "BEGIN:VEVENT",
      `UID:spendwise-${schedule.type}-${schedule.day}@spendwise.local`, `DTSTAMP:${stamp}`,
      `DTSTART:${date}T090000`, "DURATION:PT15M", `RRULE:FREQ=MONTHLY;BYMONTHDAY=${schedule.day}`,
      `SUMMARY:SpendWise - ${title}`, `DESCRIPTION:Open SpendWise Reports to generate your ${schedule.format} export.`,
      "BEGIN:VALARM", "ACTION:DISPLAY", "TRIGGER:PT0M", "DESCRIPTION:Generate your SpendWise report.",
      "END:VALARM", "END:VEVENT", "END:VCALENDAR", "",
    ].join("\r\n");
    downloadFile("spendwise-report-reminder.ics", new Blob([event], { type: "text/calendar;charset=utf-8" }));
    setNotice("Calendar reminder downloaded.");
  }

  const shareText = [
    `SpendWise · ${report.title}`,
    report.period.range,
    report.options.type === "tax" ? "Source: Transaction ledger" : "Source: Sample Analytics activity",
    "",
    ...report.totals.map(({ label, amount }) => `${label}: ${formatMoney(amount)}`),
  ].join("\n");

  return (
    <main aria-label="Reports" className="grid min-w-0 gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 print:hidden">
        <div>
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Reports</h1>
          <p className="mt-1 text-sm text-slate-600">Generate, preview, and export your financial statements.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-haspopup="dialog" onClick={() => setDialog("schedule")} className={secondaryAction}>
            <HugeiconsIcon icon={Calendar03Icon} className="size-4" aria-hidden="true" />
            Schedule
          </button>
          <button type="button" aria-haspopup="dialog" onClick={() => setDialog("share")} className={secondaryAction}>
            <HugeiconsIcon icon={Share08Icon} className="size-4" aria-hidden="true" />
            Share
          </button>
          <button type="button" onClick={() => exportReport()} disabled={busy} className={`${actionClass} bg-[#1257ff] text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 disabled:opacity-60`}>
            <HugeiconsIcon icon={Download04Icon} className="size-4" aria-hidden="true" />
            Export {format}
          </button>
        </div>
      </div>

      <span role="status" className="sr-only">{notice}</span>
      {error && <p role="alert" className="rounded-xl bg-red-100 px-3 py-2 text-sm text-red-800 print:hidden">{error}</p>}
      <div className="grid min-w-0 items-start gap-4 sm:gap-5 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.6fr)] xl:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)_minmax(0,1fr)] print:block">
        <ReportSettings options={options} onChange={setOptions} format={format} onFormat={setFormat} onGenerate={() => exportReport()} busy={busy} />
        <ReportPreview report={report} today={today} />
        <aside className="grid min-w-0 items-start gap-4 sm:gap-5 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:grid-cols-1 print:hidden">
          <RecentExports exports={exports} onDownload={exportReport} busy={busy} />
          <ScheduledReport schedule={schedule} today={today} onEdit={() => setDialog("schedule")} onToggle={toggleReminder} onCalendar={downloadCalendar} />
        </aside>
      </div>

      {dialog === "schedule" && (
        <ReportScheduleDialog schedule={schedule} initialType={options.type} initialFormat={format} onSave={saveReminder} onClose={() => setDialog(null)} />
      )}
      {dialog === "share" && <ShareReportDialog title={report.title} summary={shareText} onClose={() => setDialog(null)} />}
    </main>
  );
}
