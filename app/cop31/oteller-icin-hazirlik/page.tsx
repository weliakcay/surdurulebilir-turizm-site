import Link from "next/link";
import { Portal, Heading, CopSource } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "COP31 Öncesi Oteller İçin Uygulama ve Kayıt Rehberi",
  "Oteller için günlük kontrol envanteri, kayıt erişimi, ekip yetkileri ve başlangıç ölçümü. COP31 turizm dosyasından uygulanabilir sorular.",
  "/cop31/oteller-icin-hazirlik",
);
const checklist = [
  [
    "Hangi kontrol gerçekten yapılıyor?",
    "İşletmede tekrarlanan kontrollerin listesini çıkarın. Hangi noktada, kim tarafından ve hangi sıklıkla yapıldığını yetkili ekiple netleştirin.",
  ],
  [
    "Form ile uygulama eşleşiyor mu?",
    "Kullanılmayan alanları, birbirini tekrar eden formları ve belirsiz sorumlulukları belirleyin. Teknik kontrol maddelerinin doğruluğunu yetkili ekip değerlendirsin.",
  ],
  [
    "Geçmiş kayıt ne kadar sürede bulunuyor?",
    "Aynı kaydı farklı günlerde aratıp süreyi not edin. Bulunamayan kayıtları da ölçüme dahil edin; yalnız başarılı örnekleri seçmeyin.",
  ],
  [
    "Ekip değişince erişim nasıl yönetiliyor?",
    "Yeni personelin işe başlamasında kimin onay verdiğini ve ayrılan personelin erişiminin nasıl kapandığını kontrol edin. Paylaşılan telefonlarda açık hesabı görünür kılın.",
  ],
  [
    "Kâğıt nerede gerçekten kullanılıyor?",
    "Form başına kullanılan sayfayı ve baskıyı başlangıç döneminde sayın. Dijital geçişten sonra paralel kâğıt kullanımını da ölçün.",
  ],
  [
    "Küçük bir deneme için ne seçeceğiz?",
    "Sık kullanılan az sayıda nokta ve formla başlayın. Eğitim, destek, tamamlanma ve kayıt bulma sürelerini birlikte değerlendirin.",
  ],
];
export default function Page() {
  return (
    <Portal>
      <Heading
        parent="COP31 turizm dosyası"
        parentHref="/cop31"
        title="Gündemi, günlük işin içinden düşün."
        description="Bu bir resmî COP31 şartnamesi veya sertifikasyon kontrol listesi değil; otel ekipleri için uygulama ve kayıt düzeni rehberidir."
      />
      <section className="section">
        <div className="wrap readable">
          <CopSource />
          {checklist.map(([title, text]) => (
            <section key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
            </section>
          ))}
          <div className="disclosure">
            <p>
              Bu soruların dijital kayıt tarafını Greenlog ile denemek isteyen
              işletmeler için başlangıç çizgisi ve pilot yöntemi hazırladık.
              Greenlog aynı oluşumun ürünüdür.
            </p>
            <Link className="textlink" href="/greenlog/pilot">
              Pilot yöntemini incele
            </Link>
          </div>
        </div>
      </section>
    </Portal>
  );
}
