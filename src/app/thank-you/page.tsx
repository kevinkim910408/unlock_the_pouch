"use client";

import Text from "@/components/text";
import { CampaignLanguage } from "@/types/campaign";
import { useMemo, useState } from "react";

const SHARE_OPTIONS = {
  en: [
    "I just sent a letter to the Minister of Health asking to unlock nicotine pouches from pharmacies. Join me-send yours at unlockthepouch.ca",
    "I've written to the Minister of Health to unlock nicotine pouches from pharmacy restrictions. Add your voice: unlockthepouch.ca",
    "Sent my letter to the Minister of Health-time to unlock nicotine pouches. Join the movement: unlockthepouch.ca",
    "I just told the Minister of Health to unlock nicotine pouches from pharmacies. Your turn: unlockthepouch.ca",
  ],
  fr: [
    "Je viens d'envoyer une lettre a la ministre de la Sante pour liberer les sachets de nicotine des pharmacies. Joignez-vous a moi : envoyez la votre sur unlockthepouch.ca",
    "J'ai ecrit a la ministre de la Sante pour lever les restrictions sur les sachets de nicotine en pharmacie. Ajoutez votre voix : unlockthepouch.ca",
    "Lettre envoyee a la ministre de la Sante-il est temps de liberer les sachets de nicotine. Joignez-vous au mouvement : unlockthepouch.ca",
    "Je viens de demander a la ministre de la Sante de liberer les sachets de nicotine des pharmacies. A votre tour : unlockthepouch.ca",
  ],
} as const;

const COPY = {
  en: {
    title: "Thank You",
    body: "Thank you for stepping up and making your voice heard. By writing to Minister of Health Marjorie Michel, you've taken real action, calling on the federal government to reverse the ministerial order and unlock access to nicotine pouches where cigarettes are already sold. This is how change happens. When Canadians speak up, it sends a clear message: access to lower-risk alternatives matters. At R4V, we're building momentum, and we're not slowing down. We will keep pushing until Canadians have reasonable, regulated access to safer options. You're part of that movement now.",
    shareTitle: "Share on socials",
    shareX: "Share on X",
    shareFb: "Share on FB",
  },
  fr: {
    title: "Merci",
    body: "Merci d'avoir pris position et fait entendre votre voix. En ecrivant a Marjorie Michel, ministre de la Sante, vous avez pose un geste concret en demandant au gouvernement federal de renverser l'arrete ministeriel et de retablir l'acces aux sachets de nicotine la ou les cigarettes sont deja vendues. C'est ainsi que le changement se produit. Lorsque les Canadiens s'expriment, cela envoie un message clair : l'acces a des solutions a risque reduit est important. Chez Rights 4 Vapers (R4V), nous prenons de l'elan et nous ne ralentissons pas. Nous continuerons de faire pression jusqu'a ce que les Canadiens aient un acces raisonnable et reglemente a des options plus sures. Vous faites maintenant partie de ce mouvement.",
    shareTitle: "Partager sur les reseaux",
    shareX: "Partager sur X",
    shareFb: "Partager sur FB",
  },
} as const;

function getLanguage(): CampaignLanguage {
  if (typeof window === "undefined") return "en";
  const rawFormInfo = localStorage.getItem("campaign-form-info");
  if (rawFormInfo) {
    try {
      const parsed = JSON.parse(rawFormInfo) as { language?: CampaignLanguage };
      return parsed.language === "fr" ? "fr" : "en";
    } catch {
      return "en";
    }
  }
  return "en";
}

function randomShare(language: CampaignLanguage) {
  const list = SHARE_OPTIONS[language];
  return list[Math.floor(Math.random() * list.length)];
}

export default function ThankYouPage() {
  const [language] = useState<CampaignLanguage>(getLanguage);
  const t = COPY[language];
  const shareUrl = "https://unlockthepouch.ca";

  const body = useMemo(() => t.body, [t.body]);

  function handleShareX() {
    const message = randomShare(language);
    const url = `https://x.com/intent/tweet?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleShareFb() {
    const message = randomShare(language);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      shareUrl,
    )}&quote=${encodeURIComponent(message)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <main className="relative min-h-[calc(100vh-112px)] overflow-hidden bg-[#121722]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#27344f_0%,#121722_55%)]" />
      <div className="absolute inset-0 bg-black/45" />

      <section className="relative mx-auto w-full max-w-[1200px] px-5 py-10 text-white md:px-8 md:py-14">
        <Text
          as="h1"
          size="lg"
          className="font-black uppercase leading-[0.92] text-[#59b0df]"
        >
          {t.title}
        </Text>
        <Text as="p" size="md" className="mt-4 max-w-[1050px] font-bold leading-[1.35]">
          {body}
        </Text>

        <div className="mt-8">
          <Text as="p" size="sm" className="mb-3 font-bold text-white">
            {t.shareTitle}
          </Text>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleShareX}
              className="h-12 min-w-[150px] bg-[#59b0df] px-5 uppercase text-white"
            >
              <Text as="span" size="xs" className="font-black uppercase text-white">
                {t.shareX}
              </Text>
            </button>
            <button
              type="button"
              onClick={handleShareFb}
              className="h-12 min-w-[150px] bg-[#59b0df] px-5 uppercase text-white"
            >
              <Text as="span" size="xs" className="font-black uppercase text-white">
                {t.shareFb}
              </Text>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
