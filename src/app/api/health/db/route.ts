import { getDb } from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB ?? "unlock-the-pouch";

  const base = {
    ok: false,
    hasMongoUri: Boolean(mongoUri),
    dbName,
  };

  if (!mongoUri) {
    return NextResponse.json(
      {
        ...base,
        errorType: "ENV_MISSING",
        errorMessage: "MONGODB_URI is missing",
      },
      { status: 500 },
    );
  }

  try {
    const db = await getDb();
    await db.command({ ping: 1 });

    return NextResponse.json(
      {
        ...base,
        ok: true,
        pingOk: true,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const e = error as { message?: string; code?: string | number; name?: string };
    return NextResponse.json(
      {
        ...base,
        errorType: "DB_CONNECT_FAILED",
        errorName: e?.name ?? "UnknownError",
        errorCode: e?.code ?? null,
        errorMessage: e?.message ?? "Unknown database error",
      },
      { status: 500 },
    );
  }
}

