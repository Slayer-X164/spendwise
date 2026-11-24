export const cashflow2026 = [
  { month: "Jan", income: 4510, expense: 2820 },
  { month: "Feb", income: 4650, expense: 3040 },
  { month: "Mar", income: 4430, expense: 2730 },
  { month: "Apr", income: 4830, expense: 2970 },
  { month: "May", income: 4720, expense: 2780 },
  { month: "Jun", income: 4810, expense: 3120 },
  { month: "Jul", income: 4890, expense: 2970 },
  { month: "Aug", income: 5010, expense: 3360 },
  { month: "Sep", income: 4780, expense: 2770 },
  { month: "Oct", income: 4580, expense: 3060.3 },
  { month: "Nov", income: 5200, expense: 2846.3 },
];

export const dashboardCurrency = "INR";
export const monthlyBudget = 3500;

const money = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: dashboardCurrency,
});

const wholeMoney = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: dashboardCurrency,
  maximumFractionDigits: 0,
});

export function formatMoney(amount: number, whole = false) {
  return (whole ? wholeMoney : money).format(amount);
}
