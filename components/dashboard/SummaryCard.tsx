import { HugeiconsIcon } from "@hugeicons/react";
import { SummaryCardProps } from "../../types/dashboard/DashboardTypes";

export default function SummaryCard({
  title,
  amount,
  description,
  icon,
  trendPercentage,
  trendIcon
}: SummaryCardProps) {
  return (
    <div className={`bg-neutral-50 capitalize w-full  lg:w-80 flex-1 border border-neutral-300/70 h-40 sm:h-30 rounded-xl  flex flex-col justify-between p-4 `}>
      <h3 className="text-neutral-500 font-medium text-xs sm:text-sm flex items-center gap-1">
        <HugeiconsIcon icon={icon} className="size-4 sm:size-5"/>
        {title}
      </h3>
      <div className="flex items-end w-full justify-between">
        <h3 className="text-2xl mt-4 sm:mt-0 sm:text-4xl font-sans font-medium">
          &#x20B9;<span>{amount.toLocaleString()}</span>
        </h3>
        <h4 className="flex items-center gap-0.5 font-sans text-green-600">{trendPercentage}%<span><HugeiconsIcon icon={trendIcon} className="size-5"/></span></h4>
      </div>
    </div>
  );
}
