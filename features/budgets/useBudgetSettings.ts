import { useSyncExternalStore } from "react";
import { z } from "zod";
import { createBrowserStorage } from "@/lib/browserStorage";
import { defaultBudgetSettings, maxBudgetLimit, type BudgetSettings } from "./data";

const storage = createBrowserStorage("spendwise:budgets:v1");
const settingsSchema = z.object({
  limits: z.record(z.string(), z.array(z.object({
    name: z.string().min(1).max(32),
    limit: z.number().min(0.01).max(maxBudgetLimit),
  }))),
  preferences: z.object({
    nearLimitAlerts: z.boolean(),
    rollover: z.boolean(),
    dailyReminder: z.boolean(),
  }),
});

function parseSettings(value: string | null): BudgetSettings {
  if (value) {
    try {
      const result = settingsSchema.safeParse(JSON.parse(value));
      if (result.success) return result.data;
    } catch {
      return defaultBudgetSettings;
    }
  }
  return defaultBudgetSettings;
}

export function updateBudgetSettings(update: (current: BudgetSettings) => BudgetSettings) {
  storage.write(JSON.stringify(update(parseSettings(storage.read()))));
}

export default function useBudgetSettings() {
  const value = useSyncExternalStore(storage.subscribe, storage.read, () => null);
  return parseSettings(value);
}
