import {
  CampaignFormInput,
  CampaignLanguage,
  CampaignSubmission,
  Topic,
} from "@/types/campaign";

export const GOAL_COUNT = 10000;
export const TIER_STEP = 500;
export const MINISTER_EMAIL =
  process.env.MINISTER_EMAIL ?? "marjorie.michel@parl.gc.ca";

export const PROVINCES = [
  "AB",
  "BC",
  "MB",
  "NB",
  "NL",
  "NS",
  "NT",
  "NU",
  "ON",
  "PE",
  "QC",
  "SK",
  "YT",
] as const;

export const PREMIER_EMAIL_BY_PROVINCE: Partial<Record<string, string>> = {
  AB: "premier@gov.ab.ca",
  BC: "premier@gov.bc.ca",
  MB: "premier@leg.gov.mb.ca",
  NB: "premier@gnb.ca",
  NL: "premier@gov.nl.ca",
  NS: "premier@novascotia.ca",
  ON: "premier@ontario.ca",
  PE: "premier@gov.pe.ca",
  QC: "premier@quebec.ca",
  SK: "premier@gov.sk.ca",
};

export const TOPICS: Topic[] = [
  {
    id: "wait-times",
    section: "health",
    en: "Reduce unacceptable wait times for diagnosis and treatment.",
    fr: "Reduire les temps d'attente inacceptables pour le diagnostic et le traitement.",
  },
  {
    id: "funding",
    section: "health",
    en: "Improve funding and access for life-changing treatments.",
    fr: "Ameliorer le financement et l'acces aux traitements qui changent des vies.",
  },
  {
    id: "awareness",
    section: "health",
    en: "Expand public education so patients are not left behind.",
    fr: "Elargir l'education publique pour que les patients ne soient pas laisses pour compte.",
  },
  {
    id: "care",
    section: "community",
    en: "Support patients and caregivers with coordinated care resources.",
    fr: "Soutenir les patients et les aidants avec des ressources de soins coordonnees.",
  },
  {
    id: "equity",
    section: "community",
    en: "Address regional inequities in access to care across Canada.",
    fr: "Traiter les inegalites regionales d'acces aux soins partout au Canada.",
  },
  {
    id: "research",
    section: "community",
    en: "Invest in research and long-term policy solutions.",
    fr: "Investir dans la recherche et des solutions politiques a long terme.",
  },
];

export function getTopicById(topicId: string) {
  return TOPICS.find((topic) => topic.id === topicId);
}

function topicText(topicId: string, language: CampaignLanguage) {
  const topic = getTopicById(topicId);
  if (!topic) return topicId;
  return language === "fr" ? topic.fr : topic.en;
}

export function generateLetter(input: CampaignFormInput): string {
  const selectedTopics = input.topics.map((topicId) =>
    topicText(topicId, input.language),
  );

  if (input.language === "fr") {
    return [
      "A l'attention de l'honorable Marjorie Michel, ministre de la Sante",
      "",
      "Madame la Ministre,",
      "",
      "Je vous ecris pour demander des actions concretes et urgentes afin d'ameliorer les soins lies aux maladies rares et aux besoins des patients au Canada.",
      "",
      "Priorites importantes pour moi :",
      ...selectedTopics.map((topic, index) => `${index + 1}. ${topic}`),
      "",
      "Merci de faire progresser des politiques qui ameliorent l'acces, reduisent les retards et soutiennent les patients ainsi que leurs familles.",
      "",
      "Veuillez agreer l'expression de mes sentiments distingues.",
      "",
      `${input.firstName} ${input.lastName}`,
      `${input.city}, ${input.province}, ${input.postalCode}`,
      input.mpEmail ? `CC: Depute local (${input.mpEmail})` : "CC: Depute local",
    ].join("\n");
  }

  return [
    "To the Honourable Marjorie Michel, Minister of Health,",
    "",
    "Dear Minister,",
    "",
    "I am writing to ask for urgent and practical action to improve care for people impacted by rare conditions and complex patient needs in Canada.",
    "",
    "The priorities I want your office to address are:",
    ...selectedTopics.map((topic, index) => `${index + 1}. ${topic}`),
    "",
    "Please advance policies that improve access, reduce delays, and better support patients and caregivers.",
    "",
    "Sincerely,",
    "",
    `${input.firstName} ${input.lastName}`,
    `${input.city}, ${input.province}, ${input.postalCode}`,
    input.mpEmail ? `CC: Local MP (${input.mpEmail})` : "CC: Local MP",
  ].join("\n");
}

export function toSubmission(
  input: CampaignFormInput,
  letterBody: string,
): CampaignSubmission {
  return {
    createdAt: new Date(),
    language: input.language,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    postalCode: input.postalCode.trim(),
    province: input.province.trim(),
    city: input.city.trim(),
    email: input.email.trim(),
    newsletterOptIn: input.newsletterOptIn,
    topics: input.topics,
    mpEmail: input.mpEmail?.trim() || undefined,
    mpName: input.mpName?.trim() || undefined,
    letterBody: input.ministerLetterBody ?? letterBody,
    premierLetterBody: input.premierLetterBody,
    ministerEmail: MINISTER_EMAIL,
    printStatusMinister: "pending",
    printStatusMp: input.mpEmail ? "pending" : "not_applicable",
  };
}

export function validateTopicSelection(topicIds: string[]): boolean {
  if (topicIds.length !== 4) return false;
  const selectedTopics = topicIds
    .map((id) => getTopicById(id))
    .filter((topic): topic is Topic => Boolean(topic));

  if (selectedTopics.length !== 4) return false;

  const healthCount = selectedTopics.filter(
    (topic) => topic.section === "health",
  ).length;
  const communityCount = selectedTopics.filter(
    (topic) => topic.section === "community",
  ).length;

  return healthCount === 2 && communityCount === 2;
}
