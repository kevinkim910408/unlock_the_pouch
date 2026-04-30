import { isAdminAuthenticated } from "@/lib/admin-access";
import { getSubmissionsForStats } from "@/lib/submissions";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function escapeCsv(value: string) {
  const normalized = value.replaceAll('"', '""');
  return `"${normalized}"`;
}

function single(value: string | string[] | null) {
  if (Array.isArray(value)) return value[0] ?? "";
  return value ?? "";
}

export async function GET(request: Request) {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const filterRaw = single(url.searchParams.get("filter"));
  const sortRaw = single(url.searchParams.get("sort"));
  const filter =
    filterRaw === "subscribed" || filterRaw === "unsubscribed" ? filterRaw : "all";
  const sort = sortRaw === "old" ? "old" : "new";

  const rows = await getSubmissionsForStats({ filter, sort, limit: 100000 });
  const header = [
    "Created At",
    "First Name",
    "Last Name",
    "Email",
    "Province",
    "City",
    "Postal Code",
    "Subscribed",
  ];
  const body = rows.map((row) => [
    row.createdAt ? new Date(row.createdAt).toISOString() : "",
    row.firstName ?? "",
    row.lastName ?? "",
    row.email ?? "",
    row.province ?? "",
    row.city ?? "",
    row.postalCode ?? "",
    row.newsletterOptIn ? "Yes" : "No",
  ]);

  const csv = [header, ...body]
    .map((line) => line.map((cell) => escapeCsv(String(cell))).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-subscribers.csv"`,
      "Cache-Control": "no-store",
    },
  });
}

