import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Spendwise",
  description: "Money tracker and analytics",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return <div className="min-h-dvh bg-neutral-50">{children}</div>;
}
