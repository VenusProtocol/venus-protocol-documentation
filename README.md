# Venus Protocol Documentation

Source of [docs-v4.venus.io](https://docs-v4.venus.io). A static [Starlight](https://starlight.astro.build)
site built from this repository and deployed on Vercel; every change goes through a reviewed pull request.

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build    # dist/, plus the CSP step
pnpm check    # URL parity, redirects, page-source safety (after build)
```

Node 24 (`.nvmrc`), pnpm 10 (`packageManager`).

- Pages: `src/content/docs/<url>.md` — the file path is the URL.
- Sidebar: `src/sidebar.json`.
- Images and downloads: `public/assets/`.
- Redirects and security headers: `vercel.json`.
- Whitepapers: `whitepapers/` (linked from the sidebar on GitHub).

Conventions for writing and changing pages are in [CLAUDE.md](CLAUDE.md).

Until November 2026 the docs were hosted on GitBook. `scripts/migrate/` holds the one-way converter
from the GitBook layout and its report.
