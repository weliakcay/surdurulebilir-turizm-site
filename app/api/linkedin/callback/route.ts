/**
 * LinkedIn OAuth dönüş adresi.
 *
 * LinkedIn redirect URI'lerin HTTPS olmasını şart koşuyor, bu yüzden yetkilendirme
 * yayındaki site üzerinden yapılır. Bu route yetkilendirme kodunu ekranda gösterir;
 * kodu kopyalayıp yerelde şu komutla token'a çevirirsiniz:
 *
 *   npm run linkedin:auth -- --code <kod>
 *
 * Kodun ömrü 30 dakikadır ve tek kullanımlıktır.
 */

function sayfa(baslik: string, govde: string, durum = 200): Response {
  return new Response(
    `<!doctype html><html lang="tr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex,nofollow">
<title>${baslik}</title>
<style>
  body{margin:0;min-height:100vh;display:grid;place-items:center;background:#f6f1e7;color:#101f1d;
       font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;padding:24px}
  .k{max-width:640px;background:#fffdf8;border:1px solid #d9d0be;border-radius:14px;padding:32px}
  h1{margin:0 0 12px;font-size:22px;letter-spacing:-.01em}
  code{display:block;margin:16px 0;padding:14px;background:#0b3b39;color:#f6f1e7;border-radius:8px;
       word-break:break-all;font-size:13px;user-select:all}
  .n{color:#5b6e6b;font-size:14px}
  @media(prefers-color-scheme:dark){
    body{background:#091614;color:#e9efed}.k{background:#0e211e;border-color:#1e3330}.n{color:#93a5a2}
  }
</style></head><body><div class="k">${govde}</div></body></html>`,
    { status: durum, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const kod = url.searchParams.get("code");
  const hata = url.searchParams.get("error");
  const hataAciklama = url.searchParams.get("error_description");
  const state = url.searchParams.get("state");

  if (hata) {
    return sayfa(
      "Yetkilendirme iptal edildi",
      `<h1>Yetkilendirme tamamlanmadı</h1>
       <p class="n">LinkedIn şu hatayı döndü:</p>
       <code>${hata}${hataAciklama ? ` — ${decodeURIComponent(hataAciklama)}` : ""}</code>
       <p class="n">Yeniden denemek için <code>npm run linkedin:auth</code> çalıştırıp
       verilen bağlantıyı açın.</p>`,
      400,
    );
  }

  if (!kod) {
    return sayfa(
      "Kod yok",
      `<h1>Yetkilendirme kodu gelmedi</h1>
       <p class="n">Bu adrese doğrudan gelmiş olabilirsiniz. Akışı başlatmak için yerelde
       <code>npm run linkedin:auth</code> çalıştırın.</p>`,
      400,
    );
  }

  return sayfa(
    "Yetkilendirme kodu",
    `<h1>Kod alındı</h1>
     <p class="n">Aşağıdaki kodu kopyalayın ve yerelde şu komutu çalıştırın:</p>
     <code>npm run linkedin:auth -- --code ${kod}</code>
     <p class="n"><strong>Kodun ömrü 30 dakika</strong> ve tek kullanımlıktır.
     ${state ? `<br>state: <em>${state}</em> — başlattığınız değerle aynı olmalı.` : ""}</p>`,
  );
}
