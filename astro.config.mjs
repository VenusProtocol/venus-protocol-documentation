// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightLinksValidator from 'starlight-links-validator';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import sidebar from './src/sidebar.json' with { type: 'json' };

export default defineConfig({
  site: 'https://docs-v4.venus.io',
  // GitBook served every page without a trailing slash; keep the same URLs.
  trailingSlash: 'never',
  markdown: {
    // GitBook only treated `$$…$$` as math, so a lone `$100` stays text.
    remarkPlugins: [[remarkMath, { singleDollarTextMath: false }]],
    // MathML needs no KaTeX stylesheet, fonts or inline styles.
    rehypePlugins: [[rehypeKatex, { output: 'mathml', strict: 'ignore' }]],
  },
  integrations: [
    starlight({
      title: 'Venus Protocol',
      description: 'Documentation and guides for interacting with and integrating the Venus Protocol.',
      logo: { light: './src/assets/logo-light.svg', dark: './src/assets/logo-dark.svg', replacesTitle: true },
      favicon: '/favicon.svg',
      customCss: ['./src/styles/venus.css'],
      social: [
        { icon: 'github', label: 'GitHub', href: 'https://github.com/VenusProtocol' },
        { icon: 'x.com', label: 'X', href: 'https://x.com/VenusProtocol' },
        { icon: 'discord', label: 'Discord', href: 'https://discord.gg/venus-protocol-912811548651708448' },
        { icon: 'telegram', label: 'Telegram', href: 'https://t.me/venusprotocol' },
      ],
      editLink: { baseUrl: 'https://github.com/VenusProtocol/venus-protocol-documentation/edit/main/' },
      lastUpdated: true,
      sidebar,
      plugins: [starlightLinksValidator({ errorOnRelativeLinks: false, errorOnInvalidHashes: false })],
    }),
  ],
});
