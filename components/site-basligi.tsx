import Link from "next/link";
import { site } from "@/lib/site";

export function SiteBasligi() {
  return (
    <header className="relative z-20 border-b border-cizgi bg-krem">
      <div className="mx-auto grid max-w-6xl grid-cols-[1fr_auto_1fr] items-center gap-4 px-5 py-4 md:px-10">
        <nav aria-label="Bölümler" className="etiket flex gap-4 text-solgun">
          <Link href="/isletme" className="hover:text-cam">
            İşletmeyim
          </Link>
          <Link href="/gezgin" className="hidden hover:text-terra sm:inline">
            Gezginim
          </Link>
        </nav>

        <Link href="/" className="whitespace-nowrap text-center text-lg tracking-tight">
          Sürdürülebilir&nbsp;Turizm
        </Link>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/araclar/karbon-ayak-izi"
            className="etiket rounded-sm bg-cam px-3.5 py-2 text-krem transition-opacity hover:opacity-90"
          >
            Ayak izini ölç
          </Link>
          <a
            href={site.linkedin}
            target="_blank"
            rel="noreferrer"
            className="etiket hidden text-solgun hover:text-cam md:inline"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </header>
  );
}
