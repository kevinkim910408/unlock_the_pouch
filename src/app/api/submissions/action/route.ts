import { recordSubmissionEmailAction } from "@/lib/submissions";
import { NextResponse } from "next/server";

type Payload = {
  submissionId?: string;
  actionType?: "minister_copy" | "mp_copy" | "premier_copy";
  province?: string;
  mpEmail?: string;
  mpName?: string;
  premierEmail?: string;
};

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    if (!payload.submissionId || !payload.actionType) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const result = await recordSubmissionEmailAction({
      submissionId: payload.submissionId,
      actionType: payload.actionType,
      province: payload.province,
      mpEmail: payload.mpEmail,
      mpName: payload.mpName,
      premierEmail: payload.premierEmail,
    });

    if (!result.ok) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    return NextResponse.json({ ok: true, recorded: result.recorded });
  } catch {
    return NextResponse.json({ error: "Failed to record action." }, { status: 500 });
  }
}
