import type { Metadata } from "next";
import ReportsView from "@/features/reports/components/ReportsView";

export const metadata: Metadata = {
  title: "Reports | Spendwise",
  description: "Build financial reports and export statements from Spendwise.",
};

export default function ReportsPage() {
  return <ReportsView />;
}
