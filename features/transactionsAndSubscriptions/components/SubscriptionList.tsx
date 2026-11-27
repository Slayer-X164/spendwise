import { ArrowReloadHorizontalIcon, MoreHorizontalIcon, Search01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import CardHeading, { cardClass } from "@/features/dashboard/components/CardHeading";
import SelectListbox from "@/features/ui/components/SelectListbox";
import { billingOptions, formatChargeDate, subscriptionCategories, subscriptionMoney, type SubscriptionDetails } from "../subscriptionData";
import SubscriptionMark from "./SubscriptionMark";

export const sortOptions = [
  { value: "renewal", label: "Next charge" },
  { value: "cost", label: "Highest monthly cost" },
  { value: "name", label: "Service name" },
] as const;

export type SubscriptionSort = (typeof sortOptions)[number]["value"];

function StatusLabel({ subscription }: { subscription: SubscriptionDetails }) {
  const { status, unused, daysUnused } = subscription;
  const color = unused ? "bg-amber-100 text-amber-800" : status === "active" ? "bg-green-100 text-green-800" : "bg-slate-200 text-slate-700";
  const label = unused ? `Unused ${daysUnused}d` : status === "active" ? "Active" : status === "paused" ? "Paused" : "Canceled";

  return <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold leading-tight ${color}`}>{label}</span>;
}

function ServiceLabel({ subscription }: { subscription: SubscriptionDetails }) {
  return (
    <span className="block min-w-0">
      <span className="block font-semibold [overflow-wrap:anywhere]">{subscription.name}</span>
      <span className="block text-xs text-slate-600 [overflow-wrap:anywhere]">{subscription.plan || subscription.category}</span>
    </span>
  );
}

export default function SubscriptionList({
  subscriptions,
  search,
  onSearch,
  sort,
  onSort,
  onEdit,
}: {
  subscriptions: SubscriptionDetails[];
  search: string;
  onSearch: (value: string) => void;
  sort: SubscriptionSort;
  onSort: (value: SubscriptionSort) => void;
  onEdit: (subscription: SubscriptionDetails) => void;
}) {
  const monthlyTotal = subscriptions.reduce((sum, item) => sum + item.monthly, 0);

  return (
    <section aria-label="All subscriptions" className={`${cardClass} grid min-w-0 gap-4 bg-neutral-50`}>
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <CardHeading icon={ArrowReloadHorizontalIcon}>All subscriptions</CardHeading>
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2 sm:w-auto sm:flex-nowrap">
          <label className="flex min-h-9 min-w-0 flex-1 basis-32 items-center gap-2 rounded-full bg-slate-100 px-3 focus-within:outline-2 focus-within:outline-blue-600 sm:w-36">
            <HugeiconsIcon icon={Search01Icon} className="size-4 shrink-0 text-slate-500" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search subscriptions"
              placeholder="Search"
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              className="w-full min-w-0 bg-transparent text-sm outline-none placeholder:text-slate-600"
            />
          </label>
          <SelectListbox
            label="Sort subscriptions"
            value={sort}
            onChange={onSort}
            options={sortOptions}
            buttonClassName="min-h-9 rounded-full bg-slate-100 px-3 text-xs font-medium hover:bg-slate-200 sm:text-sm"
          />
        </div>
      </div>

      {subscriptions.length ? (
        <>
          <table className="hidden w-full table-fixed border-separate border-spacing-y-1 text-left text-sm xl:table">
            <colgroup>
              <col className="w-[28%]" /><col className="w-[18%]" /><col className="w-[11%]" />
              <col className="w-[14%]" /><col className="w-[11%]" /><col className="w-[13%]" /><col className="w-[5%]" />
            </colgroup>
            <thead className="text-xs font-semibold tracking-wide text-slate-600 uppercase">
              <tr>
                <th scope="col" className="px-2 pb-2">Service</th>
                <th scope="col" className="px-2 pb-2">Category</th>
                <th scope="col" className="px-2 pb-2">Billing</th>
                <th scope="col" className="px-2 pb-2">Next charge</th>
                <th scope="col" className="px-2 pb-2">Price</th>
                <th scope="col" className="px-2 pb-2">Status</th>
                <th scope="col"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {subscriptions.map((subscription) => (
                <tr key={subscription.id} className="even:bg-slate-100/80">
                  <td className="rounded-l-xl px-2 py-2.5">
                    <div className="flex min-w-0 items-center gap-2">
                      <SubscriptionMark name={subscription.name} />
                      <ServiceLabel subscription={subscription} />
                    </div>
                  </td>
                  <td className="px-2">
                    <span className="flex items-center gap-1.5">
                      <i aria-hidden="true" className="size-2 shrink-0 rounded-full" style={{ backgroundColor: subscriptionCategories.find(({ value }) => value === subscription.category)?.color }} />
                      {subscription.category}
                    </span>
                  </td>
                  <td className="px-2 text-slate-600">{billingOptions.find(({ value }) => value === subscription.cycle)?.label}</td>
                  <td className="px-2 font-medium">{subscription.nextCharge ? <time dateTime={subscription.nextCharge}>{formatChargeDate(subscription.nextCharge)}</time> : "—"}</td>
                  <td className="px-2 font-semibold tabular-nums [overflow-wrap:anywhere]">{subscriptionMoney(subscription.price)}</td>
                  <td className="px-2"><StatusLabel subscription={subscription} /></td>
                  <td className="rounded-r-xl">
                    <button
                      type="button"
                      aria-label={`Edit ${subscription.name}`}
                      aria-haspopup="dialog"
                      onClick={() => onEdit(subscription)}
                      className="grid size-8 cursor-pointer place-items-center rounded-full text-slate-600 hover:bg-slate-200 hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-blue-600"
                    >
                      <HugeiconsIcon icon={MoreHorizontalIcon} className="size-4" aria-hidden="true" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <ul className="divide-y divide-slate-200 xl:hidden">
            {subscriptions.map((subscription) => (
              <li key={subscription.id}>
                <button
                  type="button"
                  aria-label={`Edit ${subscription.name}`}
                  aria-haspopup="dialog"
                  onClick={() => onEdit(subscription)}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-lg py-3 text-left text-sm focus-visible:outline-2 focus-visible:outline-blue-600 sm:gap-3"
                >
                  <SubscriptionMark name={subscription.name} />
                  <span className="min-w-0 flex-1">
                    <ServiceLabel subscription={subscription} />
                    {subscription.nextCharge && (
                      <span className="block text-xs text-slate-600">
                        Next <time dateTime={subscription.nextCharge}>{formatChargeDate(subscription.nextCharge)}</time>
                      </span>
                    )}
                  </span>
                  <span className="grid max-w-30 shrink-0 justify-items-end gap-1 text-right">
                    <strong className="font-semibold tabular-nums [overflow-wrap:anywhere]">
                      {subscriptionMoney(subscription.price)}<small className="text-xs font-normal text-slate-600">/{subscription.cycle === "monthly" ? "mo" : "yr"}</small>
                    </strong>
                    {(subscription.unused || subscription.status !== "active") && <StatusLabel subscription={subscription} />}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-1 pt-3 text-sm">
            <span className="text-slate-600">{search.trim() ? "Matching monthly total" : "Total per month"}</span>
            <strong className="text-base tracking-tight tabular-nums sm:text-lg">{subscriptionMoney(monthlyTotal)}</strong>
          </div>
        </>
      ) : (
        <p className="rounded-2xl bg-slate-100 px-4 py-5 text-sm text-slate-600">
          {search.trim() ? "No subscriptions match your search." : "Add a subscription to start tracking recurring charges."}
        </p>
      )}
    </section>
  );
}
