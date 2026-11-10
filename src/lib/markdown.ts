import { getCollection, type CollectionEntry } from 'astro:content';
import sidebar from '../sidebar.json';

type Item = { label: string; link?: string; items?: Item[] };

export const SITE = 'https://docs-v4.venus.io';

// URL of the Markdown copy of a page; the home page is `/index.md`.
export const mdPath = (id: string) => `/${id === 'index' ? 'index' : id}.md`;

export const toMarkdown = (entry: CollectionEntry<'docs'>) =>
  `# ${entry.data.title}\n\n${entry.body?.trim() ?? ''}\n`;

// Pages in sidebar order, the order a reader (or an agent) would meet them.
export async function orderedDocs() {
  const docs = new Map((await getCollection('docs')).map((d) => [d.id, d]));
  const out: { section: string; label: string; entry: CollectionEntry<'docs'> }[] = [];
  const visit = (section: string, items: Item[]) => {
    for (const it of items) {
      const id = it.link?.startsWith('/') ? it.link.slice(1) || 'index' : undefined;
      const entry = id ? docs.get(id) : undefined;
      if (entry && !out.some((o) => o.entry === entry)) out.push({ section, label: it.label === 'Overview' ? entry.data.title : it.label, entry });
      if (it.items) visit(section, it.items);
    }
  };
  for (const group of sidebar as Item[]) visit(group.label, group.items ?? []);
  return out;
}
