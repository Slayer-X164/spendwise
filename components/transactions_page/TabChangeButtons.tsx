"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function TabChangeButtons() {
  const searchParams = useSearchParams();
  const updateSearchParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      return params.toString();
    },
    [searchParams],
  );
  return (
    <div className="bg-neutral-300 border border-neutral-400/50 p-1 flex items-center gap-1 rounded-lg text-sm font-medium">
      <Link
        href={`/transactions?${updateSearchParams("tab", "transactions")}`}
        className={`${searchParams.get("tab") === "transactions" ? "bg-linear-to-br from-neutral-950 via-neutral-700 to-neutral-950 text-white" : "text-neutral-600"} px-4 py-2 rounded-md tracking-wider`}
      >
        Transactions
      </Link>
      <Link
        href={`/transactions?${updateSearchParams("tab", "subscriptions")}`}
        className={`${searchParams.get("tab") === "subscriptions" ? "bg-linear-to-br from-neutral-950 via-neutral-700 to-neutral-950 text-white" : "text-neutral-600"} px-4 py-2 rounded-md tracking-wider`}
      >
        Subscriptons
      </Link>
    </div>
  );
}
