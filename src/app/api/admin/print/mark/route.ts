import { isAdminAuthenticated } from "@/lib/admin-access";
import { markPrintedBulk } from "@/lib/submissions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const ids = formData
    .getAll("ids")
    .map((value) => String(value))
    .filter(Boolean);
  const target = String(formData.get("target") ?? "all");
  const status = String(formData.get("status") ?? "printed");
  const back = String(formData.get("back") ?? "/admin?tab=print");

  if (
    (target !== "all" && target !== "minister" && target !== "mp") ||
    (status !== "pending" && status !== "printed")
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  await markPrintedBulk(ids, target, status);
  return NextResponse.redirect(new URL(back, request.url), 303);
}
