export type TermsLang = "en" | "fr";

export const TERMS_TEXT: Record<TermsLang, string> = {
  en: `
These terms and conditions govern your use of the survey website and its services provided by Rights 4 Vapers, hereinafter referred to as "the Website."

By accessing or using the Website, you agree to be bound by these terms and conditions. If you disagree with any part of these terms and conditions, you may not access the Website.

1. User Consent
1.1. By providing your email address and participating in surveys on the Website, you consent to the collection, use, and disclosure of your personal information in accordance with our Privacy Policy.

2. Collection and Use of Information
2.1. The Website collects email addresses for the purpose of sending letters on your behalf to the government.

3. Protection of Personal Information
3.1. We are committed to protecting the privacy and security of your personal information. Please refer to our Privacy Policy for details on how we collect, use, and protect your personal information.

4. Email Communications
4.1. By providing your email address, you may opt into receiving newsletters from Rights 4 Vapers. We will not communicate, spread, publish, or otherwise give away your address.
4.2. You may opt out of receiving email communications at any time by following the unsubscribe instructions provided in the emails.

5. Intellectual Property
5.1. All content, including surveys, questions, text, graphics, images, and software, provided on the Website is the property of Rights 4 Vapers and is protected by copyright and other intellectual property laws.
5.2. You may not modify, reproduce, distribute, or republish any content from the Website without prior written permission from Rights 4 Vapers.

6. Limitation of Liability
6.1. The Website and its services are provided on an "as is" and "as available" basis without any warranties, express or implied.
6.2. Rights 4 Vapers shall not be liable for any direct, indirect, incidental, special, or consequential damages arising out of or in any way connected with your use of the Website or its services.

7. Changes to Terms and Conditions
7.1. Rights 4 Vapers reserves the right to modify or replace these terms and conditions at any time. Your continued use of the Website following the posting of any changes constitutes acceptance of those changes.

8. Governing Law
8.1. These terms and conditions shall be governed by and construed in accordance with the laws of Canada, without regard to its conflict of law provisions.

9. Contact Us
9.1. If you have any questions about these terms and conditions, please contact us at info@rights4vapers.com.

By using the Website, you acknowledge that you have read, understood, and agree to be bound by these terms and conditions. If you do not agree to these terms and conditions, you may not use the Website.
`.trim(),
  fr: `
Ces conditions d'utilisation regissent votre utilisation du site Web de sondage et de ses services fournis par Rights 4 Vapers, ci-apres denomme "le Site Web".

En accedant ou en utilisant le Site Web, vous acceptez d'etre lie par ces conditions d'utilisation. Si vous n'etes pas d'accord avec une partie de ces conditions d'utilisation, vous ne pouvez pas acceder au Site Web.

1. Consentement de l'utilisateur
1.1. En fournissant votre adresse e-mail et en participant aux sondages sur le Site Web, vous consentez a la collecte, a l'utilisation et a la divulgation de vos informations personnelles conformement a notre Politique de confidentialite.

2. Collecte et utilisation des informations
2.1. Le Site Web collecte des adresses e-mail dans le but d'envoyer des lettres en votre nom au gouvernement.

3. Protection des informations personnelles
3.1. Nous nous engageons a proteger la confidentialite et la securite de vos informations personnelles. Veuillez vous referer a notre Politique de confidentialite pour plus de details sur la maniere dont nous collectons, utilisons et protegeons vos informations personnelles.

4. Communications par e-mail
4.1. En fournissant votre adresse e-mail, vous pouvez choisir de recevoir des newsletters de Rights 4 Vapers. Nous ne communiquerons pas, ne diffuserons pas ou ne divulguerons pas autrement votre adresse.
4.2. Vous pouvez choisir de ne plus recevoir de communications par e-mail a tout moment en suivant les instructions de desabonnement fournies dans les e-mails.

5. Propriete intellectuelle
5.1. Tout le contenu, y compris les sondages, les questions, le texte, les graphiques, les images et les logiciels, fourni sur le Site Web est la propriete de Rights 4 Vapers et est protege par les lois sur le droit d'auteur et autres lois sur la propriete intellectuelle.
5.2. Vous ne pouvez pas modifier, reproduire, distribuer ou republier tout contenu du Site Web sans l'autorisation ecrite prealable de Rights 4 Vapers.

6. Limitation de responsabilite
6.1. Le Site Web et ses services sont fournis "tels quels" et "selon disponibilite" sans aucune garantie, expresse ou implicite.
6.2. Rights 4 Vapers ne sera pas responsable de tout dommage direct, indirect, accessoire, special ou consecutif decoulant de votre utilisation du Site Web ou de ses services.

7. Modifications des conditions d'utilisation
7.1. Rights 4 Vapers se reserve le droit de modifier ou de remplacer ces conditions d'utilisation a tout moment. Votre utilisation continue du Site Web apres la publication de tout changement constitue une acceptation de ces changements.

8. Loi applicable
8.1. Ces conditions d'utilisation seront regies et interpretees conformement aux lois du Canada, sans egard a ses principes de conflits de lois.

9. Contactez-nous
9.1. Si vous avez des questions concernant ces conditions d'utilisation, veuillez nous contacter a l'adresse info@rights4vapers.com.

En utilisant le Site Web, vous reconnaissez avoir lu, compris et accepte d'etre lie par ces conditions d'utilisation. Si vous n'acceptez pas ces conditions d'utilisation, vous ne pouvez pas utiliser le Site Web.
`.trim(),
};

export const splitTermsParagraphs = (text: string): string[] =>
  text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

