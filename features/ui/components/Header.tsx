"use client";

import {
  ArrowDown01Icon,
  DashboardSquare02Icon,
  Notification01Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/transactions" },
  { label: "Analytics", href: "/dashboard#cashflow" },
  { label: "Budgets", href: "/dashboard#expense" },
  { label: "Goals", href: "/dashboard#today" },
  { label: "Subscriptions", href: "/transactions?tab=subscriptions" },
  { label: "Reports", href: "/dashboard#report" },
];

const iconClass = "size-4 shrink-0";
const utilityClass = "relative grid size-10 cursor-pointer place-items-center rounded-full bg-neutral-50 hover:bg-neutral-200 aria-[current=page]:text-blue-600";
const menuClass = "m-0 min-w-48 rounded-2xl border border-[#e9ebf0] bg-neutral-50 px-4 py-3.5 text-sm text-[#121315] shadow-[0_0.625rem_2rem_#26324d22] [inset:auto] [right:anchor(right)] [top:calc(anchor(bottom)_+_0.5rem)] [position-try-fallbacks:flip-inline]";

function Navigation({ active }: { active: string }) {
  return (
    <nav className="rounded-full bg-neutral-50 border border-neutral-300" aria-label="Main navigation">
      <ul className="flex w-max p-1.5  gap-2">
        {links.map(({ label, href }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={href === active ? "page" : undefined}
              className="flex items-center gap-1.5 rounded-full px-3 py-2  text-sm font-medium whitespace-nowrap text-slate-600 hover:bg-neutral-200
                focus-visible:-outline-offset-2 aria-[current=page]:bg-neutral-800 aria-[current=page]:text-white
                "
            >
              <HugeiconsIcon icon={DashboardSquare02Icon} aria-hidden="true" className={iconClass} />
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function TransactionNavigation() {
  const subscriptions = useSearchParams().get("tab") === "subscriptions";
  return <Navigation active={subscriptions ? links[5].href : "/transactions"} />;
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="mb-4 flex items-center justify-between gap-3 px-1
        [&_:is(button,a):focus-visible]:outline-2 [&_:is(button,a):focus-visible]:outline-blue-600 print:hidden"
    >
      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-1 text-xl font-medium tracking-tight  "
      >
        <Image src="/brand/logo.png" width={50} height={50} alt="" className="shrink-0 size:10 lg:size-10" />
        SpendWise
      </Link>

      {pathname === "/transactions" ? (
        <Suspense fallback={<Navigation active={pathname} />}>
          <TransactionNavigation />
        </Suspense>
      ) : (
        <Navigation active={pathname} />
      )}

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={`${utilityClass} after:absolute border border-neutral-300 after:top-1/4 after:right-1/3 after:size-2 after:rounded-full after:border-2 after:border-white after:bg-red-500`}
          aria-label="Notifications"
          popoverTarget="product-notifications"
        >
          <HugeiconsIcon icon={Notification01Icon} aria-hidden="true" className={iconClass} />
        </button>
        <div className={menuClass} id="product-notifications" popover="auto">
          <strong>Notifications</strong>
          <p className="mt-1.5 text-[#667085]">You’ve used 81% of your November budget.</p>
        </div>

        <Link
          href="/settings"
          className={` ${utilityClass} border border-neutral-300 `}
          aria-current={pathname === "/settings" ? "page" : undefined}
          aria-label="Settings"
        >
          <HugeiconsIcon icon={Settings02Icon} aria-hidden="true" className={iconClass} />
        </Link>

        <button
          type="button"
          className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full bg-neutral-50 border border-neutral-300 py-1 pr-3 pl-1 text-sm font-semibold whitespace-nowrap hover:bg-neutral-200"
          aria-label="Alex Morgan, account"
          popoverTarget="product-account"
        >
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-blue-600 to-blue-400 font-semibold text-white"
            aria-hidden="true"
          >
            AM
          </span>
          <span>Alex Morgan</span>
          <HugeiconsIcon icon={ArrowDown01Icon} aria-hidden="true" className="size-3.5 text-slate-500" />
        </button>
        <div className={menuClass} id="product-account" popover="auto">
          <strong>Alex Morgan</strong>
          <Link href="/settings" className="mt-1.5 block text-[#667085] hover:underline">Account settings</Link>
        </div>
      </div>
    </header>
  );
}
