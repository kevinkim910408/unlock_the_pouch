import AdminPrintSelectionTable from "@/components/admin-print-selection-table";
import Text from "@/components/text";
import { isAdminAuthenticated } from "@/lib/admin-access";
import {
  DESIRED_TOPICS,
  IMPORTANT_TOPICS,
  LETTER_ENDINGS,
  LETTER_OPENINGS,
} from "@/lib/campaign";
import {
  getEmailActionStats,
  getImportantTopicStats,
  getPrintSubmissions,
  getSubmissionStats,
  getSubmissionsForStats,
  getTemplateUsageStats,
  getTopicSelectionStats,
} from "@/lib/submissions";
import { CampaignSubmission } from "@/types/campaign";

type SearchParams = Promise<{
  tab?: string | string[];
  filter?: string | string[];
  sort?: string | string[];
  target?: string | string[];
  status?: string | string[];
  q?: string | string[];
  recipient?: string | string[];
  error?: string | string[];
}>;

function single(value?: string | string[]) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function formatDate(value: Date | string | undefined) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function tabHref(tab: "stats" | "print" | "customers") {
  return `/admin?tab=${tab}`;
}

function TabLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <a
      href={href}
      className={`rounded px-3 py-2 text-sm font-bold ${
        active ? "bg-[#59b0df] text-white" : "bg-[#e4e4e4] text-[#444]"
      }`}
    >
      {label}
    </a>
  );
}

function LoginView({ showError }: { showError: boolean }) {
  return (
    <main className="min-h-screen bg-[#e9e9e9] px-5 py-10 md:px-8">
      <section className="mx-auto w-full max-w-[460px] rounded-md border border-[#d6d6d6] bg-white p-6 md:p-8">
        <Text as="h1" size="md" className="font-black uppercase text-[#333]">
          Admin Login
        </Text>
        <form className="mt-6 space-y-4" method="post" action="/api/admin/login">
          <div>
            <Text as="label" size="xs" className="font-semibold text-[#555]">
              Password
            </Text>
            <input
              name="password"
              type="password"
              className="mt-1 w-full rounded border border-[#cfcfcf] bg-white px-3 py-2"
              autoFocus
              required
            />
          </div>
          {showError ? (
            <Text as="p" size="xs" className="font-semibold text-red-600">
              Wrong password.
            </Text>
          ) : null}
          <button
            type="submit"
            className="rounded bg-[#59b0df] px-4 py-2 text-sm font-bold text-white"
          >
            Login
          </button>
        </form>
      </section>
    </main>
  );
}

