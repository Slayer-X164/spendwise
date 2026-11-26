import { Wallet01Icon } from "@hugeicons/core-free-icons";
import { activityByPeriod, getAnalytics, type AnalyticsData } from "@/features/analytics/data";

const defaultLimits = {
  "Food & Dining": 900,
  Shopping: 500,
  Bills: 550,
  Transport: 400,
  Health: 300,
  Entertainment: 250,
  Other: 600,
} satisfies Record<AnalyticsData["categoryTotals"][number]["name"], number>;

export const maxBudgetLimit = 9_999_999;
export const warningThreshold = 80;

export type CategoryLimit = { name: string; limit: number };
export type BudgetPreferences = {
  nearLimitAlerts: boolean;
  rollover: boolean;
  dailyReminder: boolean;
};

export type BudgetSettings = {
  limits: Record<string, CategoryLimit[]>;
  preferences: BudgetPreferences;
};

export const defaultBudgetSettings: BudgetSettings = {
  limits: {},
  preferences: { nearLimitAlerts: true, rollover: false, dailyReminder: false },
};

const monthFormat = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
const dayFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

export const budgetMonths = activityByPeriod.Month.map(({ label }, index) => {
  const { days, spend, categoryTotals } = getAnalytics("Month", index);
  const first = days[0].date;
  const last = days[days.length - 1].date;
  const year = first.getUTCFullYear();
  const month = first.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  return {
    label,
    fullLabel: monthFormat.format(first),
    resetLabel: dayFormat.format(new Date(Date.UTC(year, month + 1, 1))),
    daysLeft: daysInMonth - last.getUTCDate(),
    daysElapsed: days.length,
    spend: roundMoney(spend),
    categories: categoryTotals,
  };
});

export const budgetMonthOptions = budgetMonths.map(({ label }, value) => ({ label, value }));

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function getLimits(monthIndex: number, settings: BudgetSettings) {
  const month = budgetMonths[monthIndex];
  if (!month) return [];

  const saved = settings.limits[month.label] ?? [];
  const defaults = Object.entries(defaultLimits).map(([name, limit]) => ({ name, limit }));
  return [
    ...defaults.map((entry) => saved.find(({ name }) => name === entry.name) ?? entry),
    ...saved.filter(({ name }) => !Object.hasOwn(defaultLimits, name)),
  ];
}

export function getMonthlyBudget(index: number, settings: BudgetSettings) {
  const month = budgetMonths[index];
  const previousMonth = budgetMonths[index + 1];
  const previousLimits = settings.preferences.rollover ? getLimits(index + 1, settings) : [];
  const categories = getLimits(index, settings).map(({ name, limit }) => {
    const category = month.categories.find((entry) => entry.name === name);
    const previous = previousLimits.find((entry) => entry.name === name);
    const previousSpend = previousMonth?.categories.find((entry) => entry.name === name)?.amount ?? 0;
    const rollover = previous ? Math.max(0, roundMoney(previous.limit - previousSpend)) : 0;
    const totalLimit = roundMoney(limit + rollover);
    const spend = roundMoney(category?.amount ?? 0);
    const remaining = roundMoney(totalLimit - spend);
    const percentage = spend / totalLimit * 100;

    return {
      name,
      limit,
      totalLimit,
      spend,
      remaining,
      percentage,
      icon: category?.icon ?? Wallet01Icon,
      color: category?.color ?? "#64748b",
      status: remaining < 0 ? "over" as const : percentage >= warningThreshold ? "near" as const : "under" as const,
    };
  });
  const limit = roundMoney(categories.reduce((total, category) => total + category.totalLimit, 0));
  const remaining = roundMoney(limit - month.spend);
  const remainingCents = Math.max(0, Math.round(remaining * 100));
  const safePerDay = month.daysLeft ? Math.floor(remainingCents / month.daysLeft) / 100 : 0;
  const alerts = categories
    .filter(({ status }) => status === "over" || (status === "near" && settings.preferences.nearLimitAlerts))
    .sort((first, second) => second.percentage - first.percentage);

  return { ...month, categories, limit, remaining, safePerDay, alerts };
}

export type MonthlyBudget = ReturnType<typeof getMonthlyBudget>;
export type BudgetCategory = MonthlyBudget["categories"][number];
