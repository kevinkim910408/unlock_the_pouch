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

export const PREMIER_EMAIL_BY_PROVINCE: Partial<Record<string, string[]>> = {
  NL: ["LelaEvans@gov.nl.ca", "TonyWakeham@gov.nl.ca", "CraigPardy@gov.nl.ca"],
  PE: ["slacorn@gov.pe.ca", "premier@gov.pe.ca", "MinisterFinance@gov.pe.ca"],
  NS: [
    "Health.Minister@novascotia.ca",
    "premier@novascotia.ca",
    "brian.comer@novascotia.ca",
    "OSDMIN@novascotia.ca",
    "SLTCmin@novascotia.ca",
  ],
  NB: ["John.Dornan@gnb.ca", "Susan.Holt@gnb.ca", "rene.legacy@gnb.ca"],
  ON: [
    "sylvia.jones@ontario.ca",
    "Premier@ontario.ca",
    "andrea.khanjinco@pc.ola.org",
    "lisa.thompsonco@pc.ola.org",
  ],
  MB: ["minhealth@leg.gov.mb.ca", "premier@manitoba.ca", "minfin@manitoba.ca"],
  SK: [
    "he.minister@gov.sk.ca",
    "premier@gov.sk.ca",
    "fin.minister@gov.sk.ca",
    "lori.carr@gov.sk.ca",
  ],
  AB: ["health.minister@gov.ab.ca", "premier@gov.ab.ca", "ministersa@gov.ab.ca"],
  BC: [
    "HLTH.Minister@gov.bc.ca",
    "premier@gov.bc.ca",
    "Niki.Sharma.MLA@leg.bc.ca",
    "Amna.Shah.MLA@leg.bc.ca",
  ],
  YT: ["premier@yukon.ca", "brad.cathers@yukon.ca"],
  NT: ["premier@gov.nt.ca", "lesa_semmler@gov.nt.ca"],
  NU: ["premier@gov.nu.ca"],
  QC: ["Christine.Frechette.SAGU@assnat.qc.ca", "Sonia.Belanger.PREV@assnat.qc.ca"],
};

export const MINISTER_EMAIL_BY_PROVINCE: Partial<Record<string, string>> = {
  NL: "LelaEvans@gov.nl.ca",
  PE: "slacorn@gov.pe.ca",
  NS: "Health.Minister@novascotia.ca",
  NB: "John.Dornan@gnb.ca",
  ON: "sylvia.jones@ontario.ca",
  MB: "minhealth@leg.gov.mb.ca",
  SK: "he.minister@gov.sk.ca",
  AB: "health.minister@gov.ab.ca",
  BC: "HLTH.Minister@gov.bc.ca",
  YT: "brad.cathers@yukon.ca",
  NT: "lesa_semmler@gov.nt.ca",
  QC: "Sonia.Belanger.PREV@assnat.qc.ca",
};

export const MINISTER_NAME_BY_PROVINCE: Partial<Record<string, string>> = {
  NL: "Lela Evans",
  PE: "Cory Deagle",
  NS: "Michelle Thompson",
  NB: "John Dornan",
  ON: "Sylvia Jones",
  MB: "Uzoma Asagwara",
  SK: "Jeremy Cockrill",
  AB: "Adriana LaGrange",
  BC: "Josie Osborne",
  YT: "Brad Cathers",
  NT: "Lesa Semmler",
  QC: "Sonia Belanger",
};

export function getMinisterGreeting(language: CampaignLanguage, _province?: string) {
  void _province;
  if (language === "fr") {
    return "Chere Ministre Michel,";
  }
  return "Dear Minister Michel,";
}

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
  
export type ImportantTopic = {
  id: string;
  en: string;
  fr: string;
  variants: string[];
  variantsFr: string[];
};

