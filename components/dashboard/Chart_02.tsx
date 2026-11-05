"use client"
import { Chart } from '@tanstack/charts/react/tooltip'
import { tooltip as exampleTooltip, tooltip } from '@tanstack/charts/tooltip'

import { defineChart } from '@tanstack/charts'
import { pie, polar, radialArc } from '@tanstack/charts/polar'
// import { alphabet } from '@tanstack/charts-data/alphabet'
// import { selectRoundedDonutData } from './selection'

const gapAngle = (Math.PI / 180) * 3
const colors = ['#0284c7', '#4f46e5', '#9333ea', '#db2777', '#ea580c']
const percentage = new Intl.NumberFormat('en-US', {
  style: 'percent',
  maximumFractionDigits: 2,
})

const categoryExpenses = [
  { category: "Food & Dining", expense: 8500 },
  { category: "Shopping", expense: 12000 },
  { category: "Transportation", expense: 4500 },
  { category: "Entertainment", expense: 3200 },
  { category: "Education", expense: 5500 },
];

export const pieChart = (input: ChartOptions) => {
  const arcs = pie(categoryExpenses, {
    value: 'expense',
    gapAngle,
  })

  return defineChart(
    {
      marks: [
        polar({
          radiusRatio: 0.8,
          marks: [
            radialArc(arcs, {
              id: 'category-slices',
              key: 'category',
              innerRadius: ({ radius }) => radius * 0.58,
              cornerRadius: 8,
              color: 'category',
            }),
          ],
          scales: {
            angle: null,
            radius: null,
          },
        }),
      ],
      scales: {
        x: null,
        y: null,
      },
      color: { range: colors },
      margin: 0,
    },
    {
      keyboard: true,
      tooltip,
    },
  )
}
export interface ChartOptions {
  revision: number
}



export const chart = pieChart({
  revision: 0,
})


export function Chart_2() {
  return (
    <div className="flex-1 w-full h-70 bg-neutral-50 border border-neutral-300/70  rounded-xl p-4">
      <h3 className="capitalize font-medium text-sm pb-0">Category wise Expense</h3>
      <Chart
        definition={chart}
        height={230}
        ariaLabel="Category wise expense"
        renderTooltipBody={({points}) => {
          const point = points[0];
          console.log("points: ", points)
          if (!point) return null;

          return (
            <div className="max-w-60 flex items-center gap-2 rounded-xl border border-neutral-200 bg-white p-3 shadow-lg">
              <p className="text-sm  font-medium text-gray-500">
                {point.datum.category}
              </p>

              <p className="text-sm font-semibold text-gray-900">
                ₹{point.datum.expense.toLocaleString("en-IN")}
              </p>

            </div>
          );
        }}
      />
    </div>
  );
}