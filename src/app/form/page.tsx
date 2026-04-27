"use client";

import Text from "@/components/text";
import ProgressSteps from "@/components/progress-steps";
import { PROVINCES } from "@/lib/campaign";
import { CampaignLanguage } from "@/types/campaign";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

type Copy = {
  heading: string;
  progress: [string, string, string];
  labels: {
    firstName: string;
    lastName: string;
    email: string;
    province: string;
    city: string;
    postalCode: string;
    newsletter: string;
  };
  back: string;
  next: string;
  error: string;
  invalidEmail: string;
  invalidPostalCode: string;
};

const COPY: Record<CampaignLanguage, Copy> = {
  en: {
    heading: "Generating Submission",
    progress: [
      "Step 1 - Your info",
      "Step 2 - Choose Topics",
      "Step 3 - Send the letter",
    ],
    labels: {
      firstName: "First Name",
      lastName: "Last Name",
      email: "E-Mail",
      province: "Province",
      city: "City",
      postalCode: "Postal Code",
      newsletter: "Sign me up for the Rights4Vapers newsletters",
    },
    back: "Back",
    next: "Next",
    error: "Please complete all required fields.",
    invalidEmail: "Please enter a valid email address.",
    invalidPostalCode: "Please enter a valid Canadian postal code (A1A 1A1).",
  },
  fr: {
    heading: "Generation de la soumission",
    progress: [
      "Etape 1 - Vos infos",
      "Etape 2 - Choisir les sujets",
      "Etape 3 - Envoyer la lettre",
    ],
    labels: {
      firstName: "Prenom",
      lastName: "Nom",
      email: "Courriel",
      province: "Province",
      city: "Ville",
      postalCode: "Code postal",
      newsletter: "Inscrivez-moi a l'infolettre Rights4Vapers",
    },
    back: "Retour",
    next: "Suivant",
    error: "Veuillez remplir tous les champs obligatoires.",
    invalidEmail: "Veuillez entrer une adresse courriel valide.",
    invalidPostalCode:
      "Veuillez entrer un code postal canadien valide (A1A 1A1).",
  },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const POSTAL_CODE_REGEX = /^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/;

function FormPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const language: CampaignLanguage =
    searchParams.get("lang") === "fr" ? "fr" : "en";
  const t = COPY[language];

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [province, setProvince] = useState("ON");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [newsletterOptIn, setNewsletterOptIn] = useState(false);
  const [error, setError] = useState("");

  function handleBack() {
    router.push(`/terms?lang=${language}`);
  }

  function handleNext() {
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !province.trim() ||
      !city.trim() ||
      !postalCode.trim()
    ) {
      setError(t.error);
      return;
    }

    if (!EMAIL_REGEX.test(email.trim())) {
      setError(t.invalidEmail);
      return;
    }

    if (!POSTAL_CODE_REGEX.test(postalCode.trim().toUpperCase())) {
      setError(t.invalidPostalCode);
      return;
    }

    localStorage.setItem(
      "campaign-form-info",
      JSON.stringify({
        language,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        province,
        city: city.trim(),
        postalCode: postalCode.trim().toUpperCase(),
        newsletterOptIn,
      }),
    );

    router.push(`/topics?lang=${language}`);
  }

  return (
    <main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]">
      <section className="mx-auto w-full max-w-[1200px] px-5 py-10 md:px-8 md:py-12">
        <ProgressSteps labels={t.progress} activeCount={1} />

        <Text as="h1" size="md" className="mt-6 font-black text-[#444]">
          {t.heading}
        </Text>

        <div className="mt-6 grid gap-4 md:grid-cols-12">
          <div className="md:col-span-3">
            <label className="mb-1 block font-semibold text-[#2d2d2d]">
              <Text
                as="span"
                size="xs"
                className="font-semibold text-[#2d2d2d]"
              >
                {t.labels.firstName}
              </Text>{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              maxLength={30}
              className="w-full border border-[#9d9d9d] bg-white px-2 py-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block font-semibold text-[#2d2d2d]">
              <Text
                as="span"
                size="xs"
                className="font-semibold text-[#2d2d2d]"
              >
                {t.labels.lastName}
              </Text>{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              maxLength={30}
              className="w-full border border-[#9d9d9d] bg-white px-2 py-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

          <div className="md:col-span-5">
            <label className="mb-1 block font-semibold text-[#2d2d2d]">
              <Text
                as="span"
                size="xs"
                className="font-semibold text-[#2d2d2d]"
              >
                {t.labels.email}
              </Text>{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              maxLength={120}
              className="w-full border border-[#9d9d9d] bg-white px-2 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="md:col-span-4">
            <label className="mb-1 block font-semibold text-[#2d2d2d]">
              <Text
                as="span"
                size="xs"
                className="font-semibold text-[#2d2d2d]"
              >
                {t.labels.province}
              </Text>{" "}
              <span className="text-red-600">*</span>
            </label>
            <select
              className="w-full border border-[#9d9d9d] bg-white px-2 py-2"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            >
              {PROVINCES.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="mb-1 block font-semibold text-[#2d2d2d]">
              <Text
                as="span"
                size="xs"
                className="font-semibold text-[#2d2d2d]"
              >
                {t.labels.city}
              </Text>{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              className="w-full border border-[#9d9d9d] bg-white px-2 py-2"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block font-semibold text-[#2d2d2d]">
              <Text
                as="span"
                size="xs"
                className="font-semibold text-[#2d2d2d]"
              >
                {t.labels.postalCode}
              </Text>{" "}
              <span className="text-red-600">*</span>
            </label>
            <input
              maxLength={7}
              className="w-full border border-[#9d9d9d] bg-white px-2 py-2"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
            />
          </div>
        </div>

        <label className="mt-8 flex items-center gap-2 font-semibold text-[#2d2d2d]">
          <input
            type="checkbox"
            checked={newsletterOptIn}
            onChange={(e) => setNewsletterOptIn(e.target.checked)}
          />
          <Text as="span" size="sm" className="font-semibold text-[#2d2d2d]">
            {t.labels.newsletter}
          </Text>
        </label>

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

export default function FormPage() {
  return (
    <Suspense fallback={<main className="min-h-[calc(100vh-112px)] bg-[#e9e9e9]" />}>
      <FormPageClient />
    </Suspense>
  );
}
