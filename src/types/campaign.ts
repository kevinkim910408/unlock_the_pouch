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
  mpEmail?: string;
};

export type CampaignSubmission = {
  _id?: string;
  createdAt: Date;
  language: CampaignLanguage;
  firstName: string;
  lastName: string;
  postalCode: string;
  province: string;
  city: string;
  email?: string;
  newsletterOptIn: boolean;
  topics: string[];
  mpEmail?: string;
  mpSelected: boolean;
  letterBody: string;
  ministerEmail: string;
};

export type ProvinceStat = {
  province: string;
  count: number;
};
