import { NextResponse } from "next/server"; export async function GET(request: Request) { const url = new URL("/", request.url); const response = NextResponse.redirect(url); response.cookies.set({ name: "age_verified", value: "true", path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax", httpOnly: false, }); return response;
}
