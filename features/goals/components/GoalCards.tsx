import { ArrowDown02Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CardIcon, cardClass } from "@/features/dashboard/components/CardHeading";
import { formatGoalDate, goalCategoryOptions, money, type GoalProgress } from "../data";

const statusStyle = {
  "On track": "bg-green-100 text-green-800",
  Behind: "bg-amber-100 text-amber-800",
  Done: "bg-blue-100 text-blue-800",
  Active: "bg-slate-100 text-slate-700",
};

function GoalStatus({ status }: { status: GoalProgress["status"] }) {
  return <span className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusStyle[status]}`}>{status}</span>;
}

function goalIcon(goal: GoalProgress) {
  return goalCategoryOptions.find(({ value }) => value === goal.category)?.icon ?? goalCategoryOptions[0].icon;
}

function goalDate(goal: GoalProgress, full = false) {
  if (goal.completedAt) return `Reached ${formatGoalDate(goal.completedAt, full ? "full" : "month")}`;
  return `Target ${formatGoalDate(goal.deadline, full ? "full" : "month")}`;
}

const focusClass = "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400";

export function FeaturedGoal({
  goal,
  onAddFunds,
  onEdit,
}: {
  goal: GoalProgress;
  onAddFunds: () => void;
  onEdit: () => void;
}) {
  const progress = Math.min(goal.saved / goal.target, 1);
  const angle = Math.PI * progress;
  const daysLabel = goal.completedAt ? "Completed" : goal.overdue ? "Past due" : goal.monthsLeft ? `${goal.monthsLeft} mo` : "Due today";
  const contributions = goal.contributions.slice(0, 3);
  const stats = [
    { label: "Remaining", value: money(goal.remaining) },
    { label: "Monthly", value: goal.monthly ? money(goal.monthly) : "—" },
    { label: "Time left", value: daysLabel },
  ];

  return (
    <section aria-label={`${goal.name} details`} className={`${cardClass} grid min-w-0 gap-4 border-neutral-800 bg-neutral-800 text-white sm:gap-5`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-start gap-2">
          <HugeiconsIcon icon={goalIcon(goal)} className="mt-0.5 size-5 shrink-0 text-blue-300 sm:size-6" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="text-xl leading-tight font-bold tracking-tight [overflow-wrap:anywhere] sm:text-2xl">{goal.name}</h2>
            <p className="mt-1 text-xs text-neutral-300 sm:text-sm">{goalDate(goal, true)}</p>
          </div>
        </div>
        <GoalStatus status={goal.status} />
      </div>

      <div className="relative mx-auto aspect-[1.7] w-full max-w-sm">
        <svg viewBox="0 0 200 116" className="absolute inset-0 size-full" aria-hidden="true">
          <path d="M 14 102 A 86 86 0 0 1 186 102" fill="none" stroke="#404040" strokeWidth="15" strokeLinecap="round" />
          {progress > 0 && (
            <>
              <path d="M 14 102 A 86 86 0 0 1 186 102" pathLength={100} fill="none" stroke="#1257ff" strokeWidth="15" strokeLinecap="round" strokeDasharray={`${progress * 100} 100`} />
              <circle cx={100 - 86 * Math.cos(angle)} cy={102 - 86 * Math.sin(angle)} r="4.5" fill="#fafafa" />
            </>
          )}
        </svg>
        <div className="absolute inset-x-9 bottom-0 grid justify-items-center gap-0.5 text-center">
          <span className="text-xs font-medium text-neutral-300 sm:text-sm">Saved so far</span>
          <strong className="max-w-full text-3xl leading-none font-bold tracking-tight tabular-nums [overflow-wrap:anywhere] sm:text-4xl">{money(goal.saved)}</strong>
          <span className="text-xs text-neutral-300 sm:text-sm">of {money(goal.target)} · {goal.percentage}%</span>
        </div>
      </div>

      <dl className="grid grid-cols-3 gap-2">
        {stats.map(({ label, value }) => (
          <div key={label} className="min-w-0 rounded-2xl bg-neutral-700/65 px-2.5 py-3 sm:px-3">
            <dt className="text-xs text-neutral-300">{label}</dt>
            <dd className="mt-0.5 text-sm font-semibold tabular-nums [overflow-wrap:anywhere] sm:text-base">{value}</dd>
          </div>
        ))}
      </dl>

      <div className={`grid gap-2 ${goal.completedAt ? "" : "grid-cols-2"}`}>
        {!goal.completedAt && (
          <button type="button" aria-haspopup="dialog" onClick={onAddFunds} className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-full bg-[#1257ff] px-2 text-sm font-semibold shadow-md shadow-blue-900/40 hover:bg-blue-700 ${focusClass}`}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4" aria-hidden="true" />
            Add funds
          </button>
        )}
        <button type="button" aria-haspopup="dialog" onClick={onEdit} className={`min-h-11 cursor-pointer rounded-full bg-neutral-700 px-3 text-sm font-semibold hover:bg-neutral-600 ${focusClass}`}>
          Edit goal
        </button>
      </div>

      <div className="border-t border-neutral-700 pt-3">
        <h3 className="text-sm font-semibold">Recent contributions</h3>
        {contributions.length ? (
          <ul className="mt-1 divide-y divide-neutral-700">
            {contributions.map(({ label, date, amount }, index) => (
              <li key={`${date}-${index}`} className="flex items-center gap-2.5 py-2.5 last:pb-0">
                <CardIcon icon={ArrowDown02Icon} className="bg-neutral-700/75 text-blue-300" size="size-8" />
                <div className="min-w-0 flex-1">
                  <strong className="block text-sm [overflow-wrap:anywhere]">{label}</strong>
                  <time dateTime={date} className="block text-xs text-neutral-300">{formatGoalDate(date, "short")}</time>
                </div>
                <strong className="text-right text-sm text-blue-300 tabular-nums">+{money(amount)}</strong>
              </li>
            ))}
          </ul>
        ) : <p className="mt-2 text-sm text-neutral-300">No contributions yet.</p>}
      </div>
    </section>
  );
}

