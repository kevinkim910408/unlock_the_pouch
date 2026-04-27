"use client";

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
    progress: ["STEP 1 - Your info", "STEP 2 - Choose Topics", "STEP 3 - Send the letter"],
    heading: "Please choose the topics below",
    sectionOne: "Why is this important to you? (Pick 2)",
    sectionTwo: "What do you want? (Pick 2)",
    back: "Back",
    next: "Next",
    error: "Please select 2 topics from each section.",
  },
  fr: {
    progress: ["ETAPE 1 - Vos infos", "ETAPE 2 - Choisir les sujets", "ETAPE 3 - Envoyer la lettre"],
    heading: "Veuillez choisir les sujets ci-dessous",
    sectionOne: "Pourquoi est-ce important pour vous? (Choisissez 2)",
    sectionTwo: "Que voulez-vous? (Choisissez 2)",
    back: "Retour",
    next: "Suivant",
    error: "Veuillez choisir 2 sujets dans chaque section.",
  },
};

const SECTION_ONE = ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"];
const SECTION_TWO = ["Topic 1", "Topic 2", "Topic 3", "Topic 4", "Topic 5", "Topic 6"];

export default function TopicsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language: CampaignLanguage = searchParams.get("lang") === "fr" ? "fr" : "en";
  const t = COPY[language];

  const [sectionOneSelected, setSectionOneSelected] = useState<string[]>([]);
  const [sectionTwoSelected, setSectionTwoSelected] = useState<string[]>([]);
  const [error, setError] = useState("");

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
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

  function handleNext() {
    if (sectionOneSelected.length !== 2 || sectionTwoSelected.length !== 2) {
      setError(t.error);
      return;
    }

    const rawInfo = localStorage.getItem("campaign-form-info");
    const formInfo = rawInfo ? (JSON.parse(rawInfo) as Record<string, string | boolean>) : {};

    const letterBody = [
      "To the Honourable Marjorie Michel, Minister of Health,",
      "",
      "Dear Minister,",
      "",
      "I am writing to share my priorities:",
      ...sectionOneSelected.map((topic, idx) => `${idx + 1}. ${topic}`),
      ...sectionTwoSelected.map(
        (topic, idx) => `${idx + 3}. ${topic}`,
      ),
      "",
      "Thank you for your attention.",
      "",
      `${formInfo.firstName ?? ""} ${formInfo.lastName ?? ""}`.trim(),
      `${formInfo.city ?? ""}, ${formInfo.province ?? ""} ${formInfo.postalCode ?? ""}`.trim(),
    ].join("\n");

    localStorage.setItem(
      "campaign-preview",
      JSON.stringify({
        letterBody,
        ministerEmail: MINISTER_EMAIL_FALLBACK,
        mpEmail: undefined,
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
        <div className="grid grid-cols-1 gap-[2px] md:grid-cols-3">
          {t.progress.map((label, idx) => {
            const active = idx < 2;
            return (
              <div
                key={label}
                className={`px-4 py-2 text-center text-sm font-bold ${
                  active ? "bg-[#59b0df] text-white" : "bg-[#dcdcdc] text-[#222]"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        <h1 className="mt-8 text-5xl font-black text-[#444] md:text-6xl">{t.heading}</h1>

        <div className="mt-6">
          <h2 className="text-4xl font-black text-[#444] md:text-5xl">{t.sectionOne}</h2>
          <div className="mt-3 space-y-2">
            {SECTION_ONE.map((topic) => (
              <label
                key={topic}
                className="flex items-center gap-3 bg-[#dedede] px-4 py-2 text-lg text-[#333]"
              >
                <input
                  type="checkbox"
                  checked={sectionOneSelected.includes(topic)}
                  onChange={() => toggle(sectionOneSelected, setSectionOneSelected, topic)}
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mt-10">
          <h2 className="text-4xl font-black text-[#444] md:text-5xl">{t.sectionTwo}</h2>
          <div className="mt-3 space-y-2">
            {SECTION_TWO.map((topic) => (
              <label
                key={topic}
                className="flex items-center gap-3 bg-[#dedede] px-4 py-2 text-lg text-[#333]"
              >
                <input
                  type="checkbox"
                  checked={sectionTwoSelected.includes(topic)}
                  onChange={() => toggle(sectionTwoSelected, setSectionTwoSelected, topic)}
                />
                <span>{topic}</span>
              </label>
            ))}
          </div>
        </div>

        {error ? <p className="mt-4 text-sm font-semibold text-red-600">{error}</p> : null}

        <div className="mt-8 flex gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-5 py-2 text-sm font-black uppercase text-white hover:bg-[#4aa2d2]"
          >
            {t.back}
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-5 py-2 text-sm font-black uppercase text-white hover:bg-[#4aa2d2]"
          >
            {t.next}
          </button>
        </div>
      </section>
    </main>
  );
}
