import { formatMoney } from "@/features/dashboard/data";
import type { LedgerTransaction } from "./ledger";

export const subscriptionCategories = [
  { value: "Entertainment", label: "Entertainment", color: "#82a7fa" },
  { value: "Work tools", label: "Work tools", color: "#1257ff" },
  { value: "Health & fitness", label: "Health & fitness", color: "#262626" },
  { value: "Cloud storage", label: "Cloud storage", color: "#8290a5" },
  { value: "Other", label: "Other", color: "#9b78cd" },
] as const;

export const billingOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
] as const;

export const trackingOptions = [
  { value: "active", label: "Active" },
  { value: "paused", label: "Paused" },
  { value: "canceled", label: "Canceled" },
] as const;

export type SubscriptionCategory = (typeof subscriptionCategories)[number]["value"];
export type BillingCycle = (typeof billingOptions)[number]["value"];
export type TrackingStatus = (typeof trackingOptions)[number]["value"];
export type SubscriptionPlan = {
  name: string;
  plan: string;
  category: SubscriptionCategory;
  cycle: BillingCycle;
  price: number;
  chargeDate: string;
  lastUsed: string;
  status: TrackingStatus;
};
export type Subscription = SubscriptionPlan & { id: string; reviewed: boolean };

export const demoSubscriptionDate = "2026-11-27";
export const maxSubscriptionPrice = 9_999_999;
const unusedThreshold = 45;
const dayMs = 86_400_000;

function sample(id: string, name: string, plan: string, category: SubscriptionCategory, price: number, chargeDate: string, lastUsed = ""): Subscription {
  return { id, name, plan, category, price, chargeDate, lastUsed, cycle: "monthly", status: "active", reviewed: false };
}

export const demoSubscriptions = [
  sample("netflix", "Netflix", "Standard", "Entertainment", 1549, "2026-12-22"),
  sample("spotify", "Spotify", "Premium", "Entertainment", 1199, "2026-11-27"),
  sample("icloud", "iCloud+", "200 GB", "Cloud storage", 299, "2026-12-03"),
  sample("notion", "Notion", "Plus", "Work tools", 1000, "2026-11-30"),
  sample("figma", "Figma", "Professional", "Work tools", 1500, "2026-12-05"),
  sample("adobe", "Adobe Creative Cloud", "Photography", "Work tools", 2299, "2026-12-09", "2026-10-13"),
  sample("fitzone", "FitZone Gym", "Standard", "Health & fitness", 2900, "2026-12-01"),
];

const shortDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const weekdayDate = new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });

export function formatChargeDate(date: string, weekday = false) {
  return (weekday ? weekdayDate : shortDate).format(new Date(date));
}

export function subscriptionMoney(cents: number) {
  return formatMoney(cents / 100);
}

export function daysBetween(first: string, second: string) {
  return (Date.parse(second) - Date.parse(first)) / dayMs;
}

export function getNextCharge(chargeDate: string, cycle: BillingCycle, today: string) {
  if (chargeDate >= today) return chargeDate;
  const [year, month, day] = chargeDate.split("-").map(Number);
  const [currentYear, currentMonth] = today.split("-").map(Number);
  const billingMonths = cycle === "yearly" ? 12 : 1;
  const elapsedMonths = (currentYear - year) * 12 + currentMonth - month;
  const periods = Math.floor(elapsedMonths / billingMonths);

  function dateForPeriod(period: number) {
    const targetMonth = month - 1 + billingMonths * period;
    const lastDay = new Date(Date.UTC(year, targetMonth + 1, 0)).getUTCDate();
    return new Date(Date.UTC(year, targetMonth, Math.min(day, lastDay))).toISOString().slice(0, 10);
  }

  const candidate = dateForPeriod(periods);
  return candidate < today ? dateForPeriod(periods + 1) : candidate;
}

export function getSubscriptionDetails(subscription: Subscription, today: string) {
  const active = subscription.status === "active";
  const nextCharge = active ? getNextCharge(subscription.chargeDate, subscription.cycle, today) : "";
  const daysUnused = subscription.lastUsed ? daysBetween(subscription.lastUsed, today) : 0;
  const unused = active && !subscription.reviewed && daysUnused >= unusedThreshold;
  const yearly = active ? subscription.price * (subscription.cycle === "monthly" ? 12 : 1) : 0;
  return { ...subscription, nextCharge, daysUnused, unused, yearly, monthly: yearly / 12 };
}

export type SubscriptionDetails = ReturnType<typeof getSubscriptionDetails>;

export function subscriptionNameKey(name: string) {
  return name.replace(/\bsubscription\b/gi, "").trim().replace(/\s+/g, " ").toLowerCase();
}

export function detectSubscriptions(rows: LedgerTransaction[]) {
  const merchants = new Map<string, LedgerTransaction[]>();
  for (const row of rows) {
    if (row.amount >= 0 || row.status !== "Completed") continue;
    const key = subscriptionNameKey(row.merchant);
    if (key) merchants.set(key, [...(merchants.get(key) ?? []), row]);
  }

  return [...merchants.entries()].flatMap(([key, charges]) => {
    const [latest, previous] = [...charges].sort((first, second) => second.date.localeCompare(first.date));
    const explicitlyRecurring = /\bsubscription\b/i.test(latest.merchant);
    const samePrice = previous && Math.round(latest.amount * 100) === Math.round(previous.amount * 100);
    const interval = previous ? daysBetween(previous.date, latest.date) : 0;
    const roughlyMonthly = interval >= 26 && interval <= 34;
    const roughlyYearly = interval >= 360 && interval <= 370;
    if (!explicitlyRecurring && !(samePrice && (roughlyMonthly || roughlyYearly))) return [];

    const plan: SubscriptionPlan = {
      name: latest.merchant.replace(/\bsubscription\b/gi, "").trim(),
      plan: "",
      category: latest.category === "Entertainment" ? "Entertainment" : "Other",
      cycle: roughlyYearly ? "yearly" : "monthly",
      price: Math.round(-latest.amount * 100),
      chargeDate: latest.date,
      lastUsed: "",
      status: "active",
    };
    return [{ key, plan, lastCharge: latest.date }];
  });
}

export type DetectedSubscription = ReturnType<typeof detectSubscriptions>[number];
