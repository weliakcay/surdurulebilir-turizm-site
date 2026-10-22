import Image from "next/image";
import Link from "next/link";
export function OperationsStory() {
  return (
    <section className="section operations-story">
      <div className="wrap">
        <div className="section-top">
          <div>
            <p className="demo-label">Sahadan yöneticiye</p>
            <h2>Kontrollerin nerede aksadığını gör.</h2>
          </div>
          <Link className="textlink" href="/greenlog/operasyon-gorunurlugu">
            Grafikler ne anlatıyor?
          </Link>
        </div>
        <div className="ops-ribbon" aria-label="Örnek kontrol durumları">
          <div>
            <b>Yapıldı</b>
            <span>Beklenen kontrolün kaydı var.</span>
          </div>
          <div>
            <b>Bekliyor</b>
            <span>Henüz tamamlanmamış planlı kontrol.</span>
          </div>
          <div>
            <b>Gecikti</b>
            <span>Planlanan süre geçmiş, kayıt eksik.</span>
          </div>
          <div>
            <b>Acil</b>
            <span>Zorunlu ve gecikmiş kontrol kaydı.</span>
          </div>
        </div>
        <div className="dashboard-frame">
          <div className="dashboard-caption">
            <strong>Yöneticinin görünümü</strong>
            <span>Gerçek uygulama bileşenleri · Gösterim verisi</span>
          </div>
          <Image
            src="/greenlog/screens/dashboard.webp"
            alt="Greenlog ekranında saatlik kayıt akışı, departman tamamlama oranı ve son yedi günlük kayıt sayısı grafikleri"
            width={2200}
            height={1600}
            sizes="(max-width:700px) 100vw, 1100px"
          />
        </div>
        <p className="tiny">
          “Acil”, zorunlu kontrolün gecikmesini ifade eder. Ölçüm değerinin
          tehlikeli olduğunu veya mevzuata aykırılığı tek başına göstermez.
        </p>
        <div className="insight-grid">
          <article>
            <span className="insight-icon">↗</span>
            <h3>Günün ritmi</h3>
            <p>
              Saatlik kayıt dağılımı hangi saatlerde kayıt oluştuğunu gösterir.
              Yoğunluk ve boşlukların nedenini ekiple inceleyebilirsin.
            </p>
          </article>
          <article>
            <span className="insight-icon">▥</span>
            <h3>Departman karşılaştırması</h3>
            <p>
              Planlı kontrollerin tamamlanma durumunu departman bazında izle.
              Eksik kaydın olduğu noktaya dön.
            </p>
          </article>
          <article>
            <span className="insight-icon">⌁</span>
            <h3>Kayıt devamlılığı</h3>
            <p>
              Son 7 günün kayıt sayısını karşılaştır. Değişimin nedenini vardiya
              ve kontrol planıyla birlikte değerlendir.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