export const IMPORTANT_TOPICS: ImportantTopic[] = [
  {
    id: "same-places-as-cigarettes",
    en: "Nicotine pouches should be available in the same places as cigarettes",
    fr: "Les sachets de nicotine devraient etre disponibles aux memes endroits que les cigarettes",
    variants: [
      "Common sense would suggest that deadly cigarettes should be more difficult to purchase than products designed to help you quit smoking.",
      "Common sense says that products known to cause harm should be harder to access than those intended to help people quit smoking.",
      "It only makes sense that cigarettes, which are deadly, should be more restricted than tools designed to help people stop smoking.",
      "If policy reflected common sense, cigarettes would be the hardest products to access-not the ones designed to help people move away from smoking.",
      "Logically, the most harmful products should be the hardest to buy-not the ones meant to support quitting.",
      "If we follow common sense, cigarettes should be less accessible than alternatives created to help people quit.",
      "It defies logic that deadly cigarettes are easier to purchase than products meant to reduce harm.",
      "Basic common sense tells us that harmful products should face greater restrictions than those designed to help people quit.",
      "It stands to reason that cigarettes should be harder to obtain than safer alternatives aimed at helping people stop smoking.",
      "A common-sense approach would make the most dangerous products the least accessible.",
      "There is a clear disconnect when cigarettes are easier to buy than products intended to help people quit.",
    ],
    variantsFr: [
      "Le bon sens voudrait que les cigarettes mortelles soient plus difficiles a acheter que les produits concus pour vous aider a arreter de fumer.",
      "Le bon sens veut que les cigarettes, qui sont mortelles, soient plus difficiles d'acces que les produits aidant a arreter de fumer.",
      "Logiquement, les produits les plus dangereux devraient etre les plus difficiles a se procurer, pas ceux qui aident a cesser de fumer.",
      "Il serait tout a fait logique que les cigarettes soient plus difficiles a acheter que les solutions concues pour arreter de fumer.",
      "Le simple bon sens indique que les cigarettes devraient etre moins accessibles que les produits de sevrage tabagique.",
      "Il est incoherent que les cigarettes soient faciles a obtenir alors que les produits pour arreter de fumer ne le sont pas.",
      "Si on suit le bon sens, les cigarettes devraient etre les produits les plus restreints, pas les aides au sevrage.",
      "Il parait evident que les produits mortels devraient etre plus reglementes que ceux qui aident a arreter de fumer.",
      "Le bon sens suggere que l'acces aux cigarettes devrait etre plus limite que celui aux alternatives pour arreter de fumer.",
      "Rien n'est plus illogique que de rendre les cigarettes plus accessibles que les outils pour cesser de fumer.",
      "Une approche sensee ferait en sorte que les cigarettes soient plus difficiles a obtenir que les produits d'aide a l'arret du tabac.",
    ],
  },
  {
    id: "permission-to-quit",
    en: "I shouldn't have to ask for permission to stop smoking",
    fr: "Je ne devrais pas avoir a demander la permission pour arreter de fumer.",
    variants: [
      "I have to speak to a pharmacist to buy a NTR nicotine pouch, yet my local convenience store owner will sell me a pack of cigarettes, no questions asked.",
      "I need to consult a pharmacist to purchase an NTR nicotine pouch, but I can walk into a convenience store and buy cigarettes without any questions.",
      "To get a nicotine pouch, I have to go through a pharmacist-yet cigarettes are sold to me freely at the corner store.",
      "Buying a nicotine pouch requires a conversation with a pharmacist, while cigarettes are handed over the counter with no hesitation.",
      "I am required to speak with a pharmacist for a nicotine pouch, but I can grab a pack of cigarettes from a convenience store, no questions asked.",
      "Accessing a nicotine pouch means dealing with a pharmacist, but cigarettes are readily available at any local shop.",
      "I have to jump through hoops to get a nicotine pouch, yet cigarettes are sold to me instantly at my neighbourhood store.",
      "A pharmacist is required for a nicotine pouch, but cigarettes? Just walk in and buy them-no questions.",
      "Getting a nicotine pouch involves speaking to a pharmacist, but cigarettes are available to me right away at any convenience store.",
      "It is easier for me to buy cigarettes at a convenience store than it is to access a nicotine pouch through a pharmacist.",
      "I need approval from a pharmacist for a nicotine pouch, while cigarettes are sold to me casually at the local corner store.",
    ],
    variantsFr: [
      "Je dois parler a un pharmacien pour acheter un sachet de nicotine NTR, pourtant le proprietaire de mon depanneur local me vendra un paquet de cigarettes sans poser de questions.",
      "Je dois consulter un pharmacien pour acheter un sachet de nicotine NTR, alors que je peux acheter des cigarettes au depanneur sans aucune question.",
      "Pour obtenir un sachet de nicotine NTR, je dois passer par un pharmacien, mais les cigarettes me sont vendues librement au depanneur.",
      "L'achat d'un sachet de nicotine NTR exige de parler a un pharmacien, tandis que les cigarettes sont accessibles sans restriction au coin de la rue.",
      "Je suis oblige de m'adresser a un pharmacien pour un sachet de nicotine NTR, alors qu'un paquet de cigarettes s'achete facilement au depanneur.",
      "Pour un sachet de nicotine NTR, il faut l'accord d'un pharmacien, mais les cigarettes sont vendues sans aucune verification au depanneur.",
      "Il me faut l'intervention d'un pharmacien pour acheter un sachet de nicotine NTR, mais je peux obtenir des cigarettes sans difficulte au magasin du coin.",
      "Acceder a un sachet de nicotine NTR demande une discussion avec un pharmacien, tandis que les cigarettes sont en vente libre au depanneur.",
      "Je dois passer par un pharmacien pour acheter un sachet de nicotine NTR, alors que les cigarettes me sont vendues sans poser de questions.",
      "On m'exige de consulter un pharmacien pour un sachet de nicotine NTR, alors qu'un paquet de cigarettes s'achete sans effort au depanneur.",
      "Je dois consulter un pharmacien pour un sachet NTR, alors que les cigarettes restent faciles d'acces au depanneur.",
    ],
  },
  {
    id: "helped-me-quit",
    en: "Nicotine pouches helped me quit smoking",
    fr: "Les sachets de nicotine m'ont aide a arreter de fumer.",
    variants: [
      "These products work-I was able to quit smoking because of nicotine pouches.",
      "Nicotine pouches helped me stop smoking-they truly made a difference for me.",
      "I can say from experience that nicotine pouches work-they helped me quit smoking.",
      "Thanks to nicotine pouches, I was able to leave smoking behind.",
      "Nicotine pouches played a key role in helping me quit smoking-they work.",
      "I quit smoking with the help of nicotine pouches, and that speaks for itself.",
      "For me, nicotine pouches were effective-they helped me stop smoking.",
      "I successfully quit smoking thanks to nicotine pouches-they really do work.",
      "Nicotine pouches made it possible for me to quit smoking-they were a game changer.",
      "These products helped me quit smoking-nicotine pouches worked for me.",
      "This products work. I have quit smoking thanks to nicotine pouches.",
    ],
    variantsFr: [
      "Ces produits fonctionnent. J'ai arrete de fumer grace aux sachets de nicotine.",
      "Les sachets de nicotine m'ont aide a arreter de fumer.",
      "Je peux en temoigner: ces sachets ont joue un role cle dans mon arret du tabac.",
      "Grace aux sachets de nicotine, j'ai pu laisser la cigarette derriere moi.",
      "Ces produits ont vraiment fait une difference dans ma demarche d'arret.",
      "Pour moi, les sachets de nicotine ont ete efficaces pour cesser de fumer.",
      "J'ai reussi a arreter de fumer avec l'aide des sachets de nicotine.",
      "Ces sachets ont rendu mon arret du tabac possible.",
      "Les sachets de nicotine ont ete un changement determinant pour moi.",
      "Mon experience montre que ces produits fonctionnent vraiment.",
      "Ils m'ont aide concretement a arreter de fumer.",
    ],
  },
  {
    id: "freedom-to-choose",
    en: "The government should give me the freedom to choose",
    fr: "Le gouvernement devrait me donner la liberte de choisir.",
    variants: [
      "I am an adult. I should be able to make my own choices.",
      "I am an adult-I should be trusted to make my own decisions.",
      "As an adult, I have the right to choose for myself.",
      "I am fully capable of making my own choices as an adult.",
      "Being an adult means I should be able to decide what is best for me.",
      "I am an adult-I do not need others deciding for me.",
      "I have the autonomy, as an adult, to make my own decisions.",
      "As a grown adult, I should have control over my own choices.",
      "I am old enough to make my own decisions and take responsibility for them.",
      "My choices should be mine to make-I am an adult.",
      "I am an adult, and I should have the freedom to decide for myself.",
    ],
    variantsFr: [
      "Je suis un adulte. Je devrais pouvoir faire mes propres choix.",
      "Je suis adulte et capable de faire mes propres choix.",
      "En tant qu'adulte, mes decisions devraient m'appartenir.",
      "Je suis une personne adulte, libre de decider pour moi-meme.",
      "Je suis adulte, je devrais pouvoir agir selon mon propre jugement.",
      "Etant adulte, je dois pouvoir prendre mes propres decisions.",
      "Je suis un adulte responsable, je devrais choisir par moi-meme.",
      "Mon statut d'adulte me donne le droit de decider seul.",
      "Je suis adulte, personne ne devrait decider a ma place.",
      "Comme adulte, j'ai la capacite de faire mes propres choix.",
      "Je suis adulte, je devrais avoir le controle de mes decisions.",
    ],
  },
  {
    id: "poor-public-health-policy",
    en: "This is poor public health policy.",
    fr: "Il s'agit d'une mauvaise politique de sante publique.",
    variants: [
      "Removing NRT nicotine pouches from convenience stores was a very bad idea. This decision was not based on evidence, but rather on a knee-jerk reaction to the false perception that these products are a gateway to smoking.",
      "Pulling NRT nicotine pouches from convenience stores was a mistake. It was not based on solid research, but rather a reaction to the misconception that they lead to smoking.",
      "Removing nicotine pouches from convenience stores was a poor decision-driven more by perception than by evidence.",
      "The decision to take NRT nicotine pouches out of convenience stores lacked a research foundation and appears to have been a knee-jerk response to unfounded gateway concerns.",
      "Taking nicotine pouches off convenience store shelves was misguided, rooted in fear rather than credible evidence.",
      "This move was not evidence-based. Removing nicotine pouches from stores seems like a reaction to a false narrative rather than real data.",
      "Eliminating access to nicotine pouches in convenience stores was not supported by research-it reflects a rushed response to a misleading perception.",
      "The removal of NRT nicotine pouches from convenience stores was poorly thought out, driven by assumptions rather than science.",
      "This policy change appears reactionary, not research-driven, based on the mistaken belief that nicotine pouches lead to smoking.",
      "Taking nicotine pouches out of convenience stores was a bad call-more about optics than evidence.",
      "The decision to restrict nicotine pouches was not grounded in research, but in a knee-jerk response to an unproven gateway theory.",
    ],
    variantsFr: [
      "Retirer les sachets de nicotine NRT des depanneurs a ete une tres mauvaise idee. Cette decision ne reposait pas sur des donnees probantes, mais plutot sur une reaction impulsive.",
      "Retirer les sachets de nicotine NRT des depanneurs etait une erreur.",
      "Le retrait des sachets de nicotine NRT des depanneurs a ete une mauvaise decision, davantage basee sur une reaction emotive que sur la science.",
      "Enlever les sachets de nicotine NRT des depanneurs n'etait pas justifie par des preuves.",
      "Cette mesure repose sur une idee fausse plutot que sur des donnees concretes.",
      "Supprimer ces produits des depanneurs a ete une decision precipitee, sans appui scientifique solide.",
      "Le retrait n'etait pas fonde sur la recherche, mais sur une perception erronee.",
      "Cette decision semble etre une reaction impulsive plutot qu'une politique basee sur des faits.",
      "Enlever ces produits des depanneurs etait une mauvaise idee, influencee par une fausse croyance.",
      "Le retrait n'a pas ete guide par des donnees probantes.",
      "Restreindre l'acces decoule davantage d'une reaction rapide que d'une analyse fondee sur la recherche.",
    ],
  },
];

