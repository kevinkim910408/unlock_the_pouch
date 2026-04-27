import { generateLetter, toSubmission, validateTopicSelection,
} from "@/lib/campaign";
import { insertSubmission } from "@/lib/submissions";
import { CampaignFormInput } from "@/types/campaign";
import { NextResponse } from "next/server"; function required(value?: string) { return value && value.trim().length > 0;
} export async function POST(request: Request) { try { const payload = (await request.json()) as CampaignFormInput; if ( !required(payload.firstName) || !required(payload.lastName) || !required(payload.postalCode) || !required(payload.province) || !required(payload.city) || !required(payload.email) ) { return NextResponse.json( { error: "Missing required fields." }, { status: 400 }, ); } if (!validateTopicSelection(payload.topics)) { return NextResponse.json( { error: "Topic selection is invalid. Pick 2 from each section." }, { status: 400 }, ); } const letterBody = generateLetter(payload); const submission = toSubmission(payload, letterBody); const id = await insertSubmission(submission); return NextResponse.json({ id, letterBody, ministerEmail: submission.ministerEmail, mpEmail: submission.mpEmail, province: submission.province, }); } catch (error) { console.error(error); return NextResponse.json( { error: "Failed to save submission." }, { status: 500 }, ); }
}
