import type { Metadata } from "next";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "İletişim",
  description: "Haber önerisi, düzeltme talebi ve işbirliği için bize ulaşın.",
  alternates: { canonical: "/iletisim" },
};

export default function Iletisim() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">İletişim</h1>

      <div className="makale mt-10">
        <p>
          Haber önerisi, düzeltme talebi veya işbirliği için yazın. Okuduğumuz her mesaja
          dönüyoruz.
        </p>

        <h2>E-posta</h2>
        <p>
          <a href={`mailto:${site.eposta}`}>{site.eposta}</a>
        </p>

        <h2>LinkedIn</h2>
        <p>
          <a href={site.linkedin} target="_blank" rel="noreferrer">
            linkedin.com/company/surdurulebilir-turizm
          </a>
        </p>

        <h2>Haber önerirken</h2>
        <p>Şunları eklerseniz değerlendirmemiz hızlanır:</p>
        <ul>
          <li>Birincil kaynak bağlantısı</li>
          <li>Uygulamanın somut sonucu — mümkünse sayıyla</li>
          <li>Türkiye'de neden ilgi çekeceğini düşündüğünüz</li>
        </ul>

        <h2>Düzeltme talebi</h2>
        <p>
          Bir haberde hata gördüyseniz hangi cümle ve doğrusunun ne olduğunu yazın. Doğrulayıp
          sayfaya tarihli düzeltme notu ekleriz — içeriği sessizce değiştirmeyiz.
        </p>
      </div>
    </div>
  );
}
