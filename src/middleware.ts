import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const AGE_COOKIE = "age_verified";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico";

  if (isPublicPath) {
    return NextResponse.next();
  }

  const hasAgeCookie = request.cookies.get(AGE_COOKIE)?.value === "true";

  const isAgePage = pathname === "/age-verification";
  if (!hasAgeCookie && !isAgePage) {
    const url = request.nextUrl.clone();
    url.pathname = "/age-verification";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
