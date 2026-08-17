/* RSS.
 *
 * Generated in `buildEnd` from the same posts the blog index reads, so the feed
 * cannot list something the site does not. Hand-rolled rather than pulling in a
 * feed library: it is one well-specified XML document and the escaping is the
 * only part that needs care. */

import { writeFileSync } from 'node:fs'
import path from 'node:path'
import { createContentLoader, type SiteConfig } from 'vitepress'

const HOST = 'https://siwe.xyz'
const TITLE = 'Sign-In with Ethereum'
const DESCRIPTION =
  'Case studies, changes to the standard, and notes from the libraries behind ERC-4361.'

export async function generateFeed(config: SiteConfig) {
  const posts = await createContentLoader('blog/**/*.md', {
    render: true,
    globOptions: { ignore: ['**/index.md', '**/_*.md'] }
  }).load()

  const items = posts
    .filter((p) => p.frontmatter.title && !p.frontmatter.draft)
    .sort((a, b) => +new Date(b.frontmatter.date) - +new Date(a.frontmatter.date))

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
<channel>
<title>${esc(TITLE)}</title>
<link>${HOST}/blog/</link>
<description>${esc(DESCRIPTION)}</description>
<language>en-us</language>
<atom:link href="${HOST}/feed.rss" rel="self" type="application/rss+xml"/>
${items.map(item).join('\n')}
</channel>
</rss>
`

  writeFileSync(path.join(config.outDir, 'feed.rss'), xml)
}

function item(p: { url: string; html?: string; frontmatter: Record<string, unknown> }) {
  const url = `${HOST}${p.url}`
  const date = new Date(String(p.frontmatter.date))
  /* Noon UTC, so the published day does not shift either side of the date line. */
  date.setUTCHours(12, 0, 0, 0)

  return `<item>
<title>${esc(String(p.frontmatter.title))}</title>
<link>${url}</link>
<guid isPermaLink="true">${url}</guid>
<pubDate>${date.toUTCString()}</pubDate>
<description>${esc(String(p.frontmatter.description ?? ''))}</description>
<content:encoded xmlns:content="http://purl.org/rss/1.0/modules/content/"><![CDATA[${cdata(
    p.html ?? ''
  )}]]></content:encoded>
</item>`
}

function esc(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/* A `]]>` inside the body would close the section early. */
function cdata(s: string) {
  return s.replace(/]]>/g, ']]]]><![CDATA[>')
}
