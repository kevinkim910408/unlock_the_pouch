type Lang = "en" | "fr";
type PrivacyPolicyPageProps = { searchParams: Promise<{ lang?: string }> };

const CONTENT: Record<
  Lang,
  {
    title: string;
    lastUpdatedLabel: string;
    lastUpdatedDate: string;
    sections: Array<{
      title: string;
      body: string[];
      bullets?: string[];
      subSections?: Array<{
        title: string;
        body: string[];
        bullets?: string[];
      }>;
    }>;
  }
> = {
  en: {
    title: "Privacy Policy",
    lastUpdatedLabel: "Last updated:",
    lastUpdatedDate: "May 1, 2026",
    sections: [
      {
        title: "1. Introduction",
        body: [
          "We at Rights4Vapers (\"we,\" \"us,\" or \"our\") respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and disclose information when you visit our website, use our letter-generation services, register for an account, or otherwise interact with us. By using our service or providing your personal information, you consent to the terms of this policy.",
        ],
      },
      {
        title: "2. Information We Collect",
        body: [],
        subSections: [
          {
            title: "a. Information You Provide Directly",
            body: ["When you use our service, you may provide us with information such as:"],
            bullets: [
              "Contact details (name, email address, address) when you register, use our service, or sign up to our mailing list.",
              "Letter-generation details, content inputs, and topic selections.",
              "Communications such as email messages or support requests you send us.",
            ],
          },
          {
            title: "b. Automatically Collected Information",
            body: ["When you visit or use our website, we may automatically collect:"],
            bullets: [
              "Usage and browsing data such as pages visited, time spent, referring sites, and navigation paths.",
              "Technical data such as device type, browser version, IP address, operating system, and other diagnostic information.",
            ],
          },
          {
            title: "c. Cookies & Tracking Technologies",
            body: [
              "We may use cookies or similar technologies to store preferences, enable features (such as remembering your letter progress), and analyse website traffic. You can adjust your browser settings to refuse cookies, though some site features may not function properly as a result.",
            ],
          },
        ],
      },
      {
        title: "3. How We Use Your Information",
        body: ["We use collected information to:"],
        bullets: [
          "Provide and operate our letter-generation service.",
          "Send newsletters or campaign updates if you have subscribed to our mailing list.",
          "Communicate important updates or responses to inquiries.",
          "Improve website functionality, security, and performance.",
          "Comply with legal or regulatory obligations.",
        ],
      },
      {
        title: "4. When We Share Information",
        body: ["We may share your information in these limited situations:"],
        bullets: [
          "Service Providers: With trusted third-party vendors that help us operate our website (e.g., hosting, analytics, email delivery). They are bound by confidentiality agreements and may only use your data as directed by us.",
          "Legal Requirements: If required by law, subpoena, or legal process.",
          "With Your Consent: When you explicitly agree to share data for a specific purpose.",
        ],
      },
      {
        title: "5. Data Retention",
        body: [
          "We retain your personal information only for as long as necessary to fulfill the purposes outlined in this policy or as required by law. If you unsubscribe from our mailing list or request deletion, your data will be permanently removed from our active systems.",
        ],
      },
      {
        title: "6. Data Security",
        body: [
          "We use reasonable technical and organizational measures to safeguard your personal information from unauthorized access, disclosure, alteration, or destruction. However, no data transmission over the internet can be guaranteed to be 100% secure.",
        ],
      },
      {
        title: "7. Links to Other Websites",
        body: [
          "Our website may contain links to external websites. We are not responsible for the privacy practices or content of those websites and encourage you to review their privacy policies.",
        ],
      },
      {
        title: "8. Your Rights and Choices",
        body: ["You may:"],
        bullets: [
          "Access or correct personal information we hold about you.",
          "Withdraw consent for communications (unsubscribe).",
          "Request deletion of your personal information.",
        ],
      },
      {
        title: "9. Children's Privacy",
        body: [
          "Our services are intended for adult users (18+ or the legal age of majority in your province). We do not knowingly collect personal information from minors. If we become aware that we have inadvertently collected data from a minor, it will be deleted promptly.",
        ],
      },
      {
        title: "10. Updates to This Policy",
        body: [
          "We may update this Privacy Policy from time to time. Any updates will be posted on this page with the revised \"Last updated\" date.",
        ],
      },
      {
        title: "11. Contact Us",
        body: [
          "Rights4Vapers",
          "Email: info@rights4vapers.com",
          "Website: www.rights4vapers.com",
          "Canada",
        ],
      },
    ],
  },
  fr: {
    title: "Politique de confidentialite",
    lastUpdatedLabel: "Derniere mise a jour :",
    lastUpdatedDate: "1 mai 2026",
    sections: [
      {
        title: "1. Introduction",
        body: [
          "Chez Rights4Vapers (\"nous\", \"notre\"), nous respectons votre vie privee et nous engageons a proteger vos renseignements personnels. Cette Politique de confidentialite explique comment nous recueillons, utilisons, conservons et communiquons les renseignements lorsque vous visitez notre site Web, utilisez nos services de generation de lettres, creez un compte ou interagissez autrement avec nous. En utilisant notre service ou en fournissant vos renseignements personnels, vous acceptez les conditions de cette politique.",
        ],
      },
      {
        title: "2. Renseignements que nous recueillons",
        body: [],
        subSections: [
          {
            title: "a. Renseignements fournis directement",
            body: ["Lorsque vous utilisez notre service, vous pouvez nous fournir des renseignements tels que :"],
            bullets: [
              "Coordonnees (nom, courriel, adresse) lorsque vous vous inscrivez, utilisez notre service ou vous abonnez a notre liste d'envoi.",
              "Renseignements lies a la generation de lettres, contenus saisis et sujets choisis.",
              "Communications comme les courriels ou demandes de soutien que vous nous envoyez.",
            ],
          },
          {
            title: "b. Renseignements recueillis automatiquement",
            body: ["Lorsque vous visitez ou utilisez notre site Web, nous pouvons recueillir automatiquement :"],
            bullets: [
              "Donnees d'utilisation et de navigation (pages visitees, temps passe, sites referents et parcours de navigation).",
              "Donnees techniques (type d'appareil, version du navigateur, adresse IP, systeme d'exploitation et autres renseignements de diagnostic).",
            ],
          },
          {
            title: "c. Temoins et technologies de suivi",
            body: [
              "Nous pouvons utiliser des temoins (cookies) ou des technologies similaires pour enregistrer des preferences, activer des fonctionnalites (comme la memorisation de votre progression) et analyser le trafic du site. Vous pouvez configurer votre navigateur pour refuser les temoins, mais certaines fonctions du site pourraient ne pas fonctionner correctement.",
            ],
          },
        ],
      },
      {
        title: "3. Utilisation de vos renseignements",
        body: ["Nous utilisons les renseignements recueillis pour :"],
        bullets: [
          "Fournir et exploiter notre service de generation de lettres.",
          "Envoyer des infolettres ou des mises a jour de campagne si vous y etes abonne.",
          "Communiquer des mises a jour importantes ou repondre a vos demandes.",
          "Ameliorer le fonctionnement, la securite et la performance du site.",
          "Respecter les obligations legales et reglementaires.",
        ],
      },
      {
        title: "4. Cas ou nous partageons des renseignements",
        body: ["Nous pouvons partager vos renseignements dans les situations limitees suivantes :"],
        bullets: [
          "Fournisseurs de services : avec des tiers de confiance qui nous aident a exploiter notre site (hebergement, analyses, envoi de courriels). Ils sont tenus a la confidentialite et ne peuvent utiliser vos donnees que selon nos directives.",
          "Exigences legales : si la loi, une assignation ou une procedure legale l'exige.",
          "Avec votre consentement : lorsque vous acceptez explicitement un partage pour une fin precise.",
        ],
      },
      {
        title: "5. Conservation des donnees",
        body: [
          "Nous conservons vos renseignements personnels seulement pendant la duree necessaire aux fins decrites dans cette politique ou selon les exigences de la loi. Si vous vous desabonnez de notre liste d'envoi ou demandez la suppression, vos donnees seront retirees de nos systemes actifs.",
        ],
      },
      {
        title: "6. Securite des donnees",
        body: [
          "Nous mettons en place des mesures techniques et organisationnelles raisonnables pour proteger vos renseignements personnels contre l'acces non autorise, la divulgation, la modification ou la destruction. Toutefois, aucune transmission de donnees sur Internet ne peut etre garantie a 100 %.",
        ],
      },
      {
        title: "7. Liens vers d'autres sites",
        body: [
          "Notre site peut contenir des liens vers des sites externes. Nous ne sommes pas responsables de leurs pratiques ou de leur contenu en matiere de confidentialite et vous encourageons a consulter leurs politiques.",
        ],
      },
      {
        title: "8. Vos droits et vos choix",
        body: ["Vous pouvez :"],
        bullets: [
          "Acceder aux renseignements personnels que nous detenons a votre sujet ou les corriger.",
          "Retirer votre consentement aux communications (desabonnement).",
          "Demander la suppression de vos renseignements personnels.",
        ],
      },
      {
        title: "9. Confidentialite des enfants",
        body: [
          "Nos services sont destines aux adultes (18 ans et plus ou l'age legal de la majorite dans votre province). Nous ne recueillons pas sciemment de renseignements personnels sur des mineurs. Si nous apprenons que de telles donnees ont ete recueillies par inadvertance, elles seront supprimees rapidement.",
        ],
      },
      {
        title: "10. Mises a jour de cette politique",
        body: [
          "Nous pouvons modifier cette Politique de confidentialite de temps a autre. Toute mise a jour sera affichee sur cette page avec la nouvelle date de mise a jour.",
        ],
      },
      {
        title: "11. Nous joindre",
        body: [
          "Rights4Vapers",
          "Courriel : info@rights4vapers.com",
          "Site Web : www.rights4vapers.com",
          "Canada",
        ],
      },
    ],
  },
};

export default async function PrivacyPolicyPage({
  searchParams,
}: PrivacyPolicyPageProps) {
  const params = await searchParams;
  const lang: Lang = params.lang === "fr" ? "fr" : "en";
  const copy = CONTENT[lang];

  return (
    <div className="min-h-screen bg-white">
      <main className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <h1 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
          {copy.title}
        </h1>
        <p className="mb-8 text-sm text-gray-600">
          {copy.lastUpdatedLabel} {copy.lastUpdatedDate}
        </p>

        {copy.sections.map((section) => (
          <section key={section.title} className="mb-8">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">{section.title}</h2>

            {section.body.map((paragraph) => (
              <p key={paragraph} className="mb-3 leading-relaxed text-gray-700">
                {paragraph}
              </p>
            ))}

            {section.bullets && (
              <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}

            {section.subSections?.map((subSection) => (
              <div key={subSection.title} className="mb-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-800">
                  {subSection.title}
                </h3>
                {subSection.body.map((paragraph) => (
                  <p key={paragraph} className="mb-3 leading-relaxed text-gray-700">
                    {paragraph}
                  </p>
                ))}
                {subSection.bullets && (
                  <ul className="mb-4 ml-6 list-disc space-y-2 text-gray-700">
                    {subSection.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
