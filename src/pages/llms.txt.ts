import type { APIRoute } from 'astro';
import { SITE, mdPath, orderedDocs } from '../lib/markdown';

export const GET: APIRoute = async () => {
  const lines = ['# Venus Protocol', ''];
  let section = '';
  for (const { section: s, label, entry } of await orderedDocs()) {
    if (s !== section) lines.push('', `## ${(section = s)}`, '');
    lines.push(`- [${label}](${SITE}${mdPath(entry.id)})`);
  }
  return new Response(lines.join('\n').replace(/\n{3,}/g, '\n\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
