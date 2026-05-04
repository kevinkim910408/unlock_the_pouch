import type { Metadata } from "next";
import SiteChrome from "@/components/site-chrome";
import "./globals.css";

const siteUrl = "https://www.unlockthepouch.ca";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Unlock the Pouch",
  description: "Campaign letter generation site",
  icons: {
    icon: "/Logo.svg",
    shortcut: "/Logo.svg",
  },
  openGraph: {
    title: "Unlock the Pouch",
    description: "Campaign letter generation site",
    url: siteUrl,
    siteName: "Unlock the Pouch",
    type: "website",
    images: [
      {
        url: "/og_img.jpg",
        alt: "Unlock the Pouch",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Unlock the Pouch",
    description: "Campaign letter generation site",
    images: ["/og_img.jpg"],
  },
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
