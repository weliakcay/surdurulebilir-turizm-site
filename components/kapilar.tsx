import Link from "next/link";
import Image from "next/image";

/**
 * İki kapı — ana sayfanın ilk perdesi.
 * İşletme derin çam, gezgin terrakota. Seçim kilitlemez; her an diğerine geçilir.
 *
 * Zemindeki fotoğraflar marka renk işlemesinden geçmiş hâlde (npm run gorsel:ai
 * --sadece-ham). Üstlerindeki perde iki iş yapıyor: yazının kontrastını garanti
 * ediyor ve hover'da kapının kendi rengine dönüşerek seçimi hissettiriyor.
 */
export function Kapilar() {
  return (
    <section className="relative border-b border-cizgi">
      <div className="grid md:grid-cols-2">
        <Kapi
          no="01"
          baslik="İşletmeyim"
          metin="Otel, pansiyon, tur operatörü. Maliyet, mevzuat ve geri ödeme odaklı araçlar."
          href="/isletme"
          tur="isletme"
          gorsel="/site/kapi-isletme.jpg"
        />
        <Kapi
          no="02"
          baslik="Gezginim"
          metin="Kendi ayak izini ölç, seyahatini hafiflet, nereye gideceğine bilerek karar ver."
          href="/gezgin"
          tur="gezgin"
          gorsel="/site/kapi-gezgin.jpg"
        />
      </div>
    </section>
  );
}

function Kapi({
  no,
  baslik,
  metin,
  href,
  tur,
  gorsel,
}: {
  no: string;
  baslik: string;
  metin: string;
  href: string;
  tur: "isletme" | "gezgin";
  gorsel: string;
}) {
  const isletme = tur === "isletme";

  return (
    <Link
      href={href}
      className={[
        "group relative block overflow-hidden px-5 py-16 md:px-10 md:py-20",
        isletme ? "border-b border-cizgi md:border-b-0 md:border-r" : "",
      ].join(" ")}
    >
      <Image
        src={gorsel}
        alt=""
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />

      {/* Perde: yazı kontrastı + hover'da kapının rengine dönüş */}
      <div
        className={[
          "absolute inset-0 transition-colors duration-500",
          isletme
            ? "bg-cam/72 group-hover:bg-cam/88"
            : "bg-[#7a3c1f]/72 group-hover:bg-terra/86",
        ].join(" ")}
      />

      <div className="relative">
        <div
          className={[
            "etiket transition-colors",
            isletme ? "text-adacayi" : "text-[#ffd9c4]",
          ].join(" ")}
        >
          {no} — Kapı
        </div>

        <h2 className="mt-2.5 text-3xl leading-none tracking-tight text-krem md:text-[2.4rem]">
          {baslik}
        </h2>

        <p
          className={[
            "mt-2.5 max-w-[34ch] text-[0.95rem] leading-relaxed",
            isletme ? "text-adacayi" : "text-[#ffd9c4]",
          ].join(" ")}
        >
          {metin}
        </p>

        <span className="etiket mt-5 inline-block text-krem transition-transform duration-300 group-hover:translate-x-1.5">
          Devam et →
        </span>
      </div>
    </Link>
  );
}
