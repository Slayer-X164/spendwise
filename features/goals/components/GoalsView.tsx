"use client";

import { PlusSignIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRef, useState } from "react";
import { cardClass } from "@/features/dashboard/components/CardHeading";
import { localDate } from "@/lib/useLocalDate";
import { getGoalProgress, getSaved, getSavingsHistory, money, type Contribution, type GoalPlan } from "../data";
import useGoals, { updateGoals } from "../useGoals";
import { FeaturedGoal, GoalCard } from "./GoalCards";
import GoalDialog, { type GoalDialogMode } from "./GoalDialog";
import SavingsGrowth from "./SavingsGrowth";

const filters = ["Active", "Completed", "All"] as const;
type GoalFilter = typeof filters[number];

export default function GoalsView() {
  const { goals, today } = useGoals();
  const [filter, setFilter] = useState<GoalFilter>("All");
  const [selectedId, setSelectedId] = useState("travel");
  const [dialog, setDialog] = useState<{ mode: GoalDialogMode; goalId?: string } | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const featuredRef = useRef<HTMLDivElement>(null);
  const progress = goals.map((goal) => getGoalProgress(goal, today));
  const active = progress.filter(({ completedAt }) => !completedAt);
  const visible = filter === "All" ? progress : progress.filter(({ completedAt }) => Boolean(completedAt) === (filter === "Completed"));
  const featured = visible.find(({ id }) => id === selectedId) ?? visible[0];
  const otherGoals = visible.filter(({ id }) => id !== featured?.id);
  const dialogGoal = progress.find(({ id }) => id === dialog?.goalId);
  const activeSaved = active.reduce((sum, item) => sum + item.saved, 0);
  const activeTarget = active.reduce((sum, item) => sum + item.target, 0);
  const history = getSavingsHistory(progress, today);

  function openGoal(id: string) {
    setSelectedId(id);
    requestAnimationFrame(() => {
      featuredRef.current?.scrollIntoView({ block: "start" });
      featuredRef.current?.focus({ preventScroll: true });
    });
  }

  function savePlan(plan: GoalPlan) {
    if (dialog?.mode === "create") {
      const id = Array.from(crypto.getRandomValues(new Uint32Array(4)), (value) => value.toString(16)).join("-");
      updateGoals((current) => [...current, { ...plan, id, contributions: [] }]);
      setSelectedId(id);
      if (filter === "Completed") setFilter("All");
      setAnnouncement(`${plan.name} created.`);
      setDialog(null);
      return;
    }

    let error: string | undefined;
    let updatedId: string | undefined;
    let finished = false;
    updateGoals((current) => {
      const existing = current.find(({ id }) => id === dialog?.goalId);
      if (!existing) {
        error = "This goal is no longer available.";
        return current;
      }
      const saved = getSaved(existing);
      if (plan.target < saved) {
        error = `Set the target to at least ${money(saved)} already saved.`;
        return current;
      }
      updatedId = existing.id;
      finished = plan.target === saved;
      return current.map((goal) => goal.id === existing.id ? { ...goal, ...plan } : goal);
    });
    if (error) return error;
    if ((filter === "Active" && finished) || (filter === "Completed" && !finished)) setFilter("All");
    if (updatedId) setSelectedId(updatedId);
    setAnnouncement(`${plan.name} updated.`);
    setDialog(null);
  }

  function saveContribution(contribution: Contribution) {
    let error: string | undefined;
    let completed = false;
    updateGoals((current) => {
      const existing = current.find(({ id }) => id === dialog?.goalId);
      const remaining = existing ? existing.target - getSaved(existing) : 0;
      if (!existing || contribution.amount <= 0 || contribution.amount > remaining || contribution.date > localDate()) {
        error = "Enter an amount within the remaining target and a date up to today.";
        return current;
      }
      completed = contribution.amount === remaining;
      return current.map((goal) => goal.id === existing.id ? { ...goal, contributions: [...goal.contributions, contribution] } : goal);
    });
    if (error) return error;
    if (dialog?.goalId) setSelectedId(dialog.goalId);
    if (completed && filter === "Active") setFilter("All");
    setAnnouncement(completed ? "Contribution recorded. Goal completed." : "Contribution recorded.");
    setDialog(null);
  }

  return (
    <main aria-label="Goals" className="grid min-w-0 gap-4 sm:gap-5">
      <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-1 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:gap-3">

        <div className="col-start-1 row-start-1 min-w-0 text-left sm:col-start-1 sm:text-left">
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Goals</h1>
          <p className="mt-1 text-sm text-slate-600 ">
            {active.length} active {active.length === 1 ? "goal" : "goals"} · {money(activeSaved)} saved of {money(activeTarget)}
          </p>
        </div>
        <div role="group" aria-label="Goal filters" className="col-span-3 col-start-1 row-start-2 grid grid-cols-3 rounded-full border border-neutral-300 bg-neutral-50 p-1 sm:col-span-1 sm:col-start-2 sm:row-start-1">
          {filters.map((item) => (
            <button key={item} type="button" aria-pressed={filter === item} onClick={() => setFilter(item)} className="min-h-9 cursor-pointer rounded-full px-3 text-sm font-medium text-slate-600 hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-blue-600 aria-pressed:bg-neutral-800 aria-pressed:text-white">
              {item}
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-haspopup="dialog"
          onClick={() => setDialog({ mode: "create" })}
          className="col-start-3 row-start-1 flex min-h-10 min-w-10 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#1257ff] px-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/25 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:px-4"
        >
          <HugeiconsIcon icon={PlusSignIcon} className="size-5 sm:size-4" />
          <span>New goal</span>
        </button>
      </div>

      <div className={`grid min-w-0 items-start gap-4 sm:gap-5 ${featured ? "lg:grid-cols-[minmax(18rem,1fr)_minmax(0,2fr)] xl:grid-cols-[minmax(19rem,1fr)_minmax(0,2.15fr)]" : ""}`}>
        {featured && (
          <div ref={featuredRef} tabIndex={-1} className="min-w-0 scroll-m-4 outline-none">
            <FeaturedGoal
              goal={featured}
              onAddFunds={() => setDialog({ mode: "contribute", goalId: featured.id })}
              onEdit={() => setDialog({ mode: "edit", goalId: featured.id })}
            />
          </div>
        )}
        <div className="grid min-w-0 gap-4 sm:gap-5">
          {(otherGoals.length > 0 || !featured) && (
            <section aria-labelledby="goal-list-title" className="grid min-w-0 gap-3">
              <div className="flex items-center justify-between gap-2 px-1">
                <h2 id="goal-list-title" className="text-lg font-semibold tracking-tight sm:text-xl">{filter === "All" ? "All goals" : `${filter} goals`}</h2>
                <span className="text-sm font-semibold text-blue-700">{filter === "Completed" ? `${visible.length} completed` : `${active.length} active`}</span>
              </div>
              {otherGoals.length ? (
                <ul className="grid min-w-0 gap-3 sm:gap-4 md:grid-cols-2">
                  {otherGoals.map((goal) => <GoalCard key={goal.id} goal={goal} onSelect={() => openGoal(goal.id)} />)}
                </ul>
              ) : (
                <p className={`${cardClass} bg-neutral-50 text-sm text-slate-600`}>No {filter === "All" ? "" : `${filter.toLowerCase()} `}goals yet.</p>
              )}
            </section>
          )}
          <SavingsGrowth history={history} />
        </div>
      </div>

      <span role="status" className="sr-only">{announcement}</span>
      {dialog && (
        <GoalDialog
          mode={dialog.mode}
          goal={dialogGoal}
          today={today}
          onSavePlan={savePlan}
          onSaveContribution={saveContribution}
          onClose={() => setDialog(null)}
        />
      )}
    </main>
  );
}
