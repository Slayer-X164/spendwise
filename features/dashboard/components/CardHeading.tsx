import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export const cardClass = "min-w-0 scroll-m-4 rounded-3xl p-4 xl:p-5 print:break-inside-avoid border border-neutral-300";
export const cardTopClass = "flex items-center justify-between gap-2.5";
export const legendDotClass = "inline-block size-2 shrink-0 rounded-full";

const iconTones = {
  light: "bg-[#e6edff] text-[#1257ff]",
  blue: "border border-green-600 text-green-600 bg-green-100",
  dark: "border border-red-600 text-red-600 bg-red-100",
};

export function CardIcon({
  icon,
  tone = "light",
  className,
  size = "size-8 sm:size-10",
}: {
  icon: IconSvgElement;
  tone?: keyof typeof iconTones;
  className?: string;
  size?: string;
}) {
  return (
    <span className={`inline-grid shrink-0 place-items-center rounded-xl ${size} ${className ?? iconTones[tone]}`}>
      <HugeiconsIcon icon={icon} aria-hidden="true" className="size-1/2" />
    </span>
  );
}

export default function CardHeading({
  icon,
  tone,
  children,
}: {
  icon: IconSvgElement;
  tone?: keyof typeof iconTones;
  children: string;
}) {
  return (
    <h2 className="flex items-center gap-2 text-base leading-tight font-semibold tracking-tight sm:gap-2.5 sm:text-lg">
      <CardIcon icon={icon} tone={tone} />
      {children}
    </h2>
  );
}
