import { useSyncExternalStore } from "react";
import { z } from "zod";
import { createBrowserStorage } from "@/lib/browserStorage";
import { billingOptions, demoSubscriptions, maxSubscriptionPrice, subscriptionCategories, trackingOptions, type Subscription } from "./subscriptionData";

const storage = createBrowserStorage("spendwise:subscriptions:v1");
const schema = z.array(z.object({
  id: z.string(),
  name: z.string().min(1).max(64),
  plan: z.string().max(48),
  category: z.enum(subscriptionCategories.map(({ value }) => value)),
  cycle: z.enum(billingOptions.map(({ value }) => value)),
  price: z.number().int().positive().max(maxSubscriptionPrice * 100),
  chargeDate: z.iso.date(),
  lastUsed: z.union([z.iso.date(), z.literal("")]),
  status: z.enum(trackingOptions.map(({ value }) => value)),
  reviewed: z.boolean(),
}));

function parse(value: string | null): Subscription[] {
  try {
    const parsed = schema.safeParse(value ? JSON.parse(value) : null);
    return parsed.success ? parsed.data : demoSubscriptions;
  } catch {
    return demoSubscriptions;
  }
}

export function updateSubscriptions(update: (current: Subscription[]) => Subscription[]) {
  const current = parse(storage.read());
  const next = update(current);
  if (next !== current) storage.write(JSON.stringify(next));
}

export default function useSubscriptions() {
  const value = useSyncExternalStore(storage.subscribe, storage.read, () => null);
  return parse(value);
}
