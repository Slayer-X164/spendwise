import {
  Airplane01Icon,
  Car01Icon,
  LaptopIcon,
  MusicNote01Icon,
  Shield01Icon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import { formatMoney } from "@/features/dashboard/data";

export const goalCategoryOptions = [
  { value: "general", label: "General", icon: Target01Icon },
  { value: "travel", label: "Travel", icon: Airplane01Icon },
  { value: "emergency", label: "Emergency", icon: Shield01Icon },
  { value: "technology", label: "Technology", icon: LaptopIcon },
  { value: "vehicle", label: "Vehicle", icon: Car01Icon },
  { value: "events", label: "Events", icon: MusicNote01Icon },
] as const;

export type GoalCategory = (typeof goalCategoryOptions)[number]["value"];
export type Contribution = { amount: number; date: string; label: string };
export type GoalPlan = { name: string; category: GoalCategory; target: number; deadline: string; monthly: number };
export type Goal = GoalPlan & { id: string; contributions: Contribution[] };
type GoalStatus = "Done" | "Behind" | "On track" | "Active";

// Monetary amounts are stored in minor units.
export const maxGoalAmount = 9_999_999;
export const demoDate = "2026-11-27";

function sampleGoal(
  category: GoalCategory,
  name: string,
  target: number,
  deadline: string,
  monthly: number,
  deposits: [string, number, string?][],
): Goal {
  return {
    id: category,
    category,
    name,
    target: target * 100,
    deadline,
    monthly: monthly * 100,
    contributions: deposits.map(([date, amount, label = "Auto-save"]) => ({ date, amount: amount * 100, label })),
  };
}

export const demoGoals = [
  sampleGoal("travel", "Japan Trip", 4000, "2027-03-15", 400, [
    ["2026-07-01", 900, "Opening savings"], ["2026-08-01", 150], ["2026-09-01", 400],
    ["2026-10-01", 400], ["2026-10-24", 150, "Manual top-up"], ["2026-11-01", 400],
  ]),
  sampleGoal("emergency", "Emergency Fund", 10000, "2027-12-31", 300, [
    ["2026-07-01", 5000, "Opening savings"], ["2026-08-01", 300], ["2026-09-01", 300],
    ["2026-10-01", 300], ["2026-11-01", 300],
  ]),
  sampleGoal("technology", "New Laptop", 2000, "2027-01-31", 175, [
    ["2026-07-01", 1100, "Opening savings"], ["2026-09-01", 30], ["2026-10-01", 175], ["2026-11-01", 175],
  ]),
  sampleGoal("vehicle", "Car Down Payment", 8000, "2027-08-31", 250, [
    ["2026-07-01", 2400, "Opening savings"], ["2026-08-01", 250], ["2026-09-01", 250], ["2026-11-01", 250],
  ]),
  sampleGoal("events", "Concert Tickets", 300, "2026-10-31", 0, [["2026-10-24", 300, "Manual top-up"]]),
];

const shortDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "UTC" });
const fullDate = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const monthDate = new Intl.DateTimeFormat("en-IN", { month: "short", year: "numeric", timeZone: "UTC" });

export function formatGoalDate(date: string, style: "short" | "full" | "month") {
  const formatter = style === "short" ? shortDate : style === "full" ? fullDate : monthDate;
  return formatter.format(new Date(date));
}

export function localDate() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

export function money(amount: number) {
  return formatMoney(amount / 100, amount % 100 === 0);
}

export function getSaved(goal: Goal) {
  return goal.contributions.reduce((total, { amount }) => total + amount, 0);
}

export function getGoalProgress(goal: Goal, today: string) {
  const contributions = [...goal.contributions].sort((first, second) => first.date.localeCompare(second.date));
  let saved = 0;
  let completedAt: string | undefined;
  for (const { amount, date } of contributions) {
    saved += amount;
    if (saved >= goal.target && !completedAt) completedAt = date;
  }
  const remaining = Math.max(0, goal.target - saved);
  const [year, month, day] = goal.deadline.split("-").map(Number);
  const [currentYear, currentMonth, currentDay] = today.split("-").map(Number);
  const overdue = goal.deadline < today && !completedAt;
  const monthsLeft = Math.max(0, (year - currentYear) * 12 + month - currentMonth + Number(day > currentDay));
  const percentage = Math.min(100, Math.floor(saved / goal.target * 100));
  let status: GoalStatus = "Active";
  if (completedAt) status = "Done";
  else if (overdue || (goal.monthly > 0 && goal.monthly * monthsLeft < remaining)) status = "Behind";
  else if (goal.monthly > 0) status = "On track";

  return { ...goal, saved, remaining, percentage, monthsLeft, overdue, status, completedAt, contributions: contributions.reverse() };
}

export type GoalProgress = ReturnType<typeof getGoalProgress>;

export function getSavingsHistory(goals: GoalProgress[], today: string) {
  const contributions = goals.flatMap((goal) => goal.contributions);
  const currentMonth = today.slice(0, 7);
  const monthStart = new Date(`${currentMonth}-01`);
  const year = monthStart.getUTCFullYear();
  const month = monthStart.getUTCMonth();
  const currentSavings = goals.reduce((total, goal) => total + goal.saved, 0);
  const thisMonth = contributions.reduce((total, item) => item.date.startsWith(currentMonth) ? total + item.amount : total, 0);
  const points = Array.from({ length: 9 }, (_, index) => {
    const offset = index - 4;
    const date = new Date(Date.UTC(year, month + offset, 1)).toISOString().slice(0, 10);
    const monthKey = date.slice(0, 7);
    const projected = offset > 0;
    const amount = projected
      ? goals.reduce((total, goal) => total + goal.saved + Math.min(goal.remaining, goal.monthly * offset), 0)
      : contributions.reduce((total, item) => item.date.slice(0, 7) <= monthKey ? total + item.amount : total, 0);
    return { date, amount, projected };
  });
  return { points, currentSavings, thisMonth };
}
