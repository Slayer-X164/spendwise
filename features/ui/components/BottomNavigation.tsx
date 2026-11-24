"use client";

import {
  ChartColumnIcon,
  Home01Icon,
  PlusSignIcon,
  ReceiptTextIcon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import AddTransactionDialog from "@/features/transactionsAndSubscriptions/components/AddTransactionDialog";

function subscribeToHash(onChange: () => void) {
  window.addEventListener("hashchange", onChange);
  return () => window.removeEventListener("hashchange", onChange);
}

function getHash() {
  return window.location.hash;
}

function getServerHash() {
  return "";
}

function BottomNavLink({
  href,
  icon,
  label,
  current,
}: {
  href: string;
  icon: IconSvgElement;
  label: string;
  current?: "page" | "location";
}) {
  const className = "flex min-h-12 flex-col items-center justify-center gap-1 rounded-full text-xs font-medium text-slate-500 hover:text-blue-600 focus-visible:outline-2 focus-visible:outline-blue-600 aria-[current=page]:text-blue-600 aria-[current=location]:text-blue-600 max-[360px]:text-[11px]";
  const content = (
    <>
      <HugeiconsIcon icon={icon} className="size-6" aria-hidden="true" />
      {label}
    </>
  );

  return href.startsWith("#") ? (
    <a href={href} className={className} aria-current={current}>{content}</a>
  ) : (
    <Link href={href} className={className} aria-current={current}>{content}</Link>
  );
}

export default function BottomNavigation() {
  const pathname = usePathname();
  const hash = useSyncExternalStore(subscribeToHash, getHash, getServerHash);
  const onDashboard = pathname === "/dashboard";
  const analyticsActive = onDashboard && hash === "#cashflow";

  return (
    <nav
      className="fixed  inset-x-3 bottom-3 z-30 mx-auto mb-[env(safe-area-inset-bottom)] grid max-w-md grid-cols-5 items-center rounded-full border border-neutral-300 bg-neutral-50 px-1 py-2 shadow-xl sm:px-3 xl:hidden print:hidden"
      aria-label="Mobile navigation"
    >
      <BottomNavLink
        href={onDashboard ? "#" : "/dashboard"}
        icon={Home01Icon}
        label="Home"
        current={onDashboard && !analyticsActive ? "page" : undefined}
      />
      <BottomNavLink
        href={onDashboard ? "#cashflow" : "/dashboard#cashflow"}
        icon={ChartColumnIcon}
        label="Analytics"
        current={analyticsActive ? "location" : undefined}
      />
      <div className="grid place-items-center">
        <AddTransactionDialog className="grid size-14 -translate-y-4 cursor-pointer place-items-center rounded-2xl bg-[#1257ff] text-white shadow-lg shadow-blue-600/30 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          <HugeiconsIcon icon={PlusSignIcon} className="size-7" aria-hidden="true" />
          <span className="sr-only">Add expense</span>
        </AddTransactionDialog>
      </div>
      <BottomNavLink
        href="/transactions"
        icon={ReceiptTextIcon}
        label="Transactions"
        current={pathname === "/transactions" ? "page" : undefined}
      />
      <BottomNavLink
        href="/settings"
        icon={Settings02Icon}
        label="Settings"
        current={pathname === "/settings" ? "page" : undefined}
      />
    </nav>
  );
}
