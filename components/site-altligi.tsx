import Link from "next/link";
import { site } from "@/lib/site";

export function SiteAltligi() {
  return (
    <footer className="relative border-t border-cizgi bg-krem">
      <div className="izgara" />
      <div className="relative mx-auto max-w-6xl px-5 py-12 md:px-10">
        <p className="max-w-md text-[1.05rem] leading-relaxed text-solgun">
          Dünyada işe yarayan sürdürülebilir turizm uygulamalarını aktarıyor, her birinin
          Türkiye'de hangi koşullarda hayata geçebileceğini yazıyoruz.
        </p>

        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div>
            <div className="etiket text-terra">Araçlar</div>
            <ul className="mt-3 space-y-1.5 text-sm text-solgun">
              <li>
                <Link href="/araclar/karbon-ayak-izi" className="hover:text-cam">
                  Karbon ayak izi
                </Link>
              </li>
              <li>
                <Link href="/araclar/sertifika-taramasi" className="hover:text-cam">
                  Sertifika taraması
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="etiket text-terra">Yayın</div>
            <ul className="mt-3 space-y-1.5 text-sm text-solgun">
              <li>
                <Link href="/hakkinda" className="hover:text-cam">
                  Hakkında
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="hover:text-cam">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/gizlilik-politikasi" className="hover:text-cam">
                  Gizlilik Politikası
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="etiket text-terra">Takip</div>
            <ul className="mt-3 space-y-1.5 text-sm text-solgun">
              <li>
                <a href={site.linkedin} target="_blank" rel="noreferrer" className="hover:text-cam">
                  LinkedIn
                </a>
              </li>
            </ul>
          </div>
        </div>

        <p className="etiket mt-10 text-solgun">
          © {new Date().getFullYear()} {site.ad} — haberlerde kaynak gösterilir
        </p>
      </div>
    </footer>
  );
}
