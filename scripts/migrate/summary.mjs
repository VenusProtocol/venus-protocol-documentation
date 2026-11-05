// Parse GitBook's SUMMARY.md and derive each page's public URL the way GitBook does:
// a page's slug is its lower-cased file name (a README takes its folder's name), and it
// hangs under its parent page's URL, or under the slugified group heading at top level.
import fs from 'node:fs';
import path from 'node:path';

const slugify = (s) => s.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-');

export function pageSlug(file) {
  const base = path.posix.basename(file, '.md');
  return (base === 'README' ? path.posix.basename(path.posix.dirname(file)) : base).toLowerCase();
}

export function parseSummary(root) {
  const lines = fs.readFileSync(path.join(root, 'SUMMARY.md'), 'utf8').split('\n');
  const groups = [];
  const stack = []; // [{indent, node}]
  for (const line of lines) {
    const g = line.match(/^## (.+)$/);
    if (g) { groups.push({ label: g[1].trim(), slug: slugify(g[1]), items: [] }); stack.length = 0; continue; }
    const m = line.match(/^(\s*)\* \[(.*)\]\((.+)\)\s*$/);
    if (!m) continue;
    const indent = m[1].length;
    const target = decodeURI(m[3].trim());
    const node = { label: m[2], children: [] };
    if (/^https?:\/\//.test(target)) node.external = target; else node.file = target;
    while (stack.length && stack.at(-1).indent >= indent) stack.pop();
    const parent = stack.at(-1)?.node;
    const group = groups.at(-1);
    if (node.file) {
      if (node.file === 'README.md' && !parent) node.url = '';
      else node.url = `${parent?.url ?? group.slug}/${pageSlug(node.file)}`.replace(/^\//, '');
    }
    (parent ? parent.children : group.items).push(node);
    stack.push({ indent, node });
  }
  return groups;
}

export function* walk(nodes) {
  for (const n of nodes) { yield n; yield* walk(n.children); }
}

export function pages(groups) {
  return groups.flatMap((g) => [...walk(g.items)]).filter((n) => n.file);
}
