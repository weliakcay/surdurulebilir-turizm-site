import Image from "next/image";
import Link from "next/link";
import { Portal, CopSource } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "COP31 Antalya 2026: Turizm İçin Gündem ve Hazırlık",
  "9–20 Kasım 2026 Antalya COP31 için kaynaklı turizm dosyası. Otellerde günlük uygulama, kontrol kayıtları ve hazırlık rehberi.",
  "/cop31",
);
export default function Page() {
  return (
    <Portal>
      <section className="cop-hero">
        <div className="wrap">
          <div>
            <div className="tag">Bağımsız editoryal dosya</div>
            <h1>Antalya’dan günlük uygulamaya.</h1>
            <p className="lead">
              COP31’in turizm açısından anlamını, otellerin günlük işlerinden
              başlayarak konuşuyoruz.
            </p>
            <div className="cop-date">
              9–20 Kasım 2026<span>Antalya · Tarih kaynağı: UNFCCC</span>
            </div>
          </div>
          <figure>
            <Image
              src="/site/hero-varis.jpg"
              alt="Temsili bir kıyı manzarası"
              width={1200}
              height={630}
              sizes="(max-width:700px) 100vw, 50vw"
              priority
            />
            <figcaption className="tiny">
              Temsili kıyı görseli; konferans mekânını göstermiyor.
            </figcaption>
          </figure>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <CopSource />
          <h2>Turizm için soracağımız sorular.</h2>
          <div className="topics">
            <div className="topic">
              <h3>Oteller neye hazırlanmalı?</h3>
              <p>
                Günlük kontrol işlerini ve kayıt düzenini görünür kılan uygulama
                rehberi.
              </p>
              <Link href="/cop31/oteller-icin-hazirlik">
                Oteller için rehberi aç
              </Link>
            </div>
            <div className="topic">
              <h3>Hangi gündemi takip edeceğiz?</h3>
              <p>Resmî kaynaklar ile editoryal soruları ayrı ele alıyoruz.</p>
              <Link href="/cop31/turizm-gundemi">Kaynaklar ve sorular</Link>
            </div>
            <div className="topic">
              <h3>Kâğıtsız kontrolün etkisi nasıl ölçülür?</h3>
              <p>
                Bir formun dijitale geçmesi ile fiilen basılmayan sayfa
                arasındaki fark.
              </p>
              <Link href="/greenlog/pilot">Ölçüm yöntemine bak</Link>
            </div>
            <div className="topic">
              <h3>Konferans sonrasında ne kalır?</h3>
              <p>
                Bir haftalık görünürlük yerine sürdürülebilen kayıt ve çalışma
                alışkanlıkları.
              </p>
              <Link href="/topluluk">Topluluğu tanı</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="wrap split">
          <h2>Büyük hedeflerin günlük karşılığı.</h2>
          <div>
            <p>
              Greenlog, oteldeki tekrarlanan kontrol kayıtlarını düzenlemek için
              geliştirdiğimiz üründür. Bu dosyada bir karbon muhasebesi sistemi
              veya COP31’in resmî çözümü olarak sunulmuyor.
            </p>
            <Link className="btn" href="/greenlog/nasil-calisir">
              Bir kontrolün akışını gör
            </Link>
          </div>
        </div>
      </section>
    </Portal>
  );
}
