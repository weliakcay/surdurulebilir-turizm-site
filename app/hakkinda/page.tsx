import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hakkında",
  description:
    "Neden bu yayın var, nasıl çalışıyoruz ve editoryal ilkelerimiz neler.",
  alternates: { canonical: "/hakkinda" },
};

export default function Hakkinda() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">Hakkında</h1>

      <div className="makale mt-10">
        <p>
          Sürdürülebilir turizm üzerine Türkçe içeriğin çoğu ya çeviri haber ya da genel geçer
          farkındalık metni. İkisi de bir işletmecinin pazartesi sabahı ne yapacağını
          söylemiyor.
        </p>
        <p>
          Bu yayın <strong>köprü kurmak</strong> için var. Dünyada bir yerde işe yaramış bir
          uygulamayı aktarıyoruz, sonra asıl soruyu soruyoruz: bu Türkiye'de nasıl işler?
          Maliyeti ne, engeli ne, kim şimdiden deniyor?
        </p>

        <h2>Her haberde üç bölüm</h2>
        <ul>
          <li>
            <strong>Ne oldu</strong> — olgu, kaynağıyla birlikte, kısa
          </li>
          <li>
            <strong>Türkiye açısı</strong> — uygulanabilir mi, hangi koşullarda, hangi engelle
          </li>
          <li>
            <strong>Kim yapıyor</strong> — konuyla ilgili öncü işletme veya kurum, adıyla
          </li>
        </ul>
        <p>
          "Türkiye açısı" bölümü olmayan içerik yayınlanmaz. Özgün katman yoksa o zaten kopya
          haberdir.
        </p>

        <h2>Editoryal ilkeler</h2>
        <ul>
          <li>
            <strong>Kaynak her zaman gösterilir.</strong> Haberin altında görünür bağlantıyla.
            Kaynağın kaynağı varsa asıl kaynağa gideriz.
          </li>
          <li>
            <strong>Öne çıkarma satılmaz.</strong> Bir işletmenin habere girmesi editoryal
            karardır. Para veya ürün karşılığı yer verilmez.
          </li>
          <li>
            <strong>Kanıtsız iddia aktarılmaz.</strong> Sürdürülebilirlik iddiası büyükse
            kanıtına bakarız: sertifika, ölçülmüş veri, bağımsız doğrulama. Yoksa haber
            yapmayız.
          </li>
          <li>
            <strong>Hata düzeltilir, silinmez.</strong> Yanlış bilgi tespit edilirse sayfaya
            tarihli düzeltme notu eklenir.
          </li>
          <li>
            <strong>Suçlamıyoruz.</strong> Muhatabımız turizm işletmecisi. Sorunları anlatırken
            çözümü ve maliyeti birlikte konuşuruz.
          </li>
        </ul>

        <h2>İletişim</h2>
        <p>
          Bir haber önerisi, düzeltme talebi veya işbirliği için{" "}
          <a href={`mailto:${site.eposta}`}>{site.eposta}</a> adresine yazabilir, ya da{" "}
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn sayfamızdan
          </a>{" "}
          ulaşabilirsiniz.
        </p>
      </div>
    </div>
  );
}
