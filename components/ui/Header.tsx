import { Notification01Icon, Share08Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";

export default function Header() {
  return (
    <main className="w-full h-18 flex justify-between items-center px-2 lg:px-4 ">
      <div className="flex items-center gap-1">
        <Image src={"/brand/logo.png"} width={50} height={50} alt="logo" className="h-12 w-12"/>
        <h2 className="font-medium text-2xl">SpendWise</h2>
      </div>

      <div className="flex items-center gap-3">
        <div className="p-1.5 border border-neutral-300 rounded-lg hover:bg-neutral-200 cursor-pointer h-10 w-10 flex items-center justify-center">
          <HugeiconsIcon icon={Notification01Icon} />
        </div>
        <div className="rounded-full overflow-hidden cursor-pointer">
          <Image src={"/brand/pfp.jpg"} width={50} height={50} alt="profile picture" className="h-10 w-10"/>
        </div>
        <div className="bg-blue-700 text-neutral-50 flex items-center gap-1 h-10 px-3 rounded-lg cursor-pointer font-medium ml-4">
          <h3>Share</h3>
          <HugeiconsIcon icon={Share08Icon} />
        </div>
      </div>


    </main>
  );
}
