import {
  Car01Icon,
  Film01Icon,
  Mortarboard01Icon,
  Restaurant01Icon,
  ShoppingBag01Icon,
  SmartPhone01Icon,
} from "@hugeicons/core-free-icons";

export const categories = {
  Shopping: { icon: ShoppingBag01Icon, dot: "bg-blue-500", badge: "bg-blue-100 text-blue-700" },
  Electronics: { icon: SmartPhone01Icon, dot: "bg-sky-500", badge: "bg-sky-100 text-sky-700" },
  Food: { icon: Restaurant01Icon, dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
  Education: { icon: Mortarboard01Icon, dot: "bg-violet-500", badge: "bg-violet-100 text-violet-700" },
  Entertainment: { icon: Film01Icon, dot: "bg-slate-500", badge: "bg-slate-100 text-slate-700" },
  Transportation: { icon: Car01Icon, dot: "bg-neutral-600", badge: "bg-neutral-200 text-neutral-700" },
  Groceries: { icon: ShoppingBag01Icon, dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
};

export type LedgerTransaction = {
  id: number;
  merchant: string;
  amount: number;
  method: string;
  category: keyof typeof categories;
  date: string;
  status: "Completed" | "Pending";
};

export const transactionsPerPage = 6;

export const transactions: LedgerTransaction[] = [
  { id: 1, merchant: "Adidas Ultraboost 4.0", amount: -35, method: "Cash", category: "Shopping", date: "2026-11-25", status: "Completed" },
  { id: 2, merchant: "iPhone 15 Pro Max 256GB", amount: -999, method: "Credit", category: "Electronics", date: "2026-11-24", status: "Completed" },
  { id: 3, merchant: "MacBook Pro 14 M2 - 16GB", amount: -1999, method: "Credit", category: "Electronics", date: "2026-11-03", status: "Completed" },
  { id: 4, merchant: "Lunch", amount: -6.48, method: "Bank", category: "Food", date: "2026-11-02", status: "Pending" },
  { id: 5, merchant: "Angular Courses", amount: -60.48, method: "Debit", category: "Education", date: "2026-11-01", status: "Completed" },
  { id: 6, merchant: "Netflix Subscription", amount: -15.99, method: "Credit", category: "Entertainment", date: "2026-10-30", status: "Completed" },
  { id: 7, merchant: "Petrol", amount: -12.5, method: "UPI", category: "Transportation", date: "2026-10-29", status: "Completed" },
  { id: 8, merchant: "Grocery Shopping", amount: -85.75, method: "UPI", category: "Groceries", date: "2026-10-28", status: "Completed" },
];

const fullDate = new Intl.DateTimeFormat("en-IN", {
  day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
});

const dateWithWeekday = new Intl.DateTimeFormat("en-IN", {
  weekday: "short", day: "numeric", month: "short", timeZone: "UTC",
});

export function formatLedgerDate(date: string, includeWeekday = false) {
  return (includeWeekday ? dateWithWeekday : fullDate).format(new Date(date));
}

export function getLedgerPeriod(rows: LedgerTransaction[]) {
  const latest = rows[0];
  if (!latest) return { days: 0, label: "" };

  const end = new Date(latest.date);
  const start = new Date(rows[rows.length - 1].date);
  return {
    days: (end.getTime() - start.getTime()) / 86_400_000 + 1,
    label: fullDate.formatRange(start, end).replace(/\s+/g, " "),
  };
}

const rollingDateRanges = [
  { value: "last-7-days", label: "Last 7 days", days: 7 },
  { value: "last-30-days", label: "Last 30 days", days: 30 },
  { value: "last-3-months", label: "Last 3 months", months: 3 },
  { value: "last-6-months", label: "Last 6 months", months: 6 },
] as const;

export const dateRangeOptions = rollingDateRanges.map(({ value, label }) => ({ value, label }));

function dateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getTransactionDateRange(value: string, today: Date) {
  const rolling = rollingDateRanges.find((range) => range.value === value);

  if (!rolling) return undefined;

  // Map the client's calendar day to UTC so date-only comparisons are unaffected by daylight saving.
  const year = today.getFullYear();
  const month = today.getMonth();
  const day = today.getDate();
  const end = new Date(Date.UTC(year, month, day));

  if ("days" in rolling) {
    const start = new Date(Date.UTC(year, month, day - rolling.days + 1));
    return { from: dateKey(start), to: dateKey(end) };
  }

  const startMonth = month - rolling.months;
  const lastDayOfMonth = new Date(Date.UTC(year, startMonth + 1, 0)).getUTCDate();
  const start = new Date(Date.UTC(year, startMonth, Math.min(day, lastDayOfMonth)));
  return { from: dateKey(start), to: dateKey(end) };
}
