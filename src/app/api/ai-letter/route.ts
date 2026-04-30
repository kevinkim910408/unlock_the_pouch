import { NextResponse } from "next/server";

type Payload = {
  language?: "en" | "fr";
  name?: string;
  riding?: string;
  topics?: string[];
};

function required(value?: string) {
  return Boolean(value && value.trim().length > 0);
}

function buildEnglishPrompt(name: string, riding: string, topics: string[]) {
  return `Write a respectful, natural-sounding formal letter addressed to a Canadian federal Minister.

Requirements:

Use Canadian English.
Output must be in HTML format using <p> tags for paragraphs and <br /> between paragraphs.
Do not include any greeting line such as "Dear Minister" or any closing signature such as "Sincerely." These will be handled separately.
Do not include any leading or trailing whitespace.

Tone and style:

The letter should feel genuinely human, personal, and conversational while remaining respectful and composed.
Avoid robotic phrasing, overly formal cliches, or predictable AI-style transitions.
Avoid phrases like "I am writing to you today."
Vary sentence length and structure naturally.
Do not use dash symbols.
The writing should feel like it comes from a real constituent, not an organization.

Content:

Begin with a natural, human-sounding introduction that clearly includes:
"My name is ${name} and I live in ${riding}"
A personal expression of concern about access to nicotine pouches in Canada
Rewrite the following ideas in a more natural and human way, without copying phrasing directly:
A 2024 ministerial order moved nicotine pouches behind pharmacy counters
This change made access more difficult for Canadians
There is frustration or confusion because more harmful products remain widely available in convenience stores and gas stations
The change has created real barriers for adults who rely on these products as an alternative
The introduction should feel like a real person explaining their perspective, not listing policy points.

Body:

Expand naturally on the issue using the user selected topics below. Integrate them smoothly into the letter instead of listing them mechanically:
${topics[0] ?? ""}
${topics[1] ?? ""}
${topics[2] ?? ""}
${topics[3] ?? ""}
Keep the discussion focused on adult access, harm reduction, fairness, and practical impact.
Do not mention youth, children, or students.
Avoid extreme or absolute claims. Keep the tone reasonable and grounded.

Closing paragraph:

Rewrite the following request in a calm, reasonable, and persuasive way without copying phrasing directly:
The writer is asking for reconsideration of the current approach
They are not asking for unrestricted access, but for reasonable, regulated access for adults
They want the ministerial order removed
They want nicotine pouches to be available wherever other legal nicotine products are sold
The closing should feel polite, measured, and solution-oriented.`;
}

function buildFrenchPrompt(topics: string[]) {
  return `Write a respectful, natural-sounding formal letter in Canadian French addressed to a Canadian federal Minister.

Requirements:

The letter must be written in Canadian French.
Output must be in HTML format using <p> tags for paragraphs and <br /> between paragraphs.
Do not include any greeting (e.g., Cher/Chere) or any closing signature (e.g., Cordialement). These will be handled separately.
Do not include any leading or trailing whitespace.
Preserve the variables exactly as written:
{inserer le nom}
{inserer la circonscription}

Tone and style:

The letter should feel natural, personal, and authentically human.
Maintain a respectful, calm, and composed tone.
Avoid overly formal, rigid, or bureaucratic phrasing.
Avoid repetitive sentence structures and predictable transitions.
Vary sentence length and flow naturally.
Do not use dash symbols.
The voice should reflect that of a real Canadian constituent.

Content:

Introduction:

Begin with a natural and human rewrite of the following opening. Do not copy it directly, but preserve all key ideas and meaning:

Je m’appelle {inserer le nom} et j’habite a {inserer la circonscription}. Je vous ecris en tant que Canadien souhaitant un meilleur acces aux sachets de nicotine. En 2024, le ministre de la Sante de l’epoque a pris un arrete ministeriel qui a relegue ces produits derriere le comptoir des pharmacies. Ce changement a rendu leur acces difficile pour l’ensemble des Canadiens.

Cela n’a pas de sens, surtout lorsque le produit le plus nocif est disponible dans presque toutes les stations-service et depanneurs du pays. Pour ceux d’entre nous qui utilisent ces produits dans le cadre d’une transition loin du tabagisme, ce changement a cree de la confusion, de l’incoherence et de veritables obstacles a l’acces.

The rewritten introduction must:
Clearly include {inserer le nom} and {inserer la circonscription} exactly as written
Sound fluid, natural, and personal
Avoid sounding like a policy summary

Body:

Expand naturally on the issue by integrating the following topics smoothly into the text:
${topics[0] ?? ""}
${topics[1] ?? ""}
${topics[2] ?? ""}
${topics[3] ?? ""}
Do not list topics mechanically. Blend them into the narrative.
Keep the focus on adult access, harm reduction, fairness, and real-world impact.
Do not mention youth, children, or students.
Avoid exaggerated or absolute claims.

Closing paragraph:

Rewrite the following closing message in a natural, persuasive, and human way without copying it directly:

Je vous demande de reconsiderer cette approche, non pas pour elargir l’acces sans limites, mais pour garantir que les Canadiens adultes aient un acces raisonnable et reglemente a des solutions a moindre risque. Je vous demande de retirer immediatement l’arrete ministeriel et de permettre aux Canadiens d’acceder a des produits a faible risque, en particulier les sachets de nicotine, partout ou les cigarettes et autres produits contenant de la nicotine sont vendus.

The closing should:
Remain polite and solution-oriented
Emphasize reasonable, regulated access
Clearly communicate the request without sounding aggressive.`;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Payload;
    const language = payload.language === "fr" ? "fr" : "en";
    const name = payload.name?.trim() ?? "";
    const riding = payload.riding?.trim() ?? "";
    const topics = (payload.topics ?? [])
      .filter((topic): topic is string => typeof topic === "string")
      .slice(0, 4);

    if (!required(name) || !required(riding) || topics.length < 4) {
      return NextResponse.json({ error: "Missing required generation fields." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY is not configured." }, { status: 503 });
    }

    const prompt = language === "fr"
      ? buildFrenchPrompt(topics)
      : buildEnglishPrompt(name, riding, topics);

    const model = process.env.GEMINI_MODEL ?? "gemini-2.5-flash-lite";
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const detail = await response.text();
      return NextResponse.json({ error: "AI generation failed.", detail }, { status: 502 });
    }

    const data = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const rawLetter =
      data.candidates?.[0]?.content?.parts
        ?.map((part) => part.text ?? "")
        .join("")
        .trim() ?? "";
    const letterHtml =
      language === "fr"
        ? rawLetter
            .replaceAll("{insérer le nom}", name)
            .replaceAll("{insérer la circonscription}", riding)
            .replaceAll("{inserer le nom}", name)
            .replaceAll("{inserer la circonscription}", riding)
        : rawLetter;

    if (!letterHtml) {
      return NextResponse.json({ error: "Empty AI response." }, { status: 502 });
    }

    return NextResponse.json({ letterHtml });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to generate letter." }, { status: 500 });
  }
}
