import { MINISTER_EMAIL } from "@/lib/campaign";
import { NextResponse } from "next/server";

type Representative = {
  name?: string;
  email?: string;
  elected_office?: string;
  district_name?: string;
};

type PostcodeResponse = {
  representatives_concordance?: Representative[];
  representatives_centroid?: Representative[];
};

type MpResult = {
  name: string;
  email?: string;
  districtName?: string;
  source: "concordance" | "centroid";
};

type CacheValue = {
  expiresAt: number;
  result: MpResult | null;
};

const REPRESENT_BASE_URL = "https://represent.opennorth.ca";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12;
const mpLookupCache = new Map<string, CacheValue>();

function normalizePostalCode(value: string) {
  return value.toUpperCase().replace(/\s+/g, "");
}

function isFederalMp(rep: Representative) {
  return rep.elected_office?.trim().toUpperCase() === "MP";
}

function pickMp(list: Representative[], source: "concordance" | "centroid") {
  const candidates = list.filter((rep) => isFederalMp(rep) && rep.name);
  if (candidates.length === 0) return null;

  const withEmail = candidates.find((rep) => rep.email);
  const chosen = withEmail ?? candidates[0];

  return {
    name: chosen.name ?? "",
    email: chosen.email,
    districtName: chosen.district_name,
    source,
  } satisfies MpResult;
}

async function fetchByPostalCode(postalCode: string) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(
      `${REPRESENT_BASE_URL}/postcodes/${postalCode}/`,
      {
        headers: { Accept: "application/json" },
        cache: "no-store",
        signal: controller.signal,
      },
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as PostcodeResponse;
    const concordance = Array.isArray(data.representatives_concordance)
      ? data.representatives_concordance
      : [];
    const centroid = Array.isArray(data.representatives_centroid)
      ? data.representatives_centroid
      : [];

    const mp =
      pickMp(concordance, "concordance") ?? pickMp(centroid, "centroid");

    return mp;
  } finally {
    clearTimeout(timeoutId);
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const postalCodeRaw = searchParams.get("postalCode") ?? "";
  const postalCode = normalizePostalCode(postalCodeRaw);

  if (!/^[A-Z]\d[A-Z]\d[A-Z]\d$/.test(postalCode)) {
    return NextResponse.json(
      { error: "Invalid postal code.", ministerEmail: MINISTER_EMAIL },
      { status: 400 },
    );
  }

  const now = Date.now();
  const cached = mpLookupCache.get(postalCode);
  if (cached && cached.expiresAt > now) {
    return NextResponse.json({
      postalCode,
      ministerEmail: MINISTER_EMAIL,
      mp: cached.result,
      cached: true,
    });
  }

  const mp = await fetchByPostalCode(postalCode);
  mpLookupCache.set(postalCode, {
    result: mp,
    expiresAt: now + CACHE_TTL_MS,
  });

  return NextResponse.json({
    postalCode,
    ministerEmail: MINISTER_EMAIL,
    mp,
    cached: false,
  });
}
