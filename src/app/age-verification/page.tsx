import Text from "@/components/text";
import Image from "next/image";

export default function AgeVerificationPage() {
  return (
    <main className="min-h-screen w-full bg-[#111316]">
      <section className="mx-auto flex min-h-screen w-full max-w-[1536px] items-center px-6 py-10 sm:px-10 md:px-20 lg:px-28">
        <div className="w-full max-w-[900px]">
          <div className="relative h-16 w-56 sm:h-20 sm:w-72 md:h-24 md:w-80">
            <Image
              src="/Logo.svg"
              alt="Logo"
              fill
              className="object-contain object-left"
            />
          </div>
          <Text
            as="p"
            size="xl"
            className="mt-8 font-black uppercase tracking-tight text-[#67b8e6]"
          >
            Unlock the <br /> Pouch
          </Text>
          <Text
            as="p"
            size="md"
            className="mt-4 font-black uppercase text-white"
          >
            DÉVERROUILLEZ LE SACHET
          </Text>
          <Text
            as="p"
            size="md"
            className="mt-10 font-extrabold uppercase text-white"
          >
            Age Verification <br /> Vérification de l&apos;âge
          </Text>
          <Text as="p" size="sm" className="mt-8 uppercase text-white">
            You must be at least 18+ to enter this site <br /> Vous devez avoir
            au moins 18 ans pour entrer sur ce site
          </Text>
          <div className="mt-10 flex flex-wrap gap-5">
            <a
              href="https://www.google.com"
              className="t-4 inline-flex min-w-[210px] items-center justify-center bg-[#67b8e6] px-8 py-2 font-bold uppercase tracking-wide text-white transition hover:bg-[#59aad9]"
            >
              <Text
                as="span"
                size="sm"
                className="font-bold uppercase tracking-wide text-white"
              >
                Leave / Partir
              </Text>
            </a>
            <a
              href="/api/age-verify"
              className="t-4 inline-flex min-w-[210px] items-center justify-center bg-[#67b8e6] px-8 py-2 font-bold uppercase tracking-wide text-white transition hover:bg-[#59aad9]"
            >
              <Text
                as="span"
                size="sm"
                className="font-bold uppercase tracking-wide text-white"
              >
                Enter / Entrer
              </Text>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
