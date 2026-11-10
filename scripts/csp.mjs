// Post-build: write a Content-Security-Policy <meta> into every page of dist/.
//
// Script hashes come only from scripts/csp-hashes.json, a reviewed file, never from page
// content: any inline <script> not in it (e.g. one smuggled into a Markdown page) fails
// the build. After a Starlight/Astro upgrade changes its own inline scripts, run
// `node scripts/csp.mjs --write`, check that the new hashes belong to the framework, and
// commit the file.
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const DIST = path.join(ROOT, 'dist');
const HASHES = path.join(ROOT, 'scripts/csp-hashes.json');
const write = process.argv.includes('--write');

const sha = (s) => `'sha256-${crypto.createHash('sha256').update(s).digest('base64')}'`;
const INLINE_SCRIPT = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
const META = /<meta http-equiv="content-security-policy"[^>]*>/gi;

const pages = fs.readdirSync(DIST, { recursive: true }).filter((f) => f.endsWith('.html')).map((f) => path.join(DIST, f));

const found = new Map(); // hash -> first page
for (const file of pages) {
  for (const [, body] of fs.readFileSync(file, 'utf8').matchAll(INLINE_SCRIPT)) {
    const h = sha(body);
    if (!found.has(h)) found.set(h, path.relative(DIST, file));
  }
}

if (write) {
  fs.writeFileSync(HASHES, JSON.stringify([...found.keys()].sort(), null, 2) + '\n');
  console.log(`csp: wrote ${found.size} script hashes to scripts/csp-hashes.json — review before committing`);
  process.exit(0);
}

const allowed = new Set(JSON.parse(fs.readFileSync(HASHES, 'utf8')));
const unknown = [...found].filter(([h]) => !allowed.has(h));
if (unknown.length) {
  for (const [h, page] of unknown) console.error(`csp: inline script ${h} in ${page} is not in scripts/csp-hashes.json`);
  process.exit(1);
}

const policy = [
  "default-src 'self'",
  // Pagefind (search) runs WebAssembly.
  `script-src 'self' 'wasm-unsafe-eval' ${[...allowed].join(' ')}`,
  "style-src 'self'",
  // Starlight and its code blocks colour tokens through style attributes; attributes cannot run code.
  "style-src-attr 'unsafe-inline'",
  "img-src 'self' data:",
  "font-src 'self'",
  "connect-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');
const meta = `<meta http-equiv="content-security-policy" content="${policy}">`;

for (const file of pages) {
  const html = fs.readFileSync(file, 'utf8').replace(META, '');
  if (!html.includes('<head>')) throw new Error(`csp: no <head> in ${file}`);
  fs.writeFileSync(file, html.replace('<head>', `<head>${meta}`));
}
console.log(`csp: policy written to ${pages.length} pages (${allowed.size} script hashes)`);
