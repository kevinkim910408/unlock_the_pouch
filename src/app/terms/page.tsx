import Link from "next/link";
import Text from "@/components/text";
import { splitTermsParagraphs, TERMS_TEXT, TermsLang } from "@/lib/terms-content";

type Lang = "en" | "fr";
type TermsPageProps = { searchParams: Promise<{ lang?: string }> };

const CONTENT: Record<
  Lang,
  {
    title: string;
    label: string;
    consentPrefix: string;
    consentPrivacyLabel: string;
    consentSuffix: string;
    back: string;
    accept: string;
  }
> = {
  en: {
    title: "Terms and conditions",
    label: "Terms and conditions:",
    consentPrefix:
      "By using this Rights4Vapers tool, you acknowledge that you have read and accepted these Terms and Conditions and the ",
    consentPrivacyLabel: "Privacy Policy",
    consentSuffix: ".",
    back: "Back",
    accept: "Accept",
  },
  fr: {
    title: "Termes et conditions",
    label: "Termes et conditions:",
    consentPrefix:
      "En utilisant l'outil Rights4Vapers, vous reconnaissez avoir lu et accepte ces Termes et Conditions et la ",
    consentPrivacyLabel: "Politique de confidentialite",
    consentSuffix: ".",
    back: "Retour",
    accept: "Accepter",
  },
};

export default async function TermsPage({ searchParams }: TermsPageProps) {
  const params = await searchParams;
  const lang: TermsLang = params.lang === "fr" ? "fr" : "en";
  const copy = CONTENT[lang];
  const termsParagraphs = splitTermsParagraphs(TERMS_TEXT[lang]);
  const privacyPolicyText =
    lang === "fr" ? "Politique de confidentialite" : "Privacy Policy";
  const privacyPolicyHref = `/privacy-policy?lang=${lang}`;

  return (
    <main className="h-[calc(100dvh-7rem)] overflow-hidden bg-[#e9e9e9]">
      <section className="mx-auto flex h-full min-h-0 w-full max-w-[1200px] flex-col px-5 pb-5 pt-8 md:px-8 md:pb-6 md:pt-10">
        <Text as="h1" size="md" className="font-black text-[#3e3e3e]">
          {copy.title}
        </Text>

        <div className="mt-6 min-h-0 flex-1 border border-[#8f8f8f] bg-[#efefef]">
          <div className="h-full overflow-y-auto px-5 py-4">
            <Text as="p" size="sm" className="mb-4 font-bold text-[#222]">
              {copy.label}
            </Text>
            {termsParagraphs.map((line) => (
              <Text key={line} as="p" size="sm" className="!leading-9 text-[#222]">
                {line.split(privacyPolicyText).map((part, index, arr) => (
                  <span key={`${line}-${index}`}>
                    {part}
                    {index < arr.length - 1 && (
                      <Link
                        href={privacyPolicyHref}
                        className="text-[#145f8f] underline underline-offset-2 hover:text-[#0f4a6f]"
                      >
                        {privacyPolicyText}
                      </Link>
                    )}
                  </span>
                ))}
              </Text>
            ))}
          </div>
        </div>

        <Text as="p" size="sm" className="mt-4 !leading-7 font-bold text-[#333]">
          {copy.consentPrefix}
          <Link
            href={privacyPolicyHref}
            className="text-[#145f8f] underline underline-offset-2 hover:text-[#0f4a6f]"
          >
            {copy.consentPrivacyLabel}
          </Link>
          {copy.consentSuffix}
        </Text>

        <div className="mt-4 flex gap-3">
          <Link
            href="/"
            className="inline-flex min-w-[130px] items-center justify-center bg-[#55ade0] px-6 py-2 uppercase text-white hover:bg-[#3f9ad0]"
          >
            <Text
              as="span"
              size="sm"
              className="font-black uppercase text-white"
            >
              {copy.back}
            </Text>
          </Link>
          <Link
            href={`/form?lang=${lang}`}
            className="inline-flex min-w-[130px] items-center justify-center bg-[#55ade0] px-6 py-2 uppercase text-white hover:bg-[#3f9ad0]"
          >
            <Text
              as="span"
              size="sm"
              className="font-black uppercase text-white"
            >
              {copy.accept}
            </Text>
          </Link>
        </div>
      </section>
    </main>
  );
}
