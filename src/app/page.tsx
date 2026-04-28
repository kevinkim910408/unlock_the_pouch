import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getSubmissionStats } from "@/lib/submissions";
import Text from "@/components/text";
import CanadaMap from "@/components/canada-map";
import { CampaignLanguage } from "@/types/campaign";

type HomePageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const HOME_COPY: Record<
  CampaignLanguage,
  {
    happeningTitle: string;
    happeningBody: string[];
    participateTitle: string;
    participateBody: string;
    ctaLeftLabel: string;
    ctaLeftButton: string;
    ctaRightLabel: string;
    ctaRightButton: string;
    statLabel: string;
    step1: string;
    step2: string;
    step3: string;
    thankTitle: string;
    thankLine: string;
  }
> = {
  en: {
    happeningTitle: "What Is Happening",
    happeningBody: [
      "In Canada in 2024, a federal ministerial order moved nicotine pouches behind the counter in pharmacies, making them harder for adult Canadians to access while cigarettes remain widely available.",
      "For many adults, nicotine pouches are not a starting point. They are part of a transition away from smoking. Restricting access creates confusion, inconsistency, and real barriers for people trying to make a change.",
      "This campaign is grounded in a simple principle: adult Canadians deserve reasonable, regulated access to lower-risk alternatives.",
    ],
    participateTitle: "How To Participate",
    participateBody:
      "We created a tool to help you create a personalized letter to send to your MP and the Minister of Health. Once done, you can also send a note to your Premier.",
    ctaLeftLabel: "Write to the Government",
    ctaLeftButton: "English",
    ctaRightLabel: "Ecrivez au Gouvernement",
    ctaRightButton: "Francais",
    statLabel: "Letters Sent",
    step1: "Create a letter with our tool to send to the government",
    step2: "Review and approve",
    step3: "We will mail your letter to the government",
    thankTitle: "Thank You",
    thankLine: "Our collective voice will be heard",
  },
  fr: {
    happeningTitle: "Qu’est-ce qui se passe ?",
    happeningBody: [
      "Au Canada, il est plus facile d’acheter un paquet de cigarettes que d’acheter un produit qui peut vous aider à arrêter de fumer. Cela n’a aucun sens.",
      "Pourquoi ? Parce qu’en 2024, le gouvernement fédéral a décidé de restreindre les sachets de nicotine, conçus spécifiquement comme aide à l’abandon du tabac, en les plaçant derrière le comptoir des pharmacies. Pendant ce temps, les cigarettes demeurent largement accessibles dans presque tous les dépanneurs du pays.",
      "Pour de nombreux adultes, les sachets de nicotine ne sont pas un point de départ, mais plutôt une étape dans une transition pour cesser de fumer. Restreindre l’accès n’élimine pas la demande; cela crée de la confusion, de l’incohérence et de véritables obstacles pour les personnes qui tentent d’apporter un changement.",
      "Cette campagne repose sur un principe simple : le bon sens !",
      "Les adultes canadiens méritent un accès raisonnable et réglementé à des solutions à moindre risque. Les politiques devraient refléter l’impact réel sur le terrain, et pour l’instant, celle-ci manque la cible.",
    ],
    participateTitle: "Comment participer",
    participateBody: `Dites à votre député et à la ministre de la Santé que cette situation est inacceptable.

Cet outil vous aidera à le faire. Suivez les étapes pour créer une lettre personnalisée et unique qui met en lumière les enjeux qui vous tiennent à cœur.

Une fois votre lettre rédigée, vous aurez la possibilité d’envoyer un message à votre premier ministre provincial pour lui faire savoir que vous souhaitez avoir accès aux sachets de nicotine.

Nous voulons nous assurer que tous les Canadiens aient accès à des produits plus sûrs.`,
    ctaLeftLabel: "Write to the Government",
    ctaLeftButton: "English",
    ctaRightLabel: "Ecrivez au Gouvernement",
    ctaRightButton: "Francais",
    statLabel: "Lettres envoyées",
    step1: "Créez une lettre avec notre outil pour le gouvernement",
    step2: "Révisez et approuvez",
    step3: "Nous posterons votre lettre au gouvernement",
    thankTitle: "Merci",
    thankLine: "Notre voix collective sera entendue",
  },
};

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const language: CampaignLanguage = params.lang === "fr" ? "fr" : "en";
  const t = HOME_COPY[language];

  const cookieStore = await cookies();
  const isAgeVerified = cookieStore.get("age_verified")?.value === "true";
  if (!isAgeVerified) redirect("/age-verification");

  let total = 123456;

  try {
    const stats = await getSubmissionStats();
    total = stats.total;
  } catch {
    // Keep page usable even when DB is missing in local dev.
  }

  return (
    <main className="min-h-screen bg-[#ececec]">
      <section
        className="relative bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/home-overlay.svg')" }}
      >
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 mx-auto w-full max-w-[1200px] px-5 py-10 text-white md:px-8 md:py-14">
          <Text as="h1" size="lg" className="font-black uppercase">
            {t.happeningTitle}
          </Text>
          <div className="mt-3 h-1 w-28 bg-[#27a8df]" />
          <div className="mt-4 max-w-4xl space-y-4 text-slate-100">
            {t.happeningBody.map((line) => (
              <Text key={line} size="sm">
                {line}
              </Text>
            ))}
          </div>

          <Text as="h2" size="lg" className="mt-10 font-black uppercase">
            {t.participateTitle}
          </Text>
          <div className="mt-3 h-1 w-28 bg-[#27a8df]" />
          <Text
            size="sm"
            className="mt-4 max-w-4xl whitespace-pre-line text-slate-100"
          >
            {t.participateBody}
          </Text>

          <div className="mt-8 flex flex-wrap gap-6">
            <div>
              <Text as="p" size="xs" className="mb-2 font-bold uppercase">
                {t.ctaLeftLabel}
              </Text>
              <Link
                href="/terms?lang=en"
                className="inline-flex w-[240px] items-center justify-center bg-[#2caee5] px-8 py-2 font-black uppercase text-white hover:bg-[#159bd2]"
              >
                <Text
                  as="span"
                  size="sm"
                  className="font-black uppercase text-white"
                >
                  {t.ctaLeftButton}
                </Text>
              </Link>
            </div>
            <div>
              <Text as="p" size="xs" className="mb-2 font-bold uppercase">
                {t.ctaRightLabel}
              </Text>
              <Link
                href="/terms?lang=fr"
                className="inline-flex w-[240px] items-center justify-center bg-[#2caee5] px-8 py-2 font-black uppercase text-white hover:bg-[#159bd2]"
              >
                <Text
                  as="span"
                  size="sm"
                  className="font-black uppercase text-white"
                >
                  {t.ctaRightButton}
                </Text>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-[1200px] gap-0 px-5 py-10 md:grid-cols-3 md:px-8">
        <div className="flex min-h-[280px] items-center justify-center bg-[#efefef] p-6 text-center">
          <div className="w-full">
            <Text
              as="p"
              size="lg"
              className="text-center font-black text-[#1da8df] md:text-right"
            >
              {total.toLocaleString()}
            </Text>
            <Text
              as="p"
              size="md"
              className="mt-3 text-center font-black uppercase text-[#444] md:text-right"
            >
              {t.statLabel}
            </Text>
          </div>
        </div>

        <div className="bg-[#f4f4f4] p-6">
          <div className="space-y-6">
            <div className="relative flex min-h-[140px] flex-col items-center justify-center text-center">
              <img src="/1st.svg" alt="Step 1" className="h-16 w-16" />
              <Text
                as="p"
                size="xs"
                className="mt-4 font-extrabold uppercase text-[#3b3b3b]"
              >
                {t.step1}
              </Text>
            </div>

            <div className="relative flex min-h-[140px] flex-col items-center justify-center text-center">
              <img src="/2nd.svg" alt="Step 2" className="h-16 w-16" />
              <Text
                as="p"
                size="xs"
                className="mt-4 font-extrabold uppercase text-[#3b3b3b]"
              >
                {t.step2}
              </Text>
            </div>

            <div className="relative flex min-h-[140px] flex-col items-center justify-center text-center">
              <img src="/3rd.svg" alt="Step 3" className="h-16 w-16" />
              <Text
                as="p"
                size="xs"
                className="mt-4 font-extrabold uppercase text-[#3b3b3b]"
              >
                {t.step3}
              </Text>
            </div>
          </div>
        </div>

        <div className="flex min-h-[280px] items-center justify-center bg-[#efefef] p-6">
          <div className="text-center md:text-left">
            <Text
              as="p"
              size="md"
              className="font-black uppercase leading-[0.9] text-[#1da8df]"
            >
              {t.thankTitle}
            </Text>
            <Text
              as="p"
              size="sm"
              className="mt-5 font-black uppercase leading-tight text-[#3f3f3f]"
            >
              {t.thankLine}
            </Text>
          </div>
        </div>
      </section>

      <CanadaMap language={language} />
    </main>
  );
}
