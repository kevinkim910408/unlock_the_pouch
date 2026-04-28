import PrintOnLoad from "@/components/print-on-load";
import { assertAdminAccess } from "@/lib/admin-access";
import { getPrintSubmissions } from "@/lib/submissions";

type SearchParams = Promise<{
  target?: string | string[];
  status?: string | string[];
  q?: string | string[];
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

  const target =
    targetRaw === "minister" || targetRaw === "mp" ? targetRaw : "all";
  const status =
    statusRaw === "pending" || statusRaw === "printed" ? statusRaw : "all";

  const rows = await getPrintSubmissions({ target, status, query: q, limit: 1000 });

  return (
    <main style={{ padding: "24px", background: "#fff" }}>
      <PrintOnLoad />
      {rows.map((row) => (
        <section
          key={String(row._id)}
          style={{
            pageBreakAfter: "always",
            borderBottom: "1px solid #ddd",
            paddingBottom: "20px",
            marginBottom: "20px",
          }}
        >
          {(target === "all" || target === "minister") && (
            <article style={{ marginBottom: "18px" }}>
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
            </article>
          )}

          {(target === "all" || target === "mp") && row.mpEmail && (
            <article>
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
            </article>
          )}
        </section>
      ))}
    </main>
  );
}
