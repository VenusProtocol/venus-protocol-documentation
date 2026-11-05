import type { APIRoute } from 'astro';
import { orderedDocs, toMarkdown } from '../lib/markdown';

export const GET: APIRoute = async () =>
  new Response((await orderedDocs()).map(({ entry }) => toMarkdown(entry)).join('\n---\n\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
