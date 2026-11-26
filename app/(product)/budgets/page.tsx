import type { Metadata } from "next";
import BudgetView from "@/features/budgets/components/BudgetView";

export const metadata: Metadata = {
  title: "Budgets | Spendwise",
  description: "Track monthly spending, manage category limits, and review budget history.",
};

export default function BudgetsPage() {
  return <BudgetView />;
}
