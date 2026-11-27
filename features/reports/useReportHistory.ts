import { useSyncExternalStore } from "react";
import { z } from "zod";
import { createBrowserStorage } from "@/lib/browserStorage";
import { formats, reportTypes } from "./data";

const storage = createBrowserStorage("spendwise:reports:v1");
const schema = z.object({
  exports: z.array(z.object({
    id: z.string(),
    filename: z.string(),
    format: z.enum(formats),
    bytes: z.number(),
    document: z.object({
      title: z.string(), range: z.string(), date: z.iso.date(), source: z.string(),
      sections: z.array(z.object({
        title: z.string(),
        columns: z.array(z.string()),
        rows: z.array(z.array(z.union([z.string(), z.number()]))),
        chart: z.object({
          series: z.array(z.object({ label: z.string(), color: z.string() })),
          points: z.array(z.object({ label: z.string(), values: z.array(z.number()) })),
        }).optional(),
      })),
    }),
  })),
  schedule: z.object({
    day: z.number().int().min(1).max(31),
    enabled: z.boolean(),
    type: z.enum(reportTypes.map(({ value }) => value)),
    format: z.enum(formats),
  }).optional(),
});

type History = z.infer<typeof schema>;
export type ReportExport = History["exports"][number];
export type ReportSchedule = NonNullable<History["schedule"]>;
const empty: History = { exports: [] };

function parse(value: string | null): History {
  try {
    const parsed = schema.safeParse(value ? JSON.parse(value) : null);
    return parsed.success ? parsed.data : empty;
  } catch {
    return empty;
  }
}

export function updateReportHistory(update: (current: History) => History) {
  storage.write(JSON.stringify(update(parse(storage.read()))));
}

export default function useReportHistory() {
  return parse(useSyncExternalStore(storage.subscribe, storage.read, () => null));
}

export function nextReportDate(day: number, today: string) {
  const [year, month, currentDay] = today.split("-").map(Number);
  let monthIndex = month - Number(day >= currentDay);
  let date = new Date(Date.UTC(year, monthIndex, day));
  while (date.getUTCDate() !== day) {
    monthIndex += 1;
    date = new Date(Date.UTC(year, monthIndex, day));
  }
  return date.toISOString().slice(0, 10);
}