export type DesiredTopic = {
  id: string;
  en: string;
  fr: string;
  variants: string[];
  variantsFr: string[];
};

export const DESIRED_TOPICS: DesiredTopic[] = [
  {
    id: "remove-order-return-store-access",
    en: "Remove the Ministerial Order and allow nicotine pouches that help people quit smoking back into convenience stores.",
    fr: "Supprimez l'arrete ministeriel et permettez le retour des sachets de nicotine qui aident a arreter de fumer dans les depanneurs.",
    variants: [
      "Restoring access to nicotine pouches in convenience stores would make it easier for adults to choose lower-risk alternatives to smoking.",
      "Making nicotine pouches available in convenience stores again would give adults easier access to lower-risk options.",
      "Allowing nicotine pouches back into convenience stores would help adults access alternatives to smoking more easily.",
      "Restoring access in everyday retail locations would remove unnecessary barriers for adults trying to quit smoking.",
      "Bringing nicotine pouches back to convenience stores would improve accessibility for those looking to move away from cigarettes.",
      "Reintroducing nicotine pouches to convenience stores would help align policy with reducing smoking.",
      "Allowing these products back into convenience stores would make it easier for adults to choose alternatives.",
      "Making nicotine pouches available in convenience stores again would support adults seeking practical ways to quit.",
      "Restoring retail access to nicotine pouches would better support harm reduction efforts.",
      "Reversing the restriction would improve access for adults who rely on them to quit smoking.",
      "Allowing nicotine pouches back into convenience stores would make lower-risk alternatives more accessible.",
    ],
    variantsFr: [
      "Retablir l'acces aux sachets de nicotine dans les depanneurs faciliterait le choix, pour les adultes, d'alternatives a risque reduit.",
      "Rendre de nouveau accessibles les sachets de nicotine dans les depanneurs aiderait les adultes.",
      "Permettre le retour des sachets de nicotine en depanneur faciliterait l'acces a des alternatives moins nocives.",
      "Redonner acces aux sachets de nicotine en commerce de proximite simplifierait le choix d'options moins risquees.",
      "Le retablissement de l'acces aux sachets de nicotine dans les depanneurs encouragerait les adultes.",
      "Offrir a nouveau ces produits dans les depanneurs rendrait les alternatives au tabac plus accessibles.",
      "En reintroduisant les sachets de nicotine en depanneur, on faciliterait l'acces.",
      "Rendre ces produits disponibles en depanneur permettrait aux adultes d'acceder plus facilement.",
      "Le retour des sachets de nicotine dans les points de vente courants aiderait a reduire les obstacles.",
      "Faciliter l'acces aux sachets de nicotine en depanneur encouragerait l'utilisation d'alternatives moins nocives.",
      "Reintroduire les sachets de nicotine dans les depanneurs soutiendrait une approche pragmatique.",
    ],
  },
  {
    id: "all-nrts-where-cigarettes-sold",
    en: "Ensure that all NRTs are widely available in the same places as people buy cigarettes",
    fr: "Assurez-vous que tous les TRN soient largement disponibles aux memes endroits ou les gens achetent des cigarettes.",
    variants: [
      "Making all NRTs available wherever cigarettes are sold would remove unnecessary barriers.",
      "NRTs should be just as easy to find as cigarettes.",
      "If cigarettes are widely available, NRTs should be too.",
      "Access to NRTs should match the availability of cigarettes.",
      "People should not have to go out of their way to find NRTs.",
      "Making NRTs as accessible as cigarettes would better support quitting.",
      "If the goal is to reduce smoking, NRTs need to be in the same places.",
      "Equal access to NRTs and cigarettes would remove barriers.",
      "NRTs should be as convenient to buy as cigarettes.",
      "Widespread access to NRTs is essential.",
      "To support quitting, NRTs must be available wherever cigarettes are purchased.",
    ],
    variantsFr: [
      "Rendre tous les TRN disponibles partout ou les cigarettes sont vendues eliminerait des obstacles inutiles.",
      "Offrir tous les TRN dans les memes points de vente que les cigarettes permettrait de lever des barrieres.",
      "Mettre tous les TRN a disposition la ou les cigarettes sont vendues reduirait les obstacles.",
      "Permettre la vente de tous les TRN partout ou l'on trouve des cigarettes eliminerait des barrieres.",
      "Rendre les TRN disponibles dans tous les lieux de vente de cigarettes supprimerait des obstacles.",
      "Assurer la disponibilite des TRN partout ou les cigarettes sont vendues permettrait d'eliminer des barrieres.",
      "Offrir tous les TRN dans les memes commerces que les cigarettes enleverait des obstacles.",
      "Mettre les TRN a disposition partout ou les cigarettes sont vendues eliminerait des barrieres.",
      "Rendre accessibles tous les TRN dans les points de vente de cigarettes supprimerait des obstacles.",
      "Permettre l'acces a tous les TRN partout ou les cigarettes sont vendues reduirait les barrieres.",
      "Rendre tous les TRN disponibles partout ou les cigarettes sont vendues permettrait de mieux soutenir.",
    ],
  },
  {
    id: "more-than-mint-flavours",
    en: "I want more flavours than mint and should be available in all flavours of current NRT's",
    fr: "Je souhaite plus de saveurs que la menthe, et qu'elles soient offertes dans toutes les saveurs deja disponibles pour les TRN actuels.",
    variants: [
      "Expanding flavour options beyond mint would make these products more appealing and better suited to individual preferences.",
      "Offering more than mint flavours would better meet individual preferences.",
      "Expanding flavour choices beyond mint would make these products more appealing and accessible.",
      "Limiting flavours to mint does not reflect real user needs.",
      "A broader range of flavours would help cater to different preferences.",
      "More flavour options beyond mint would make these products more usable.",
      "People have different tastes, and offering more than mint could make a real difference.",
      "Expanding beyond mint flavours would improve accessibility and appeal.",
      "Restricting flavours to mint limits effectiveness.",
      "A wider selection of flavours would help more people find an option that works.",
      "Offering only mint is limiting-more flavours would better support needs.",
    ],
    variantsFr: [
      "Elargir les options de saveurs au-dela de la menthe rendrait ces produits plus attrayants.",
      "Proposer davantage de saveurs que la menthe rendrait ces produits plus attrayants.",
      "Diversifier les saveurs au-dela de la menthe permettrait de mieux repondre aux preferences individuelles.",
      "Aller au-dela de la saveur menthe rendrait ces produits plus interessants.",
      "Offrir plus de saveurs que la menthe rendrait ces produits plus attrayants.",
      "Proposer une plus grande variete de saveurs que la menthe rendrait ces produits plus adaptes.",
      "Elargir la gamme de saveurs au-dela de la menthe permettrait de mieux repondre aux gouts individuels.",
      "Depasser la saveur menthe en offrant plus d'options rendrait ces produits plus personnalisables.",
      "Ajouter des saveurs au-dela de la menthe rendrait ces produits plus attrayants.",
      "Offrir un eventail de saveurs plus large que la menthe rendrait ces produits plus adaptes.",
      "Permettre une diversite de saveurs au-dela de la menthe rendrait ces produits plus attrayants.",
    ],
  },
  {
    id: "all-canadians-not-just-near-pharmacies",
    en: "All Canadians who smoke should have access to NRT nicotine pouches. Not just those who live near pharmacies.",
    fr: "Tous les Canadiens qui fument devraient avoir acces aux sachets de nicotine TRN, pas seulement ceux qui vivent pres des pharmacies.",
    variants: [
      "Access to nicotine pouches should not depend on geography.",
      "All Canadians deserve equal, convenient options to help them quit smoking.",
      "No one should be limited by geography when it comes to quitting smoking.",
      "Access must be consistent across the country.",
      "Quitting smoking should not be easier for some Canadians than others based on location.",
      "Everyone deserves the same opportunity to quit smoking.",
      "Where you live should not determine access to quitting tools.",
      "Equal access matters for all Canadians.",
      "Supporting smoking cessation means these products are within reach for everyone.",
      "Limiting access to pharmacies creates unnecessary barriers.",
      "Access must be practical and widespread-not restricted by geography.",
    ],
    variantsFr: [
      "L'acces aux sachets de nicotine ne devrait pas dependre de l'endroit ou l'on vit.",
      "L'acces aux sachets de nicotine ne devrait pas varier selon la geographie.",
      "L'acces aux sachets de nicotine ne devrait pas etre determine par le lieu de residence.",
      "L'acces aux sachets de nicotine ne devrait pas dependre de la region.",
      "L'acces aux sachets de nicotine ne devrait pas etre inegal selon l'endroit ou l'on habite.",
      "L'acces aux sachets de nicotine ne devrait pas etre limite par la geographie.",
      "L'acces aux sachets de nicotine ne devrait pas dependre du code postal.",
      "L'acces aux sachets de nicotine ne devrait pas varier selon la localisation.",
      "L'acces aux sachets de nicotine ne devrait pas etre dicte par la geographie.",
      "L'acces aux sachets de nicotine ne devrait pas dependre du lieu de residence.",
      "L'acces aux sachets de nicotine ne devrait pas etre influence par la geographie.",
    ],
  },
];

