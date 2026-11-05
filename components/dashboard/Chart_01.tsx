"use client";
import { barY, defineChart } from "@tanstack/charts";
import { Chart } from "@tanstack/charts/react/tooltip";
import { scaleBand } from "@tanstack/charts/scales/band";
import { scaleLinear } from "@tanstack/charts/scales/linear";
import { tooltip } from "@tanstack/charts/tooltip";

const monthlyExpenses = [
  { month: "January", expense: 12500 },
  { month: "February", expense: 15800 },
  { month: "March", expense: 11200 },
  { month: "April", expense: 18400 },
  { month: "May", expense: 14600 },
  { month: "June", expense: 21000 },
  { month: "July", expense: 17500 },
  { month: "August", expense: 12000}
];

const barGraph = defineChart({
  marks: [
    barY(monthlyExpenses, {
      x: "month",
      y: "expense",
      fill: "#4270ff",
      radius: 4,
      maxThickness: 60,
    }),
  ],
  scales: {
    x: {
      scale: () => scaleBand().padding(0.3),
      axis:{
        ticks: {
          format(value) {
            return String(value).slice(0,3)
          },
        }
      }
    },
    y: {
      scale: scaleLinear,
      nice: true,
      axis: {
        ticks: {
          format: (value) => `${value / 1000}k`,
        },
      },
    },
  },
  focusRing: {
    radius: 4,
    strokeWidth: 2,
    fill: "#fafafa",
  },

  svgAnimation: true,
  tooltip,
});

export function Chart_1() {
  return (
    <div className="flex-3 w-full h-70 bg-neutral-50 border border-neutral-300/70  rounded-xl p-4">
      <h3 className="capitalize font-medium text-sm pb-3">Monthly Expense</h3>
      <Chart
        definition={barGraph}
        height={210}
        ariaLabel="Monthly expense"
        renderTooltipBody={({ points }) => {
          const point = points[0];
          console.log("points: ", points)
          if (!point) return null;

          return (
            <div className="w-20 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
              <p className="text-xs font-medium text-gray-500">
                {point.datum.month}
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                ₹{point.datum.expense.toLocaleString("en-IN")}
              </p>

            </div>
          );
        }}
      />
    </div>
  );
}
