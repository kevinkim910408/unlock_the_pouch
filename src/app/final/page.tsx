"use client";

import Text from "@/components/text";
import ProgressSteps from "@/components/progress-steps";
import { CampaignLanguage } from "@/types/campaign";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

type PreviewData = {
  letterBody?: string;
  ministerLetterBody?: string;
  mpLetterBody?: string;
  premierLetterBody?: string;
  subjectLine?: string;
  premierSubjectLine?: string;
  openingTemplateId?: string;
  closingTemplateId?: string;
  endingTemplateId?: string;
  selectedTopics?: string[];
  importantTopicIds?: string[];
  importantTopicVariantIds?: string[];
  desiredTopicIds?: string[];
  desiredTopicVariantIds?: string[];
  province?: string;
  firstName?: string;
  lastName?: string;
  language?: CampaignLanguage;
  ministerEmail?: string;
  mpEmail?: string;
  mpName?: string;
  mpRiding?: string;
  premierEmail?: string;
};

type FormInfo = {
  language?: CampaignLanguage;
  firstName?: string;
  lastName?: string;
  email?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  newsletterOptIn?: boolean;
};

type SubmissionResponse = {
  id?: string;
  error?: string;
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
  sendTo: string;
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
    sendPhysical: "Check here to Send Physical Letter",
    physicalDone: "Thank you! Your letter will be mailed to the government.",
    digitalTitle: "Send a digital copy of your letter to the Federal Government :",
    premierTitle: "Send a letter to your Premier",
    step1: "STEP 1",
    step2: "STEP 2",
    step3: "STEP 3",
    step4: "STEP 4",
    copyLetter: "Copy letter",
    copied: "Letter has been copied to your clipboard.",
    complete: "Complete",
    sendTo: "Send email to:",
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
      "Envoyer une copie numerique de votre lettre au gouvernement federal :",
    premierTitle: "Envoyer une lettre a votre premier ministre provincial",
    step1: "ETAPE 1",
    step2: "ETAPE 2",
    step3: "ETAPE 3",
    step4: "ETAPE 4",
    copyLetter: "Copier la lettre",
    copied: "La lettre a ete copiee dans votre presse-papiers.",
    complete: "Terminer",
    sendTo: "Envoyer le courriel a :",
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

function ProviderRow({ mailtoHref }: { mailtoHref: string }) {
  const providers = [
    { name: "GMAIL", src: "/gmail.svg" },
    { name: "OUTLOOK", src: "/outlook.svg" },
    { name: "YAHOO", src: "/yahoo.svg", bigger: true },
  ];

  return (
    <div className="mt-3 flex flex-wrap gap-4">
      {providers.map((provider) => (
        <a
          key={provider.name}
          href={mailtoHref}
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
        </a>
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
  subjectLine?: string;
  recipientEmails: string[];
  ccEmails?: string[];
  recipients: string[];
  ccRecipients?: string[];
  sendToLabel: string;
  onCopy?: () => Promise<boolean>;
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
  subjectLine,
  recipientEmails,
  ccEmails,
  recipients,
  ccRecipients,
  sendToLabel,
  onCopy,
}: LetterPanelProps) {
  const [copySuccess, setCopySuccess] = useState(false);
  const [copyLocked, setCopyLocked] = useState(false);
  const params = new URLSearchParams();
  params.set("subject", subjectLine ?? "");
  params.set("body", body);
  if (ccEmails && ccEmails.length > 0) {
    params.set("cc", ccEmails.join(","));
  }
  const mailtoHref = `mailto:${recipientEmails.join(",")}?${params.toString()}`;

  function escapeHtml(input: string) {
    return input
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function buildClipboardHtml(input: string) {
    const normalized = input.replace(/\r\n/g, "\n");
    const lines = normalized.split("\n").map((line) => (line.length > 0 ? escapeHtml(line) : "<br>"));
    return `<div>${lines.join("</div><div>")}</div>`;
  }

  function decodeUrlEncodedBodyIfNeeded(input: string) {
    const trimmed = input.trim();
    const maybeBodyValue = trimmed.startsWith("body=") ? trimmed.slice(5) : trimmed;
    const looksEncoded =
      maybeBodyValue.includes("+") || /%[0-9a-fA-F]{2}/.test(maybeBodyValue);
    if (!looksEncoded) return input;
    try {
      const decoded = decodeURIComponent(maybeBodyValue.replaceAll("+", " "));
      return decoded.trim().length > 0 ? decoded : input;
    } catch {
      return input;
    }
  }

  async function handleCopyLetter() {
    try {
      const normalizedBody = decodeUrlEncodedBodyIfNeeded(body).replace(/\r\n/g, "\n");
      const clipboardItemSupported =
        typeof window !== "undefined" &&
        typeof ClipboardItem !== "undefined" &&
        typeof navigator.clipboard.write === "function";

      if (clipboardItemSupported) {
        const html = buildClipboardHtml(normalizedBody);
        const item = new ClipboardItem({
          "text/plain": new Blob([normalizedBody], { type: "text/plain" }),
          "text/html": new Blob([html], { type: "text/html" }),
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(normalizedBody);
      }
      if (onCopy) {
        const recorded = await onCopy();
        if (!recorded) {
          setCopyLocked(true);
        }
      }
      setCopySuccess(true);
      if (onCopy) setCopyLocked(true);
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
      {subjectLine ? (
        <Text as="p" size="xs" className="mt-2 text-[#333]">
          Subject: {subjectLine}
        </Text>
      ) : null}
      <div className="mt-2 border border-[#b9b9b9] bg-white p-3">
        <pre className="max-h-[260px] overflow-y-auto whitespace-pre-wrap t-5 leading-5 text-[#333]">
          {body}
        </pre>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleCopyLetter}
          disabled={copyLocked}
          className="inline-flex min-w-[95px] items-center justify-center bg-[#59b0df] px-4 py-2 uppercase text-white disabled:opacity-60"
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
      <ProviderRow mailtoHref={mailtoHref} />
      {recipients.length > 0 ? (
        <div className="mt-3">
          <Text as="p" size="xs" className="font-black text-[#444]">
            {sendToLabel}
          </Text>
          {recipients.map((recipient) => (
            <Text key={recipient} as="p" size="xs" className="mt-1 text-[#444]">
              {recipient}
            </Text>
          ))}
          {ccRecipients && ccRecipients.length > 0 ? (
            <>
              <Text as="p" size="xs" className="mt-2 font-black text-[#444]">
                CC:
              </Text>
              {ccRecipients.map((recipient) => (
                <Text key={`cc-${recipient}`} as="p" size="xs" className="mt-1 text-[#444]">
                  {recipient}
                </Text>
              ))}
            </>
          ) : null}
        </div>
      ) : null}

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
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
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
  const ministerLetterBody = useMemo(
    () => preview?.ministerLetterBody ?? preview?.letterBody ?? SAMPLE_LETTER,
    [preview],
  );
  const premierLetterBody = useMemo(
    () => preview?.premierLetterBody ?? preview?.letterBody ?? SAMPLE_LETTER,
    [preview],
  );
  const ministerToEmails = useMemo(() => {
    return ["marjorie.michel@parl.gc.ca"];
  }, []);
  const ministerCcEmails = useMemo(() => {
    return preview?.mpEmail ? [preview.mpEmail] : [];
  }, [preview]);
  const ministerRecipientLines = useMemo(() => ministerToEmails, [ministerToEmails]);
  const ministerCcLines = useMemo(() => ministerCcEmails, [ministerCcEmails]);

  const allPremierEmails = useMemo(() => {
    if (!preview?.premierEmail) return [];
    return preview.premierEmail
      .split(",")
      .map((email) => email.trim())
      .filter(Boolean);
  }, [preview]);
  const premierToEmails = useMemo(
    () => allPremierEmails.filter((email) => email.toLowerCase().includes("premier@")),
    [allPremierEmails],
  );
  const premierCcEmails = useMemo(
    () => allPremierEmails.filter((email) => !email.toLowerCase().includes("premier@")),
    [allPremierEmails],
  );
  const premierRecipientLines = useMemo(() => premierToEmails, [premierToEmails]);
  const premierCcLines = useMemo(() => premierCcEmails, [premierCcEmails]);

  const saveSubmission = useCallback(async () => {
    if (!preview) return true;
    if (typeof window === "undefined") return false;

    const existingSubmissionId = localStorage.getItem("campaign-submission-id");
    if (existingSubmissionId) return true;

    const rawFormInfo = localStorage.getItem("campaign-form-info");
    if (!rawFormInfo) {
      setSaveError("Missing form info. Please start again from Home.");
      return false;
    }

    let formInfo: FormInfo;
    try {
      formInfo = JSON.parse(rawFormInfo) as FormInfo;
    } catch {
      setSaveError("Invalid form info. Please start again from Home.");
      return false;
    }

    if (
      !formInfo.firstName ||
      !formInfo.lastName ||
      !formInfo.email ||
      !formInfo.province ||
      !formInfo.city ||
      !formInfo.postalCode
    ) {
      setSaveError("Missing required form data.");
      return false;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const response = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language: formInfo.language ?? language,
          firstName: formInfo.firstName,
          lastName: formInfo.lastName,
          email: formInfo.email,
          province: formInfo.province,
          city: formInfo.city,
          postalCode: formInfo.postalCode,
          newsletterOptIn: Boolean(formInfo.newsletterOptIn),
          topics: preview.selectedTopics ?? [],
          importantTopicIds: preview.importantTopicIds ?? [],
          importantTopicVariantIds: preview.importantTopicVariantIds ?? [],
          desiredTopicIds: preview.desiredTopicIds ?? [],
          desiredTopicVariantIds: preview.desiredTopicVariantIds ?? [],
          mpEmail: preview.mpEmail,
          mpName: preview.mpName,
          mpRiding: preview.mpRiding,
          ministerEmail: preview.ministerEmail,
          subjectLine: preview.subjectLine,
          premierSubjectLine: preview.premierSubjectLine,
          openingTemplateId: preview.openingTemplateId,
          closingTemplateId: preview.closingTemplateId,
          endingTemplateId: preview.endingTemplateId,
          ministerLetterBody:
            preview.ministerLetterBody ?? preview.letterBody ?? SAMPLE_LETTER,
          mpLetterBody:
            preview.mpLetterBody ?? preview.ministerLetterBody ?? preview.letterBody ?? SAMPLE_LETTER,
          premierLetterBody:
            preview.premierLetterBody ?? preview.letterBody ?? SAMPLE_LETTER,
        }),
      });

      const data = (await response.json()) as SubmissionResponse;
      if (!response.ok || !data.id) {
        setSaveError(data.error ?? "Failed to save submission.");
        return false;
      }

      localStorage.setItem("campaign-submission-id", data.id);
      return true;
    } catch {
      setSaveError("Failed to save submission.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }, [language, preview]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void saveSubmission();
    }, 0);

    return () => window.clearTimeout(timer);
  }, [saveSubmission]);

  async function handleComplete() {
    if (isSaving) return;
    const ok = await saveSubmission();
    if (ok) {
      router.push("/thank-you");
    }
  }

  async function trackCopy(actionType: "minister_copy" | "mp_copy" | "premier_copy") {
    const ok = await saveSubmission();
    if (!ok || typeof window === "undefined") return false;
    const submissionId = localStorage.getItem("campaign-submission-id");
    if (!submissionId) return false;
    const res = await fetch("/api/submissions/action", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        submissionId,
        actionType,
        province: preview?.province,
        mpEmail: preview?.mpEmail,
        mpName: preview?.mpName,
        premierEmail: preview?.premierEmail,
      }),
    }).catch(() => null);
    if (!res) return false;
    try {
      const data = (await res.json()) as { ok?: boolean; recorded?: boolean };
      return Boolean(data.ok && data.recorded);
    } catch {
      return false;
    }
  }

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
            body={ministerLetterBody}
            subjectLine={preview?.subjectLine}
            recipientEmails={ministerToEmails}
            ccEmails={ministerCcEmails}
            recipients={ministerRecipientLines}
            ccRecipients={ministerCcLines}
            sendToLabel={t.sendTo}
            onCopy={() => trackCopy("minister_copy")}
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
            body={premierLetterBody}
            subjectLine={preview?.premierSubjectLine}
            recipientEmails={premierToEmails}
            ccEmails={premierCcEmails}
            recipients={premierRecipientLines}
            ccRecipients={premierCcLines}
            sendToLabel={t.sendTo}
            onCopy={() => trackCopy("premier_copy")}
          />
        </div>

        <div className="mt-6">
          <button
            type="button"
            onClick={handleComplete}
            className="inline-flex min-w-[120px] items-center justify-center bg-[#59b0df] px-5 py-2 text-white"
          >
            <Text as="span" size="xs" className="font-black text-white">
              {t.complete}
            </Text>
          </button>
          {isSaving ? (
            <Text as="p" size="xs" className="mt-2 text-[#555]">
              Saving submission...
            </Text>
          ) : null}
          {saveError ? (
            <Text as="p" size="xs" className="mt-2 text-red-600">
              {saveError}
            </Text>
          ) : null}
        </div>
      </section>
    </main>
  );
}
