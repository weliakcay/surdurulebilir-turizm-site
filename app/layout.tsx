import type { Metadata, Viewport } from "next";
import { Newsreader, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { SiteBasligi } from "@/components/site-basligi";
import { SiteAltligi } from "@/components/site-altligi";

/*
  Tipografi kilitli → 01-marka/marka-kimligi.md
  latin-ext ZORUNLU: Türkçe ğ Ğ ı İ ş Ş ç Ç ö Ö ü Ü.
  İkisi de gerçek dizgiyle test edildi, İ/ı ayrımı doğru.
*/
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono-jb",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.ad} — dünyada işe yarayan uygulamalar, Türkiye'de karşılığı`,
    template: `%s · ${site.ad}`,
  },
  description: site.aciklama,
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: site.ad,
    title: site.ad,
    description: site.aciklama,
    url: site.url,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f4eee5" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" className={`${newsreader.variable} ${mono.variable}`}>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#icerik"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded focus:bg-cam focus:px-4 focus:py-2 focus:text-krem"
        >
          İçeriğe geç
        </a>
        <SiteBasligi />
        <main id="icerik" className="flex-1">
          {children}
        </main>
        <SiteAltligi />
      </body>
    </html>
  );
}