type LetterVariant = {
  id: string;
  en: string;
  fr: string;
};

export const LETTER_OPENINGS: LetterVariant[] = [
  {
    id: "opening-default",
    en: "My name is {name} and I live in the riding of {riding}. I am writing to you as a Canadian who wants better access to nicotine pouches. In 2024, then Minister of Health, made a ministerial order and had them placed behind the counter in Pharmacies. That change made it difficult for all Canadians to access. This makes no sense, when the harmful product is available at every gas station and corner store in the country. For those of us who have used these products as part of that transition, this shift has created confusion, inconsistency, and real barriers to access.",
    fr: "Je m'appelle {name} et je reside dans la circonscription de {riding}. Je vous ecris en tant que Canadien souhaitant un meilleur acces aux sachets de nicotine. En 2024, le ministre de la Sante de l'epoque a pris un arrete ministeriel qui a relegue ces produits derriere le comptoir des pharmacies. Ce changement a rendu leur acces difficile pour l'ensemble des Canadiens. Cela n'a pas de sens, surtout lorsque le produit le plus nocif est disponible dans presque toutes les stations-service et depanneurs du pays. Pour ceux d'entre nous qui utilisent ces produits dans le cadre d'une transition loin du tabagisme, ce changement a cree de la confusion, de l'incoherence et de veritables obstacles a l'acces.",
  },
];

