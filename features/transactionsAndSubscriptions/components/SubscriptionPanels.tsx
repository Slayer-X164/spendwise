import { Alert02Icon, ArrowReloadHorizontalIcon, Calendar03Icon, Notification01Icon, PieChartIcon, SparklesIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CardHeading, { CardIcon, cardClass } from "@/features/dashboard/components/CardHeading";
import SpendingDonut from "@/features/ui/components/SpendingDonut";
import { daysBetween, formatChargeDate, subscriptionCategories, subscriptionMoney, type SubscriptionDetails } from "../subscriptionData";
import SubscriptionMark from "./SubscriptionMark";

export function SubscriptionSummary({ activeCount, yearly, upcoming, potentialSavings }: {
  activeCount: number;
  yearly: number;
  upcoming: SubscriptionDetails[];
  potentialSavings: number;
}) {
  const cards = [
    { label: "Monthly cost", icon: ArrowReloadHorizontalIcon, amount: yearly / 12, detail: `${activeCount} active`, tone: "bg-slate-100 text-slate-700" },
    { label: "Yearly projection", icon: Calendar03Icon, amount: yearly, detail: "At current prices", tone: "bg-blue-100 text-blue-800" },
    { label: "Due in 7 days", icon: Notification01Icon, amount: upcoming.reduce((total, item) => total + item.price, 0), detail: `${upcoming.length} ${upcoming.length === 1 ? "renewal" : "renewals"}`, tone: "bg-amber-100 text-amber-800" },
    { label: "Potential savings", icon: SparklesIcon, amount: potentialSavings, detail: potentialSavings ? `${subscriptionMoney(potentialSavings / 12)}/mo from unused plans` : "No flagged plans", tone: "bg-green-100 text-green-800" },
  ];

  return (
    <section aria-label="Subscription summary" className="grid min-w-0 grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map(({ label, icon, amount, detail, tone }) => {
        const [whole, fraction] = subscriptionMoney(amount).split(".");

        return (
          <div key={label} className={`${cardClass} flex flex-col gap-3 bg-neutral-50 sm:gap-4`}>
            <h2 className="flex items-center gap-2 text-xs leading-tight font-semibold text-slate-600 sm:text-sm">
              <CardIcon icon={icon} />
              {label}
            </h2>
            <p className="text-xl leading-none font-bold tracking-tight tabular-nums [overflow-wrap:anywhere] sm:text-2xl xl:text-3xl">
              {whole}<span className="text-sm text-neutral-500 sm:text-base">.{fraction}</span>
            </p>
            <span className={`mt-auto w-fit rounded-full px-2 py-1 text-xs leading-tight font-medium ${tone}`}>{detail}</span>
          </div>
        );
      })}
    </section>
  );
}

export function UpcomingRenewals({ subscriptions, today, onEdit }: {
  subscriptions: SubscriptionDetails[];
  today: string;
  onEdit: (subscription: SubscriptionDetails) => void;
}) {
  return (
    <section aria-label="Upcoming renewals" className={`${cardClass} grid min-w-0 gap-3 bg-neutral-50`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <CardHeading icon={Notification01Icon}>Upcoming renewals</CardHeading>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">Next 7 days</span>
      </div>
      {subscriptions.length ? (
        <ul className="max-h-72 divide-y divide-slate-200 overflow-y-auto">
          {subscriptions.map((subscription) => {
            const days = daysBetween(today, subscription.nextCharge);
            const timing = days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;

            return (
              <li key={subscription.id}>
                <button
                  type="button"
                  aria-label={`Review ${subscription.name} renewal`}
                  aria-haspopup="dialog"
                  className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg py-2.5 text-left hover:bg-slate-100 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-blue-600"
                  onClick={() => onEdit(subscription)}
                >
                  <SubscriptionMark name={subscription.name} />
                  <span className="min-w-0 flex-1">
                    <strong className="block text-sm [overflow-wrap:anywhere]">{subscription.name}</strong>
                    <span className="block text-xs text-slate-600">
                      <time dateTime={subscription.nextCharge}>{formatChargeDate(subscription.nextCharge, true)}</time> · {timing}
                    </span>
                  </span>
                  <strong className="max-w-24 text-right text-sm tabular-nums [overflow-wrap:anywhere]">{subscriptionMoney(subscription.price)}</strong>
                </button>
              </li>
            );
          })}
        </ul>
      ) : <p className="rounded-xl bg-slate-100 px-3 py-4 text-sm text-slate-600">No renewals in the next 7 days.</p>}
    </section>
  );
}

export function SubscriptionCostSplit({ subscriptions }: { subscriptions: SubscriptionDetails[] }) {
  const total = subscriptions.reduce((sum, item) => sum + item.monthly, 0);
  const categories = subscriptionCategories.map(({ value, label, color }) => ({
    name: label,
    color,
    amount: subscriptions.reduce((sum, item) => item.category === value ? sum + item.monthly / 100 : sum, 0),
  })).filter(({ amount }) => amount > 0);

  return (
    <section aria-label="Cost split" className={`${cardClass} min-w-0 bg-neutral-50`}>
      <CardHeading icon={PieChartIcon}>Cost split</CardHeading>
      {total > 0 ? (
        <div className="mt-4">
          <SpendingDonut key={categories.map(({ name }) => name).join("|")} total={total / 100} categories={categories} label="Monthly" />
        </div>
      ) : <p className="mt-3 rounded-xl bg-slate-100 px-3 py-4 text-sm text-slate-600">No active subscription costs.</p>}
    </section>
  );
}

export function UnusedSubscription({ subscription, onEdit, onKeep }: {
  subscription: SubscriptionDetails;
  onEdit: () => void;
  onKeep: () => void;
}) {
  return (
    <section aria-label="Possibly unused" className={`${cardClass} grid min-w-0 gap-3 border-neutral-800 bg-neutral-800 text-white`}>
      <h2 className="flex items-center gap-2 text-base font-semibold tracking-tight sm:text-lg">
        <HugeiconsIcon icon={Alert02Icon} className="size-5 shrink-0 text-amber-400" aria-hidden="true" />
        Possibly unused
      </h2>
      <p className="text-sm leading-relaxed text-neutral-300">
        Last recorded use of <strong>{subscription.name}</strong> was {subscription.daysUnused} days ago. Canceling this plan could save <strong>{subscriptionMoney(subscription.yearly)}</strong> a year.
      </p>
      <div className="grid grid-cols-2 gap-2 text-sm font-semibold">
        <button type="button" onClick={onEdit} className="min-h-10 cursor-pointer rounded-full bg-[#1257ff] px-3 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-blue-300">
          Review plan
        </button>
        <button type="button" onClick={onKeep} className="min-h-10 cursor-pointer rounded-full bg-neutral-700 px-3 hover:bg-neutral-600 focus-visible:outline-2 focus-visible:outline-blue-300">
          Keep
        </button>
      </div>
    </section>
  );
}
