import Link from "next/link";
import { Portal, Heading, CopSource } from "@/components/portal";
import { pageMetadata } from "@/lib/portal";
export const metadata = pageMetadata(
  "COP31 Turizm Gündemi: Resmî Kaynaklar ve Açık Sorular",
  "COP31 Antalya turizm dosyası: resmî programı nereden izlemeli, otel uygulamalarıyla hangi soruları ilişkilendirmeli?",
  "/cop31/turizm-gundemi",
);
export default function Page() {
  return (
    <Portal>
      <Heading
        parent="COP31 turizm dosyası"
        parentHref="/cop31"
        title="Kaynaklar ayrı. Sorularımız açık."
        description="Etkinlik programı ve haberleri doğrulanmış kaynaklardan takip ediyor; günlük otel uygulamalarıyla ilişkisini kendi editoryal sorularımızla ele alıyoruz."
      />
      <section className="section">
        <div className="wrap readable">
          <CopSource />
          <h2>Resmî bilgiyi nereden takip edelim?</h2>
          <ul>
            <li>
              <a
                href="https://unfccc.int/cop31"
                target="_blank"
                rel="noreferrer"
              >
                UNFCCC COP31 ana sayfası
              </a>
              : toplantı ve program bağlantıları.
            </li>
            <li>
              <a
                href="https://unfccc.int/cop31/ifp"
                target="_blank"
                rel="noreferrer"
              >
                Katılımcı bilgi rehberi
              </a>
              : katılım ve mekânla ilgili güncel bilgiler.
            </li>
            <li>
              <a
                href="https://www.untourism.int/the-glasgow-declaration-on-climate-action-in-tourism"
                target="_blank"
                rel="noreferrer"
              >
                UN Tourism Glasgow Declaration
              </a>
              : turizmde iklim eylemi için sektör çerçevesi.
            </li>
          </ul>
          <h2>Biz hangi soruları soruyoruz?</h2>
          <p>
            Bir hedefin günlük uygulamadaki karşılığı nasıl görülebilir?
            İşletmede zaten yapılan kontrollerin kayıtları bulunabilir mi? Yeni
            bir çalışma yöntemi denendiğinde başlangıç çizgisi ve sonuç aynı
            yöntemle ölçülüyor mu?
          </p>
          <p>
            Bu sorular bizim editoryal çerçevemizdir; resmî konferans gündemi
            veya kabul edilmiş kararlar gibi sunulmaz.
          </p>
          <h2>Haber ile yorumu nasıl ayırıyoruz?</h2>
          <p>
            Önce kaynağı, tarihi ve doğrulanmış gelişmeyi aktarırız. Ardından
            Türkiye’de hangi koşullarda uygulanabileceğini tartışırız.
            Öngörüleri ve kendi ürünümüzle ilgili açıklamaları ayrıca
            belirtiriz.
          </p>
          <div className="links">
            <Link className="btn" href="/haberler">
              Haber arşivini aç
            </Link>
            <Link className="textlink" href="/yayin-ilkeleri">
              Yayın ilkelerimiz
            </Link>
          </div>
        </div>
      </section>
    </Portal>
  );
}