export const LETTER_CLOSINGS: LetterVariant[] = [
  {
    id: "closing-default",
    en: "I am asking you to reconsider this approach, not to expand access without limits, but to ensure that adult Canadians have reasonable, regulated access to lower-risk alternatives. I am asking that you remove the ministerial order immediately and allow Canadians to access non risk products specifically nicotine pouches, everywhere cigarettes and other nicotine products are sold.",
    fr: "Je vous demande de reconsiderer cette approche, non pas pour elargir l'acces sans limites, mais pour garantir que les Canadiens adultes aient un acces raisonnable et reglemente a des solutions a moindre risque. Je vous demande de retirer immediatement l'arrete ministeriel et de permettre aux Canadiens d'acceder a des produits a faible risque, en particulier les sachets de nicotine, partout ou les cigarettes et autres produits contenant de la nicotine sont vendus.",
  },
];

export const LETTER_ENDINGS: LetterVariant[] = [
  { id: "best-regards", en: "Best regards", fr: "Meilleures salutations" },
  { id: "kind-regards", en: "Kind regards", fr: "Cordialement" },
  { id: "warm-regards", en: "Warm regards", fr: "Salutations chaleureuses" },
  { id: "yours-truly", en: "Yours truly", fr: "Je vous prie d'agreer, l'expression de mes salutations distinguees" },
  { id: "yours-faithfully", en: "Yours faithfully", fr: "Veuillez agreer, l'expression de mes salutations respectueuses" },
  { id: "with-appreciation", en: "With appreciation", fr: "Avec reconnaissance" },
  { id: "best-wishes", en: "Best wishes", fr: "Meilleurs voeux" },
  { id: "warmest-wishes", en: "Warmest wishes", fr: "Voeux les plus chaleureux" },
  { id: "respectfully", en: "Respectfully", fr: "Respectueusement" },
  { id: "cordially", en: "Cordially", fr: "Cordialement" },
  { id: "all-the-best", en: "All the best", fr: "Tout le meilleur" },
  { id: "take-care", en: "Take care", fr: "Prenez soin de vous" },
  { id: "with-gratitude", en: "With gratitude", fr: "Avec gratitude" },
  { id: "cheers", en: "Cheers", fr: "Sante / A votre sante" },
  { id: "many-thanks", en: "Many thanks", fr: "Un grand merci" },
  { id: "with-warmest-regards", en: "With warmest regards", fr: "Avec mes salutations les plus chaleureuses" },
  { id: "yours-sincerely", en: "Yours sincerely", fr: "Je vous prie d'agreer, l'expression de mes salutations sinceres" },
  { id: "looking-forward", en: "Looking forward", fr: "Dans l'attente de" },
  { id: "with-best-regards", en: "With best regards", fr: "Avec mes meilleures salutations" },
  { id: "from", en: "From", fr: "De" },
  { id: "sincerely", en: "Sincerely", fr: "Sincerement" },
];

