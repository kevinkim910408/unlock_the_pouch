import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSubmissionStats } from "@/lib/submissions";
import Text from "@/components/text";

const POPULATION_BY_PROVINCE: Record<string, string> = {
  ON: "16,000,000",
  AB: "5,000,000",
  BC: "6,000,000",
  SK: "1,200,000",
  MB: "1,500,000",
  QC: "9,000,000",
  NB: "850,000",
  NS: "1,100,000",
  NL: "550,000",
  YT: "45,000",
  NT: "45,000",
  NU: "40,000",
  PE: "180,000",
};

export default async function HomePage() {
  const cookieStore = await cookies();
  const isAgeVerified = cookieStore.get("age_verified")?.value === "true";
  if (!isAgeVerified) redirect("/age-verification");

  let total = 0;
  let provinceStats: Array<{ province: string; count: number }> = [];

  try {
    const stats = await getSubmissionStats();
    total = stats.total;
    provinceStats = stats.provinceStats;
  } catch {
    // Keep page usable even when DB is missing in local dev.
  }

  const orderedRows = [...provinceStats].sort((a, b) => b.count - a.count);

  return (
    <main className="min-h-screen bg-[#ececec]">
      <section className="bg-[#111a2b]">
        <div className="mx-auto w-full max-w-[1200px] px-5 py-10 text-white md:px-8 md:py-14">
          <Text as="h1" size="lg" className="font-black uppercase">
            What Is Happening
          </Text>
          <div className="mt-3 h-1 w-28 bg-[#27a8df]" />
          <div className="mt-4 max-w-4xl space-y-4 text-slate-100">
            <Text size="sm">
              In Canada it is easier in 2024, a federal ministerial order moved
              nicotine pouches behind the counter in pharmacies, making them
              harder for adult Canadians to access, while cigarettes remain
              widely available.
            </Text>
            <Text size="sm">
              For many adults, nicotine pouches are not a starting point. They
              are part of a transition away from smoking. Restricting access
              creates confusion, inconsistency, and real barriers for people
              trying to make a change.
            </Text>
            <Text size="sm">
              This campaign is grounded in a simple principle: adult Canadians
              deserve reasonable, regulated access to lower-risk alternatives.
            </Text>
          </div>

          <Text as="h2" size="lg" className="mt-10 font-black uppercase">
            How To Participate
          </Text>
          <div className="mt-3 h-1 w-28 bg-[#27a8df]" />
          <Text size="sm" className="mt-4 max-w-4xl text-slate-100">
            We created a tool to help you create a personalized letter to send
            to your MP and the Minister of Health. Once done, you can also send
            a note to your Premier.
          </Text>

          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <Text as="p" size="xs" className="mb-2 font-bold uppercase">
                Write to the Government
              </Text>
              <Link
                href="/terms?lang=en"
                className="inline-flex w-[240px] items-center justify-center bg-[#2caee5] px-8 py-2 font-black uppercase text-white hover:bg-[#159bd2]"
              >
                <Text
                  as="span"
                  size="lg"
                  className="font-black uppercase text-white"
                >
                  English
                </Text>
              </Link>
            </div>
            <div>
              <Text as="p" size="xs" className="mb-2 font-bold uppercase">
                Ecrivez au Gouvernement
              </Text>
              <Link
                href="/terms?lang=fr"
                className="inline-flex w-[240px] items-center justify-center bg-[#2caee5] px-8 py-2 font-black uppercase text-white hover:bg-[#159bd2]"
              >
                <Text
                  as="span"
                  size="lg"
                  className="font-black uppercase text-white"
                >
                  Francais
                </Text>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-0 px-5 py-10 md:grid-cols-3 md:px-8">
        <div className="flex min-h-[280px] items-center justify-center border border-[#dddddd] bg-[#efefef] p-6 text-center">
          <div>
            <Text as="p" size="xl" className="font-black text-[#1da8df]">
              {total.toLocaleString()}
            </Text>
            <Text
              as="p"
              size="lg"
              className="mt-3 font-black uppercase text-[#444]"
            >
              Letters Sent
            </Text>
            <Text as="p" size="lg" className="font-black uppercase text-[#444]">
              Lettres Envoyees
            </Text>
          </div>
        </div>

        <div className="flex min-h-[280px] items-center justify-center border border-[#dddddd] bg-[#f4f4f4] p-6">
          <div className="space-y-3 text-center">
            <Text
              as="p"
              size="sm"
              className="font-extrabold uppercase text-[#3b3b3b]"
            >
              1 Create a letter with our tool to send to the government
            </Text>
            <Text
              as="p"
              size="sm"
              className="font-extrabold uppercase text-[#3b3b3b]"
            >
              2 Review and approve
            </Text>
            <Text
              as="p"
              size="sm"
              className="font-extrabold uppercase text-[#3b3b3b]"
            >
              3 We will mail your letter to the government
            </Text>
          </div>
        </div>

        <div className="flex min-h-[280px] items-center justify-center border border-[#dddddd] bg-[#efefef] p-6">
          <div>
            <Text
              as="p"
              size="xl"
              className="font-black uppercase leading-[0.9] text-[#1da8df]"
            >
              Thank You
              <br />
              Merci
            </Text>
            <Text
              as="p"
              size="lg"
              className="mt-5 font-black uppercase leading-tight text-[#3f3f3f]"
            >
              Our collective voice will be heard
            </Text>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 pb-12 md:px-8">
        <div className="flex flex-wrap gap-1">
          <button className="bg-[#dddddd] px-4 py-2 font-bold uppercase text-[#444]">
            <Text
              as="span"
              size="xs"
              className="font-bold uppercase text-[#444]"
            >
              Submissions
            </Text>
          </button>
          <button className="bg-[#1da8df] px-4 py-2 font-bold uppercase text-white">
            <Text
              as="span"
              size="xs"
              className="font-bold uppercase text-white"
            >
              Submissions vs Population
            </Text>
          </button>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <Text
              as="h3"
              size="lg"
              className="font-black uppercase text-[#3b3b3b]"
            >
              Submissions vs Population
            </Text>
            <Text
              as="p"
              size="lg"
              className="font-black uppercase text-[#3b3b3b]"
            >
              Soumissions vs Population
            </Text>

            <table className="mt-5 w-full text-left">
              <thead>
                <tr className="border-b border-[#d5d5d5] text-[#666]">
                  <th className="py-2 pr-2">
                    <Text as="span" size="xs">
                      Province
                    </Text>
                  </th>
                  <th className="py-2 pr-2">
                    <Text as="span" size="xs">
                      Rank
                    </Text>
                  </th>
                  <th className="py-2 pr-2">
                    <Text as="span" size="xs">
                      Submissions
                    </Text>
                  </th>
                  <th className="py-2">
                    <Text as="span" size="xs">
                      Population*
                    </Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderedRows.map((row, index) => (
                  <tr key={row.province} className="border-b border-[#e2e2e2]">
                    <td className="py-2 pr-2">
                      <Text as="span" size="xs" className="font-semibold">
                        {row.province}
                      </Text>
                    </td>
                    <td className="py-2 pr-2">
                      <Text as="span" size="xs">
                        {index + 1}
                      </Text>
                    </td>
                    <td className="py-2 pr-2">
                      <Text as="span" size="xs">
                        {row.count}
                      </Text>
                    </td>
                    <td className="py-2">
                      <Text as="span" size="xs">
                        {POPULATION_BY_PROVINCE[row.province] ?? "-"}
                      </Text>
                    </td>
                  </tr>
                ))}
                {orderedRows.length === 0 ? (
                  <tr>
                    <td className="py-3 text-[#666]" colSpan={4}>
                      <Text as="span" size="xs">
                        No submissions yet.
                      </Text>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <Text as="p" size="xs" className="mt-2 text-[#777]">
              *based on 2024 stat can population
            </Text>
          </div>

          <div className="flex min-h-[360px] items-center justify-center bg-[#d9d9d9]">
            <div className="text-center">
              <Text
                as="p"
                size="md"
                className="font-bold uppercase text-[#666]"
              >
                Canada Map
              </Text>
              <Text as="p" size="xs" className="text-[#777]">
                Placeholder
              </Text>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
