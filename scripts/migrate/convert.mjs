// One-way converter from the GitBook layout (SUMMARY.md + files at their repo paths) to
// Starlight (src/content/docs/<public URL>.md). Re-runnable: point --src at a checkout of
// the last GitBook-layout commit and it rewrites src/content/docs, src/sidebar.json and
// public/assets from scratch.
//
//   node scripts/migrate/convert.mjs --src /path/to/gitbook-checkout
import fs from 'node:fs';
import { parseArgs } from 'node:util';
import path from 'node:path';
import { parseSummary, pages } from './summary.mjs';

const { values: args } = parseArgs({ options: { src: { type: 'string' } } });
if (!args.src) throw new Error('--src <gitbook checkout> is required');
const SRC = path.resolve(args.src);
const OUT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const DOCS = path.join(OUT, 'src/content/docs');
const ASSETS_SRC = path.join(SRC, '.gitbook/assets');
const ASSETS_OUT = path.join(OUT, 'public/assets');
const SELF = /^https?:\/\/docs(?:-v4)?\.venus\.io/;
// Images GitBook hot-linked from third-party hosts, downloaded into scripts/migrate/imported/.
const IMPORTED = JSON.parse(fs.readFileSync(path.join(OUT, 'scripts/migrate/imported.json'), 'utf8'));
const ASIDE = { info: 'note', success: 'tip', warning: 'caution', danger: 'danger' };

const report = [];
const note = (file, msg) => report.push(`- \`${file}\`: ${msg}`);

const groups = parseSummary(SRC);
const all = pages(groups);
const urlByFile = new Map(all.map((p) => [p.file, p.url]));

// GitHub tree/blob links to files that move into public/assets.
const GH_ASSET = /^https:\/\/github\.com\/VenusProtocol\/venus-protocol-documentation\/(?:tree|blob)\/main\/\.gitbook\/assets\//;

function resolveLink(fromFile, href) {
  const [raw, hash] = href.split('#');
  if (!raw) return href; // same-page anchor
  if (IMPORTED[raw]) return '/assets/imported/' + IMPORTED[raw];
  if (GH_ASSET.test(raw)) return '/assets/' + raw.replace(GH_ASSET, '') + (hash ? `#${hash}` : '');
  if (SELF.test(raw)) {
    const p = raw.replace(SELF, '') || '/';
    return p + (hash ? `#${hash}` : '');
  }
  if (/^[a-z]+:/i.test(raw) || raw.startsWith('/')) return href;
  const target = path.posix.normalize(path.posix.join(path.posix.dirname(fromFile), decodeURI(raw)));
  // Asset paths with a wrong number of `../` were broken on GitBook too; the file name is unambiguous.
  const asset = target.split('.gitbook/assets/')[1];
  if (asset !== undefined) {
    if (!target.startsWith('.gitbook/assets/')) note(fromFile, `fixed asset path: ${href}`);
    return '/assets/' + encodeURI(asset);
  }
  if (target.endsWith('.md')) {
    let url = urlByFile.get(target);
    if (url === undefined) {
      const ci = [...urlByFile.keys()].find((f) => f.toLowerCase() === target.toLowerCase());
      if (ci) { url = urlByFile.get(ci); note(fromFile, `fixed link case: ${href}`); }
    }
    if (url === undefined) { note(fromFile, `link to page not in SUMMARY: ${href}`); return href; }
    return '/' + url + (hash ? `#${hash}` : '');
  }
  // Non-page repo files (whitepapers etc.) stay on GitHub.
  if (fs.existsSync(path.join(SRC, target))) {
    return `https://github.com/VenusProtocol/venus-protocol-documentation/blob/main/${encodeURI(target)}`;
  }
  note(fromFile, `unresolved link: ${href}`);
  return href;
}

const spec = (() => {
  const f = path.join(ASSETS_SRC, 'swagger.json');
  return fs.existsSync(f) ? JSON.parse(fs.readFileSync(f, 'utf8')) : null;
})();
const cell = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n+/g, '<br>');

// GitBook rendered {% swagger %} blocks live from the spec; render the same operation statically.
function swagger(file, attrs) {
  const p = attrs.match(/path="([^"]+)"/)?.[1];
  const m = attrs.match(/method="([^"]+)"/)?.[1];
  const op = spec?.paths?.[p]?.[m];
  if (!op) { note(file, `swagger operation not found: ${m} ${p}`); return `\`${m?.toUpperCase()} ${p}\`\n`; }
  const out = [`#### \`${m.toUpperCase()} ${p}\``, ''];
  if (op.summary) out.push(op.summary, '');
  if (op.description) out.push(op.description, '');
  const params = op.parameters ?? [];
  if (params.length) {
    out.push('| Parameter | In | Type | Required | Description |', '| --- | --- | --- | --- | --- |');
    for (const x of params) {
      const t = x.schema?.enum ? x.schema.enum.map((e) => `\`${e}\``).join(' \\| ') : x.schema?.type ?? '';
      out.push(`| \`${x.name}\` | ${x.in} | ${cell(t)} | ${x.required ? 'yes' : 'no'} | ${cell(x.description)} |`);
    }
    out.push('');
  }
  const res = Object.entries(op.responses ?? {});
  if (res.length) out.push('**Responses:** ' + res.map(([c, r]) => `\`${c}\` ${r.description ?? ''}`.trim()).join(' · '), '');
  return out.join('\n');
}

