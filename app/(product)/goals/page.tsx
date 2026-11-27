import type { Metadata } from "next";
import GoalsView from "@/features/goals/components/GoalsView";

export const metadata: Metadata = {
  title: "Goals | Spendwise",
  description: "Track your savings goals, record contributions, and see your projected progress.",
};

export default function GoalsPage() {
  return <GoalsView />;
}
