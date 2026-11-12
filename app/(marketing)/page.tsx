import Link from "next/link";

export default function landing() {
  return (
    <main>
      <div className="p-4">
        <Link href={'/dashboard'} className="rounded-xl bg-blue-600 text-neutral-50 px-3 py-2 capitalize">go to dashboard</Link>
      </div>
    </main>
  );
}
