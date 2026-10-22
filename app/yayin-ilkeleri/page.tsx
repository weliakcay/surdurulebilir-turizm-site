import Link from "next/link";
import { Portal, Heading } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "Yayın İlkeleri ve Greenlog Ürün Sahipliği",
  "Kaynak kullanımı, Türkiye açısı, düzeltme politikası ve Greenlog’un Sürdürülebilir Turizm oluşumuyla ilişkisi.",
  "/yayin-ilkeleri",
);
export default function Page() {
  return (
    <Portal>
      <Heading
        title="Haber, yorum ve ürün. Açıkça ayrılır."
        description="Yayın güveni, ne söylediğimiz kadar bilgiyi nereden aldığımız ve kimin adına konuştuğumuzla ilgilidir."
      />
      <section className="section">
        <div className="wrap readable">
          <h2>Kaynak her zaman gösterilir.</h2>
          <p>
            Olguları kendi cümlelerimizle aktarır, haberde kullanılan kaynakları
            görünür bağlantılarla paylaşırız. Bir rapora dayanan haber için
            mümkünse asıl rapora gideriz.
          </p>
          <h2>Türkiye açısı, özgün katkımızdır.</h2>
          <p>
            Dünyada olanı aktardıktan sonra Türkiye’de hangi koşullarda
            uygulanabileceğini sorarız. Maliyet, engeller ve uygulama
            koşullarını da tartışırız. Yorum ve önerilerimizi doğrulanmış
            olgular gibi sunmayız.
          </p>
          <h2>Greenlog aynı oluşumun ürünüdür.</h2>
          <p>
            Greenlog’u Sürdürülebilir Turizm kapsamında geliştiriyoruz. Kendi
            ürünümüzle ilgili içerikleri bağımsız bir işletme haberi gibi
            gizlemeyiz. Ürün özelliklerini ölçülmüş iş sonuçlarından ayrı ele
            alırız.
          </p>
          <p>
            Greenlog kontrol kayıtlarını dijitale taşır. Bağımsız sertifikasyon,
            fiziksel ölçüm doğruluğu veya ölçülmemiş çevresel sonuçlar vaat
            etmiyoruz.
          </p>
          <h2>İşletme öne çıkarma satılmaz.</h2>
          <p>
            Başka işletmelere haberlerde yer vermek editoryal karardır.
            Sürdürülebilirlik iddialarında kaynağa ve kanıta bakarız. İşletmenin
            beyanını bağımsız doğrulama olarak sunmayız.
          </p>
          <h2>Hata görünür biçimde düzeltilir.</h2>
          <p>
            Bir hata doğrulanırsa içeriği düzeltir ve tarihli düzeltme notu
            ekleriz. Haberlerdeki güncelleme tarihi gerçek bir içerik
            değişikliğini göstermelidir.
          </p>
          <h2>COP31 dosyası editoryal yayındır.</h2>
          <p>
            Resmî konferans ortaklığı veya konferansta temsil iddiası
            taşımıyoruz. Tarih ve katılım bilgileri için resmî kaynağa bağlantı
            veriyoruz.
          </p>
          <Link className="btn" href="/iletisim">
            Düzeltme veya kaynak öner
          </Link>
        </div>
      </section>
    </Portal>
  );
}
