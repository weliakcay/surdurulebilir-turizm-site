import { PhoneDemo } from "@/components/phone-demo";
import { OperationsStory } from "@/components/operations-story";
import { HotelModel } from "@/components/hotel-model";
import Link from "next/link";
import { Portal, Heading, PilotCta } from "@/components/portal";
import { GREENLOG_URL, pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "Greenlog: Oteller İçin Dijital Kontrol Formları",
  "Otellerin tekrarlanan operasyon kontrolleri için QR ile form doldurma, yönetici onayı, kayıt geçmişi ve raporlama.",
  "/greenlog",
);
export default function Greenlog() {
  return (
    <Portal>
      <Heading
        title="Günlük işin kaydı, günlük hayat kadar kolay."
        description="Mutfaktan havuza, soğuk odadan kontrol noktasına: tekrarlanan formları dijital bir kayıt düzenine taşı."
      />
      <section className="section">
        <div className="wrap product-intro">
          <div>
            <div className="product">
              <span className="glyph" aria-hidden="true">
                g
              </span>
              Greenlog
            </div>
            <h2>Bir formun değil, işin devamlılığı.</h2>
            <p className="lead">
              Formun nerede olduğu, kimin doldurduğu ve eski kayda nasıl
              ulaşılacağı günlük işin bir parçası. Greenlog bu akışı aynı yerde
              bir araya getirir.
            </p>
            <div className="links">
              <Link className="btn" href="/greenlog/nasil-calisir">
                İş akışını gör
              </Link>
              <a
                className="textlink"
                href={GREENLOG_URL}
                target="_blank"
                rel="noreferrer"
              >
                Uygulamaya git
              </a>
            </div>
          </div>
          <PhoneDemo />
        </div>
      </section>
      <section className="section pale">
        <div className="wrap">
          <h2>Bugün ne yapabilirsin?</h2>
          <div className="steps">
            <div className="step">
              <h3>Formlarını taşı</h3>
              <p>
                Metin veya desteklenen dosyalardan bir form taslağı hazırla.
                Alanları ve maddeleri gözden geçirerek yayıma hazırla.
              </p>
            </div>
            <div className="step">
              <h3>Noktadan kayda geç</h3>
              <p>
                Personel QR’ı açar, giriş yapar ve gerekiyorsa yönetici onayı
                ister. Yetkili olduğu formu doldurur.
              </p>
            </div>
            <div className="step">
              <h3>Geçmişi bul</h3>
              <p>
                Noktaya ve zamana bağlı kayıtları incele. Raporlama ve Excel
                çıktısıyla geçmişe dön.
              </p>
            </div>
          </div>
          <Link className="textlink" href="/greenlog/kullanim-alanlari">
            Kullanım alanlarını incele
          </Link>
        </div>
      </section>
      <section className="section">
        <div className="wrap split">
          <div>
            <h2>Yeni otel. Aynı hesap.</h2>
            <p>
              Personel farklı bir otelde çalışmaya başladığında mevcut hesabıyla
              yeni otelin yöneticisinden erişim onayı isteyebilir. Her otelin
              erişimi ayrı yönetilir.
            </p>
            <p>
              Aynı telefonu başka bir personel kullanacaksa hesap değiştirme
              seçeneği vardır.
            </p>
          </div>
          <div className="feature-box">
            <h3>İddia yerine ölçüm.</h3>
            <p>
              Kâğıt kullanımındaki değişimi ve kayıt bulma süresini pilotta
              ölçmeyi öneriyoruz. Ölçüm yapılmadan tasarruf yüzdesi veya karbon
              sonucu açıklamıyoruz.
            </p>
            <Link className="textlink" href="/greenlog/pilot">
              Pilotun ölçüm yöntemini gör
            </Link>
          </div>
        </div>
      </section>
      <OperationsStory />
      <HotelModel />
      <PilotCta />
      <section className="section small">
        <div className="wrap disclosure">
          Greenlog, Sürdürülebilir Turizm oluşumu kapsamında geliştirdiğimiz
          üründür. Kontrol kayıtlarını düzenler; fiziksel ölçüm doğruluğu veya
          sürdürülebilirlik sertifikası sağlamaz.
        </div>
      </section>
    </Portal>
  );
}
