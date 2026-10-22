import Link from "next/link";
import { Portal, Heading } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
import { site } from "@/lib/site";
export const metadata = pageMetadata(
  "Sürdürülebilir Turizm Topluluğu: Haber, Deneyim ve Uygulama",
  "Otel ekipleri ve turizm profesyonelleriyle kaynaklı haberleri, saha deneyimlerini ve Greenlog’un gelişimini konuşuyoruz.",
  "/topluluk",
);
export default function Page() {
  return (
    <Portal>
      <Heading
        title="İyi bir soruyla aynı masada."
        description="Otel yöneticileri, operasyon ekipleri ve turizm profesyonelleriyle haberin sahadaki karşılığını konuşuyoruz."
      />
      <section className="section">
        <div className="wrap question">
          <div>
            <h2>Kontrol kaydını bulmak neden hâlâ bir iş?</h2>
            <p>
              En zor bulunan kayıt hangisi? Sorun formda mı, ekip değişiminde
              mi, arşivde mi? Bu soruları gerçek deneyimlerden yola çıkarak
              tartışmak istiyoruz.
            </p>
          </div>
          <div>
            <p>
              LinkedIn sayfamızı takip edebilir, yayımlanmış içeriklerin altında
              kendi deneyimini paylaşabilir veya bize konu önerebilirsin.
            </p>
            <a
              className="btn lime"
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn topluluğunu aç
            </a>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="wrap">
          <h2>Bir yayın ritmi. Gerçek bir konuşma.</h2>
          <div className="steps">
            <div className="step">
              <h3>Kaynaklı haber</h3>
              <p>
                Dünyadaki bir uygulamayı aktarıyoruz. Türkiye’de nerede, hangi
                koşulla işe yarayacağını soruyoruz.
              </p>
            </div>
            <div className="step">
              <h3>Sahadan deneyim</h3>
              <p>
                İyi sonucu da uygulama engelini de konuşuyoruz. Müşteri ve
                personel bilgilerini paylaşmıyoruz.
              </p>
            </div>
            <div className="step">
              <h3>Açık ürün günlüğü</h3>
              <p>
                Greenlog’un aynı oluşumun ürünü olduğunu açıkça belirtiyoruz.
                Ürün gelişimini ve pilot yöntemini anlatıyoruz.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap readable">
          <h2>Nasıl katkı verebilirsin?</h2>
          <p>
            Bir uygulama örneği, kaynaklı haber veya günlük iş sorusu
            önerebilirsin. İşletme adıyla bir örnek paylaşacaksan izin ve ölçüm
            yöntemini de belirt. Katkılar editoryal değerlendirmeden geçer.
          </p>
          <div className="links">
            <Link className="btn" href="/iletisim">
              Konu öner veya ulaş
            </Link>
            <Link className="textlink" href="/greenlog/pilot">
              Greenlog pilotunu incele
            </Link>
          </div>
          <h2>Birlikte konuşmanın kuralları.</h2>
          <ul>
            <li>Kaynağını belirt, olguyla görüşü ayır.</li>
            <li>Misafir, personel ve işletmeye ait özel bilgileri paylaşma.</li>
            <li>Ticari ilişkileri ve ürün sahipliğini açıkça söyle.</li>
            <li>Eleştiriyi kişiye değil, uygulama ve kanıta yönelt.</li>
            <li>Hata fark edersen düzeltme iste; düzeltmeleri görünür tut.</li>
          </ul>
          <Link className="textlink" href="/yayin-ilkeleri">
            Yayın ilkelerini oku
          </Link>
        </div>
      </section>
    </Portal>
  );
}
