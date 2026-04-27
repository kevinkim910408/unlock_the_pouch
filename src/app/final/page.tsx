"use client";

import Text from "@/components/text";
import ProgressSteps from "@/components/progress-steps";
import { CampaignLanguage } from "@/types/campaign";
import Image from "next/image";
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
  const providers = [
    { name: "GMAIL", src: "/gmail.svg" },
    { name: "OUTLOOK", src: "/outlook.svg" },
    { name: "YAHOO", src: "/yahoo.svg", bigger: true },
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {providers.map((provider) => (
        <div
          key={provider.name}
          className="flex h-14 w-28 flex-col items-center justify-center gap-1 bg-transparent text-[#555]"
        >
          <Image
            src={provider.src}
            alt={provider.name}
            width={provider.bigger ? 34 : 28}
            height={provider.bigger ? 34 : 28}
            className={provider.bigger ? "h-[34px] w-[34px] object-contain" : "h-7 w-7 object-contain"}
          />
          <Text as="span" size="xs" className="font-bold">
            {provider.name}
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
  const [copySuccess, setCopySuccess] = useState(false);

  async function handleCopyLetter() {
    try {
      await navigator.clipboard.writeText(body);
      setCopySuccess(true);
    } catch {
      setCopySuccess(false);
    }
  }

  return (
    <section className="border border-[#d7d7d7] bg-[#ececec] p-4 md:p-5">
      <Text as="h3" size="md" className="font-black text-[#424242]">
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
          onClick={handleCopyLetter}
          className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-4 py-2 uppercase text-white"
        >
          <Text as="span" size="xs" className="font-black uppercase text-white">
            {copyLetter}
          </Text>
        </button>
        {copySuccess ? (
          <div className="flex items-center gap-2">
            <Image src="/checked.svg" alt="Copied" width={16} height={16} />
            <Text as="span" size="xs" className="text-[#444]">
              {copied}
            </Text>
          </div>
        ) : null}
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
  const [physicalSent, setPhysicalSent] = useState(false);
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
        <ProgressSteps labels={t.progress} activeCount={3} />

        <section className="mt-5 border border-[#d7d7d7] bg-[#ececec] p-4 md:p-5">
          <Text as="h2" size="md" className="font-black text-[#424242]">
            {t.physicalTitle}
          </Text>
          <div className="mt-3 flex items-start gap-2 border border-[#e3b3b3] bg-[#f8dcdc] px-3 py-2">
            <Image src="/warning.svg" alt="Warning" width={18} height={18} />
            <Text as="p" size="xs" className="text-[#5d5d5d]">
              {t.consent}
            </Text>
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => setPhysicalSent(true)}
              className="inline-flex min-w-[140px] items-center justify-center bg-[#59b0df] px-4 py-2 text-white"
            >
              <Text as="span" size="xs" className="font-black text-white">
                {t.sendPhysical}
              </Text>
            </button>
            {physicalSent ? (
              <div className="flex items-center gap-2">
                <Image src="/checked.svg" alt="Sent" width={16} height={16} />
                <Text as="p" size="xs" className="text-[#444]">
                  {t.physicalDone}
                </Text>
              </div>
            ) : null}
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
