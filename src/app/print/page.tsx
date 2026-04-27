import CampaignShell from "@/components/campaign-shell";
import Text from "@/components/text";
import { getRecentSubmissions } from "@/lib/submissions";

export const dynamic = "force-dynamic";

type GroupedByMp = Record<
  string,
  Array<{ name: string; body: string; createdAt: Date }>
>;

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
        <Text as="h2" size="sm" className="font-semibold text-slate-900">
          Minister of Health Print Section ({ministerLetters.length})
        </Text>
        <div className="mt-4 space-y-4">
          {ministerLetters.map((letter, index) => (
            <div
              key={`${letter.name}-${index}`}
              className="rounded-xl border border-slate-200 p-4"
            >
              <Text as="div" size="xs" className="mb-2 text-slate-500">
                {letter.name} | {new Date(letter.createdAt).toLocaleString()}
              </Text>
              <pre className="whitespace-pre-wrap t-5 text-slate-800">
                {letter.body}
              </pre>
            </div>
          ))}
          {ministerLetters.length === 0 ? (
            <Text as="p" size="xs" className="text-slate-600">
              No letters available yet.
            </Text>
          ) : null}
        </div>
      </section>

      <section className="mt-10">
        <Text as="h2" size="sm" className="font-semibold text-slate-900">
          MP Print Sections
        </Text>
        <div className="mt-4 space-y-6">
          {Object.entries(mpGrouped).map(([mpEmail, letters]) => (
            <div
              key={mpEmail}
              className="rounded-2xl border border-slate-200 p-4"
            >
              <Text as="h3" size="xs" className="font-semibold text-slate-800">
                {mpEmail} ({letters.length})
              </Text>
              <div className="mt-3 space-y-3">
                {letters.map((letter, index) => (
                  <div
                    key={`${letter.name}-${index}`}
                    className="rounded-xl bg-slate-50 p-3"
                  >
                    <Text as="div" size="xs" className="mb-2 text-slate-500">
                      {letter.name} |{" "}
                      {new Date(letter.createdAt).toLocaleString()}
                    </Text>
                    <pre className="whitespace-pre-wrap t-5 text-slate-800">
                      {letter.body}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {Object.keys(mpGrouped).length === 0 ? (
            <Text as="p" size="xs" className="text-slate-600">
              No MP copies selected yet.
            </Text>
          ) : null}
        </div>
      </section>
    </CampaignShell>
  );
}
