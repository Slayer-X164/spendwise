export default function Graphs() {
  return (
    <div className="flex items-center gap-3">
      <LineGraph />
      <PieChart />
    </div>
  );
}

function LineGraph() {
  return (
    <div className="flex-3 h-70 bg-neutral-50 border border-neutral-300/70  rounded-xl p-4">
      Line graph
    </div>
  );
}

function PieChart() {
  return (
    <div className="flex-1 h-70 bg-neutral-50 border border-neutral-300/70  rounded-xl p-4">
      Pie chart
    </div>
  );
}
