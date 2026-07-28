import Link from "next/link";

export default function Bulunamadi() {
  return (
    <div className="relative">
      <div className="izgara" />
      <div className="relative mx-auto max-w-3xl px-5 py-24 text-center">
        <p className="etiket text-terra">404</p>
        <h1 className="mt-3 text-3xl leading-tight tracking-tight">Bu sayfa bulunamadı</h1>
        <p className="mt-4 text-solgun">
          Aradığınız haber taşınmış veya adres yanlış yazılmış olabilir.
        </p>
        <Link
          href="/"
          className="etiket mt-8 inline-block rounded-sm bg-cam px-5 py-2.5 text-krem transition-opacity hover:opacity-90"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
