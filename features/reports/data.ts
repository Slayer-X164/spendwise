import { activityByPeriod, getAnalytics } from "@/features/analytics/data";
import { getMonthlyBudget, roundMoney, type BudgetSettings } from "@/features/budgets/data";
import { dashboardCurrency } from "@/features/dashboard/data";
import { getGoalProgress, type Goal } from "@/features/goals/data";
import { transactions } from "@/features/transactionsAndSubscriptions/ledger";

export const reportTypes = [
  { value: "summary", label: "Monthly summary", title: "Financial statement", description: "Income, spending, and savings" },
  { value: "categories", label: "Category breakdown", title: "Category breakdown", description: "Where your spending went" },
  { value: "cashflow", label: "Income vs expense", title: "Income vs expense", description: "Cashflow trends across months" },
  { value: "tax", label: "Tax activity export", title: "Tax activity", description: "Ledger transactions for tax review" },
] as const;

export const formats = ["PDF", "CSV", "XLSX"] as const;
export const reportIncludes = [
  { key: "charts", label: "Charts & graphs" },
  { key: "transactions", label: "Transactions list" },
  { key: "budgets", label: "Budget status" },
  { key: "goals", label: "Goals progress" },
] as const;

export type ReportType = (typeof reportTypes)[number]["value"];
export type ReportFormat = (typeof formats)[number];
export type ReportIncludes = Record<(typeof reportIncludes)[number]["key"], boolean>;
export type ReportOptions = { type: ReportType; period: string; include: ReportIncludes };

const fullDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthDate = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric", timeZone: "UTC" });
const dateKey = (date: Date) => date.toISOString().slice(0, 10);

export const reportPeriods = (["Month", "Quarter", "Year"] as const).flatMap((mode) =>
  activityByPeriod[mode].map(({ label, days }, index) => ({
    mode,
    index,
    value: `${mode}-${index}`,
    label: mode === "Month" ? monthDate.format(days[0].date) : mode === "Year" ? `${label} year to date` : label,
    range: fullDate.formatRange(days[0].date, days[days.length - 1].date),
    from: dateKey(days[0].date),
    to: dateKey(days[days.length - 1].date),
  })),
);

export const defaultReportOptions: ReportOptions = {
  type: "summary",
  period: reportPeriods[0].value,
  include: { charts: true, transactions: true, budgets: true, goals: false },
};

export type ReportChart = { series: { label: string; color: string }[]; points: { label: string; values: number[] }[] };
export type ReportSection = { title: string; columns: string[]; rows: (string | number)[][]; chart?: ReportChart };
export type ExportDocument = { title: string; range: string; date: string; source: string; sections: ReportSection[] };

export function formatReportDate(date: string) {
  return fullDate.format(new Date(date));
}

export function getReport(options: ReportOptions, budgetSettings: BudgetSettings, goals: Goal[], today: string) {
  const period = reportPeriods.find(({ value }) => value === options.period) ?? reportPeriods[0];
  const reportType = reportTypes.find(({ value }) => value === options.type) ?? reportTypes[0];
  const isTax = options.type === "tax";
  const analytics = getAnalytics(period.mode, period.index);
  const ledger = transactions
    .filter(({ date }) => date >= period.from && date <= period.to)
    .sort((first, second) => Math.abs(second.amount) - Math.abs(first.amount));
  const ledgerTotals = ledger.reduce(({ income, spend }, { amount, status }) => ({
    income: income + (status === "Completed" ? Math.max(0, amount) : 0),
    spend: spend + (status === "Completed" ? Math.max(0, -amount) : 0),
  }), { income: 0, spend: 0 });
  const { income, spend } = isTax ? ledgerTotals : analytics;
  const totals = [
    { label: "Total income", amount: roundMoney(income) },
    { label: "Total expenses", amount: roundMoney(spend) },
    { label: "Net saved", amount: roundMoney(income - spend) },
  ];
  const selectedMonths = reportPeriods.filter(({ mode, from, to }) => mode === "Month" && from >= period.from && to <= period.to);
  const trendMonths = period.mode === "Month"
    ? reportPeriods.filter(({ mode }) => mode === "Month").slice(period.index, period.index + 6)
    : selectedMonths;
  const trend = [...trendMonths].reverse().map(({ index, from }) => {
    const month = getAnalytics("Month", index);
    return { label: month.label, shortLabel: formatReportDate(from).split(" ")[1], income: roundMoney(month.income), spend: roundMoney(month.spend) };
  });
  const budget = new Map<string, { name: string; spend: number; limit: number }>();
  if (options.include.budgets && !isTax) {
    for (const { index } of selectedMonths) {
      for (const { name, spend, totalLimit } of getMonthlyBudget(index, budgetSettings).categories) {
        const entry = budget.get(name) ?? { name, spend: 0, limit: 0 };
        budget.set(name, { name, spend: roundMoney(entry.spend + spend), limit: roundMoney(entry.limit + totalLimit) });
      }
    }
  }
  const budgets = [...budget.values()];
  const goalsProgress = options.include.goals && !isTax ? goals.map((goal) => getGoalProgress(goal, today)) : [];
  const taxCategories = new Map<string, number>();
  if (isTax) {
    for (const { category, amount, status } of ledger) {
      if (status === "Completed" && amount < 0) taxCategories.set(category, roundMoney((taxCategories.get(category) ?? 0) - amount));
    }
  }

  return {
    options,
    period,
    reportType,
    title: options.type === "summary" && period.mode === "Month" ? "Monthly statement" : reportType.title,
    totals,
    categories: isTax ? [] : analytics.categoryTotals.map(({ name, color, amount }) => ({ name, color, amount: roundMoney(amount) })),
    trend,
    budgets,
    goals: goalsProgress,
    ledger,
    taxCategories: Array.from(taxCategories, ([name, amount]) => ({ name, amount })).sort((first, second) => second.amount - first.amount),
  };
}

