import { ArrowDataTransferHorizontalIcon, CrownPlusIcon, DashboardSquare02Icon, Settings02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export default function Sidebar() {
  return (
    <main className="w-80 h-[calc(100dvh-72px)] flex flex-col items-center justify-between gap-4 p-3 ">
      <div className="w-full">
        <h3 className="uppercase tracking-wider text-xs text-neutral-400 px-4">
          main menu
        </h3>
        <ul className="flex flex-col items-center gap-2 w-full pt-3 px-1 text-sm">
          <li className="w-full">
            <button className="flex cursor-pointer hover:bg-neutral-100 border border-transparent hover:border-neutral-300 rounded-lg w-full px-3 py-2.5 items-center gap-2 bg-radial from-neutral-900 to-neutral-600 text-neutral-50">
              <HugeiconsIcon icon={DashboardSquare02Icon} /> <h3>Dashboard</h3>
            </button>
          </li>
          <li className="w-full">
            <button className="flex cursor-pointer hover:bg-neutral-100 border border-transparent hover:border-neutral-300 rounded-lg w-full px-3 py-2.5 items-center gap-2 bg-radial  ">
              <HugeiconsIcon icon={ArrowDataTransferHorizontalIcon} /> <h3>Transaction</h3>
            </button>
          </li>
          <li className="w-full">
            <button className="flex cursor-pointer hover:bg-neutral-100 border border-transparent hover:border-neutral-300 rounded-lg w-full px-3 py-2.5 items-center gap-2 bg-radial  ">
              <HugeiconsIcon icon={Settings02Icon} /> <h3>Settings</h3>
            </button>
          </li>

        </ul>
      </div>
      <div className="flex items-start flex-col gap-1 rounded-xl bg-linear-to-br from-blue-100 to-blue-200  p-4">
        <h2 className="text-lg capitalize font-semibold">upgrade to pro!</h2>
        <h4 className="text-neutral-600 text-sm">Higher productivity with better organization</h4>
        <button className="flex items-center gap-1 text-sm w-full mt-3 bg-radial from-blue-700 to-blue-400 cursor-pointer active:scale-95 transition-all duration-150 font-medium justify-center py-2.5 text-blue-50 rounded-xl"><HugeiconsIcon icon={CrownPlusIcon} />Upgrade</button>
      </div>
    </main>
  );
}
