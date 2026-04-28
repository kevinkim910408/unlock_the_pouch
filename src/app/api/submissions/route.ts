import {
  generateLetter,
  getMinisterGreeting,
  LETTER_ENDINGS,
  toSubmission,
} from "@/lib/campaign";
import { insertSubmission } from "@/lib/submissions";
import { CampaignFormInput } from "@/types/campaign";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function required(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

function htmlToText(value: string) {
  return value
    .replace(/<\/p>\s*(?:<br\s*\/?>\s*)*<p>/gi, "\n\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<p>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeMinisterLetter(payload: CampaignFormInput, body: string) {
  const cleanBody = htmlToText(body);
  const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
  const location = `${payload.city.trim()}, ${payload.province.trim()}, ${payload.postalCode.trim()}`;
  const ending =
    payload.language === "fr"
      ? LETTER_ENDINGS.find((item) => item.id === payload.endingTemplateId)?.fr ?? "Cordialement"
      : LETTER_ENDINGS.find((item) => item.id === payload.endingTemplateId)?.en ?? "Sincerely";
  const greeting = getMinisterGreeting(payload.language, payload.province);
  const ccLine = payload.mpEmail?.trim() ? `CC: ${payload.mpEmail.trim()}` : "";

  const hasGreeting =
    cleanBody.startsWith("Dear Minister") || cleanBody.startsWith("Chere Ministre");
  const hasSignature = cleanBody.includes(fullName);

  if (hasGreeting && hasSignature) {
    return cleanBody;
  }

  return [
    greeting,
    "",
    cleanBody,
    "",
    `${ending},`,
    fullName,
    location,
    ccLine,
  ].join("\n");
}

function normalizeMpLetter(payload: CampaignFormInput, body: string) {
  const cleanBody = htmlToText(body);
  const fullName = `${payload.firstName.trim()} ${payload.lastName.trim()}`.trim();
  const location = `${payload.city.trim()}, ${payload.province.trim()}, ${payload.postalCode.trim()}`;
  const ending =
    LETTER_ENDINGS.find((item) => item.id === payload.endingTemplateId)?.en ?? "Sincerely";
  const mpLabel = payload.mpName?.trim() || "Member of Parliament";
  const greeting = payload.language === "fr" ? `Cher ${mpLabel},` : `Dear ${mpLabel},`;

  const hasGreeting = cleanBody.startsWith("Dear ") || cleanBody.startsWith("Cher ");
  const hasSignature = cleanBody.includes(fullName);

  if (hasGreeting && hasSignature) {
    return cleanBody.replace(/\nCC\s*:.*$/gim, "").trim();
  }

  return [greeting, "", cleanBody, "", `${ending},`, fullName, location].join("\n");
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as CampaignFormInput;

    if (
      !required(payload.firstName) ||
      !required(payload.lastName) ||
      !required(payload.postalCode) ||
      !required(payload.province) ||
      !required(payload.city) ||
      !required(payload.email)
    ) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const rawLetterBody =
      payload.ministerLetterBody && payload.ministerLetterBody.trim().length > 0
        ? payload.ministerLetterBody
        : generateLetter(payload);
    const letterBody = normalizeMinisterLetter(payload, rawLetterBody);
    const rawMpLetterBody =
      payload.mpLetterBody && payload.mpLetterBody.trim().length > 0
        ? payload.mpLetterBody
        : rawLetterBody;
    const mpLetterBody = normalizeMpLetter(payload, rawMpLetterBody);

    const submission = toSubmission({ ...payload, mpLetterBody }, letterBody);
    const id = await insertSubmission(submission);

    return NextResponse.json({
      id,
      letterBody: submission.letterBody,
      ministerEmail: submission.ministerEmail,
      mpEmail: submission.mpEmail,
      province: submission.province,
    });
  } catch (error: unknown) {
    console.error(error);
    const e = error as { message?: string; code?: string | number; name?: string };
    return NextResponse.json(
      {
        error: "Failed to save submission.",
        debug: {
          name: e?.name ?? null,
          code: e?.code ?? null,
          message: e?.message ?? null,
        },
      },
      { status: 500 },
    );
  }
}
