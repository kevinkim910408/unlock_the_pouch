import { getSubmissionStats } from "@/lib/submissions";
import { NextResponse } from "next/server"; export async function GET() { try { const stats = await getSubmissionStats(); return NextResponse.json(stats); } catch (error) { console.error(error); return NextResponse.json( { total: 0, mpCount: 0, provinceStats: [], unavailable: true, }, { status: 200 }, ); }
}
