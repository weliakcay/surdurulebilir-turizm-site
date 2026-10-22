import Link from "next/link";
import { Portal, Heading, PilotCta } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "Greenlog Kullanım Alanları: Mutfak, Soğuk Oda ve Havuz",
  "Otellerde tekrarlanan operasyon kontrolleri için nokta bazlı dijital form örnekleri ve uygulama kapsamı.",
  "/greenlog/kullanim-alanlari",
);
const useCases = [
  [
    "Soğuk oda ve dondurucu",
    "Düzenli yapılan sıcaklık kontrollerini ilgili noktanın formuna kaydet. Geçmiş kontrolleri tarih aralığıyla incele.",
  ],
  [
    "Üretim mutfağı",
    "İşletmenin kullandığı gıda üretimi ve kontrol formlarını dijital taslağa taşı. Ekip hangi noktanın hangi formunu doldurduğunu görsün.",
  ],
  [
    "Havuz kontrol noktası",
    "İşletmenin belirlediği kontrol maddelerini noktayla ilişkilendir. Ölçümü yapan personel kayıt oluşturabilsin.",
  ],
  [
    "Bulaşık ve depo kontrolleri",
    "Tekrarlanan operasyon kayıtlarını farklı defterler yerine nokta ve forma bağlı bir geçmişte düzenle.",
  ],
];
export default function Page() {
  return (
    <Portal>
      <Heading
        parent="Greenlog"
        parentHref="/greenlog"
        title="Aynı kayıt düzeni. Farklı kontrol noktaları."
        description="İşletmenin gerçek form ve çalışma düzeninden başla. İlk pilot için az sayıda, sık kullanılan kontrol noktası seç."
      />
      <section className="section">
        <div className="wrap topics">
          {useCases.map(([title, text]) => (
            <div className="topic" key={title}>
              <h2>{title}</h2>
              <p>{text}</p>
              <Link className="textlink" href="/greenlog/nasil-calisir">
                İş akışını gör
              </Link>
            </div>
          ))}
        </div>
      </section>
      <section className="section small">
        <div className="wrap disclosure">
          Kontrol maddelerini, ölçüm yöntemini ve kabul sınırlarını işletmenin
          yetkili ekibi belirler. Greenlog kayıt tutmayı destekler; ölçüm cihazı
          veya teknik değerlendirme yerine geçmez.
        </div>
      </section>
      <PilotCta />
    </Portal>
  );
}
