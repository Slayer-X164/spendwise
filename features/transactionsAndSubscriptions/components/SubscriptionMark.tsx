import Image from "next/image";
import { subscriptionNameKey } from "../subscriptionData";

const brands = new Map([
  ["netflix", { image: "netflix.svg", color: "bg-neutral-900" }],
  ["spotify", { image: "spotify.svg", color: "bg-neutral-900" }],
  ["prime video", { image: "prime.svg", color: "bg-slate-900" }],
  ["icloud+", { color: "bg-blue-500" }],
  ["figma", { color: "bg-neutral-900" }],
  ["adobe creative cloud", { color: "bg-blue-700" }],
]);

export default function SubscriptionMark({ name }: { name: string }) {
  const brand = brands.get(subscriptionNameKey(name));
  const color = brand?.color ?? "bg-slate-700";

  return (
    <span aria-hidden="true" className={`grid size-9 shrink-0 place-items-center rounded-xl text-sm font-bold text-white sm:size-10 ${color}`}>
      {brand?.image ? (
        <Image src={`/subscriptions-icon/${brand.image}`} alt="" width={20} height={20} className="size-5 object-contain" unoptimized />
      ) : Array.from(name)[0]?.toUpperCase()}
    </span>
  );
}
