export default function AgeVerificationPage() {
  return (
    <main className="min-h-screen w-full bg-[#111316]">
      <section className="mx-auto flex min-h-screen w-full max-w-[1536px] items-center px-6 py-10 sm:px-10 md:px-20 lg:px-28">
        <div className="w-full max-w-[900px]">
          <div className="h-16 w-56 bg-[#d7322d] sm:h-20 sm:w-72 md:h-24 md:w-80" />

          <p className="mt-8 font-['Trebuchet_MS'] text-[56px] font-black uppercase leading-[0.92] tracking-tight text-[#67b8e6] sm:text-[74px] md:text-[112px]">
            Unlock the
            <br />
            Pouch
          </p>

          <p className="mt-4 font-['Trebuchet_MS'] text-[32px] font-black uppercase leading-none text-white sm:text-[46px] md:text-[62px]">
            Déverrouillez la
            <br />
            Pochette
          </p>

          <p className="mt-10 font-['Trebuchet_MS'] text-[34px] font-extrabold uppercase leading-[1.02] text-white sm:text-[40px] md:text-[52px]">
            Age Verification
            <br />
            Vérification de l&apos;âge
          </p>

          <p className="mt-8 font-['Trebuchet_MS'] text-[16px] uppercase leading-[1.25] text-white sm:text-[24px] md:text-[40px]">
            You must be at least 18+ to enter this site
            <br />
            Vous devez avoir au moins 18 ans pour entrer sur ce site
          </p>

          <div className="mt-10 flex flex-wrap gap-5">
            <a
              href="https://www.google.com"
              className="inline-flex min-w-[210px] items-center justify-center bg-[#67b8e6] px-8 py-2 text-base font-bold uppercase tracking-wide text-white transition hover:bg-[#59aad9]"
            >
              Leave / Partir
            </a>
            <a
              href="/api/age-verify"
              className="inline-flex min-w-[210px] items-center justify-center bg-[#67b8e6] px-8 py-2 text-base font-bold uppercase tracking-wide text-white transition hover:bg-[#59aad9]"
            >
              Enter / Entrer
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
