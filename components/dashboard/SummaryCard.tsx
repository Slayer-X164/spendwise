import { HugeiconsIcon } from "@hugeicons/react";
import { SummaryCardProps } from "../../types/dashboard/DashboardTypes";

export default function SummaryCard({
  title,
  amount,
  description,
  icon,
  trendPercentage,
  trendIcon,
  topSpendingCategoryName,
}: SummaryCardProps) {
  return (
    <div
      className={`bg-neutral-50 capitalize w-full  lg:w-80 flex-1 border border-neutral-300/70 h-24 sm:h-30 rounded-xl  flex flex-col justify-between p-4 `}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-neutral-500 font-medium text-xs sm:text-sm flex items-center gap-1">
          <HugeiconsIcon icon={icon} className="size-4 sm:size-5" />
          {title}
        </h3>
      </div>
      <div className="flex items-end w-full justify-between">
        <h3 className="text-md mt-4 sm:mt-0 sm:text-4xl font-sans font-medium">
          &#x20B9;<span>{amount.toLocaleString()}</span>
        </h3>

        <div className="flex items-center justify-between">
          {trendPercentage && trendIcon && (
            <h4 className="flex text-sm pb-0.5 items-center gap-0.5 font-sans text-green-600">
              {trendPercentage}%
              <span>
                <HugeiconsIcon icon={trendIcon} className="size-4 sm:size-5" />
              </span>
            </h4>
          )}
          {topSpendingCategoryName != undefined &&
            topSpendingCategoryName?.length != 0 && (
              <h3 className="capitalize text-[10px] sm:text-xs py-1 border px-1.5 rounded-md text-neutral-700 font-medium border-neutral-300 bg-neutral-200">{topSpendingCategoryName}</h3>
            )}
        </div>
      </div>
    </div>
  );
}
