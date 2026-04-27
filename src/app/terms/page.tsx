import Link from "next/link";

type Lang = "en" | "fr";

type TermsPageProps = {
  searchParams: Promise<{ lang?: string }>;
};

const CONTENT: Record<
  Lang,
  {
    title: string;
    heading: string;
    label: string;
    lines: string[];
    consent: string;
    back: string;
    accept: string;
  }
> = {
  en: {
    title: "Terms and conditions",
    heading: "Terms and conditions:",
    label: "Terms and conditions:",
    lines: [
      "1. By using this tool, you agree to campaign terms and all referenced policies.",
      "2. Generated letters may be printed and used for campaign delivery operations.",
      "3. You confirm that submitted personal information is accurate to the best of your knowledge.",
      "4. You will not use the platform for unlawful, abusive, or prohibited activity.",
      "5. All content, layout, and platform materials remain protected by applicable copyright laws.",
      "6. Newsletter email storage occurs only when you explicitly opt in to updates.",
      "7. Optional MP details are used only for generation, preview, and campaign print workflows.",
      "8. The tool is provided as-is and may be updated without prior notice during campaign operation.",
      "9. You understand this page is placeholder copy and will be replaced with approved legal language.",
      "10. Continued use of this tool indicates acceptance of these terms.",
    ],
    consent:
      "By using this Rights4Vapers tool, you acknowledge that you have read and accepted these Terms and Conditions.",
    back: "Back",
    accept: "Accept",
  },
  fr: {
    title: "Termes et conditions",
    heading: "Termes et conditions:",
    label: "Termes et conditions:",
    lines: [
      "1. En utilisant cet outil, vous acceptez les conditions de la campagne et les politiques associees.",
      "2. Les lettres generees peuvent etre imprimees et utilisees pour la livraison de la campagne.",
      "3. Vous confirmez que les renseignements soumis sont exacts selon votre connaissance.",
      "4. Vous ne devez pas utiliser la plateforme pour une activite illegale, abusive ou interdite.",
      "5. Tout le contenu, la mise en page et les materiels de la plateforme demeurent proteges par la loi.",
      "6. L'adresse courriel est conservee seulement en cas d'inscription volontaire a l'infolettre.",
      "7. Les details facultatifs du depute servent uniquement a la generation, previsualisation et impression.",
      "8. L'outil est fourni tel quel et peut etre mis a jour sans preavis pendant la campagne.",
      "9. Ce texte est temporaire et sera remplace par la version legale approuvee.",
      "10. L'utilisation continue de l'outil confirme votre acceptation de ces conditions.",
    ],
    consent:
      "En utilisant l'outil Rights4Vapers, vous reconnaissez avoir lu et accepte ces Termes et Conditions.",
    back: "Retour",
    accept: "Accepter",
  },
};

export default async function TermsPage({ searchParams }: TermsPageProps) {
  const params = await searchParams;
  const lang: Lang = params.lang === "fr" ? "fr" : "en";
  const copy = CONTENT[lang];

  return (
    <main className="min-h-screen bg-[#e9e9e9]">
      <section className="mx-auto w-full max-w-[1200px] px-5 py-12 md:px-8 md:py-16">
        <h1 className="text-5xl font-black text-[#3e3e3e] md:text-6xl">{copy.title}</h1>

        <div className="mt-6 border border-[#8f8f8f] bg-[#efefef]">
          <div className="border-b border-[#8f8f8f] px-5 py-4">
            <p className="text-lg font-bold text-[#222]">{copy.heading}</p>
          </div>
          <div className="max-h-[410px] overflow-y-auto px-5 py-4 text-base leading-7 text-[#222]">
            <p className="mb-4 font-bold">{copy.label}</p>
            {copy.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>

        <p className="mt-6 text-lg font-bold text-[#333]">{copy.consent}</p>

        <div className="mt-5 flex gap-3">
          <Link
            href="/"
            className="inline-flex min-w-[130px] items-center justify-center bg-[#55ade0] px-6 py-2 text-base font-black uppercase text-white hover:bg-[#3f9ad0]"
          >
            {copy.back}
          </Link>
          <Link
            href={`/form?lang=${lang}`}
            className="inline-flex min-w-[130px] items-center justify-center bg-[#55ade0] px-6 py-2 text-base font-black uppercase text-white hover:bg-[#3f9ad0]"
          >
            {copy.accept}
          </Link>
        </div>
      </section>
    </main>
  );
}
