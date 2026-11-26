import { useSyncExternalStore } from "react";
import { z } from "zod";
import { defaultBudgetSettings, maxBudgetLimit, type BudgetSettings } from "./data";

const storageKey = "spendwise:budgets:v1";
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
let memory: string | null = null;

function readSettings() {
  try {
    return memory ?? window.localStorage.getItem(storageKey);
  } catch {
    return memory;
  }
}

function subscribe(onChange: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === storageKey || event.key === null) onChange();
  }

  window.addEventListener("storage", onStorage);
  window.addEventListener(storageKey, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(storageKey, onChange);
  };
}

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
  const value = JSON.stringify(update(parseSettings(readSettings())));
  try {
    window.localStorage.setItem(storageKey, value);
    memory = null;
  } catch {
    memory = value;
  }
  window.dispatchEvent(new Event(storageKey));
}

export default function useBudgetSettings() {
  const value = useSyncExternalStore(subscribe, readSettings, () => null);
  return parseSettings(value);
}
