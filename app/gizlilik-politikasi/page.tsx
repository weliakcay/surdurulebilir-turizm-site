import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gizlilik Politikası",
  description: `${site.ad} gizlilik politikası: hangi verileri topluyoruz, neden ve haklarınız neler.`,
  alternates: { canonical: "/gizlilik-politikasi" },
};

const GUNCELLEME = "27 Temmuz 2026";

export default function GizlilikPolitikasi() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Gizlilik Politikası</h1>
      <p className="etiket mt-3 text-solgun">Son güncelleme: {GUNCELLEME}</p>

      <div className="makale mt-10">
        <p>
          Bu politika, {site.ad} web sitesinin ({site.url}) ziyaretçilerine ait kişisel
          verilerin nasıl işlendiğini açıklar. 6698 sayılı Kişisel Verilerin Korunması Kanunu
          (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) çerçevesinde hazırlanmıştır.
        </p>

        <h2>Topladığımız veriler</h2>
        <p>
          Bu site bir <strong>yayın sitesidir</strong>. Üyelik sistemi, yorum alanı veya
          alışveriş işlevi bulunmaz. Site üzerinde sizden kişisel veri talep etmiyoruz.
        </p>
        <ul>
          <li>
            <strong>Hesap verisi:</strong> Toplanmıyor — sitede hesap oluşturulmuyor.
          </li>
          <li>
            <strong>Çerezler:</strong> Site reklam veya takip çerezi kullanmaz.
          </li>
          <li>
            <strong>Sunucu kayıtları:</strong> Sitemiz Vercel altyapısında barındırılmaktadır.
            Vercel, hizmetin çalışması ve güvenliği için IP adresi, tarayıcı türü ve istek
            zamanı gibi teknik kayıtları geçici olarak tutar. Bu kayıtlara erişimimiz
            toplulaştırılmış düzeydedir ve kişi bazında analiz yapılmaz.
          </li>
          <li>
            <strong>İletişim:</strong> Bize e-posta yazarsanız, yalnızca size dönüş yapmak
            amacıyla mesajınızı ve e-posta adresinizi saklarız.
          </li>
        </ul>

        <h2>Verilerin kullanım amacı</h2>
        <p>
          Toplanan sınırlı teknik veri yalnızca sitenin çalışır durumda tutulması, güvenliğinin
          sağlanması ve hangi içeriklerin ilgi gördüğünün toplulaştırılmış olarak anlaşılması
          için kullanılır. Kişisel veriler pazarlama amacıyla kullanılmaz.
        </p>

        <h2>Üçüncü taraflar</h2>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> — barındırma ve içerik dağıtımı
          </li>
          <li>
            <strong>Google Fonts</strong> — yazı tipleri sunucumuzdan sunulur, tarayıcınız
            Google'a istek göndermez
          </li>
        </ul>
        <p>
          Verileriniz bunların dışında hiçbir üçüncü tarafa satılmaz, kiralanmaz veya
          aktarılmaz.
        </p>

        <h2>LinkedIn üzerinden paylaşım</h2>
        <p>
          İçeriklerimizi LinkedIn şirket sayfamızda da yayınlıyoruz. Bu paylaşım tek yönlüdür:
          kendi içeriğimizi LinkedIn'e göndeririz. Site ziyaretçilerine ait hiçbir veri
          LinkedIn'e aktarılmaz. LinkedIn sayfamızla etkileşiminiz LinkedIn'in kendi gizlilik
          politikasına tabidir.
        </p>

        <h2>Saklama süresi</h2>
        <p>
          Sunucu kayıtları barındırma sağlayıcısının politikası uyarınca kısa süreli tutulur.
          E-posta yazışmaları, ilgili konu kapandıktan sonra makul bir süre içinde silinir.
        </p>

        <h2>Haklarınız</h2>
        <p>KVKK madde 11 ve GDPR kapsamında şu haklara sahipsiniz:</p>
        <ul>
          <li>Kişisel verinizin işlenip işlenmediğini öğrenme</li>
          <li>İşlenmişse buna ilişkin bilgi talep etme</li>
          <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
          <li>Silinmesini veya yok edilmesini isteme</li>
          <li>İşlemeye itiraz etme</li>
        </ul>
        <p>
          Bu haklarınızı kullanmak için{" "}
          <a href={`mailto:${site.eposta}`}>{site.eposta}</a> adresine yazabilirsiniz.
          Talebinize en geç 30 gün içinde yanıt veririz.
        </p>

        <h2>Telif ve içerik</h2>
        <p>
          Yayınladığımız haberlerde kaynak gösterilir ve alıntılar sınırlı tutulur. Bir
          içeriğin haklarınızı ihlal ettiğini düşünüyorsanız yukarıdaki adresten bize
          ulaşın; incelemeyi ivedilikle yaparız.
        </p>

        <h2>Değişiklikler</h2>
        <p>
          Bu politikada değişiklik yapıldığında sayfanın üstündeki güncelleme tarihi yenilenir.
        </p>
      </div>
    </div>
  );
}
