import Graphs from "@/features/dashboard/components/Graphs";
import MobileDashboardLinks from "@/features/dashboard/components/MobileDashboardLinks";
import SummaryCards from "@/features/dashboard/components/SummaryCard";
import Transactions from "@/features/dashboard/components/Transactions";

export default function DashboardPage() {
  return (
    <main
      className="grid min-w-0 gap-3 text-sm sm:gap-4
        [&_:is(a,button,input,select):focus-visible]:outline-2 [&_:is(a,button,input,select):focus-visible]:outline-offset-3
        [&_:is(a,button,input,select):focus-visible]:outline-[#1257ff] print:text-[10pt] print:[print-color-adjust:exact]"
      aria-label="Dashboard"
    >
      <SummaryCards />
      <MobileDashboardLinks />
      <Graphs />

      <Transactions />
    </main>
  );
}