export const LETTER_SUBJECTS: LetterVariant[] = [
  { id: "subject-1", en: "Give me access to pouches", fr: "Donnez-moi acces aux sachets" },
  { id: "subject-2", en: "Nicotine Pouches should be available where cigarettes are", fr: "Les sachets de nicotine devraient etre disponibles la ou les cigarettes sont vendues" },
  { id: "subject-3", en: "Remove the ministerial order", fr: "Supprimez l'arrete ministeriel" },
  { id: "subject-4", en: "Supporting Canadians Trying to Quit Smoking", fr: "Soutenir les Canadiens qui tentent d'arreter de fumer" },
  { id: "subject-5", en: "Access to Alternatives Should Be Practical", fr: "L'acces aux alternatives doit etre pratique" },
  { id: "subject-6", en: "A Consumer Perspective on Nicotine Policy", fr: "Une perspective de consommateur sur la politique de la nicotine" },
  { id: "subject-7", en: "Concern About Limited Access to Pouches", fr: "Preoccupation concernant l'acces limite aux sachets" },
  { id: "subject-8", en: "Please Make Harm Reduction More Accessible", fr: "Veuillez rendre la reduction des mefaits plus accessible" },
  { id: "subject-9", en: "Please Reconsider Access to Nicotine Alternatives", fr: "Veuillez reconsiderer l'acces aux alternatives a la nicotine" },
  { id: "subject-10", en: "A Practical Concern About Current Regulations", fr: "Une preoccupation pratique concernant la reglementation actuelle" },
  { id: "subject-11", en: "Seeking Fair Access to Lower-Risk Options", fr: "Pour un acces equitable aux options a moindre risque" },
  { id: "subject-12", en: "Why Are Cigarettes Easier to Buy Than Alternatives?", fr: "Pourquoi les cigarettes sont-elles plus faciles a acheter que les alternatives ?" },
  { id: "subject-13", en: "A Small Change That Could Help Many Canadians", fr: "Un petit changement qui pourrait aider de nombreux Canadiens" },
  { id: "subject-14", en: "Constituent Concern: Nicotine Pouch Access", fr: "Preoccupation d'un citoyen : acces aux sachets de nicotine" },
  { id: "subject-15", en: "Real Barriers to Switching Away from Smoking", fr: "De veritables obstacles a la transition hors du tabagisme" },
  { id: "subject-16", en: "Time to Revisit Nicotine Pouch Restrictions?", fr: "Est-il temps de revoir les restrictions sur les sachets de nicotine ?" },
  { id: "subject-17", en: "A Balanced Approach to Nicotine Policy", fr: "Une approche equilibree de la politique sur la nicotine" },
  { id: "subject-18", en: "Request for Review of 2024 Nicotine Policy Changes", fr: "Demande de revision des changements de politique sur la nicotine de 2024" },
  { id: "subject-19", en: "Access to Nicotine Pouches, I want it back", fr: "L'acces aux sachets de nicotine : je veux qu'il soit retabli" },
  { id: "subject-20", en: "A Quick Note on Nicotine Pouch Access in Canada", fr: "Une courte note sur l'acces aux sachets de nicotine au Canada" },
  { id: "subject-21", en: "Barriers to Alternatives: A Concern from A Canadian", fr: "Obstacles aux alternatives : une preoccupation d'un Canadien" },
  { id: "subject-22", en: "Why Are Safer Alternatives Harder to Access?", fr: "Pourquoi les alternatives plus sures sont-elles plus difficiles d'acces ?" },
  { id: "subject-23", en: "Request to Review Nicotine Pouch Restrictions", fr: "Demande de revision des restrictions sur les sachets de nicotine" },
  { id: "subject-24", en: "Concern About Current Nicotine Policy Direction", fr: "Preoccupation concernant l'orientation actuelle de la politique sur la nicotine" },
  { id: "subject-25", en: "Access Matters: A Note from a Canadian Consumer", fr: "L'acces compte : un message d'un consommateur canadien" },
  { id: "subject-26", en: "Making Better Choices Shouldn't Be Harder", fr: "Faire de meilleurs choix ne devrait pas etre plus difficile" },
  { id: "subject-27", en: "Question on Nicotine Pouch Availability", fr: "Question sur la disponibilite des sachets de nicotine" },
  { id: "subject-28", en: "Policy Concern from a Canadian Voter", fr: "Preoccupation politique d'un electeur canadien" },
];

