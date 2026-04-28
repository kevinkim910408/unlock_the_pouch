import { ADMIN_AUTH_COOKIE } from "@/lib/admin-access";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get("password") ?? "").trim();
  const expected = (process.env.ADMIN_PAGE_PASSWORD ?? "r4v1234").trim();

  if (!password || password !== expected) {
    return NextResponse.redirect(new URL("/admin?error=1", request.url), 303);
  }

  const cookieStore = await cookies();
  cookieStore.set(ADMIN_AUTH_COOKIE, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return NextResponse.redirect(new URL("/admin", request.url), 303);
}
