import CashflowChart from "./Chart_01";
import TodayChart from "./Chart_02";
import DashboardShortcuts from "./DashboardShortcuts";

export default function Graphs() {
  return (
    <div className="grid grid-cols-[0.85fr_1.6fr_1fr] gap-4  print:grid-cols-[1fr_1.6fr]">
      <TodayChart />
      <CashflowChart />
      <DashboardShortcuts />
    </div>
  );
}