export const PREMIER_SUBJECTS: LetterVariant[] = [
  { id: "premier-subject-1", en: "It’s Easier to Buy Cigarettes Than Quit — That Needs to Change", fr: "Il est plus facile d’acheter des cigarettes que d’arrêter — ça doit changer" },
  { id: "premier-subject-2", en: "Premier: Support Common-Sense Access to Quit-Smoking Tools", fr: "Premier ministre : appuyez un accès de bon sens aux outils pour cesser de fumer" },
  { id: "premier-subject-3", en: "Fix This: Quit Aids Shouldn’t Be Harder to Access Than Cigarettes", fr: "Corrigeons cela : les aides à l’arrêt ne devraient pas être plus difficiles à obtenir que les cigarettes" },
  { id: "premier-subject-4", en: "Time to Reverse a Policy That Hurts Smokers Trying to Quit", fr: "Il est temps de renverser une politique qui nuit à ceux qui veulent arrêter" },
  { id: "premier-subject-5", en: "A Simple Ask: Make Quit-Smoking Options Easier to Access", fr: "Une demande simple : faciliter l’accès aux solutions pour cesser de fumer" },
  { id: "premier-subject-6", en: "Help Us Fix a Policy That Doesn’t Make Sense", fr: "Aidez-nous à corriger une politique qui n’a pas de sens" },
  { id: "premier-subject-7", en: "Premier, Will You Support Access to Lower-Risk Alternatives?", fr: "Premier ministre, appuierez-vous l’accès à des solutions à risque réduit?" },
  { id: "premier-subject-8", en: "Let’s Put Quit-Smoking Tools Back Where Smokers Can Access Them", fr: "Remettons les outils pour cesser de fumer là où les fumeurs peuvent y accéder" },
  { id: "premier-subject-9", en: "This Policy Is Driving People to the Black Market — Let’s Fix It", fr: "Cette politique alimente le marché noir — corrigeons-la" },
  { id: "premier-subject-10", en: "Support Adult Access to Safer Alternatives — It’s Common Sense", fr: "Appuyez l’accès des adultes à des solutions plus sûres — c’est du gros bon sens" },
];

export const SOCIAL_SHARE_OPTIONS: Array<{ id: string; en: string; fr: string }> = [
  {
    id: "share-option-1",
    en: "I just sent a letter to the Minister of Health asking to unlock nicotine pouches from pharmacies. Join me-send yours at unlockthepouch.ca",
    fr: "Je viens d'envoyer une lettre a la ministre de la Sante pour liberer les sachets de nicotine des pharmacies. Joignez-vous a moi : envoyez la votre sur unlockthepouch.ca",
  },
  {
    id: "share-option-2",
    en: "I've written to the Minister of Health to unlock nicotine pouches from pharmacy restrictions. Add your voice: unlockthepouch.ca",
    fr: "J'ai ecrit a la ministre de la Sante pour lever les restrictions sur les sachets de nicotine en pharmacie. Ajoutez votre voix : unlockthepouch.ca",
  },
  {
    id: "share-option-3",
    en: "Sent my letter to the Minister of Health-time to unlock nicotine pouches. Join the movement: unlockthepouch.ca",
    fr: "Lettre envoyee a la ministre de la Sante-il est temps de liberer les sachets de nicotine. Joignez-vous au mouvement : unlockthepouch.ca",
  },
  {
    id: "share-option-4",
    en: "I just told the Minister of Health to unlock nicotine pouches from pharmacies. Your turn: unlockthepouch.ca",
    fr: "Je viens de demander a la ministre de la Sante de liberer les sachets de nicotine des pharmacies. A votre tour : unlockthepouch.ca",
  },
];

function randomPick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getVariantText(variant: LetterVariant, language: CampaignLanguage) {
  return language === "fr" ? variant.fr : variant.en;
}