function splitFrontmatter(src) {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return [{}, src];
  const fm = {};
  for (const line of m[1].split('\n')) {
    const kv = line.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv && kv[2] !== '') fm[kv[1]] = kv[2].replace(/^['"]|['"]$/g, '');
  }
  return [fm, src.slice(m[0].length)];
}

const yamlStr = (s) => JSON.stringify(s);

function convert(page) {
  const file = page.file;
  let [fm, body] = splitFrontmatter(fs.readFileSync(path.join(SRC, file), 'utf8'));

  // Title: the leading H1 (ATX or setext), else the SUMMARY label. Starlight renders it.
  let title = page.label;
  body = body.replace(/^\s*/, '');
  const atx = body.match(/^# (.+)\n/);
  const setext = body.match(/^([^\n]+)\n=+\s*\n/);
  if (atx) { title = atx[1].trim(); body = body.slice(atx[0].length); }
  else if (setext) { title = setext[1].trim(); body = body.slice(setext[0].length); }
  else note(file, 'no H1; title taken from SUMMARY');

  const outside = (fn) => body.split(/(^```[\s\S]*?^```)/m).map((chunk, i) => (i % 2 ? chunk : fn(chunk))).join('');

  body = outside((s) => s
    .replace(/\{% hint style="(\w+)" %\}\n?/g, (_, style) => {
      if (!ASIDE[style]) note(file, `unknown hint style ${style}`);
      return `:::${ASIDE[style] ?? 'note'}\n`;
    })
    .replace(/\n?\{% endhint %\}/g, '\n:::')
    .replace(/\{% swagger ([^%]*)%\}[\s\S]*?\{% endswagger %\}/g, (_, a) => swagger(file, a))
    // Markdown links and images, including GitBook's `"mention"` titles.
    .replace(/(!?\[[^\]]*\]\()(<[^>]+>|[^)\s]+)((?:\s+"[^"]*")?\))/g, (_, pre, href, post) => {
      const bare = href.replace(/^<|>$/g, '');
      return pre + resolveLink(file, bare) + post.replace(/\s+"mention"/, '');
    })
    // Raw HTML attributes (GitBook figures and anchors).
    .replace(/(<(?:img|a)\b[^>]*?\s(?:src|href)=")([^"]+)(")/g, (_, pre, href, post) => pre + resolveLink(file, href) + post)
    .replace(/<figcaption><\/figcaption>/g, ''));

  for (const leftover of body.match(/\{%[^%]*%\}/g) ?? []) note(file, `unconverted GitBook tag: ${leftover}`);

  const head = ['---', `title: ${yamlStr(title)}`];
  if (fm.description) head.push(`description: ${yamlStr(fm.description)}`);
  head.push('---', '');
  return head.join('\n') + body.replace(/^\n+/, '\n');
}

function outPath(url) {
  return path.join(DOCS, (url === '' ? 'index' : url) + '.md');
}

// Starlight groups cannot be links, so a page with children becomes a collapsed group
// whose first entry is the page itself.
function sidebarItem(n) {
  if (n.external) return { label: n.label, link: n.external, attrs: { target: '_blank', rel: 'noopener noreferrer' } };
  const self = { label: n.label, link: '/' + n.url };
  if (!n.children.length) return self;
  return { label: n.label, collapsed: true, items: [{ ...self, label: 'Overview' }, ...n.children.map(sidebarItem)] };
}

fs.rmSync(DOCS, { recursive: true, force: true });
for (const page of all) {
  const dest = outPath(page.url);
  if (fs.existsSync(dest)) { note(page.file, `duplicate URL /${page.url}`); continue; }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.writeFileSync(dest, convert(page));
}

const sidebar = groups.map((g) => ({ label: g.label, items: g.items.map(sidebarItem) }));
fs.writeFileSync(path.join(OUT, 'src/sidebar.json'), JSON.stringify(sidebar, null, 2) + '\n');

fs.rmSync(ASSETS_OUT, { recursive: true, force: true });
fs.cpSync(ASSETS_SRC, ASSETS_OUT, { recursive: true });
fs.cpSync(path.join(OUT, 'scripts/migrate/imported'), path.join(ASSETS_OUT, 'imported'), { recursive: true });

const unlisted = [];
(function scan(dir) {
  for (const e of fs.readdirSync(path.join(SRC, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.name.startsWith('.') || e.name === 'node_modules' || e.name === 'src' || e.name === 'scripts') continue;
    if (e.isDirectory()) scan(rel);
    else if (rel.endsWith('.md') && rel !== 'SUMMARY.md' && !urlByFile.has(rel)) unlisted.push(rel);
  }
})('');
for (const f of unlisted) note(f, 'not in SUMMARY.md, not served by GitBook; dropped');

fs.writeFileSync(path.join(OUT, 'scripts/migrate/REPORT.md'),
  `# Conversion report\n\n${all.length} pages converted.\n\n${report.join('\n')}\n`);
console.log(`${all.length} pages, ${report.length} notes -> scripts/migrate/REPORT.md`);
