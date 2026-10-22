import Link from "next/link";
import { Portal, Heading } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
import { site } from "@/lib/site";
export const metadata = pageMetadata(
  "Greenlog Pilotu: Dijital Kontrol Kayıtlarını Birlikte Ölçelim",
  "Az sayıda nokta ve formla başlayan Greenlog pilotu. Kayıt bulma süresi, tamamlanma ve gerçek kâğıt kullanımını aynı yöntemle ölçme planı.",
  "/greenlog/pilot",
);
const mail = `mailto:${site.eposta}?subject=${encodeURIComponent("Greenlog pilot görüşmesi")}&body=${encodeURIComponent("Merhaba,\n\nOtel / işletme adı:\nGörüşmek istediğim kontrol noktaları:\nMevcut form türleri:\nİletişim bilgim:\n")}`;
export default function Page() {
  return (
    <Portal>
      <Heading
        parent="Greenlog"
        parentHref="/greenlog"
        title="Önce küçük başla. Sonucu birlikte ölç."
        description="Günlük kontrollerin dijitale taşınmasını, ekip ve işletmenin gerçek çalışma koşullarında değerlendirelim."
      />
      <section className="section">
        <div className="wrap split">
          <div>
            <h2>14 günlük bir başlangıç önerisi.</h2>
            <p>
              İlk deneme 1–3 kontrol noktası, 3–5 gerçekten kullanılan form ve
              sınırlı bir ekiple başlayabilir. Kapsam ve süreyi işletmenin
              çalışma düzenine göre birlikte netleştiririz.
            </p>
            <p>
              Önce mevcut kayıt yönteminin başlangıç çizgisini çıkarır, sonra
              aynı işleri dijital akışta takip ederiz. İlk günlerdeki eğitim ve
              destek ihtiyacını da ölçüme dahil ederiz.
            </p>
            <a className="btn" href={mail}>
              E-postayla pilot görüşmesi iste
            </a>
            <p className="tiny" style={{ marginTop: 12 }}>
              E-posta uygulamanız açılır. Mesajı uygulamanızdan gönderirsiniz.
              Ücret ve kapsam görüşmede netleştirilir.
            </p>
            <a
              className="textlink"
              href={site.linkedin}
              target="_blank"
              rel="noreferrer"
            >
              LinkedIn sayfasından ulaş
            </a>
          </div>
          <div className="feature-box">
            <h3>Neyi ölçeceğiz?</h3>
            <ul>
              <li>Planlanan ve tamamlanan kayıtlar</li>
              <li>Geçmiş kaydı bulma süresi</li>
              <li>Eğitim ve destek ihtiyacı</li>
              <li>Gerçekte basılmayan kâğıt sayfası</li>
            </ul>
            <p>
              Sonuçları başlangıçla aynı yöntemle karşılaştırırız. Henüz
              ölçülmemiş bir tasarruf yüzdesi veya karbon sonucu açıklamıyoruz.
            </p>
          </div>
        </div>
      </section>
      <section className="section pale">
        <div className="wrap readable">
          <h2>Bir sayıyı nasıl anlamlandırırız?</h2>
          <p>
            Bir formun dijitale geçmesi, tek başına kâğıdın azaldığını
            göstermez. Aynı kayıt kâğıda da basılıyorsa bunu ayrıca sayarız.
            İşlem süresine eğitim, düzeltme ve destek sürelerini dahil ederiz.
          </p>
          <p>
            Eksik kalan kayıtlar ve kullanım zorlukları pilotun parçasıdır.
            Sonuçları müşteri adıyla paylaşmak için ayrıca izin isteriz.
          </p>
          <Link className="textlink" href="/greenlog/nasil-calisir">
            Önce ürün akışını incele
          </Link>
        </div>
      </section>
    </Portal>
  );
}
