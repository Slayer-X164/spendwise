import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";

export default function SelectPill({
  children,
  tone = "muted",
  ...props
}: ComponentProps<"select"> & { tone?: "muted" | "white" }) {
  return (
    <span className={`relative inline-flex items-center rounded-full font-medium whitespace-nowrap ${tone === "white" ? "bg-neutral-50" : "bg-slate-100"}`}>
      <select
        className="cursor-pointer appearance-none rounded-full bg-transparent py-2 pr-7 pl-3"
        {...props}
      >
        {children}
      </select>
      <HugeiconsIcon
        icon={ArrowDown01Icon}
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 size-3"
      />
    </span>
  );
}
