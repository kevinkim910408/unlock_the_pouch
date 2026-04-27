import Text from "@/components/text";

export default function ThankYouPage() {
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
          Thank You
        </Text>
        <Text
          as="p"
          size="md"
          className="mt-4 max-w-[1050px] font-bold leading-[1.35]"
        >
          Thank you for sharing your thoughts with government representatives
          and your MP. You are not alone, there have been{" "}
          <Text as="span" size="md" className="font-bold text-[#59b0df]">
            999,999
          </Text>{" "}
          Canadians who support this movement and used this platform to make
          their voices heard.
        </Text>

        <Text
          as="h2"
          size="lg"
          className="mt-10 font-black uppercase leading-[0.92] text-[#59b0df]"
        >
          Merci
        </Text>
        <Text
          as="p"
          size="md"
          className="mt-4 max-w-[1050px] font-bold leading-[1.35]"
        >
          Merci d&apos;avoir partage vos pensees. Vous n&apos;etes pas seul, il
          y a eu{" "}
          <Text as="span" size="md" className="font-bold text-[#59b0df]">
            999,999
          </Text>{" "}
          Canadiens qui ont utilise cette plateforme pour faire entendre leur
          voix.
        </Text>

        <div className="mt-10 max-w-[760px]">
          <Text as="p" size="sm" className="mb-3 font-bold">
            Sign me up for the Rights4Vapers newsletters and updates
          </Text>
          <div className="flex flex-wrap gap-3">
            <input
              type="email"
              placeholder="test@gmail.com"
              className="h-12 min-w-[320px] flex-1 border border-white/40 bg-white px-3 text-[#333] md:h-14"
            />
            <button
              type="button"
              className="h-12 min-w-[170px] bg-[#59b0df] px-6 uppercase text-white md:h-14"
            >
              <Text
                as="span"
                size="xs"
                className="font-black uppercase text-white"
              >
                Submit
              </Text>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