export function GoalCard({ goal, onSelect }: { goal: GoalProgress; onSelect: () => void }) {
  const color = goal.status === "Behind" ? "#262626" : "#1257ff";

  return (
    <li className={`${cardClass} relative grid min-w-0 grid-cols-[auto_minmax(0,1fr)] items-center gap-x-3 gap-y-2 bg-neutral-50 hover:border-blue-300 md:grid-cols-[minmax(0,1fr)_auto]`}>
      <div className="row-span-2 grid size-14 shrink-0 place-items-center rounded-full sm:size-16 md:col-start-2 md:row-start-2 md:row-span-1 md:size-18 xl:size-20" style={{ backgroundImage: `conic-gradient(${color} ${goal.percentage}%, #e2e8f0 0)` }}>
        <strong className="grid size-3/4 place-items-center rounded-full bg-neutral-50 text-xs tabular-nums sm:text-sm">{goal.percentage}%</strong>
      </div>
      <div className="flex min-w-0 items-center justify-between gap-2 md:col-span-2 md:row-start-1">
        <span className="hidden md:inline-flex"><CardIcon icon={goalIcon(goal)} /></span>
        <h3 className="min-w-0 text-sm leading-tight font-semibold [overflow-wrap:anywhere] sm:text-base md:sr-only">
          {goal.name}
        </h3>
        <GoalStatus status={goal.status} />
      </div>
      <div className="min-w-0 md:col-start-1 md:row-start-2">
        <p className="hidden text-lg leading-tight font-semibold [overflow-wrap:anywhere] md:block" aria-hidden="true">{goal.name}</p>
        <p className="text-xs text-slate-600 md:mt-1">{goalDate(goal)}</p>
        <p className="mt-1 flex flex-wrap items-baseline gap-x-1 leading-tight tabular-nums md:mt-2">
          <strong className="text-lg tracking-tight sm:text-xl xl:text-2xl">{money(goal.saved)}</strong>
          <span className="text-xs font-medium text-slate-600 sm:text-sm">/ {money(goal.target)}</span>
        </p>
      </div>
      <button
        type="button"
        onClick={onSelect}
        aria-label={`View ${goal.name}`}
        className="absolute inset-0 cursor-pointer rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      />
      <div className="col-span-2 hidden items-center justify-between gap-2 border-t border-slate-200 pt-2 text-xs md:flex">
        <span className="text-slate-600">Monthly contribution</span>
        <strong className="tabular-nums">{goal.monthly ? `${money(goal.monthly)}/mo` : "—"}</strong>
      </div>
    </li>
  );
}
