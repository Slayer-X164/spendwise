"use client";

import { ArrowUpRight03Icon, Camera01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { formatMoney } from "../data";
import { CardIcon } from "./CardHeading";

const shortcutClass = "flex min-h-24 min-w-0 scroll-m-4 cursor-pointer flex-col items-start justify-between gap-2.5 rounded-3xl border border-neutral-300 bg-neutral-50 p-4 text-left disabled:cursor-not-allowed enabled:hover:bg-neutral-200";
const shortcutTitleClass = "block font-semibold";
const shortcutDetailClass = "mt-0.5 block text-sm text-slate-500";
const shortcutIconSize = "size-8";

export default function DashboardShortcuts() {
  return (
    <aside className="grid gap-3 sm:gap-4 md:max-xl:grid-cols-2 xl:min-h-80 xl:grid-rows-[1.1fr_1fr] print:hidden" aria-label="Dashboard shortcuts">
      <div
        className="relative isolate flex flex-col justify-between gap-4 overflow-hidden rounded-3xl bg-[#f5f7fc] p-4
          after:absolute after:-top-8 after:-right-8 after:-z-10 after:size-32 after:rounded-full after:bg-blue-100 border border-neutral-300"
      >
        <div className="flex items-center justify-between gap-1.5 text-xs whitespace-nowrap text-white">
          <span className="rounded-full bg-[#1257ff] px-3 py-1.5 font-semibold">14-day free trial</span>
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-neutral-800 px-3 py-2 font-medium disabled:cursor-not-allowed"
            disabled
            title="Pro signup is unavailable"
          >
            Join Pro <HugeiconsIcon icon={ArrowUpRight03Icon} aria-hidden="true" className="size-3" />
          </button>
        </div>
        <div>
          <h2 className="max-w-md text-xl leading-tight font-bold tracking-tight">
            Unlock AI insights &amp; unlimited accounts
          </h2>
          <p className="mt-2 text-slate-500">Smart tips to save ~{formatMoney(180, true)}/mo</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <button type="button" className={shortcutClass} disabled title="Receipt scanning is unavailable">
          <CardIcon icon={Camera01Icon} size={shortcutIconSize} />
          <span><strong className={shortcutTitleClass}>Scan receipt</strong><small className={shortcutDetailClass}>Auto-fill in 2s</small></span>
        </button>
        <button type="button" id="report" className={shortcutClass} onClick={() => window.print()}>
          <CardIcon icon={File01Icon} tone="dark" size={shortcutIconSize} />
          <span><strong className={shortcutTitleClass}>Nov report</strong><small className={shortcutDetailClass}>Export PDF</small></span>
        </button>
      </div>
    </aside>
  );
}
