import { Portal, Heading, PilotCta } from "@/components/portal";
import { ProductFlow } from "@/components/product-flow";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "Dosyadan QR’lı Kontrol Formuna: Greenlog Nasıl Çalışır?",
  "Form taslağını gözden geçir, kontrol noktasına bağla, QR’dan doldur ve geçmiş kayıtlarını incele. Greenlog’un günlük iş akışı.",
  "/greenlog/nasil-calisir",
);
export default function Page() {
  return (
    <Portal>
      <Heading
        parent="Greenlog"
        parentHref="/greenlog"
        title="Dosyadan forma. Noktadan kayda."
        description="Bir kontrol formunun hazırlanmasından geçmiş kaydın bulunmasına kadar tek bir iş akışı."
      />
      <section className="section">
        <div className="wrap">
          <ProductFlow />
        </div>
      </section>
      <PilotCta />
    </Portal>
  );
}
