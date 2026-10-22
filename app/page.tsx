import { PhoneDemo } from "@/components/phone-demo";
import { OperationsStory } from "@/components/operations-story";
import { HotelModel } from "@/components/hotel-model";
import Link from "next/link";
import { tumHaberler } from "@/lib/content";
import { Portal, NewsGrid } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "Sürdürülebilir Turizm: haberler, topluluk ve Greenlog",
  "Kaynaklı turizm haberleri, COP31 Antalya dosyası ve otellerin günlük kontrol formlarını dijitale taşıyan Greenlog.",
  "/",
);
export default function Home() {
  return (
    <Portal>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <div className="product">
              <span className="glyph" aria-hidden="true">
                g
              </span>
              Greenlog
            </div>
            <h1>Otelde her kontrolün kaydı, tek yerde.</h1>
            <p>
              Tekrarlanan kontrol formlarını dijitale taşı. Ekibin QR’dan
              kaydını oluştursun, geçmiş kontroller ihtiyaç duyduğunda elinin
              altında olsun.
            </p>
            <div className="links">
              <Link className="btn" href="/greenlog">
                Greenlog’u incele
              </Link>
              <Link className="textlink" href="/greenlog/nasil-calisir">
                Nasıl çalıştığını gör
              </Link>
            </div>
            <p className="tiny" style={{ marginTop: 25, fontSize: 13 }}>
              Sürdürülebilir Turizm oluşumu kapsamında geliştiriyoruz.
            </p>
          </div>
          <PhoneDemo />
        </div>
      </section>
      <div className="trustline">
        <div className="wrap">
          <span>Metin ve dosyalardan form taslağı</span>
          <span>QR ile giriş ve yönetici onayı</span>
          <span>Geçmiş kayıtlar ve raporlama</span>
        </div>
      </div>
      <OperationsStory />
      <HotelModel />
      <section className="section">
        <div className="wrap cop-teaser">
          <div>
            <div className="tag">COP31 turizm dosyası</div>
            <h2>Antalya’da konuşulanlar, sahada neye dönüşür?</h2>
            <p>
              Turizm açısından gündemi, uygulanabilir soruları ve günlük işlerin
              kayıt düzenini birlikte ele alıyoruz.
            </p>
            <Link className="textlink" href="/cop31">
              COP31 dosyasına geç
            </Link>
          </div>
          <div className="cop-date">
            9–20 Kasım 2026<span>Antalya · Tarih kaynağı: UNFCCC</span>
            <p style={{ font: "14px/1.6 Arial", marginTop: 20 }}>
              Bağımsız editoryal dosya. Resmî ortaklık veya konferansa katılım
              iddiası içermez.
            </p>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="wrap">
          <div className="section-top">
            <h2>Haberin ötesinde, Türkiye’de karşılığı.</h2>
            <Link className="textlink" href="/haberler">
              Haber arşivine bak
            </Link>
          </div>
          <NewsGrid items={tumHaberler().slice(0, 3)} />
        </div>
      </section>
      <section className="section">
        <div className="wrap question">
          <div>
            <h2>Bir kontrol yapıldı. Kaydı sonra kaç dakikada bulunuyor?</h2>
          </div>
          <div>
            <p>
              Operasyon ekiplerinin gerçek deneyimlerinden öğrenmek istiyoruz.
              Soru ve deneyimlerini topluluğa taşı.
            </p>
            <Link className="btn lime" href="/topluluk">
              Topluluğu tanı
            </Link>
          </div>
        </div>
      </section>
    </Portal>
  );
}
