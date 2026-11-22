"use client"
import {
  ArrowDataTransferHorizontalIcon,
  DashboardSquare02Icon,
  Settings02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function SidebarLinks() {
  const pathname = usePathname();
  const PageLinks = [
    {
      id:1,
      name: "dashboard",
      link: "/dashboard",
      icon: DashboardSquare02Icon
    },
    {
      id:2,
      name: "transactions",
      link: "/transactions",
      icon: ArrowDataTransferHorizontalIcon
    },
    {
      id:3,
      name: "settings",
      link: "/settings",
      icon: Settings02Icon
    },
  ];
  return (
    <ul className="flex flex-col items-center gap-2 w-full pt-3 px-1 text-sm">
      {PageLinks.map((e) => (
        <li className="w-full" key={`${e.name}-${e.id}`}>
          <Link
            href={e.link}
            className={`${pathname == e.link && "bg-radial from-neutral-900 to-neutral-600 text-neutral-50"}  flex cursor-pointer hover:bg-neutral-100 border border-transparent hover:border-neutral-300 rounded-lg w-full px-3 py-2.5 items-center gap-2 `}
          >
            <HugeiconsIcon icon={e.icon} />{" "}
            <h3 className="capitalize">{e.name}</h3>
          </Link>
        </li>
      ))}
    </ul>
  );
}
