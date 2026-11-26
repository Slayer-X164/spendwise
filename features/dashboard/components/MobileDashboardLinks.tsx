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
  { label: "Subs", href: null, icon: ArrowReloadHorizontalIcon },
  { label: "Reports", href: "#report", icon: File01Icon },
  { label: "Budgets", href: "/budgets", icon: PieChartIcon },
];

const tileClass = "flex min-h-22 flex-col items-center justify-center gap-2 rounded-3xl border border-neutral-300 bg-neutral-50 px-1 py-3 text-center text-xs font-semibold sm:text-sm";

export default function MobileDashboardLinks() {
  return (
    <nav aria-label="Dashboard quick links" className="grid grid-cols-4 gap-2 sm:gap-3 md:hidden print:hidden">
      {shortcuts.map(({ label, href, icon }) => {
        const content = (
          <>
            <CardIcon icon={icon} size="size-4.5 sm:size-5" />
            {label}
          </>
        );

        return href ? (
          <Link key={label} href={href} className={`${tileClass} hover:bg-blue-50`}>{content}</Link>
        ) : (
          <span key={label} role="link" aria-label="Subscriptions" aria-disabled="true" className={`${tileClass} opacity-60`}>
            {content}
          </span>
        );
      })}
    </nav>
  );
}
