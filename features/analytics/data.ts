import {
  Car01Icon,
  Coffee01Icon,
  Film01Icon,
  FlashIcon,
  FavouriteIcon,
  Restaurant01Icon,
  ShoppingBag01Icon,
  Wallet01Icon,
} from "@hugeicons/core-free-icons";
import { cashflow2026, monthlyBudget } from "@/features/dashboard/data";

const spendingCategories = [
  { name: "Food & Dining", shortName: "Food", color: "#1257ff", icon: Restaurant01Icon },
  { name: "Shopping", shortName: "Shopping", color: "#6d96f8", icon: ShoppingBag01Icon },
  { name: "Bills", shortName: "Bills", color: "#8592a5", icon: FlashIcon },
  { name: "Transport", shortName: "Transport", color: "#23252a", icon: Car01Icon },
  { name: "Health", shortName: "Health", color: "#adc4fd", icon: FavouriteIcon },
  { name: "Entertainment", shortName: "Entertainment", color: "#515f78", icon: Film01Icon },
  { name: "Other", shortName: "Other", color: "#cbd5e1", icon: Wallet01Icon },
] as const;

const sampleMerchants = [
  { name: "Metro Grocery", category: 0, weight: 11 },
  { name: "Urban Threads", category: 1, weight: 13 },
  { name: "City Electric Co.", category: 2, weight: 15 },
  { name: "RideGo", category: 3, weight: 11 },
  { name: "Daily Brew Coffee", category: 0, weight: 9, icon: Coffee01Icon },
  { name: "Green Bowl Café", category: 0, weight: 8 },
  { name: "Home Goods Store", category: 1, weight: 9 },
  { name: "Pharmacy Plus", category: 4, weight: 7 },
  { name: "Netflix", category: 5, weight: 6 },
  { name: "Other purchases", category: 6, weight: 5 },
  { name: "Internet service", category: 2, weight: 3 },
] as const;

const spendingPattern = [
  45, 87, 65, 128, 189, 51, 122, 80, 149, 231, 67, 105, 91,
  182, 133, 58, 153, 79, 107, 128, 77, 194, 56, 121, 83, 47,
];

const weekdays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const year = 2026;
const novemberSnapshotDay = 26;
const dayFormat = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });

type ActivityDay = {
  date: Date;
  income: number;
  spend: number;
  budget: number;
  merchantSpending: number[];
};

export const periods = ["Week", "Month", "Quarter", "Year"] as const;
export type AnalyticsPeriod = (typeof periods)[number];

export function formatPercent(value: number) {
  return `${value.toFixed(1)}%`;
}

function centsForWeights(total: number, weights: number[]) {
  const weightTotal = weights.reduce((sum, weight) => sum + weight, 0);
  let weightSoFar = 0;
  let centsSoFar = 0;

  return weights.map((weight) => {
    weightSoFar += weight;
    const next = Math.round(total * weightSoFar / weightTotal);
    const amount = next - centsSoFar;
    centsSoFar = next;
    return amount;
  });
}

const sampleActivity: ActivityDay[] = cashflow2026.flatMap(({ income, expense }, month) => {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const sampleDays = month === cashflow2026.length - 1 ? novemberSnapshotDay : daysInMonth;
  const days = Array.from({ length: sampleDays }, (_, day) => day);
  const spending = centsForWeights(Math.round(expense * 100), days.map((day) => spendingPattern[(day + month * 5 + 2) % spendingPattern.length]));
  const earnings = centsForWeights(Math.round(income * 100), days.map(() => 1));

  return days.map((day) => ({
    date: new Date(Date.UTC(year, month, day + 1)),
    income: earnings[day] / 100,
    spend: spending[day] / 100,
    budget: monthlyBudget / daysInMonth,
    merchantSpending: centsForWeights(
      spending[day],
      sampleMerchants.map(({ weight }, index) => weight * (8 + (day * 3 + month + index * 7) % 5)),
    ).map((cents) => cents / 100),
  }));
});

