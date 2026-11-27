"use client";

import { PlusSignIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useState } from "react";
import useLocalDate from "@/lib/useLocalDate";
import { transactions } from "../ledger";
import { daysBetween, demoSubscriptionDate, detectSubscriptions, getNextCharge, getSubscriptionDetails, subscriptionMoney, type Subscription, type SubscriptionPlan } from "../subscriptionData";
import useSubscriptions, { updateSubscriptions } from "../useSubscriptions";
import { SubscriptionDetection, SubscriptionEditor } from "./SubscriptionDialogs";
import SubscriptionList, { type SubscriptionSort } from "./SubscriptionList";
import { SubscriptionCostSplit, SubscriptionSummary, UnusedSubscription, UpcomingRenewals } from "./SubscriptionPanels";

type SubscriptionDialog = { type: "detect" } | { type: "add"; initial?: SubscriptionPlan } | { type: "edit"; id: string };

const actionClass = "flex min-h-10 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 sm:gap-2 sm:px-4 sm:text-sm";

export default function SubscriptionsView() {
  const subscriptions = useSubscriptions();
  const today = useLocalDate(demoSubscriptionDate);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SubscriptionSort>("renewal");
  const [dialog, setDialog] = useState<SubscriptionDialog | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const details = subscriptions.map((subscription) => getSubscriptionDetails(subscription, today));
  const active = details.filter(({ status }) => status === "active");
  const yearly = active.reduce((sum, item) => sum + item.yearly, 0);
  const unused = active.filter((item) => item.unused).sort((first, second) => second.yearly - first.yearly);
  const potentialSavings = unused.reduce((sum, item) => sum + item.yearly, 0);
  const upcoming = active
    .filter(({ nextCharge }) => daysBetween(today, nextCharge) <= 7)
    .sort((first, second) => first.nextCharge.localeCompare(second.nextCharge));
  const query = search.trim().toLowerCase();
  const visible = details
    .filter(({ name, plan, category }) => [name, plan, category].some((value) => value.toLowerCase().includes(query)))
    .sort((first, second) => {
      if (sort === "name") return first.name.localeCompare(second.name);
      if (sort === "cost") return second.monthly - first.monthly || first.name.localeCompare(second.name);
      if (!first.nextCharge || !second.nextCharge) return Number(!first.nextCharge) - Number(!second.nextCharge) || first.name.localeCompare(second.name);
      return first.nextCharge.localeCompare(second.nextCharge) || first.name.localeCompare(second.name);
    });
  const selected = dialog?.type === "edit" ? details.find((item) => item.id === dialog.id) : undefined;
  const initial = selected ? { ...selected, chargeDate: selected.nextCharge || selected.chargeDate } : dialog?.type === "add" ? dialog.initial : undefined;

  function edit(item: Subscription) {
    setDialog({ type: "edit", id: item.id });
  }

  function save(plan: SubscriptionPlan) {
    if (dialog?.type === "edit") {
      let updated = false;
      updateSubscriptions((current) => {
        const original = current.find((item) => item.id === dialog.id);
        if (!original) return current;
        updated = true;
        const reviewed = original.lastUsed === plan.lastUsed && original.reviewed;
        const originalNextCharge = getNextCharge(original.chargeDate, original.cycle, today);
        const chargeDate = original.status === "active" && plan.chargeDate === originalNextCharge && plan.cycle === original.cycle
          ? original.chargeDate
          : plan.chargeDate;
        return current.map((item) => item.id === original.id ? { ...item, ...plan, reviewed, chargeDate } : item);
      });
      if (!updated) return "This subscription is no longer available.";
      setAnnouncement(`${plan.name} updated.`);
    } else {
      const id = Array.from(crypto.getRandomValues(new Uint32Array(4)), (value) => value.toString(16)).join("-");
      updateSubscriptions((current) => [...current, { ...plan, id, reviewed: false }]);
      setSearch("");
      setAnnouncement(`${plan.name} added.`);
    }
    setDialog(null);
  }

  function keep(item: Subscription) {
    updateSubscriptions((current) => current.map((entry) => entry.id === item.id ? { ...entry, reviewed: true } : entry));
    setAnnouncement(`${item.name} kept.`);
  }

  return (
    <main aria-label="Subscriptions" className="grid min-w-0 gap-4 sm:gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="min-w-0">
          <h1 className="text-3xl leading-tight font-bold tracking-tight sm:text-4xl">Subscriptions</h1>
          <p className="mt-1 text-sm text-slate-600">
            {active.length} active {active.length === 1 ? "subscription" : "subscriptions"} · {subscriptionMoney(yearly / 12)} per month
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" aria-haspopup="dialog" onClick={() => setDialog({ type: "detect" })} className={`${actionClass} border border-neutral-300 bg-neutral-50 hover:bg-neutral-200`}>
            <HugeiconsIcon icon={SparklesIcon} className="size-4 shrink-0" aria-hidden="true" />
            Detect from transactions
          </button>
          <button type="button" aria-haspopup="dialog" onClick={() => setDialog({ type: "add" })} className={`${actionClass} bg-[#1257ff] text-white shadow-md shadow-blue-600/25 hover:bg-blue-700`}>
            <HugeiconsIcon icon={PlusSignIcon} className="size-4 shrink-0" aria-hidden="true" />
            Add subscription
          </button>
        </div>
      </div>

      <SubscriptionSummary activeCount={active.length} yearly={yearly} upcoming={upcoming} potentialSavings={potentialSavings} />

      <div className="grid min-w-0 items-start gap-4 sm:gap-5 xl:grid-cols-[minmax(0,1.8fr)_minmax(0,1fr)]">
        <SubscriptionList subscriptions={visible} search={search} onSearch={setSearch} sort={sort} onSort={setSort} onEdit={edit} />

        <div className="grid min-w-0 items-start gap-4 sm:gap-5 md:grid-cols-2 xl:grid-cols-1">
          <UpcomingRenewals subscriptions={upcoming} today={today} onEdit={edit} />
          <SubscriptionCostSplit subscriptions={active} />
          {unused[0] && (
            <div className="md:col-span-2 xl:col-span-1">
              <UnusedSubscription subscription={unused[0]} onEdit={() => edit(unused[0])} onKeep={() => keep(unused[0])} />
            </div>
          )}
        </div>
      </div>

      <span role="status" className="sr-only">{announcement}</span>
      {dialog?.type === "detect" && (
        <SubscriptionDetection
          matches={detectSubscriptions(transactions)}
          tracked={subscriptions}
          onReview={edit}
          onAdd={(plan) => setDialog({ type: "add", initial: { ...plan, chargeDate: getNextCharge(plan.chargeDate, plan.cycle, today) } })}
          onClose={() => setDialog(null)}
        />
      )}
      {(dialog?.type === "add" || selected) && (
        <SubscriptionEditor
          key={selected?.id ?? "add"}
          initial={initial}
          editing={Boolean(selected)}
          today={today}
          onSave={save}
          onClose={() => setDialog(null)}
        />
      )}
    </main>
  );
}
