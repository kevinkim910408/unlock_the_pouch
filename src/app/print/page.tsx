import CampaignShell from "@/components/campaign-shell";
import { getRecentSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

type GroupedByMp = Record<string, Array<{ name: string; body: string; createdAt: Date }>>;

export default async function PrintPage() {
  let submissions = await getRecentSubmissions(500).catch(() => []);
  submissions = submissions.map((row) => ({
    ...row,
    createdAt: new Date(row.createdAt),
  }));

  const ministerLetters = submissions.map((row) => ({
    name: `${row.firstName} ${row.lastName}`,
    body: row.letterBody,
    createdAt: row.createdAt,
  }));

  const mpGrouped = submissions.reduce<GroupedByMp>((acc, row) => {
    if (!row.mpEmail) return acc;
    if (!acc[row.mpEmail]) acc[row.mpEmail] = [];
    acc[row.mpEmail].push({
      name: `${row.firstName} ${row.lastName}`,
      body: row.letterBody,
      createdAt: row.createdAt,
    });
    return acc;
  }, {});

  return (
    <CampaignShell
      title="Print Dashboard"
      subtitle="Every submission creates 2 letters: one for Minister of Health, one for MP."
    >
      <section>
        <h2 className="text-lg font-semibold text-slate-900">
          Minister of Health Print Section ({ministerLetters.length})
        </h2>
        <div className="mt-4 space-y-4">
          {ministerLetters.map((letter, index) => (
            <div key={`${letter.name}-${index}`} className="rounded-xl border border-slate-200 p-4">
              <div className="mb-2 text-xs text-slate-500">
                {letter.name} | {new Date(letter.createdAt).toLocaleString()}
              </div>
              <pre className="whitespace-pre-wrap text-xs text-slate-800">{letter.body}</pre>
            </div>
          ))}
          {ministerLetters.length === 0 ? (
            <p className="text-sm text-slate-600">No letters available yet.</p>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">MP Print Sections</h2>
        <div className="mt-4 space-y-6">
          {Object.entries(mpGrouped).map(([mpEmail, letters]) => (
            <div key={mpEmail} className="rounded-2xl border border-slate-200 p-4">
              <h3 className="text-sm font-semibold text-slate-800">
                {mpEmail} ({letters.length})
              </h3>
              <div className="mt-3 space-y-3">
                {letters.map((letter, index) => (
                  <div key={`${letter.name}-${index}`} className="rounded-xl bg-slate-50 p-3">
                    <div className="mb-2 text-xs text-slate-500">
                      {letter.name} | {new Date(letter.createdAt).toLocaleString()}
                    </div>
                    <pre className="whitespace-pre-wrap text-xs text-slate-800">
                      {letter.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(mpGrouped).length === 0 ? (
            <p className="text-sm text-slate-600">
              No MP copies selected yet.
            </p>
          ) : null}
        </div>
      </section>
    </CampaignShell>
  );
}
