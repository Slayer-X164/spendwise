import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

export const cardClass = "min-w-0 scroll-m-4 rounded-3xl p-4 xl:p-5 print:break-inside-avoid border border-neutral-300";
export const cardTopClass = "flex items-center justify-between gap-2.5";
export const legendDotClass = "inline-block size-2 shrink-0 rounded-full";

const iconTones = {
  light: "bg-[#e6edff] text-[#1257ff]",
  blue: "bg-[#1257ff] text-white",
  dark: "bg-neutral-800 text-white",
};

export function CardIcon({
  icon,
  tone = "light",
  className,
  size ="size-10",
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
    <h2 className="flex items-center gap-2.5 text-lg leading-tight font-semibold tracking-tight whitespace-nowrap">
      <CardIcon icon={icon} tone={tone} />
      {children}
    </h2>
  );
}
