"use client";

import Text from "@/components/text";
import { CampaignLanguage } from "@/types/campaign";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type PreviewData = {
  letterBody?: string;
  province?: string;
  firstName?: string;
  lastName?: string;
  language?: CampaignLanguage;
};

type Copy = {
  progress: [string, string, string];
  physicalTitle: string;
  consent: string;
  sendPhysical: string;
  physicalDone: string;
  digitalTitle: string;
  premierTitle: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  copyLetter: string;
  copied: string;
  complete: string;
};

const COPY: Record<CampaignLanguage, Copy> = {
  en: {
    progress: [
      "STEP 1 - Your info",
      "STEP 2 - Choose Topics",
      "STEP 3 - Send the Letter",
    ],
    physicalTitle: "Physical Letter Submission",
    consent:
      "By submitting this form, you authorize us to mail your letter to the government.",
    sendPhysical: "Send physical letter",
    physicalDone: "Thank you! Your letter will be mailed to the government.",
    digitalTitle: "Send a digital copy of your letter to the government :",
    premierTitle: "Send a letter to your Premier",
    step1: "STEP 1",
    step2: "STEP 2",
    step3: "STEP 3",
    step4: "STEP 4",
    copyLetter: "Copy letter",
    copied: "Letter has been copied to your clipboard.",
    complete: "Complete",
  },
  fr: {
    progress: [
      "ETAPE 1 - Vos infos",
      "ETAPE 2 - Choisir les sujets",
      "ETAPE 3 - Envoyer la lettre",
    ],
    physicalTitle: "Soumission de lettre physique",
    consent:
      "En soumettant ce formulaire, vous nous autorisez a poster votre lettre au gouvernement.",
    sendPhysical: "Envoyer la lettre physique",
    physicalDone: "Merci! Votre lettre sera postee au gouvernement.",
    digitalTitle:
      "Envoyer une copie numerique de votre lettre au gouvernement :",
    premierTitle: "Envoyer une lettre a votre premier ministre provincial",
    step1: "ETAPE 1",
    step2: "ETAPE 2",
    step3: "ETAPE 3",
    step4: "ETAPE 4",
    copyLetter: "Copier la lettre",
    copied: "La lettre a ete copiee dans votre presse-papiers.",
    complete: "Terminer",
  },
};

const SAMPLE_LETTER = `March 27, 2024

John Doe
123 Test Street
Ottawa, Ontario A1B 2C3

Dear Minister,

I am writing to share my concerns and priorities.

Sincerely,
John Doe`;

function ProviderRow() {
  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {["GMAIL", "OUTLOOK", "YAHOO"].map((provider) => (
        <div
          key={provider}
          className="flex h-10 w-24 items-center justify-center border border-[#cfcfcf] bg-white text-[#555]"
        >
          <Text as="span" size="xs" className="font-bold">
            {provider}
          </Text>
        </div>
      ))}
    </div>
  );
}

type LetterPanelProps = {
  title: string;
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  copyLetter: string;
  copied: string;
  body: string;
};

function LetterPanel({
  title,
  step1,
  step2,
  step3,
  step4,
  copyLetter,
  copied,
  body,
}: LetterPanelProps) {
  return (
    <section className="border border-[#d7d7d7] bg-[#ececec] p-4 md:p-5">
      <Text as="h3" size="lg" className="font-black text-[#424242]">
        {title}
      </Text>

      <Text as="p" size="xs" className="mt-4 font-black text-[#4fa9db]">
        {step1}
      </Text>
      <div className="mt-2 border border-[#b9b9b9] bg-white p-3">
        <pre className="max-h-[260px] overflow-y-auto whitespace-pre-wrap t-5 leading-5 text-[#333]">
          {body}
        </pre>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-4 py-2 uppercase text-white"
        >
          <Text as="span" size="xs" className="font-black uppercase text-white">
            {copyLetter}
          </Text>
        </button>
        <Text as="span" size="xs" className="text-[#444]">
          {copied} Please paste in your email.
        </Text>
      </div>

      <Text as="p" size="xs" className="mt-5 font-black text-[#4fa9db]">
        {step2}
      </Text>
      <Text as="p" size="xs" className="mt-2 text-[#444]">
        Please select your email provider.
      </Text>
      <ProviderRow />

      <Text as="p" size="xs" className="mt-5 font-black text-[#4fa9db]">
        {step3}
      </Text>
      <Text as="p" size="xs" className="mt-2 text-[#444]">
        Paste the letter into the body of the email.
      </Text>

      <Text as="p" size="xs" className="mt-4 font-black text-[#4fa9db]">
        {step4}
      </Text>
      <Text as="p" size="xs" className="mt-2 text-[#444]">
        Press send to submit the letter.
      </Text>
    </section>
  );
}

export default function FinalPage() {
  const router = useRouter();
  const [preview] = useState<PreviewData | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = localStorage.getItem("campaign-preview");
    if (!raw) return null;
    try {
      return JSON.parse(raw) as PreviewData;
    } catch {
      return null;
    }
  });

  const language: CampaignLanguage = preview?.language === "fr" ? "fr" : "en";
  const t = COPY[language];
  const letterBody = useMemo(
    () => preview?.letterBody ?? SAMPLE_LETTER,
    [preview],
  );

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]">
      <section className="mx-auto w-full max-w-[1200px] px-5 py-8 md:px-8 md:py-10">
        <div className="grid grid-cols-1 gap-[2px] md:grid-cols-3">
          {t.progress.map((label) => (
            <div
              key={label}
              className="bg-[#59b0df] px-4 py-2 text-center text-white"
            >
              <Text as="span" size="xs" className="font-bold text-white">
                {label}
              </Text>
            </div>
          ))}
        </div>

        <section className="mt-5 border border-[#d7d7d7] bg-[#ececec] p-4 md:p-5">
          <Text as="h2" size="lg" className="font-black text-[#424242]">
            {t.physicalTitle}
          </Text>
          <div className="mt-3 border border-[#e3b3b3] bg-[#f8dcdc] px-3 py-2">
            <Text as="p" size="xs" className="text-[#5d5d5d]">
              {t.consent}
            </Text>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button
              type="button"
              className="inline-flex min-w-[140px] items-center justify-center bg-[#59b0df] px-4 py-2 text-white"
            >
              <Text as="span" size="xs" className="font-black text-white">
                {t.sendPhysical}
              </Text>
            </button>
            <Text as="p" size="xs" className="text-[#444]">
              {t.physicalDone}
            </Text>
          </div>
        </section>

        <div className="mt-6">
          <LetterPanel
            title={t.digitalTitle}
            step1={t.step1}
            step2={t.step2}
            step3={t.step3}
            step4={t.step4}
            copyLetter={t.copyLetter}
            copied={t.copied}
            body={letterBody}
          />
        </div>

        <div className="mt-6">
          <LetterPanel
            title={t.premierTitle}
            step1={t.step1}
            step2={t.step2}
            step3={t.step3}
            step4={t.step4}
            copyLetter={t.copyLetter}
            copied={t.copied}
            body={letterBody}
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={() => router.push("/thank-you")}
            className="inline-flex min-w-[120px] items-center justify-center bg-[#59b0df] px-5 py-2 text-white"
          >
            <Text as="span" size="xs" className="font-black text-white">
              {t.complete}
            </Text>
          </button>
        </div>
      </section>
    </main>
  );
}
