# Venus docs — conventions

Static Starlight site. Content is Markdown; a PR with a Vercel preview and one human review is the
only way anything reaches docs-v4.venus.io.

## Layout

- A page lives at `src/content/docs/<url>.md`; its URL is the path without `.md`
  (`src/content/docs/tokens/xvs.md` → `/tokens/xvs`, `index.md` → `/`). URLs are lower-case,
  hyphenated and have no trailing slash.
- Frontmatter: `title` (required, rendered as the page H1 — do not repeat it as `# …` in the body)
  and optionally `description`.
- The sidebar is `src/sidebar.json`, not inferred from folders. A new page needs an entry there.
  A page with children is a collapsed group whose first item is the page itself, labelled `Overview`.
- Images and downloadable files go in `public/assets/` and are linked as `/assets/<file>`.
  Never hot-link images from other hosts: the CSP only allows images from this site.

## Writing

- Links between pages are absolute site paths: `[XVS](/tokens/xvs)`, `[...](/tokens/xvs#staking)`.
- Callouts use Starlight asides: `:::note`, `:::tip`, `:::caution`, `:::danger`, closed by `:::`.
- Math: `$$…$$` inline or as a block on its own lines. A single `$` is plain text.
- Code blocks are fenced with a language (`solidity`, `ts`, `bash`, `text`).
- Raw HTML is allowed for figures and tables only. Scripts, iframes, forms, `<style>`, event-handler
  attributes and `javascript:` URLs fail CI.
- Contract addresses: copy them from the deployment artifacts of the source repo, never retype them,
  and give the chain.

## Moving or deleting a page

Every URL that was ever published must keep working:

1. `git mv` the file and update its `src/sidebar.json` entry and every link to it.
2. Add a permanent redirect from the old path to the new one in `vercel.json` (`redirects`).
   Escape `( ) [ ] { } ? + * . : |` in `source` with a backslash; Vercel reads it as a pattern.
3. Point existing redirects whose destination was the old path at the new one.

`scripts/gitbook-urls.txt` lists every URL GitBook served; never delete lines from it.

## Checks

`pnpm build && pnpm check` locally, the same as CI:

- `astro build` fails on broken internal links (`starlight-links-validator`).
- `scripts/csp.mjs` writes a hash-based Content-Security-Policy into every page and fails if a page
  carries an inline script that is not in `scripts/csp-hashes.json`. After upgrading Astro or
  Starlight, run `node scripts/csp.mjs --write`, confirm the new hashes come from the framework, and
  commit the file in the upgrade PR.
- `scripts/check-urls.mjs` checks URL parity with GitBook, redirect targets, and page sources.

Astro and Starlight are pinned to exact versions; Starlight is 0.x and breaks config on most minor
releases, so upgrade deliberately in a dedicated PR.

## Do not

- Do not re-run `scripts/migrate/convert.mjs`: it was the one-time import from GitBook and would
  overwrite every page.
- Do not add third-party scripts, fonts, analytics or embeds without an explicit decision: the CSP
  blocks them, and the point of self-hosting is that nothing else can change what this site serves.
