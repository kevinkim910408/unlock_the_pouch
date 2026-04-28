import { generateLetter, toSubmission } from "@/lib/campaign";
import { insertSubmission } from "@/lib/submissions";
import { CampaignFormInput } from "@/types/campaign";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function required(value?: string) {
  return Boolean(value && value.trim().length > 0);
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

    const letterBody =
      payload.ministerLetterBody && payload.ministerLetterBody.trim().length > 0
        ? payload.ministerLetterBody
        : generateLetter(payload);

    const submission = toSubmission(payload, letterBody);
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
