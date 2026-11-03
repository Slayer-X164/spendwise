import { CrownPlusIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import SidebarLinks from "./SidebarLinks";

export default function Sidebar() {
  return (
    <main className="w-80 h-[calc(100dvh-72px)] flex flex-col items-center justify-between gap-4 p-3 ">
      <div className="w-full">
        <h3 className="uppercase tracking-wider text-xs text-neutral-400 px-4">
          main menu
        </h3>
        <SidebarLinks/>
      </div>
      <div className="flex items-start flex-col gap-1 rounded-xl bg-linear-to-br from-blue-100 to-blue-200  p-4">
        <h2 className="text-lg capitalize font-semibold">upgrade to pro!</h2>
        <h4 className="text-neutral-600 text-sm">
          Higher productivity with better organization
        </h4>
        <button className="flex items-center gap-1 text-sm w-full mt-3 bg-radial from-blue-700 to-blue-400 cursor-pointer active:scale-95 transition-all duration-150 font-medium justify-center py-2.5 text-blue-50 rounded-xl">
          <HugeiconsIcon icon={CrownPlusIcon} />
          Upgrade
        </button>
      </div>
    </main>
  );
}
