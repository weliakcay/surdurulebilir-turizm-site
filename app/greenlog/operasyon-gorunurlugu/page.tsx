import Link from "next/link";
import { Portal, Heading, PilotCta } from "@/components/portal";
import { OperationsStory } from "@/components/operations-story";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "Greenlog operasyon görünürlüğü ve grafikler",
  "Saatlik kayıt akışı, departman tamamlama durumu, geciken kontroller ve kayıt geçmişinin ne anlattığını inceleyin.",
  "/greenlog/operasyon-gorunurlugu",
);
export default function Visibility() {
  return (
    <Portal>
      <Heading
        parent="Greenlog"
        parentHref="/greenlog"
        title="Kayıt birikmesin. Operasyon görünsün."
        description="Hangi kontrol tamamlandı, hangisi bekliyor, hangi departmanda gecikme var? Greenlog’un bugünkü ekranlarını ve birlikte geliştireceğimiz soruları tanı."
      />
      <OperationsStory />
      <section className="section">
        <div className="wrap split">
          <div>
            <h2>Bir grafikten kontrolün kaydına.</h2>
            <p>
              Departman görünümü planlı kontrolleri yapıldı, bekliyor ve gecikti
              durumlarıyla gösterir. Nokta, form, kayıt zamanı ve dolduran kişi
              üzerinden geçmiş kayıtlar incelenebilir.
            </p>
            <p>
              Raporlama akışında dönem ve form seçerek Excel çıktısı alınabilir.
              Böylece kaydın kendisi ekip içinde incelenebilir.
            </p>
          </div>
          <div className="feature-box">
            <h3>Grafik neyi söylemez?</h3>
            <p>
              Kayıt sayısı işin kalitesini tek başına ölçmez. Departman “uyumu”,
              kontrol planının tamamlanmasıyla ilgilidir; yasal uygunluk veya
              sıcaklığın güvenli aralıkta olması anlamına gelmez.
            </p>
            <p>
              Eksik kayıt, kontrolün sahada kesinlikle yapılmadığını da
              kanıtlamaz. Yönetici için araştırılacak bir işarettir.
            </p>
          </div>
        </div>
      </section>
      <section className="section analytics-next">
        <div className="wrap">
          <h2>Birlikte netleştireceğimiz sonraki görünüm.</h2>
          <p className="lead">
            Aşağıdakiler geliştirme konularıdır. Bugün çalışan özellikler olarak
            sunmuyoruz.
          </p>
          <div className="insight-grid">
            <article>
              <h3>Ölçüm eğrileri</h3>
              <p>
                Soğuk oda sıcaklığı veya havuz ölçümünün zaman içindeki
                değişimi. Önce birim, alan türü, kontrol sıklığı ve geçerli
                sınırlar netleşmeli.
              </p>
            </article>
            <article>
              <h3>Tekrarlayan sorunlar</h3>
              <p>
                Aynı noktada yinelenen gecikme veya olumsuz yanıtlar. Farklı
                vardiya ve kontrol sıklıkları karşılaştırmayı nasıl etkiliyor?
              </p>
            </article>
            <article>
              <h3>Sorundan çözüme</h3>
              <p>
                Sorunu kim aldı, hangi işlem yapıldı, ne zaman kapandı? Bunun
                için sorumlu atama ve kapanış kaydı akışını birlikte
                tasarlamalıyız.
              </p>
            </article>
          </div>
          <Link className="textlink" href="/iletisim">
            Operasyon ihtiyacını konuşalım
          </Link>
        </div>
      </section>
      <PilotCta />
    </Portal>
  );
}
