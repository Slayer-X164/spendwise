import type { Metadata } from "next";
import AnalyticsView from "@/features/analytics/components/AnalyticsView";

export const metadata: Metadata = {
  title: "Analytics | Spendwise",
  description: "Spending, savings, and budget trends in Spendwise.",
};

export default function AnalyticsPage() {
  return <AnalyticsView />;
}
