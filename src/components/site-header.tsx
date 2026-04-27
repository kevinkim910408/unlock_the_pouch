"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const HIDDEN_PREFIXES = ["/age-verification", "/print"];

export default function SiteHeader() {
  const pathname = usePathname();
  const shouldHide = HIDDEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );

  if (shouldHide) return null;

  return (
    <header className="bg-[#082a4a]">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-5 md:px-8">
        <Link href="/" className="inline-block">
          <div className="relative h-12 w-40">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain object-left"
            />
          </div>
        </Link>
        <div className="h-8 w-14 bg-[#ffd83d]" />
      </div>
    </header>
  );
}