export type Report = ReturnType<typeof getReport>;

export function getExportDocument(report: Report, date: string): ExportDocument {
  const { title, totals, period, options, categories, ledger, budgets, goals, taxCategories, trend } = report;
  const sections: ReportSection[] = [{
    title: "Overview",
    columns: ["Metric", dashboardCurrency],
    rows: totals.map(({ label, amount }) => [label, amount]),
  }];
  if (options.type === "tax") {
    sections.push({ title: "Ledger expenses by category", columns: ["Category", dashboardCurrency], rows: taxCategories.map(({ name, amount }) => [name, amount]) });
  } else if (options.type === "cashflow") {
    sections.push({
      title: "Monthly cashflow",
      columns: ["Month", `Income (${dashboardCurrency})`, `Expenses (${dashboardCurrency})`],
      rows: trend.map(({ label, income, spend }) => [label, income, spend]),
      chart: options.include.charts ? {
        series: [{ label: "Income", color: "#1257ff" }, { label: "Expenses", color: "#30343b" }],
        points: trend.map(({ shortLabel, income, spend }) => ({ label: shortLabel, values: [income, spend] })),
      } : undefined,
    });
  } else if (options.include.charts || options.type === "categories") {
    sections.push({
      title: "Spending by category",
      columns: ["Category", dashboardCurrency, "Share (%)"],
      rows: categories.map(({ name, amount }) => [name, amount, roundMoney(amount / totals[1].amount * 100)]),
      chart: options.include.charts ? {
        series: [{ label: "Expenses", color: "#1257ff" }],
        points: categories.map(({ name, amount }) => ({ label: name.split(" ")[0], values: [amount] })),
      } : undefined,
    });
  }
  if (options.include.budgets && options.type !== "tax") sections.push({
    title: "Budget status",
    columns: ["Category", `Spent (${dashboardCurrency})`, `Limit (${dashboardCurrency})`, "Used (%)"],
    rows: budgets.map(({ name, spend, limit }) => [name, spend, limit, roundMoney(spend / limit * 100)]),
  });
  if (options.include.goals && options.type !== "tax") sections.push({
    title: "Current goal progress",
    columns: ["Goal", `Saved (${dashboardCurrency})`, `Target (${dashboardCurrency})`, "Progress (%)"],
    rows: goals.map(({ name, saved, target, percentage }) => [name, saved / 100, target / 100, percentage]),
  });
  if (options.include.transactions || options.type === "tax") sections.push({
    title: "Ledger transactions",
    columns: ["Merchant", "Date", "Category", "Status", `Amount (${dashboardCurrency})`],
    rows: ledger.map(({ merchant, date, category, status, amount }) => [merchant, date, category, status, amount]),
  });

  const source = options.type === "tax"
    ? "Transaction ledger. Totals count completed entries."
    : "Sample Analytics activity. Itemized transactions come from the separate demo ledger.";
  return { title, range: period.range, date, source, sections };
}
