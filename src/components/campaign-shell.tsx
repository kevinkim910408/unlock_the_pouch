import Link from "next/link";
import { ReactNode } from "react";
import Text from "@/components/text";

type Props = { title: string; subtitle?: string; children: ReactNode };

export default function CampaignShell({ title, subtitle, children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="font-semibold tracking-wide text-teal-700">
          <Text
            as="span"
            size="xs"
            className="font-semibold tracking-wide text-teal-700"
          >
            Unlock the Pouch
          </Text>
        </Link>
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <Text
          as="h1"
          size="md"
          className="font-bold tracking-tight text-slate-900"
        >
          {title}
        </Text>
        {subtitle ? (
          <Text as="p" size="xs" className="mt-2 text-slate-600">
            {subtitle}
          </Text>
        ) : null}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
