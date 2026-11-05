import { Chart_1 } from "./Chart_01";
import { Chart_2 } from "./Chart_02";

export default function Graphs() {
  return (
    <div className="flex flex-col lg:flex-row items-center gap-3">
      <Chart_1 />
      <Chart_2 />
    </div>
  );
}




