import { PieChartIcon } from "@hugeicons/core-free-icons";
import SpendingDonut from "@/features/ui/components/SpendingDonut";
import type { AnalyticsData } from "../data";
import AnalyticsPanel from "./AnalyticsPanel";

export default function CategoryBreakdown({ label, total, categories }: {
  label: string;
  total: number;
  categories: AnalyticsData["categoryTotals"];
}) {
  return (
    <AnalyticsPanel title="By category" icon={PieChartIcon} action={<span className="hidden rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium xl:inline">{label}</span>}>
      <SpendingDonut total={total} categories={categories} label="Total" wholeTotal />
    </AnalyticsPanel>
  );
}
