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
  const idsRaw = String(formData.get("ids") ?? "").trim();

  const target =
    targetRaw === "minister" || targetRaw === "mp" || targetRaw === "all"
      ? targetRaw
      : "all";
  const status =
    statusRaw === "pending" || statusRaw === "printed" || statusRaw === "all"
      ? statusRaw
      : "all";

  let ids: string[] = [];
  if (idsRaw) {
    try {
      const parsed = JSON.parse(idsRaw) as unknown;
      if (Array.isArray(parsed)) {
        ids = parsed.filter((id): id is string => typeof id === "string");
      }
    } catch {
      ids = [];
    }
  }
  if (ids.length === 0) {
    ids = await getPrintSubmissionIds({
      target,
      status,
      query: q,
      limit: 1000,
    });
  }

  if (ids.length > 0) {
    await markPrintedBulk(ids, target, "printed");
  }

  return NextResponse.json({ ok: true, updated: ids.length });
}