export default async function AdminPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return <LoginView showError={single(params.error) === "1"} />;
  }

  const tabRaw = single(params.tab);
  const activeTab =
    tabRaw === "print" || tabRaw === "customers" || tabRaw === "stats"
      ? tabRaw
      : "print";

  const customerFilterRaw = single(params.filter);
  const customerSortRaw = single(params.sort);
  const customerFilter =
    customerFilterRaw === "subscribed" || customerFilterRaw === "unsubscribed"
      ? customerFilterRaw
      : "all";
  const customerSort = customerSortRaw === "old" ? "old" : "new";

  const printTargetRaw = single(params.target);
  const printStatusRaw = single(params.status);
  const printTarget =
    printTargetRaw === "minister" || printTargetRaw === "mp" ? printTargetRaw : "all";
  const printStatus =
    printStatusRaw === "printed" ? "printed" : "pending";
  const printQuery = (single(params.q) ?? "").trim();
  const printRecipient = (single(params.recipient) ?? "").trim();
  type PrintSubmissionRow = CampaignSubmission;

  const [stats, topicStats, importantTopicStats, emailActionStats, customers, printRows] = await Promise.all([
    getSubmissionStats(),
    getTopicSelectionStats(),
    getImportantTopicStats(),
    activeTab === "stats" ? getEmailActionStats() : Promise.resolve({
      peopleSentToMpByMp: [],
      emailsSentByMp: [],
      peopleSentToPremierByProvince: [],
      emailsSentByProvince: [],
      lettersGeneratedByMp: [],
    }),
    activeTab === "customers"
      ? getSubmissionsForStats({
          filter: customerFilter,
          sort: customerSort,
          limit: 1000,
        })
      : Promise.resolve([]),
    activeTab === "print"
      ? getPrintSubmissions({
          target: printTarget,
          status: printStatus,
          query: printQuery,
          recipient: printRecipient,
          limit: 1000,
        })
      : Promise.resolve([] as PrintSubmissionRow[]),
  ]);
  const templateStats = await getTemplateUsageStats();
  const printableRows = (printRows as PrintSubmissionRow[]).map((row) => ({
    ...row,
    _id: String(row._id),
  }));
  const openingLabelById = new Map(LETTER_OPENINGS.map((item) => [item.id, item.en]));
  const endingLabelById = new Map(LETTER_ENDINGS.map((item) => [item.id, item.en]));
  const importantTopicLabelById = new Map(IMPORTANT_TOPICS.map((item) => [item.id, item.en]));
  const desiredTopicLabelById = new Map(DESIRED_TOPICS.map((item) => [item.id, item.en]));

  return (
    <main className="min-h-screen bg-[#e9e9e9] px-5 py-10 md:px-8">
      <section className="mx-auto w-full max-w-[1200px] rounded-md border border-[#d6d6d6] bg-white p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Text as="h1" size="md" className="font-black uppercase text-[#333]">
            Admin Dashboard
          </Text>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <TabLink href={tabHref("stats")} label="Stats" active={activeTab === "stats"} />
          <TabLink href={tabHref("print")} label="Print" active={activeTab === "print"} />
          <TabLink
            href={tabHref("customers")}
            label="Customer List"
            active={activeTab === "customers"}
          />
        </div>

        {activeTab === "stats" ? (
          <div className="mt-8 space-y-8">
            <div className="grid gap-3 md:grid-cols-1">
              <div className="rounded border border-[#d9d9d9] bg-[#f7f7f7] p-4">
                <Text as="p" size="xs" className="font-semibold text-[#555]">
                  Total Submissions
                </Text>
                <Text as="p" size="lg" className="mt-2 font-black text-[#222]">
                  {stats.total.toLocaleString()}
                </Text>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Province Submissions
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Province
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Submissions
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stats.provinceStats.map((row) => (
                    <tr key={row.province}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.province}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                How Many People Sent An Email To Which MP
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        MP
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        People
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailActionStats.peopleSentToMpByMp.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                How Many Emails Sent Based On MP
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        MP
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Emails Sent
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailActionStats.emailsSentByMp.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                How Many People Sent An Email To Premier By Province
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Province
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        People
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailActionStats.peopleSentToPremierByProvince.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                How Many Emails Sent Based On Province
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Province
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Emails Sent
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailActionStats.emailsSentByProvince.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                How Many Letters Generated Based On MP
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        MP
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Letters
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {emailActionStats.lettersGeneratedByMp.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                What They Want Topic Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Topic
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Selected
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importantTopicStats.desiredTopicStats.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {desiredTopicLabelById.get(row.key) ?? row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                What They Want Variant Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Variant
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Selected
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importantTopicStats.desiredVariantStats.map((row) => {
                    const [topicId, variantRaw] = row.key.split(":v");
                    const topicLabel = desiredTopicLabelById.get(topicId) ?? topicId;
                    const label = variantRaw
                      ? `${topicLabel} (Variant ${variantRaw})`
                      : row.key;
                    return (
                      <tr key={row.key}>
                        <td className="border-b border-[#eeeeee] px-2 py-2">
                          <Text as="span" size="xs" className="font-semibold text-[#333]">
                            {label}
                          </Text>
                        </td>
                        <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                          <Text as="span" size="xs" className="text-[#333]">
                            {row.count.toLocaleString()}
                          </Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Topic Selections
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Topic
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Selected
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topicStats.map((row) => (
                    <tr key={row.topicId}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.topicId}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Why Important Topic Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Topic
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Selected
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importantTopicStats.topicStats.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {importantTopicLabelById.get(row.key) ?? row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Why Important Variant Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Variant
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Selected
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {importantTopicStats.variantStats.map((row) => {
                    const [topicId, variantRaw] = row.key.split(":v");
                    const topicLabel = importantTopicLabelById.get(topicId) ?? topicId;
                    const label = variantRaw
                      ? `${topicLabel} (Variant ${variantRaw})`
                      : row.key;
                    return (
                      <tr key={row.key}>
                        <td className="border-b border-[#eeeeee] px-2 py-2">
                          <Text as="span" size="xs" className="font-semibold text-[#333]">
                            {label}
                          </Text>
                        </td>
                        <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                          <Text as="span" size="xs" className="text-[#333]">
                            {row.count.toLocaleString()}
                          </Text>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Opening Template Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Opening
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Used
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templateStats.openingStats.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {openingLabelById.get(row.key) ?? row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Ending Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Ending
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Used
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templateStats.endingStats.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {endingLabelById.get(row.key) ?? row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Subject Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Subject
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Used
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templateStats.subjectStats.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="overflow-x-auto">
              <Text as="h2" size="sm" className="mb-3 font-black uppercase text-[#333]">
                Premier Subject Usage
              </Text>
              <table className="w-full min-w-[420px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Subject
                      </Text>
                    </th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-right">
                      <Text as="span" size="xs" className="font-black text-[#444]">
                        Used
                      </Text>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {templateStats.premierSubjectStats.map((row) => (
                    <tr key={row.key}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        <Text as="span" size="xs" className="font-semibold text-[#333]">
                          {row.key}
                        </Text>
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-right">
                        <Text as="span" size="xs" className="text-[#333]">
                          {row.count.toLocaleString()}
                        </Text>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === "customers" ? (
          <div className="mt-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <Text as="h2" size="sm" className="font-black uppercase text-[#333]">
                Customer List
              </Text>
              <form className="flex flex-wrap gap-2" method="get">
                <input type="hidden" name="tab" value="customers" />
                <select
                  name="filter"
                  defaultValue={customerFilter}
                  className="rounded border border-[#cfcfcf] bg-white px-2 py-1 text-sm"
                >
                  <option value="all">All</option>
                  <option value="subscribed">Subscribed</option>
                  <option value="unsubscribed">Unsubscribed</option>
                </select>
                <select
                  name="sort"
                  defaultValue={customerSort}
                  className="rounded border border-[#cfcfcf] bg-white px-2 py-1 text-sm"
                >
                  <option value="new">New - Old</option>
                  <option value="old">Old - New</option>
                </select>
                <button
                  type="submit"
                  className="rounded bg-[#59b0df] px-3 py-1 text-sm font-bold text-white"
                >
                  Apply
                </button>
              </form>
            </div>

            <Text as="p" size="xs" className="mt-2 text-[#666]">
              Showing {customers.length.toLocaleString()} users
            </Text>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead>
                  <tr>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Created</th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Name</th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Email</th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Province</th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">City</th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-left">Postal Code</th>
                    <th className="border-b border-[#d9d9d9] px-2 py-2 text-center">Subscriber</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((user) => (
                    <tr key={String(user._id)}>
                      <td className="border-b border-[#eeeeee] px-2 py-2">{formatDate(user.createdAt)}</td>
                      <td className="border-b border-[#eeeeee] px-2 py-2">
                        {user.firstName} {user.lastName}
                      </td>
                      <td className="border-b border-[#eeeeee] px-2 py-2">{user.email}</td>
                      <td className="border-b border-[#eeeeee] px-2 py-2">{user.province}</td>
                      <td className="border-b border-[#eeeeee] px-2 py-2">{user.city}</td>
                      <td className="border-b border-[#eeeeee] px-2 py-2">{user.postalCode}</td>
                      <td className="border-b border-[#eeeeee] px-2 py-2 text-center">
                        {user.newsletterOptIn ? "Yes" : "No"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === "print" ? (
          <div className="mt-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <Text as="h2" size="sm" className="font-black uppercase text-[#333]">
                Print Queue
              </Text>
              <div className="flex items-center gap-2">
                <a
                  href={`/admin?tab=print&status=pending&target=${printTarget}${printQuery ? `&q=${encodeURIComponent(printQuery)}` : ""}${printRecipient ? `&recipient=${encodeURIComponent(printRecipient)}` : ""}`}
                  className={`rounded px-3 py-1 text-sm font-bold ${
                    printStatus === "pending"
                      ? "bg-[#59b0df] text-white"
                      : "bg-[#e4e4e4] text-[#444]"
                  }`}
                >
                  Unprinted
                </a>
                <a
                  href={`/admin?tab=print&status=printed&target=${printTarget}${printQuery ? `&q=${encodeURIComponent(printQuery)}` : ""}${printRecipient ? `&recipient=${encodeURIComponent(printRecipient)}` : ""}`}
                  className={`rounded px-3 py-1 text-sm font-bold ${
                    printStatus === "printed"
                      ? "bg-[#59b0df] text-white"
                      : "bg-[#e4e4e4] text-[#444]"
                  }`}
                >
                  Printed
                </a>
              </div>
              <form className="flex flex-wrap gap-2" method="get">
                <input type="hidden" name="tab" value="print" />
                <input type="hidden" name="status" value={printStatus} />
                <select
                  name="target"
                  defaultValue={printTarget}
                  className="rounded border border-[#cfcfcf] bg-white px-2 py-1 text-sm"
                >
                  <option value="all">All (Minister + MP)</option>
                  <option value="minister">Minister</option>
                  <option value="mp">MP</option>
                </select>
                <input
                  type="text"
                  name="q"
                  defaultValue={printQuery}
                  placeholder="Letter #"
                  className="rounded border border-[#cfcfcf] bg-white px-2 py-1 text-sm"
                />
                <input
                  type="text"
                  name="recipient"
                  defaultValue={printRecipient}
                  placeholder={printTarget === "mp" ? "MP name" : "Recipient name"}
                  className="rounded border border-[#cfcfcf] bg-white px-2 py-1 text-sm"
                />
                <button
                  type="submit"
                  className="rounded bg-[#59b0df] px-3 py-1 text-sm font-bold text-white"
                >
                  Apply
                </button>
              </form>
            </div>

            <div className="mt-3 flex items-center gap-2">
              <Text as="p" size="xs" className="text-[#666]">
                Showing {printRows.length.toLocaleString()} letters
              </Text>
            </div>
            <AdminPrintSelectionTable
              rows={printableRows}
              target={printTarget}
              status={printStatus}
              query={printQuery}
              recipient={printRecipient}
            />
          </div>
        ) : null}
      </section>
    </main>
  );
}

