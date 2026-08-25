import { defineConfig } from 'vitepress'

/* The extension is required: Vite 8's native config loader warns on
 * extensionless relative imports and will stop resolving them. */
import { generateFeed } from './rss.ts'

const HOST = 'https://siwe.xyz'
const DESCRIPTION =
  'Sign in with Ethereum is an open authentication standard. A user signs a readable message with an Ethereum account and the server verifies it.'

export default defineConfig({
  srcDir: 'src',
  outDir: '.vitepress/dist',
  cleanUrls: true,
  lang: 'en-US',
  title: 'Sign in with Ethereum',
  titleTemplate: ':title — SIWE',
  description: DESCRIPTION,
  appearance: 'dark',

  /* Geist is self-hosted in `theme/style/fonts.css`, so the default theme's
   * bundled Inter is not needed. */
  useWebFonts: false,

  srcExclude: ['**/README.md', '**/_*.md'],

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#00eaf2' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'Sign in with Ethereum' }],
    ['meta', { property: 'og:image', content: `${HOST}/og.png` }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@signinethereum' }],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/rss+xml',
        title: 'Sign in with Ethereum',
        href: `${HOST}/feed.rss`
      }
    ]
  ],

  sitemap: { hostname: HOST },

  buildEnd: generateFeed,

  markdown: {
    theme: { light: 'github-light', dark: 'github-dark-default' },
    lineNumbers: false,
    codeTransformers: []
  },

  themeConfig: {
    /* The wordmark is rendered inline by the layout, so the default title and
     * logo are both off. */
    siteTitle: false,

    nav: [
      { text: 'Docs', link: '/docs/', activeMatch: '^/docs/(?!libraries)' },
      { text: 'Libraries', link: '/docs/libraries/', activeMatch: '^/docs/libraries' },
      { text: 'Ecosystem', link: '/ecosystem', activeMatch: '^/ecosystem' },
      { text: 'Blog', link: '/blog/', activeMatch: '^/blog' },
      { text: 'GitHub', link: 'https://github.com/signinwithethereum' }
    ],

    sidebar: {
      '/docs/': [
        {
          text: 'Start',
          items: [
            { text: 'Introduction', link: '/docs/' },
            { text: 'The message', link: '/docs/message' },
            {
              text: 'Quickstart',
              link: '/docs/quickstart/',
              items: [
                { text: 'Frontend', link: '/docs/quickstart/frontend' },
                { text: 'Backend', link: '/docs/quickstart/backend' }
              ]
            }
          ]
        },
        {
          text: 'Build',
          items: [
            { text: 'Security considerations', link: '/docs/security-considerations' },
            { text: 'Smart accounts', link: '/docs/smart-accounts' },
            { text: 'Sessions', link: '/docs/sessions' }
          ]
        },
        {
          text: 'Libraries',
          link: '/docs/libraries/',
          items: [
            { text: 'TypeScript', link: '/docs/libraries/typescript' },
            { text: 'Python', link: '/docs/libraries/python' },
            { text: 'Rust', link: '/docs/libraries/rust' },
            { text: 'Go', link: '/docs/libraries/go' },
            { text: 'Ruby', link: '/docs/libraries/ruby' }
          ]
        },
        {
          text: 'Integrations',
          link: '/docs/integrations/',
          items: [
            { text: 'Discourse', link: '/docs/integrations/discourse' },
            {
              text: 'OIDC provider',
              link: '/docs/oidc-provider/',
              items: [
                { text: 'API reference', link: '/docs/oidc-provider/api-reference' },
                { text: 'Deployment guide', link: '/docs/oidc-provider/deployment-guide' },
                { text: 'Client setup', link: '/docs/oidc-provider/client-setup' }
              ]
            }
          ]
        },
        {
          text: 'Reference',
          items: [
            { text: 'Message validator', link: '/tools/validator' },
            { text: 'ERC-4361', link: 'https://eips.ethereum.org/EIPS/eip-4361' }
          ]
        }
      ]
    },

    outline: { level: [2, 3], label: 'On this page' },

    search: {
      provider: 'local',
      options: {
        detailedView: true
      }
    },

    editLink: {
      pattern: 'https://github.com/signinwithethereum/landing-next/edit/main/src/:path',
      text: 'Edit this page on GitHub'
    },

    docFooter: { prev: 'Previous', next: 'Next' }

    /* The site footer is a theme component (SiteFooter.vue) rendered from the
     * layout-bottom slot, so it appears on pages with a sidebar too. */
  }
})
