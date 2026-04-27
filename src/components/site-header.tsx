"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const HIDDEN_PREFIXES = ["/age-verification", "/print"];

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldHide = HIDDEN_PREFIXES.some((prefix) =>
    pathname.startsWith(prefix),
  );
  const isHome = pathname === "/";
  const currentLang = searchParams.get("lang") === "fr" ? "fr" : "en";

  if (shouldHide) return null;

  function handleLanguageChange(nextLang: "en" | "fr") {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", nextLang);
    router.replace(`/?${params.toString()}`);
  }

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
        {isHome ? (
          <div className="flex items-center gap-2">
            <label htmlFor="home-lang" className="sr-only">
              Language selector
            </label>
            <select
              id="home-lang"
              value={currentLang}
              onChange={(e) =>
                handleLanguageChange(e.target.value === "fr" ? "fr" : "en")
              }
              className="h-9 min-w-[130px] border border-[#3f6a8f] bg-[#0f3354] px-3 text-sm font-semibold text-white outline-none"
            >
              <option value="en">English</option>
              <option value="fr">French</option>
            </select>
          </div>
        ) : (
          <div className="flex h-8 w-[170px] items-center justify-end gap-3">
            {/* <Image src="/twitter.svg" alt="Twitter" width={20} height={20} />
            <Image src="/ig.svg" alt="Instagram" width={20} height={20} />
            <Image src="/utube.svg" alt="YouTube" width={20} height={20} />
            <Image src="/fb.svg" alt="Facebook" width={20} height={20} /> */}
          </div>
        )}
      </div>
    </header>
  );
}
