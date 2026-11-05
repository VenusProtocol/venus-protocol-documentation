// Checks run on every PR, against the built dist/:
//  1. every URL GitBook served (scripts/gitbook-urls.txt) is still a page or a redirect;
//  2. every redirect in vercel.json lands on a page and does not shadow one;
//  3. no page source carries active HTML (scripts, frames, event handlers, javascript: URLs).
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const DOCS = path.join(ROOT, 'src/content/docs');
const errors = [];

const isPage = (url) => {
  const p = url.replace(/^\/|\/$/g, '');
  return [path.join(DIST, p, 'index.html'), path.join(DIST, p)].some((f) => fs.existsSync(f) && fs.statSync(f).isFile());
};
// Vercel reads redirect sources as path-to-regexp; ours are literal paths with escapes.
const unescape = (s) => s.replace(/\\(.)/g, '$1');
const { redirects } = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const sources = new Set(redirects.map((r) => unescape(r.source)));

for (const r of redirects) {
  const src = unescape(r.source);
  if (/[()[\]*+?:]/.test(r.source.replace(/\\./g, ''))) errors.push(`redirect ${r.source}: unescaped pattern character`);
  if (isPage(src)) errors.push(`redirect ${src} shadows a live page`);
  if (!r.destination.startsWith('/')) errors.push(`redirect ${src} -> ${r.destination}: must stay on this site`);
  else if (!isPage(r.destination)) errors.push(`redirect ${src} -> ${r.destination}: destination is not a page`);
}

const urls = fs.readFileSync(path.join(ROOT, 'scripts/gitbook-urls.txt'), 'utf8').split('\n').filter((l) => l.startsWith('/'));
for (const url of urls) if (!isPage(url) && !sources.has(url)) errors.push(`${url}: GitBook URL is neither a page nor a redirect`);

const ACTIVE = /<\s*(script|iframe|frame|object|embed|form|style|base|meta|link)\b|<[^>]*\son[a-z]+\s*=|javascript:/i;
for (const f of fs.readdirSync(DOCS, { recursive: true }).filter((f) => /\.mdx?$/.test(f))) {
  const src = fs.readFileSync(path.join(DOCS, f), 'utf8').replace(/^```[\s\S]*?^```/gm, '').replace(/`[^`\n]*`/g, '');
  const m = src.match(ACTIVE);
  if (m) errors.push(`src/content/docs/${f}: active HTML not allowed (${m[0].trim()})`);
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(`urls: ${urls.length} GitBook URLs and ${redirects.length} redirects OK; page sources clean`);
