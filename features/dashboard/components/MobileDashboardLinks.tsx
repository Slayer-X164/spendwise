import {
  ArrowReloadHorizontalIcon,
  File01Icon,
  PieChartIcon,
  Target01Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { CardIcon } from "./CardHeading";

const shortcuts = [
  { label: "Goals", href: "#today", icon: Target01Icon },
  { label: "Subs", href: "/transactions?tab=subscriptions", icon: ArrowReloadHorizontalIcon },
  { label: "Reports", href: "#report", icon: File01Icon },
  { label: "Budgets", href: "#expense", icon: PieChartIcon },
];

export default function MobileDashboardLinks() {
  return (
    <nav aria-label="Dashboard quick links" className="grid grid-cols-4 gap-2 sm:gap-3 md:hidden print:hidden">
      {shortcuts.map(({ label, href, icon }) => {
        const ShortcutLink = href.startsWith("#") ? "a" : Link;

        return (
          <ShortcutLink
            key={href}
            href={href}
            aria-label={label === "Subs" ? "Subscriptions" : undefined}
            className="flex min-h-22 flex-col items-center border border-neutral-300 justify-center gap-2 rounded-3xl bg-neutral-50 px-1 py-3 text-center text-xs font-semibold hover:bg-blue-50 sm:text-sm"
          >
            <CardIcon icon={icon} size="size-9 sm:size-10" />
            {label}
          </ShortcutLink>
        );
      })}
    </nav>
  );
}
