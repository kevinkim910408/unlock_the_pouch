export default function ThankYouPage() {
  return (
    <main className="relative min-h-[calc(100vh-112px)] overflow-hidden bg-[#121722]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,#27344f_0%,#121722_55%)]" />
      <div className="absolute inset-0 bg-black/45" />

      <section className="relative mx-auto w-full max-w-[1200px] px-5 py-10 text-white md:px-8 md:py-14">
        <h1 className="text-[74px] font-black uppercase leading-[0.92] text-[#59b0df] md:text-[96px]">
          Thank You
        </h1>
        <p className="mt-4 max-w-[1050px] text-[20px] font-bold leading-[1.35] md:text-[44px]">
          Thank you for sharing your thoughts with government representatives and your
          MP. You are not alone, there have been{" "}
          <span className="text-[#59b0df]">999,999</span> Canadians who support this
          movement and used this platform to make their voices heard.
        </p>

        <h2 className="mt-10 text-[74px] font-black uppercase leading-[0.92] text-[#59b0df] md:text-[96px]">
          Merci
        </h2>
        <p className="mt-4 max-w-[1050px] text-[20px] font-bold leading-[1.35] md:text-[44px]">
          Merci d&apos;avoir partage vos pensees. Vous n&apos;etes pas seul, il y a eu{" "}
          <span className="text-[#59b0df]">999,999</span> Canadiens qui ont utilise cette
          plateforme pour faire entendre leur voix.
        </p>

        <div className="mt-10 max-w-[760px]">
          <p className="mb-3 text-[18px] font-bold md:text-[28px]">
            Sign me up for the Rights4Vapers newsletters and updates
          </p>
          <div className="flex flex-wrap gap-3">
            <input
              type="email"
              placeholder="test@gmail.com"
              className="h-12 min-w-[320px] flex-1 border border-white/40 bg-white px-3 text-sm text-[#333] md:h-14 md:text-base"
            />
            <button
              type="button"
              className="h-12 min-w-[170px] bg-[#59b0df] px-6 text-sm font-black uppercase text-white md:h-14 md:text-base"
            >
              Submit
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
