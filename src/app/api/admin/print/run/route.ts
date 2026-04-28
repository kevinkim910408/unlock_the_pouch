import { isAdminAuthenticated } from "@/lib/admin-access";
import { getPrintSubmissionIds, markPrintedBulk } from "@/lib/submissions";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const formData = await request.formData();
  const targetRaw = String(formData.get("target") ?? "all");
  const statusRaw = String(formData.get("status") ?? "all");
  const q = String(formData.get("q") ?? "").trim();

  const target =
    targetRaw === "minister" || targetRaw === "mp" || targetRaw === "all"
      ? targetRaw
      : "all";
  const status =
    statusRaw === "pending" || statusRaw === "printed" || statusRaw === "all"
      ? statusRaw
      : "all";

  const ids = await getPrintSubmissionIds({
    target,
    status,
    query: q,
    limit: 1000,
  });

  if (ids.length > 0) {
    await markPrintedBulk(ids, target, "printed");
  }

  const url = new URL("/admin/print-preview", request.url);
  url.searchParams.set("target", target);
  url.searchParams.set("status", status);
  if (q) url.searchParams.set("q", q);
  return NextResponse.redirect(url, 303);
}

