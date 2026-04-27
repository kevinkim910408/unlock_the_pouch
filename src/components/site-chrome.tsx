"use client";
import { usePathname } from "next/navigation";
import SiteHeader from "@/components/site-header";
const CHROME_HIDDEN_PREFIXES = ["/age-verification", "/print"];
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideChrome = CHROME_HIDDEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  if (hideChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="h-12 w-full bg-[#082a4a]" />
    </>
  );
}
