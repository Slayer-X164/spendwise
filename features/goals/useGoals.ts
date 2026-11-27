import { useSyncExternalStore } from "react";
import { z } from "zod";
import { createBrowserStorage } from "@/lib/browserStorage";
import useLocalDate from "@/lib/useLocalDate";
import { demoDate, demoGoals, goalCategoryOptions, maxGoalAmount, type Goal } from "./data";

const storage = createBrowserStorage("spendwise:goals:v1");
const amount = z.number().int().min(0).max(maxGoalAmount * 100);
const goalsSchema = z.array(z.object({
  id: z.string(),
  name: z.string().min(1).max(48),
  category: z.enum(goalCategoryOptions.map(({ value }) => value)),
  target: amount.min(1),
  deadline: z.iso.date(),
  monthly: amount,
  contributions: z.array(z.object({ amount: amount.min(1), date: z.iso.date(), label: z.string() })),
}));

function parseGoals(value: string | null): Goal[] {
  try {
    const parsed = goalsSchema.safeParse(value ? JSON.parse(value) : null);
    return parsed.success ? parsed.data : demoGoals;
  } catch {
    return demoGoals;
  }
}

export function updateGoals(update: (current: Goal[]) => Goal[]) {
  const current = parseGoals(storage.read());
  const next = update(current);
  if (next !== current) storage.write(JSON.stringify(next));
}

export default function useGoals() {
  const value = useSyncExternalStore(storage.subscribe, storage.read, () => null);
  const today = useLocalDate(demoDate);
  return { goals: parseGoals(value), today };
}
