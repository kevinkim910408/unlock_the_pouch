import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

export const metadata: Metadata = {
  title: "Unlock the Pouch",
  description: "Campaign letter generation site",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