function replaceTokens(value: string, input: CampaignFormInput) {
  const fullName = `${input.firstName?.trim() ?? ""} ${input.lastName?.trim() ?? ""}`.trim();
  const riding = input.mpRiding?.trim() || input.province?.trim() || "your riding";
  return value.replaceAll("{name}", fullName).replaceAll("{riding}", riding);
}

function getByIdOrRandom(items: LetterVariant[], id?: string) {
  if (id) {
    const found = items.find((item) => item.id === id);
    if (found) return found;
  }
  return randomPick(items);
}

export function selectRandomLetterOptions() {
  const opening = randomPick(LETTER_OPENINGS);
  const closing = randomPick(LETTER_CLOSINGS);
  const ending = randomPick(LETTER_ENDINGS);
  const subject = randomPick(LETTER_SUBJECTS);
  const premierSubject = randomPick(PREMIER_SUBJECTS);

  return {
    openingTemplateId: opening.id,
    closingTemplateId: closing.id,
    endingTemplateId: ending.id,
    subjectLine: subject.en,
    subjectLineFr: subject.fr,
    premierSubjectLine: premierSubject.en,
    premierSubjectLineFr: premierSubject.fr,
    premierSubjectTemplateId: premierSubject.id,
  };
}

export function getTopicById(topicId: string) {
  return TOPICS.find((topic) => topic.id === topicId);
}

export function getImportantTopicById(topicId: string) {
  return IMPORTANT_TOPICS.find((topic) => topic.id === topicId);
}

export function getImportantTopicLabel(topicId: string, language: CampaignLanguage) {
  const topic = getImportantTopicById(topicId);
  if (!topic) return topicId;
  return language === "fr" ? topic.fr : topic.en;
}

export function pickImportantTopicVariant(topicId: string) {
  const topic = getImportantTopicById(topicId);
  if (!topic) return null;
  const variantIndex = Math.floor(Math.random() * topic.variants.length);
  return {
    topicId: topic.id,
    variantId: `${topic.id}:v${variantIndex + 1}`,
    text: topic.variants[variantIndex],
    textFr: topic.variantsFr[variantIndex] ?? topic.variants[variantIndex],
  };
}

export function getDesiredTopicById(topicId: string) {
  return DESIRED_TOPICS.find((topic) => topic.id === topicId);
}

export function getDesiredTopicLabel(topicId: string, language: CampaignLanguage) {
  const topic = getDesiredTopicById(topicId);
  if (!topic) return topicId;
  return language === "fr" ? topic.fr : topic.en;
}

export function pickDesiredTopicVariant(topicId: string) {
  const topic = getDesiredTopicById(topicId);
  if (!topic) return null;
  const variantIndex = Math.floor(Math.random() * topic.variants.length);
  return {
    topicId: topic.id,
    variantId: `${topic.id}:v${variantIndex + 1}`,
    text: topic.variants[variantIndex],
    textFr: topic.variantsFr[variantIndex] ?? topic.variants[variantIndex],
  };
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

  const opening = getByIdOrRandom(LETTER_OPENINGS, input.openingTemplateId);
  const closing = getByIdOrRandom(LETTER_CLOSINGS, input.closingTemplateId);
  const ending = getByIdOrRandom(LETTER_ENDINGS, input.endingTemplateId);

  if (input.language === "fr") {
    return [
      getMinisterGreeting("fr", input.province),
      "",
      replaceTokens(getVariantText(opening, "fr"), input),
      "",
      "Sujets que je souhaite souligner :",
      ...selectedTopics.map((topic, index) => `${index + 1}. ${topic}`),
      "",
      getVariantText(closing, "fr"),
      "",
      `${getVariantText(ending, "fr")},`,
      `${input.firstName} ${input.lastName}`,
      `${input.city}, ${input.province}, ${input.postalCode}`,
      ...(input.mpEmail ? ["", `CC : ${input.mpEmail}`] : []),
    ].join("\n");
  }

  return [
    getMinisterGreeting("en", input.province),
    "",
    replaceTokens(getVariantText(opening, "en"), input),
    "",
    "Topics I want to highlight:",
    ...selectedTopics.map((topic, index) => `${index + 1}. ${topic}`),
    "",
    getVariantText(closing, "en"),
    "",
    `${getVariantText(ending, "en")},`,
    `${input.firstName} ${input.lastName}`,
    `${input.city}, ${input.province}, ${input.postalCode}`,
    ...(input.mpEmail ? ["", `CC: ${input.mpEmail}`] : []),
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
    importantTopicIds: input.importantTopicIds,
    importantTopicVariantIds: input.importantTopicVariantIds,
    desiredTopicIds: input.desiredTopicIds,
    desiredTopicVariantIds: input.desiredTopicVariantIds,
    mpEmail: input.mpEmail?.trim() || undefined,
    mpName: input.mpName?.trim() || undefined,
    mpRiding: input.mpRiding?.trim() || undefined,
    subjectLine: input.subjectLine?.trim() || undefined,
    premierSubjectLine: input.premierSubjectLine?.trim() || undefined,
    openingTemplateId: input.openingTemplateId?.trim() || undefined,
    closingTemplateId: input.closingTemplateId?.trim() || undefined,
    endingTemplateId: input.endingTemplateId?.trim() || undefined,
    letterBody: input.ministerLetterBody ?? letterBody,
    mpLetterBody: input.mpLetterBody?.trim() || undefined,
    premierLetterBody: input.premierLetterBody,
    ministerEmail: input.ministerEmail?.trim() || MINISTER_EMAIL,
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
