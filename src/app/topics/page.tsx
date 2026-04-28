"use client";

import Text from "@/components/text";
import ProgressSteps from "@/components/progress-steps";
import {
  DESIRED_TOPICS,
  IMPORTANT_TOPICS,
  MINISTER_EMAIL_BY_PROVINCE,
  getMinisterGreeting,
  LETTER_ENDINGS,
  PREMIER_EMAIL_BY_PROVINCE,
  generateLetter,
  pickDesiredTopicVariant,
  pickImportantTopicVariant,
  selectRandomLetterOptions,
} from "@/lib/campaign";
import { CampaignLanguage } from "@/types/campaign";
import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const MINISTER_EMAIL_FALLBACK = "marjorie.michel@parl.gc.ca";

function shuffledCopy<T>(items: T[]) {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function htmlBodyToText(html: string) {
  return html
    .replace(/<\/p>\s*(?:<br\s*\/?>\s*)*<p>/gi, "\n\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildMpLetterFromMinisterLetter(ministerLetter: string, mpName?: string) {
  const mpLabel = (mpName ?? "").trim() || "Member of Parliament";
  const lines = ministerLetter.split("\n");
  if (lines.length > 0) {
    lines[0] = /^Ch(?:er|ere)\b/i.test(lines[0]) ? `Cher ${mpLabel},` : `Dear ${mpLabel},`;
  }
  const normalized = lines.join("\n").replace(/\nCC\s*:.*$/gim, "").trim();
  return normalized;
}


type Copy = {
  progress: [string, string, string];
  heading: string;
  sectionOne: string;
  sectionTwo: string;
  back: string;
  next: string;
  error: string;
  generating: string;
};

const COPY: Record<CampaignLanguage, Copy> = {
  en: {
    progress: [
      "STEP 1 - Your info",
      "STEP 2 - Choose Topics",
      "STEP 3 - Send the letter",
    ],
    heading: "Please choose the topics below",
    sectionOne: "Why is this important to you? (Pick 2)",
    sectionTwo: "What do you want? (Pick 2)",
    back: "Back",
    next: "Next",
    error: "Please select 2 topics from each section.",
    generating: "Generating your letter...",
  },
  fr: {
    progress: [
      "ETAPE 1 - Vos infos",
      "ETAPE 2 - Choisir les sujets",
      "ETAPE 3 - Envoyer la lettre",
    ],
    heading: "Veuillez choisir les sujets ci-dessous",
    sectionOne: "Pourquoi est-ce important pour vous? (Choisissez 2)",
    sectionTwo: "Que voulez-vous? (Choisissez 2)",
    back: "Retour",
    next: "Suivant",
    error: "Veuillez choisir 2 sujets dans chaque section.",
    generating: "Generation de votre lettre...",
  },
};

type MpLookupResponse = {
  ministerEmail?: string;
  mp?: {
    name?: string;
    email?: string;
    districtName?: string;
  } | null;
};

type AiLetterResponse = {
  letterHtml?: string;
  error?: string;
};

function TopicsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language: CampaignLanguage =
    searchParams.get("lang") === "fr" ? "fr" : "en";
  const t = COPY[language];

  const [sectionOneSelected, setSectionOneSelected] = useState<string[]>([]);
  const [sectionTwoSelected, setSectionTwoSelected] = useState<string[]>([]);
  const [sectionOneOptions, setSectionOneOptions] = useState(IMPORTANT_TOPICS);
  const [sectionTwoOptions, setSectionTwoOptions] = useState(DESIRED_TOPICS);
  const [ready, setReady] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = window.setTimeout(() => {
      setSectionOneOptions(shuffledCopy(IMPORTANT_TOPICS));
      setSectionTwoOptions(shuffledCopy(DESIRED_TOPICS));
      setReady(true);
    }, 0);
    return () => window.clearTimeout(id);
  }, []);

  if (!ready) {
    return <main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]" />;
  }

  function toggle(
    list: string[],
    setList: (v: string[]) => void,
    value: string,
  ) {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
      return;
    }
    if (list.length >= 2) return;
    setList([...list, value]);
  }

  function handleBack() {
    router.push(`/form?lang=${language}`);
  }

  async function handleNext() {
    if (isGenerating) return;
    if (sectionOneSelected.length !== 2 || sectionTwoSelected.length !== 2) {
      setError(t.error);
      return;
    }
    setIsGenerating(true);

    try {
      const rawInfo = localStorage.getItem("campaign-form-info");
      const formInfo = rawInfo
        ? (JSON.parse(rawInfo) as Record<string, string | boolean>)
        : {};

      const postalCode =
        typeof formInfo.postalCode === "string" ? formInfo.postalCode : "";
      let mpEmail: string | undefined;
      let mpName: string | undefined;
      let mpRiding: string | undefined;
      let ministerEmail = MINISTER_EMAIL_FALLBACK;
      const provinceCode =
        typeof formInfo.province === "string" ? formInfo.province.trim().toUpperCase() : "";
      if (provinceCode && MINISTER_EMAIL_BY_PROVINCE[provinceCode]) {
        ministerEmail = MINISTER_EMAIL_BY_PROVINCE[provinceCode] as string;
      }

      if (postalCode) {
        try {
          const response = await fetch(
            `/api/mp-lookup?postalCode=${encodeURIComponent(postalCode)}`,
            { cache: "no-store" },
          );
          if (response.ok) {
            const lookup = (await response.json()) as MpLookupResponse;
            mpEmail = lookup.mp?.email;
            mpName = lookup.mp?.name;
            mpRiding = lookup.mp?.districtName;
          }
        } catch {
          // Keep fallback values if lookup fails.
        }
      }

      const randomOptions = selectRandomLetterOptions();
      const sectionOneVariants = sectionOneSelected
        .map((topicId) => pickImportantTopicVariant(topicId))
        .filter((item): item is { topicId: string; variantId: string; text: string; textFr: string } => Boolean(item));
      const sectionTwoVariants = sectionTwoSelected
        .map((topicId) => pickDesiredTopicVariant(topicId))
        .filter((item): item is { topicId: string; variantId: string; text: string; textFr: string } => Boolean(item));
      const sectionOneVariantTexts = sectionOneVariants.map((item) =>
        language === "fr" ? item.textFr : item.text,
      );
      const sectionTwoVariantTexts = sectionTwoVariants.map((item) =>
        language === "fr" ? item.textFr : item.text,
      );
      const selectedTopics = [...sectionOneVariantTexts, ...sectionTwoVariantTexts];
      const fallbackLetterBody = generateLetter({
        language,
        firstName: String(formInfo.firstName ?? ""),
        lastName: String(formInfo.lastName ?? ""),
        email: String(formInfo.email ?? ""),
        city: String(formInfo.city ?? ""),
        province: String(formInfo.province ?? ""),
        postalCode: String(formInfo.postalCode ?? ""),
        newsletterOptIn: Boolean(formInfo.newsletterOptIn),
        topics: selectedTopics,
        mpEmail,
        mpName,
        mpRiding,
        subjectLine: language === "fr" ? randomOptions.subjectLineFr : randomOptions.subjectLine,
        openingTemplateId: randomOptions.openingTemplateId,
        closingTemplateId: randomOptions.closingTemplateId,
        endingTemplateId: randomOptions.endingTemplateId,
      });
      let ministerLetterBody = fallbackLetterBody;
      try {
        const aiResponse = await fetch("/api/ai-letter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            language,
            name: `${String(formInfo.firstName ?? "")} ${String(formInfo.lastName ?? "")}`.trim(),
            riding: mpRiding ?? String(formInfo.province ?? ""),
            topics: selectedTopics,
          }),
        });
        if (aiResponse.ok) {
          const aiData = (await aiResponse.json()) as AiLetterResponse;
          if (aiData.letterHtml && aiData.letterHtml.trim().length > 0) {
            const generatedBody = htmlBodyToText(aiData.letterHtml);
            const endingVariant = LETTER_ENDINGS.find(
              (item) => item.id === randomOptions.endingTemplateId,
            );
            const endingText =
              language === "fr"
                ? endingVariant?.fr ?? "Cordialement"
                : endingVariant?.en ?? "Sincerely";
            const greeting = getMinisterGreeting(
              language,
              String(formInfo.province ?? ""),
            );
            const fullName = `${String(formInfo.firstName ?? "")} ${String(formInfo.lastName ?? "")}`.trim();
            const location = `${String(formInfo.city ?? "")}, ${String(formInfo.province ?? "")}, ${String(formInfo.postalCode ?? "")}`.trim();
            const ccLine = mpEmail
              ? language === "fr"
                ? `CC : ${mpEmail}`
                : `CC: ${mpEmail}`
              : "";

            ministerLetterBody = [
              greeting,
              "",
              generatedBody,
              "",
              `${endingText},`,
              fullName,
              location,
              ccLine,
            ].join("\n");
          }
        }
      } catch {
        // Keep fallback letter if AI generation fails.
      }

      const premierEmail =
        typeof formInfo.province === "string"
          ? PREMIER_EMAIL_BY_PROVINCE[formInfo.province]?.join(",")
          : undefined;
      const mpLetterBody = buildMpLetterFromMinisterLetter(ministerLetterBody, mpName);

      const userFullName = `${String(formInfo.firstName ?? "")} ${String(formInfo.lastName ?? "")}`.trim();
      const premierLetterBody =
        language === "fr"
          ? [
            "Cher Premier ministre,",
            "",
            "Vous etes peut-etre au courant qu'un debat a actuellement lieu au Canada dans le domaine de la reduction des mefaits lies au tabac. Il porte sur les sachets de nicotine, et plus particulierement sur ceux concus pour aider les Canadiens qui fument a cesser de fumer.",
            "",
            "En aout 2024, le gouvernement federal a adopte un arrete ministeriel qui a restreint la vente des sachets de nicotine, specifiquement concus comme aides au sevrage tabagique, aux seules pharmacies.",
            "",
            "Cet arrete ministeriel a retire ces sachets des depanneurs - precisement l'endroit ou les cigarettes sont vendues. Il oblige les Canadiens qui cherchent de l'aide pour arreter de fumer a se rendre en pharmacie, a faire la file avec d'autres clients venus obtenir des medicaments sur ordonnance et a repondre a des questions sur leurs habitudes tabagiques. Pourtant, ces memes Canadiens peuvent facilement traverser la rue et acheter un paquet de cigarettes au depanneur du coin, sans qu'on leur pose la moindre question.",
            "",
            "Ce n'est PAS une politique de bon sens. Elle reduit l'accessibilite et le choix pour les fumeurs adultes canadiens, au nom de la protection des enfants. Proteger les enfants contre la nicotine est un objectif louable, mais cet arrete ministeriel n'est pas la bonne facon d'y parvenir. Il a entraine la vente de sachets de nicotine illegaux partout au pays, contenant des niveaux de nicotine plus eleves et offrant davantage d'aromes.",
            "",
            "Il est temps pour le gouvernement federal d'abroger cet arrete ministeriel et de rendre ces sachets disponibles la ou les cigarettes sont vendues. J'espere que notre province s'harmonisera avec le gouvernement federal s'il adopte une approche de bon sens. Vous aurez tout mon appui.",
            "",
            "Cordialement,",
            userFullName,
            ].join("\n")
          : [
            "Dear Premier,",
            "",
            "You may be aware that there is a debate happening right now in Canada's tobacco harm reduction world. It's about nicotine pouches and specifically those designed to help Canadians who smoke quit.",
            "",
            "In August 2024, the federal government implemented a Ministerial Order that restricted the sale of licenced nicotine pouches developed specifically as quit-smoking aids to pharmacies.",
            "",
            "The Ministerial Order removed these pouches from convenience stores - the very place where cigarettes are sold. The Ministerial Order forced Canadians who are looking for help to quit smoking to make a trip to a pharmacy, line up with other prescription-seeking customers and answer questions about their smoking habits. Yet these Canadians could easily go to the corner store across the street and buy a pack of cigarettes 'no questions asked'.",
            "",
            "This is NOT common-sense policy making. It removes availability and choice from adult Canadian smokers all in the name of protecting children. Protecting children from nicotine is a noble goal but this Ministerial Order is not the way to do it. It has resulted in illegal nicotine pouches being sold across the country with higher levels of nicotine and more flavours.",
            "",
            "It is time for the federal government to rescind the Ministerial Order and make these pouches available where cigarettes are sold. I hope that our province aligns with the federal government if it decides on a commonsense approach. You would have my full support.",
            "",
            "Sincerely,",
            userFullName,
            ].join("\n");

      localStorage.setItem(
        "campaign-preview",
        JSON.stringify({
          letterBody: ministerLetterBody,
          ministerLetterBody,
          mpLetterBody,
          premierLetterBody,
          subjectLine:
            language === "fr" ? randomOptions.subjectLineFr : randomOptions.subjectLine,
          premierSubjectLine:
            language === "fr"
              ? randomOptions.premierSubjectLineFr
              : randomOptions.premierSubjectLine,
          openingTemplateId: randomOptions.openingTemplateId,
          closingTemplateId: randomOptions.closingTemplateId,
          endingTemplateId: randomOptions.endingTemplateId,
          ministerEmail,
          mpEmail,
          mpName,
          mpRiding,
          premierEmail,
          province: (formInfo.province as string) ?? "ON",
          firstName: (formInfo.firstName as string) ?? "",
          lastName: (formInfo.lastName as string) ?? "",
          language,
          selectedTopics,
          importantTopicIds: sectionOneSelected,
          importantTopicVariantIds: sectionOneVariants.map((item) => item.variantId),
          desiredTopicIds: sectionTwoSelected,
          desiredTopicVariantIds: sectionTwoVariants.map((item) => item.variantId),
        }),
      );

      router.push("/final");
    } catch {
      setError(language === "fr" ? "Une erreur est survenue." : "Something went wrong.");
      setIsGenerating(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]">
      {isGenerating ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded bg-white px-6 py-4 shadow-lg">
            <Text as="p" size="sm" className="font-semibold text-[#333]">
              {t.generating}
            </Text>
          </div>
        </div>
      ) : null}
      <section className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
        <ProgressSteps labels={t.progress} activeCount={2} />

        <Text as="h1" size="md" className="mt-8 font-black text-[#444]">
          {t.heading}
        </Text>

        <div className="mt-6">
          <Text as="h2" size="md" className="font-black text-[#444]">
            {t.sectionOne}
          </Text>
          <div className="mt-3 space-y-2">
            {sectionOneOptions.map((topic) => (
              (() => {
                const checked = sectionOneSelected.includes(topic.id);
                const disabled = sectionOneSelected.length >= 2 && !checked;
                return (
              <label
                key={topic.id}
                className={`flex items-center gap-3 px-4 py-2 transition ${
                  disabled ? "cursor-not-allowed bg-[#d6d6d6] opacity-60" : "cursor-pointer bg-[#dedede]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() =>
                    toggle(sectionOneSelected, setSectionOneSelected, topic.id)
                  }
                />
                <Text as="span" size="sm" className="text-[#333]">
                  {language === "fr" ? topic.fr : topic.en}
                </Text>
              </label>
                );
              })()
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Text as="h2" size="md" className="font-black text-[#444]">
            {t.sectionTwo}
          </Text>
          <div className="mt-3 space-y-2">
            {sectionTwoOptions.map((topic) => (
              (() => {
                const checked = sectionTwoSelected.includes(topic.id);
                const disabled = sectionTwoSelected.length >= 2 && !checked;
                return (
              <label
                key={topic.id}
                className={`flex items-center gap-3 px-4 py-2 transition ${
                  disabled ? "cursor-not-allowed bg-[#d6d6d6] opacity-60" : "cursor-pointer bg-[#dedede]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={checked}
                  disabled={disabled}
                  onChange={() =>
                    toggle(sectionTwoSelected, setSectionTwoSelected, topic.id)
                  }
                />
                <Text as="span" size="sm" className="text-[#333]">
                  {language === "fr" ? topic.fr : topic.en}
                </Text>
              </label>
                );
              })()
            ))}
          </div>
        </div>

        {error ? (
          <Text as="p" size="xs" className="mt-4 font-semibold text-red-600">
            {error}
          </Text>
        ) : null}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleBack}
            disabled={isGenerating}
            className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-5 py-2 uppercase text-white hover:bg-[#4aa2d2]"
          >
            <Text
              as="span"
              size="xs"
              className="font-black uppercase text-white"
            >
              {t.back}
            </Text>
          </button>
          <button
            type="button"
            onClick={handleNext}
            disabled={isGenerating}
            className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-5 py-2 uppercase text-white hover:bg-[#4aa2d2]"
          >
            <Text
              as="span"
              size="xs"
              className="font-black uppercase text-white"
            >
              {t.next}
            </Text>
          </button>
        </div>
        {isGenerating ? (
          <Text as="p" size="xs" className="mt-3 font-semibold text-[#333]">
            {t.generating}
          </Text>
        ) : null}
      </section>
    </main>
  );
}

const TopicsPageClientOnly = dynamic(
  async () => ({ default: TopicsPageClient }),
  {
    ssr: false,
    loading: () => <main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]" />,
  },
);

export default function TopicsPage() {
  return <TopicsPageClientOnly />;
}
