import PrintOnLoad from "@/components/print-on-load";
import { assertAdminAccess } from "@/lib/admin-access";
import { getPrintSubmissions, getPrintSubmissionsByIds } from "@/lib/submissions";

type SearchParams = Promise<{
  target?: string | string[];
  status?: string | string[];
  q?: string | string[];
  recipient?: string | string[];
  ids?: string | string[];
}>;

function single(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function AdminPrintPreviewPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  await assertAdminAccess();
  const params = await searchParams;

  const targetRaw = single(params.target);
  const statusRaw = single(params.status);
  const q = (single(params.q) ?? "").trim();
  const recipient = (single(params.recipient) ?? "").trim();
  const idsRaw = (single(params.ids) ?? "").trim();

  const target =
    targetRaw === "minister" || targetRaw === "mp" ? targetRaw : "all";
  const status =
    statusRaw === "pending" || statusRaw === "printed" ? statusRaw : "all";

  const selectedIds = idsRaw
    ? idsRaw.split(",").map((id) => id.trim()).filter(Boolean)
    : [];
  const rows =
    selectedIds.length > 0
      ? await getPrintSubmissionsByIds(selectedIds)
      : await getPrintSubmissions({ target, status, query: q, recipient, limit: 1000 });

  return (
    <main style={{ padding: "24px", background: "#fff" }}>
      <PrintOnLoad />
      <div className="admin-print-only">
        {rows.map((row) => (
          <div key={String(row._id)}>
            {(target === "all" || target === "minister") && (
              <section className="admin-print-letter">
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: 1.55,
                  }}
                >
                  {row.letterBody}
                </pre>
              </section>
            )}

            {(target === "all" || target === "mp") && row.mpEmail && (
              <section className="admin-print-letter">
                <pre
                  style={{
                    whiteSpace: "pre-wrap",
                    margin: 0,
                    fontSize: "12px",
                    lineHeight: 1.55,
                  }}
                >
                  {row.mpLetterBody ?? row.letterBody}
                </pre>
              </section>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
