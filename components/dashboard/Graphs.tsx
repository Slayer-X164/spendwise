export default function Graphs() {
  return (
    <div className="flex items-center gap-3">
      <Chart_1 />
      <Chart_2 />
    </div>
  );
}

function Chart_1() {
  return (
    <div className="flex-1 h-70 bg-neutral-50 border border-neutral-300/70  rounded-xl p-4">
      Line graph
    </div>
  );
}

function Chart_2() {
  return (
    <div className="flex-1 h-70 bg-neutral-50 border border-neutral-300/70  rounded-xl p-4">
      Pie chart
    </div>
  );
}
