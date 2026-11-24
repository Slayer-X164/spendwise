import CashflowChart from "./Chart_01";
import TodayChart from "./Chart_02";
import DashboardShortcuts from "./DashboardShortcuts";

export default function Graphs() {
  return (
    <div className="grid min-w-0 gap-3 sm:gap-4 xl:grid-cols-[0.85fr_1.6fr_1fr] print:grid-cols-[1fr_1.6fr]">
      <TodayChart />
      <CashflowChart />
      <DashboardShortcuts />
    </div>
  );
}
