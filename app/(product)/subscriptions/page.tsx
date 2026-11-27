import type { Metadata } from "next";
import SubscriptionsView from "@/features/transactionsAndSubscriptions/components/SubscriptionsView";

export const metadata: Metadata = {
  title: "Subscriptions | Spendwise",
  description: "Track subscription costs, upcoming renewals, and plans to review.",
};

export default function SubscriptionsPage() {
  return <SubscriptionsView />;
}
