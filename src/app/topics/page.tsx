"use client";

import Text from "@/components/text";
import ProgressSteps from "@/components/progress-steps";
import { PREMIER_EMAIL_BY_PROVINCE } from "@/lib/campaign";
import { CampaignLanguage } from "@/types/campaign";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const MINISTER_EMAIL_FALLBACK = "marjorie.michel@parl.gc.ca";

type Copy = {
  progress: [string, string, string];
  heading: string;
  sectionOne: string;
  sectionTwo: string;
  back: string;
  next: string;
  error: string;
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
  },
};

const SECTION_ONE = [
  "Topic 1",
  "Topic 2",
  "Topic 3",
  "Topic 4",
  "Topic 5",
  "Topic 6",
];
const SECTION_TWO = [
  "Topic 1",
  "Topic 2",
  "Topic 3",
  "Topic 4",
  "Topic 5",
  "Topic 6",
];

type MpLookupResponse = {
  ministerEmail?: string;
  mp?: {
    name?: string;
    email?: string;
    districtName?: string;
  } | null;
};

export default function TopicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language: CampaignLanguage =
    searchParams.get("lang") === "fr" ? "fr" : "en";
  const t = COPY[language];

  const [sectionOneSelected, setSectionOneSelected] = useState<string[]>([]);
  const [sectionTwoSelected, setSectionTwoSelected] = useState<string[]>([]);
  const [error, setError] = useState("");

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
    if (sectionOneSelected.length !== 2 || sectionTwoSelected.length !== 2) {
      setError(t.error);
      return;
    }

    const rawInfo = localStorage.getItem("campaign-form-info");
    const formInfo = rawInfo
      ? (JSON.parse(rawInfo) as Record<string, string | boolean>)
      : {};

    const postalCode =
      typeof formInfo.postalCode === "string" ? formInfo.postalCode : "";
    let mpEmail: string | undefined;
    let mpName: string | undefined;
    let ministerEmail = MINISTER_EMAIL_FALLBACK;

    if (postalCode) {
      try {
        const response = await fetch(
          `/api/mp-lookup?postalCode=${encodeURIComponent(postalCode)}`,
          { cache: "no-store" },
        );
        if (response.ok) {
          const lookup = (await response.json()) as MpLookupResponse;
          ministerEmail = lookup.ministerEmail ?? MINISTER_EMAIL_FALLBACK;
          mpEmail = lookup.mp?.email;
          mpName = lookup.mp?.name;
        }
      } catch {
        // Keep fallback values if lookup fails.
      }
    }

    const ministerLetterBody = [
      "To the Honourable Marjorie Michel, Minister of Health,",
      "",
      "Dear Minister Holland,",
      "",
      "I am writing to share my priorities:",
      ...sectionOneSelected.map((topic, idx) => `${idx + 1}. ${topic}`),
      ...sectionTwoSelected.map((topic, idx) => `${idx + 3}. ${topic}`),
      "",
      "Thank you for your attention.",
      "",
      `${formInfo.firstName ?? ""} ${formInfo.lastName ?? ""}`.trim(),
      `${formInfo.city ?? ""}, ${formInfo.province ?? ""} ${formInfo.postalCode ?? ""}`.trim(),
      mpName ? `CC: ${mpName}` : "CC: Local MP",
    ].join("\n");

    const premierEmail =
      typeof formInfo.province === "string"
        ? PREMIER_EMAIL_BY_PROVINCE[formInfo.province]
        : undefined;

    const premierLetterBody = [
      "To the Premier,",
      "",
      "Dear Premier,",
      "",
      "I am writing to share my priorities for provincial action:",
      ...sectionOneSelected.map((topic, idx) => `${idx + 1}. ${topic}`),
      ...sectionTwoSelected.map((topic, idx) => `${idx + 3}. ${topic}`),
      "",
      "Thank you for your attention.",
      "",
      `${formInfo.firstName ?? ""} ${formInfo.lastName ?? ""}`.trim(),
      `${formInfo.city ?? ""}, ${formInfo.province ?? ""} ${formInfo.postalCode ?? ""}`.trim(),
    ].join("\n");

    localStorage.setItem(
      "campaign-preview",
      JSON.stringify({
        letterBody: ministerLetterBody,
        ministerLetterBody,
        premierLetterBody,
        ministerEmail,
        mpEmail,
        mpName,
        premierEmail,
        province: (formInfo.province as string) ?? "ON",
        firstName: (formInfo.firstName as string) ?? "",
        lastName: (formInfo.lastName as string) ?? "",
        language,
        selectedTopics: [...sectionOneSelected, ...sectionTwoSelected],
      }),
    );

    router.push("/final");
  }

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]">
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
            {SECTION_ONE.map((topic) => (
              <label
                key={topic}
                className="flex items-center gap-3 bg-[#dedede] px-4 py-2"
              >
                <input
                  type="checkbox"
                  checked={sectionOneSelected.includes(topic)}
                  onChange={() =>
                    toggle(sectionOneSelected, setSectionOneSelected, topic)
                  }
                />
                <Text as="span" size="sm" className="text-[#333]">
                  {topic}
                </Text>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <Text as="h2" size="md" className="font-black text-[#444]">
            {t.sectionTwo}
          </Text>
          <div className="mt-3 space-y-2">
            {SECTION_TWO.map((topic) => (
              <label
                key={topic}
                className="flex items-center gap-3 bg-[#dedede] px-4 py-2"
              >
                <input
                  type="checkbox"
                  checked={sectionTwoSelected.includes(topic)}
                  onChange={() =>
                    toggle(sectionTwoSelected, setSectionTwoSelected, topic)
                  }
                />
                <Text as="span" size="sm" className="text-[#333]">
                  {topic}
                </Text>
              </label>
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
      </section>
    </main>
  );
}
