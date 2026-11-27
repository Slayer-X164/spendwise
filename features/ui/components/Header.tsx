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
import { usePathname } from "next/navigation";

const featureLinks = [
  { label: "Budgets", href: "/budgets" },
  { label: "Goals", href: "/goals" },
];

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Transactions", href: "/transactions" },
  { label: "Analytics", href: "/analytics" },
  ...featureLinks,
  { label: "Subscriptions", href: null },
  { label: "Reports", href: "/dashboard#report" },
];

const iconClass = "size-4 shrink-0";
const accountName = "Siddhesh Ghag";
const utilityClass = "relative grid size-10 cursor-pointer place-items-center rounded-full bg-neutral-50 hover:bg-neutral-200 aria-[current=page]:text-blue-600";
const menuClass = "m-0 min-w-48 rounded-2xl border border-[#e9ebf0] bg-neutral-50 px-4 py-3.5 text-sm text-[#121315] shadow-[0_0.625rem_2rem_#26324d22] [inset:auto] [right:anchor(right)] [top:calc(anchor(bottom)_+_0.5rem)] [position-try-fallbacks:flip-inline]";
const navigationItemClass = "flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium whitespace-nowrap";

function Navigation({ active }: { active: string }) {
  return (
    <nav
      className="hidden min-w-0 overflow-x-auto rounded-full border border-neutral-300 bg-neutral-50 xl:block "
      aria-label="Main navigation"
    >
      <ul className="flex w-max gap-2 p-1.5">
        {links.map(({ label, href }) => {
          const content = (
            <>
              <HugeiconsIcon icon={DashboardSquare02Icon} aria-hidden="true" className={iconClass} />
              {label}
            </>
          );

          return (
            <li key={label}>
              {href ? (
                <Link
                  href={href}
                  aria-current={href === active ? "page" : undefined}
                  className={`${navigationItemClass} text-slate-600 hover:bg-neutral-200 focus-visible:-outline-offset-2 aria-[current=page]:bg-neutral-800 aria-[current=page]:text-white`}
                >
                  {content}
                </Link>
              ) : (
                <span role="link" aria-disabled="true" className={`${navigationItemClass} text-slate-500 opacity-60`}>
                  {content}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function Header() {
  const pathname = usePathname();

  return (
    <header
      className="mb-4 flex min-w-0 items-center justify-between gap-2 sm:mb-4 sm:gap-3 sm:px-1
        [&_:is(button,a):focus-visible]:outline-2 [&_:is(button,a):focus-visible]:outline-blue-600 print:hidden"
    >
      <Link
        href="/dashboard"
        className="flex shrink-0 items-center gap-1 text-lg font-medium tracking-tight sm:text-xl"
      >
        <Image src="/brand/logo.png" width={50} height={50} alt="" className="size-9 shrink-0 sm:size-10" />
        SpendWise
      </Link>

      <Navigation active={pathname} />

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
          className={`${utilityClass} border border-neutral-300 max-sm:hidden`}
          aria-current={pathname === "/settings" ? "page" : undefined}
          aria-label="Settings"
        >
          <HugeiconsIcon icon={Settings02Icon} aria-hidden="true" className={iconClass} />
        </Link>

        <button
          type="button"
          className="flex min-h-10 cursor-pointer items-center gap-2 rounded-full border border-neutral-300 bg-neutral-50 p-1 text-sm font-semibold whitespace-nowrap hover:bg-neutral-200 sm:pr-3"
          aria-label={`${accountName}, account`}
          popoverTarget="product-account"
        >
          <span
            className="grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-blue-600 to-blue-400 font-semibold text-white"
            aria-hidden="true"
          >
            S
          </span>
          <span className="hidden sm:inline">{accountName}</span>
          <HugeiconsIcon icon={ArrowDown01Icon} aria-hidden="true" className="hidden size-3.5 text-slate-500 sm:block" />
        </button>
        <div className={menuClass} id="product-account" popover="auto">
          <strong>{accountName}</strong>
          {featureLinks.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => document.getElementById("product-account")?.hidePopover()}
              className="mt-1.5 block text-[#667085] hover:underline aria-[current=page]:font-semibold xl:hidden"
            >
              {label}
            </Link>
          ))}
          <Link href="/settings" className="mt-1.5 block text-[#667085] hover:underline">Account settings</Link>
        </div>
      </div>
    </header>
  );
}
