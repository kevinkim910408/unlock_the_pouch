import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export default function CampaignShell({ title, subtitle, children }: Props) {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-6 py-10 md:px-10">
      <div className="mb-8 flex items-center justify-between">
        <Link href="/" className="text-sm font-semibold tracking-wide text-teal-700">
          Unlock the Pouch
        </Link>
        <Link
          href="/print"
          className="rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-700 hover:bg-slate-100"
        >
          Print Dashboard
        </Link>
      </div>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          {title}
        </h1>
        {subtitle ? <p className="mt-2 text-sm text-slate-600">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
      </section>
    </main>
  );
}
