import type { IconSvgElement } from "@hugeicons/react";
import type { ReactNode } from "react";
import { CardIcon } from "@/features/dashboard/components/CardHeading";

export default function AnalyticsPanel({
  title,
  icon,
  action,
  children,
}: {
  title: string;
  icon: IconSvgElement;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section aria-label={title} className="flex min-w-0 flex-col gap-3 xl:rounded-3xl xl:border xl:border-neutral-300 xl:bg-neutral-50 xl:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 xl:px-0">
        <h2 className="flex items-center gap-2 text-lg font-semibold tracking-tight sm:text-xl">
          <span className="hidden xl:inline-flex"><CardIcon icon={icon} /></span>
          {title}
        </h2>
        {action}
      </div>
      <div className="min-w-0 flex-1 rounded-3xl border border-neutral-300 bg-neutral-50 p-4 xl:rounded-none xl:border-0 xl:bg-transparent xl:p-0">
        {children}
      </div>
    </section>
  );
}