function weekdayIndex(date: Date) {
  return (date.getUTCDay() + 6) % weekdays.length;
}

function periodLabel(date: Date, period: AnalyticsPeriod) {
  const month = date.getUTCMonth();
  const dateYear = date.getUTCFullYear();

  switch (period) {
    case "Week": {
      const monday = new Date(Date.UTC(dateYear, month, date.getUTCDate() - weekdayIndex(date)));
      return `Week of ${dayFormat.format(monday)}`;
    }
    case "Month":
      return `${cashflow2026[month].month} ${dateYear}`;
    case "Quarter":
      return `Q${Math.floor(month / 3) + 1} ${dateYear}`;
    case "Year":
      return String(dateYear);
  }
}

function groupActivity(period: AnalyticsPeriod) {
  const grouped = new Map<string, ActivityDay[]>();

  for (const day of sampleActivity) {
    const label = periodLabel(day.date, period);
    const group = grouped.get(label);
    if (group) group.push(day);
    else grouped.set(label, [day]);
  }

  return [...grouped].reverse().map(([label, days]) => ({ label, value: label, days }));
}

export const activityByPeriod = {
  Week: groupActivity("Week"),
  Month: groupActivity("Month"),
  Quarter: groupActivity("Quarter"),
  Year: groupActivity("Year"),
};

function summarize(days: ActivityDay[]) {
  const spend = days.reduce((sum, day) => sum + day.spend, 0);
  const income = days.reduce((sum, day) => sum + day.income, 0);
  const budget = days.reduce((sum, day) => sum + day.budget, 0);
  const savingsRate = income > 0 ? (income - spend) / income * 100 : 0;
  return { spend, income, budget, savingsRate };
}

export type SpendingBucket = { label: string; spend: number; budget: number };

function spendingBuckets(days: ActivityDay[], period: AnalyticsPeriod): SpendingBucket[] {
  const groups = new Map<string, SpendingBucket>();

  for (const day of days) {
    const label = period === "Year"
      ? cashflow2026[day.date.getUTCMonth()].month
      : period === "Quarter"
        ? periodLabel(day.date, "Week").replace("Week of ", "")
        : dayFormat.format(day.date);
    const bucket = groups.get(label);
    if (bucket) {
      bucket.spend += day.spend;
      bucket.budget += day.budget;
    } else {
      groups.set(label, { label, spend: day.spend, budget: day.budget });
    }
  }
  return [...groups.values()];
}

export function getAnalytics(period: AnalyticsPeriod, index: number) {
  const groups = activityByPeriod[period];
  const { days, label } = groups[index] ?? groups[0];
  const totals = summarize(days);
  const previous = groups[index + 1];
  const comparison = previous ? summarize(previous.days.slice(0, days.length)) : undefined;
  const merchantTotals = sampleMerchants.map((merchant, merchantIndex) => ({
    ...merchant,
    icon: "icon" in merchant ? merchant.icon : spendingCategories[merchant.category].icon,
    amount: days.reduce((sum, day) => sum + day.merchantSpending[merchantIndex], 0),
  })).sort((first, second) => second.amount - first.amount);

  const categoryTotals = spendingCategories.map((category, categoryIndex) => ({
    ...category,
    amount: merchantTotals.reduce((sum, merchant) => merchant.category === categoryIndex ? sum + merchant.amount : sum, 0),
  })).sort((first, second) => second.amount - first.amount);

  const byWeekday = weekdays.map((weekday, index) => {
    const matchingDays = days.filter(({ date }) => weekdayIndex(date) === index);
    return {
      label: weekday,
      amount: matchingDays.length ? summarize(matchingDays).spend / matchingDays.length : 0,
      hasData: matchingDays.length > 0,
    };
  });

  return {
    ...totals,
    days,
    label,
    comparison,
    average: totals.spend / days.length,
    dailyBudget: totals.budget / days.length,
    buckets: spendingBuckets(days, period),
    categoryTotals,
    merchantTotals,
    byWeekday,
  };
}

export type AnalyticsData = ReturnType<typeof getAnalytics>;
