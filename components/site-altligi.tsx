import Link from "next/link";
import { site } from "@/lib/site";
export function SiteAltligi() {
  return (
    <div className="portal">
      <footer>
        <div className="wrap">
          <div className="footer-grid">
            <div>
              <Link className="wordmark" href="/">
                Sürdürülebilir<span>Turizm.</span>
              </Link>
              <p style={{ marginTop: 22, fontSize: 14 }}>
                Dünyadan haberler. Türkiye’den sorular.
                <br />
                Günlük uygulamaya dönüşen bir topluluk.
              </p>
            </div>
            <div className="footer-links">
              <Link href="/greenlog">Greenlog</Link>
              <Link href="/cop31">COP31 dosyası</Link>
              <Link href="/topluluk">Topluluk</Link>
              <Link href="/yayin-ilkeleri">Yayın ilkeleri</Link>
              <Link href="/iletisim">İletişim</Link>
              <Link href="/gizlilik-politikasi">Gizlilik</Link>
              <Link href="/isletme">İşletmeler için</Link>
              <Link href="/gezgin">Gezginler için</Link>
              <Link href="/araclar/karbon-ayak-izi">Karbon ayak izi aracı</Link>
              <Link href="/araclar/sertifika-taramasi">Sertifika taraması</Link>
              <a href={site.linkedin} target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>
          <div className="bottom">
            <span>
              © {new Date().getFullYear()} Sürdürülebilir Turizm. Greenlog aynı
              oluşumun ürünüdür.
            </span>
            <span>COP31 içerikleri bağımsız editoryal yayındır.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
