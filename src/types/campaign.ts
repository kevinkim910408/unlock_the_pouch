export type CampaignLanguage = "en" | "fr";

export type TopicSection = "health" | "community";

export type Topic = {
  id: string;
  section: TopicSection;
  en: string;
  fr: string;
};

export type CampaignFormInput = {
  language: CampaignLanguage;
  firstName: string;
  lastName: string;
  postalCode: string;
  province: string;
  city: string;
  email: string;
  newsletterOptIn: boolean;
  topics: string[];
  importantTopicIds?: string[];
  importantTopicVariantIds?: string[];
  desiredTopicIds?: string[];
  desiredTopicVariantIds?: string[];
  mpEmail?: string;
  mpName?: string;
  mpRiding?: string;
  ministerEmail?: string;
  subjectLine?: string;
  premierSubjectLine?: string;
  openingTemplateId?: string;
  closingTemplateId?: string;
  endingTemplateId?: string;
  ministerLetterBody?: string;
  mpLetterBody?: string;
  premierLetterBody?: string;
};

export type CampaignSubmission = {
  _id?: string;
  submissionNumber?: number;
  createdAt: Date;
  language: CampaignLanguage;
  firstName: string;
  lastName: string;
  postalCode: string;
  province: string;
  city: string;
  email: string;
  newsletterOptIn: boolean;
  topics: string[];
  importantTopicIds?: string[];
  importantTopicVariantIds?: string[];
  desiredTopicIds?: string[];
  desiredTopicVariantIds?: string[];
  mpEmail?: string;
  mpName?: string;
  mpRiding?: string;
  subjectLine?: string;
  premierSubjectLine?: string;
  openingTemplateId?: string;
  closingTemplateId?: string;
  endingTemplateId?: string;
  letterBody: string;
  mpLetterBody?: string;
  premierLetterBody?: string;
  ministerEmail: string;
  printStatusMinister: "pending" | "printed";
  printStatusMp: "not_applicable" | "pending" | "printed";
  printedAtMinister?: Date | null;
  printedAtMp?: Date | null;
};

export type ProvinceStat = {
  province: string;
  count: number;
};
