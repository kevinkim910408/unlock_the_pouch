import { getSubmissionStats } from "@/lib/submissions";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";

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
  if (!isAgeVerified) {
    redirect("/age-verification");
  }

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
          <h1 className="text-4xl font-black uppercase md:text-5xl">What Is Happening</h1>
          <div className="mt-3 h-1 w-28 bg-[#27a8df]" />
          <div className="mt-4 max-w-4xl space-y-4 text-base leading-6 text-slate-100">
            <p>
              In Canada it is easier in 2024, a federal ministerial order moved
              nicotine pouches behind the counter in pharmacies, making them harder
              for adult Canadians to access, while cigarettes remain widely available.
            </p>
            <p>
              For many adults, nicotine pouches are not a starting point. They are part
              of a transition away from smoking. Restricting access creates confusion,
              inconsistency, and real barriers for people trying to make a change.
            </p>
            <p>
              This campaign is grounded in a simple principle: adult Canadians deserve
              reasonable, regulated access to lower-risk alternatives.
            </p>
          </div>
          <h2 className="mt-10 text-4xl font-black uppercase md:text-5xl">
            How To Participate
          </h2>
          <div className="mt-3 h-1 w-28 bg-[#27a8df]" />
          <p className="mt-4 max-w-4xl text-base leading-6 text-slate-100">
            We created a tool to help you create a personalized letter to send to your MP
            and the Minister of Health. Once done, you can also send a note to your Premier.
          </p>

          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <p className="mb-2 text-sm font-bold uppercase">Write to the Government</p>
              <Link
                href="/terms?lang=en"
                className="inline-flex w-[240px] items-center justify-center bg-[#2caee5] px-8 py-2 text-3xl font-black uppercase text-white hover:bg-[#159bd2] md:text-4xl"
              >
                English
              </Link>
            </div>
            <div>
              <p className="mb-2 text-sm font-bold uppercase">Ecrivez au Gouvernement</p>
              <Link
                href="/terms?lang=fr"
                className="inline-flex w-[240px] items-center justify-center bg-[#2caee5] px-8 py-2 text-3xl font-black uppercase text-white hover:bg-[#159bd2] md:text-4xl"
              >
                Francais
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-0 px-5 py-10 md:grid-cols-3 md:px-8">
        <div className="flex min-h-[280px] items-center justify-center border border-[#dddddd] bg-[#efefef] p-6 text-center">
          <div>
            <p className="text-6xl font-black text-[#1da8df] md:text-7xl">
              {total.toLocaleString()}
            </p>
            <p className="mt-3 text-3xl font-black uppercase text-[#444] md:text-4xl">
              Letters Sent
            </p>
            <p className="text-3xl font-black uppercase text-[#444] md:text-4xl">
              Lettres Envoyees
            </p>
          </div>
        </div>
        <div className="flex min-h-[280px] items-center justify-center border border-[#dddddd] bg-[#f4f4f4] p-6">
          <div className="space-y-3 text-center">
            <p className="text-base font-extrabold uppercase text-[#3b3b3b] md:text-lg">
              1 Create a letter with our tool to send to the government
            </p>
            <p className="text-base font-extrabold uppercase text-[#3b3b3b] md:text-lg">
              2 Review and approve
            </p>
            <p className="text-base font-extrabold uppercase text-[#3b3b3b] md:text-lg">
              3 We will mail your letter to the government
            </p>
          </div>
        </div>
        <div className="flex min-h-[280px] items-center justify-center border border-[#dddddd] bg-[#efefef] p-6">
          <div>
            <p className="text-5xl font-black uppercase leading-[0.9] text-[#1da8df] md:text-6xl">
              Thank You
              <br />
              Merci
            </p>
            <p className="mt-5 text-3xl font-black uppercase leading-tight text-[#3f3f3f] md:text-4xl">
              Our collective voice will be heard
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-5 pb-12 md:px-8">
        <div className="flex flex-wrap gap-1">
          <button className="bg-[#dddddd] px-4 py-2 text-sm font-bold uppercase text-[#444]">
            Submissions
          </button>
          <button className="bg-[#1da8df] px-4 py-2 text-sm font-bold uppercase text-white">
            Submissions vs Population
          </button>
        </div>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div>
            <h3 className="text-4xl font-black uppercase text-[#3b3b3b]">
              Submissions vs Population
            </h3>
            <p className="text-4xl font-black uppercase text-[#3b3b3b]">
              Soumissions vs Population
            </p>
            <table className="mt-5 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-[#d5d5d5] text-[#666]">
                  <th className="py-2 pr-2">Province</th>
                  <th className="py-2 pr-2">Rank</th>
                  <th className="py-2 pr-2">Submissions</th>
                  <th className="py-2">Population*</th>
                </tr>
              </thead>
              <tbody>
                {orderedRows.map((row, index) => (
                  <tr key={row.province} className="border-b border-[#e2e2e2]">
                    <td className="py-2 pr-2 font-semibold">{row.province}</td>
                    <td className="py-2 pr-2">{index + 1}</td>
                    <td className="py-2 pr-2">{row.count}</td>
                    <td className="py-2">
                      {POPULATION_BY_PROVINCE[row.province] ?? "-"}
                    </td>
                  </tr>
                ))}
                {orderedRows.length === 0 ? (
                  <tr>
                    <td className="py-3 text-[#666]" colSpan={4}>
                      No submissions yet.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
            <p className="mt-2 text-xs text-[#777]">*based on 2024 stat can population</p>
          </div>
          <div className="flex min-h-[360px] items-center justify-center bg-[#d9d9d9]">
            <div className="text-center">
              <p className="text-xl font-bold uppercase text-[#666]">Canada Map</p>
              <p className="text-sm text-[#777]">Placeholder</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
