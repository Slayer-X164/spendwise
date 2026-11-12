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
      className={`bg-neutral-50 capitalize w-full  lg:w-80 flex-1 border border-neutral-300/70 h-24 sm:h-30 rounded-xl  flex flex-col justify-between p-3 sm:p-4 `}
    >
      <div className="flex justify-between items-center">
        <h3 className="text-neutral-500 font-medium text-xs sm:text-sm flex items-center gap-1">
          <HugeiconsIcon icon={icon} className="size-4 sm:size-5" />
          {title}
        </h3>
      </div>
      <div className="flex items-end w-full justify-between">
        {!topSpendingCategoryName && (
          <h3 className="text-md mt-4 sm:mt-0 sm:text-4xl font-sans font-medium">
            <span>
              {amount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
                maximumFractionDigits: 2,
              })}
            </span>
          </h3>
        )}

        <div className="flex items-end  gap-2 flex-col w-full">
          {trendPercentage && trendIcon && (
            <h4 className="flex text-sm pb-0.5  gap-0.5 font-sans text-green-600 ">
              {trendPercentage}%
              <span>
                <HugeiconsIcon icon={trendIcon} className="size-4 sm:size-5" />
              </span>
            </h4>
          )}
          {topSpendingCategoryName != undefined &&
            topSpendingCategoryName?.length != 0 && (
              <div className="border-neutral-300 flex justify-between text-left sm:items-center gap-1 flex-col sm:flex-row bg-neutral-200/70 border capitalize  sm:text-md w-full  py-1  px-2 sm:py-2 sm:px-3 rounded-md text-neutral-700 font-medium ">
                <h3 className="text-xs sm:text-sm  ">
                  {topSpendingCategoryName}
                </h3>
                <h3 className="text-xs sm:text-sm   font-sans font-medium">
                  <span>
                    {amount.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </h3>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
