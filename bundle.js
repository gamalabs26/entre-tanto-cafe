// Empaqueta el sitio en UN solo HTML autocontenido: fotos (webp) y tipografías
// incrustadas como data URIs. Se abre sin servidor, sin red externa.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const dir = import.meta.dirname;
let html = readFileSync(join(dir, "index.html"), "utf8");

// 1) Incrustar imágenes webp
html = html.replace(/(src=")img\/(foto-\d+\.webp)(")/g, (m, a, file, b) => {
  const buf = readFileSync(join(dir, "img", file));
  return `${a}data:image/webp;base64,${buf.toString("base64")}${b}`;
});

// 2) Incrustar tipografías (fetch de Google Fonts CSS + woff2 -> data URI)
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36";
const cssUrl = "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..700&family=Inter:wght@300;400;500;600;700&display=swap";
let css = await (await fetch(cssUrl, { headers: { "User-Agent": UA } })).text();

// Quedarnos SOLO con los @font-face del subset latino (cubre español + inglés) para no inflar
const blocks = css.match(/\/\*[^*]*\*\/\s*@font-face\s*\{[^}]*\}/g) || [];
css = blocks.filter(b => /U\+0000-00FF/.test(b)).join("\n");

const urls = [...css.matchAll(/url\((https:\/\/fonts\.gstatic\.com\/[^)]+\.woff2)\)/g)].map(m => m[1]);
const uniq = [...new Set(urls)];
console.log(`Incrustando ${uniq.length} archivos de fuente...`);
for (const u of uniq) {
  const buf = Buffer.from(await (await fetch(u, { headers: { "User-Agent": UA } })).arrayBuffer());
  css = css.split(u).join(`data:font/woff2;base64,${buf.toString("base64")}`);
}

// reemplazar el <link> de google fonts por el CSS inline
html = html.replace(/<link rel="preconnect"[^>]*>\s*/g, "");
html = html.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2[^>]*>/, `<style>${css}</style>`);

// og:image relativo no sirve offline: quitarlo para evitar peticiones
html = html.replace(/<meta property="og:image"[^>]*>/, "");

writeFileSync(join(dir, "entre-tanto-cafe.html"), html);
const kb = Math.round(Buffer.byteLength(html) / 1024);
console.log(`✅ entre-tanto-cafe.html (${kb} KB) — autocontenido, se abre sin servidor`);
