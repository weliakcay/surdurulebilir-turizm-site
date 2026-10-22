import Image from "next/image";
import Link from "next/link";
import { tarihFormatla } from "@/lib/site";
import type { Haber } from "@/lib/content";

export function Portal({ children }: { children: React.ReactNode }) {
  return <div className="portal">{children}</div>;
}
export function Heading({
  title,
  description,
  parent = "Sürdürülebilir Turizm",
  parentHref = "/",
}: {
  title: string;
  description: string;
  parent?: string;
  parentHref?: string;
}) {
  return (
    <section className="page-heading">
      <div className="wrap">
        <div className="bread">
          <Link href={parentHref}>{parent}</Link>
        </div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
    </section>
  );
}
export function NewsGrid({
  items,
  all = false,
}: {
  items: Haber[];
  all?: boolean;
}) {
  return (
    <div className={`news-grid${all ? " grid-all" : ""}`}>
      {items.map((h) => (
        <Link className="news-card" href={`/haber/${h.slug}`} key={h.slug}>
          <div className="news-image">
            <Image
              src={h.gorsel}
              alt=""
              width={1200}
              height={630}
              sizes="(max-width:700px) 100vw, (max-width:1000px) 50vw, 33vw"
            />
          </div>
          <div className="news-meta">
            {h.kategori} ·{" "}
            <time dateTime={h.tarih}>{tarihFormatla(h.tarih)}</time>
          </div>
          <h3>{h.baslik}</h3>
          <span className="textlink">Haberi oku</span>
        </Link>
      ))}
    </div>
  );
}
export function PilotCta() {
  return (
    <section className="section pale">
      <div className="wrap split">
        <h2>Önce küçük başla. Sonucu birlikte ölç.</h2>
        <div>
          <p>
            Az sayıda kontrol noktası ve gerçekten kullanılan formlarla
            başlayalım. İşlem süresini, geçmişe erişimi ve kâğıt kullanımını
            aynı yöntemle ölçelim.
          </p>
          <Link className="btn" href="/greenlog/pilot">
            Pilot yöntemine bak
          </Link>
        </div>
      </div>
    </section>
  );
}
export function CopSource() {
  return (
    <div className="source cop-source">
      Tarih ve program için{" "}
      <a href="https://unfccc.int/cop31" target="_blank" rel="noreferrer">
        UNFCCC’nin COP31 sayfasını
      </a>{" "}
      kontrol edin. Bu bölüm bağımsız editoryal yayındır; resmî ortaklık veya
      katılım kaydı değildir. Kaynak kontrolü:{" "}
      <time dateTime="2026-10-22">22 Ekim 2026</time>.
    </div>
  );
}
