import { spawnSync } from 'node:child_process'
import { mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs'
import path from 'node:path'
import type { SiteConfig } from 'vitepress'

const WIDTH = 1200
const HEIGHT = 630

/* The home page ships a hand-made card from `public/` rather than a generated
 * one. */
const HOME_IMAGE = { url: '/intro.png', width: WIDTH, height: HEIGHT }
const SITE_NAME = 'Sign in with Ethereum'
const FALLBACK_DESCRIPTION =
  'Sign in with Ethereum is an open authentication standard for Ethereum accounts.'

export function routeForPage(page: string) {
  const route = `/${page}`
    .replace(/index\.(?:html|md)$/, '')
    .replace(/\.(?:html|md)$/, '')
    .replace(/\/+/g, '/')

  return route === '/' ? route : route
}

export function ogImageForRoute(route: string) {
  if (route === '/') return HOME_IMAGE

  const page = route.replace(/^\//, '')
  return {
    url: `/og/${page.endsWith('/') ? `${page}index` : page}.png`,
    width: WIDTH,
    height: HEIGHT
  }
}

export async function generateOgImages(config: SiteConfig) {
  const outputDirectory = path.join(config.outDir, 'og')
  rmSync(outputDirectory, { recursive: true, force: true })

  const pages = markdownFiles(config.srcDir).map((sourcePath) => {
    const relativePath = path.relative(config.srcDir, sourcePath)
    return {
      route: routeForPage(outputPageForSource(relativePath)),
      ...metadataForSource(sourcePath)
    }
  })

  /* VitePress renders its own 404 page too, so give its social tags a real
   * image instead of leaving a dangling /og/404.png URL. */
  pages.push({
    route: '/404',
    title: 'Page not found',
    description: 'The page you requested is not available on Sign in with Ethereum.'
  })

  for (const { route, title, description } of pages) {
    /* The home card is a static asset; generating over it would delete it. */
    if (route === '/') continue

    const target = path.join(config.outDir, ogImageForRoute(route).url)

    mkdirSync(path.dirname(target), { recursive: true })
    renderPng(ogSvg(title, description), target)
  }
}

function markdownFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name)
    if (entry.isDirectory()) return markdownFiles(entryPath)
    return entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_')
      ? [entryPath]
      : []
  })
}

function outputPageForSource(relativePath: string) {
  return relativePath.replace(/\.md$/, '.html')
}

function metadataForSource(sourcePath: string) {
  const source = readFileSync(sourcePath, 'utf8')
  const title = frontmatterValue(source, 'title') ?? firstHeading(source) ?? SITE_NAME
  const description = frontmatterValue(source, 'description') ?? FALLBACK_DESCRIPTION
  return { title, description }
}

function frontmatterValue(source: string, key: string) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  const value = frontmatter?.[1].match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))?.[1]?.trim()
  if (!value) return undefined
  return value.replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, '$1$2')
}

function firstHeading(source: string) {
  return source.match(/^#\s+(.+)$/m)?.[1]?.trim()
}

function renderPng(svg: string, target: string) {
  const result = spawnSync('rsvg-convert', ['--output', target], {
    input: svg,
    encoding: 'utf8'
  })

  if (result.error || result.status !== 0) {
    const reason = result.error?.message ?? result.stderr ?? 'unknown error'
    throw new Error(`Could not generate ${target}: ${reason}`)
  }
}

function ogSvg(title: string, description: string) {
  const titleLines = wrap(title, 24, 3)
  const descriptionLines = wrap(description, 78, 3)
  const titleSize = titleLines.length > 2 ? 54 : 64
  const titleLeading = titleLines.length > 2 ? 62 : 70
  /* The title hangs from a fixed baseline under the rule and the description
   * follows it, so the two read as one block however long the title runs. */
  const descriptionTop = 200 + (titleLines.length - 1) * titleLeading + 82

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="#050505"/>
  <pattern id="scanlines" width="3" height="3" patternUnits="userSpaceOnUse"><path d="M0 .5H3" stroke="#fff" stroke-opacity=".06"/></pattern>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#scanlines)"/>
  <g fill="#ffffff" transform="translate(80 40) scale(4)">${mark()}</g>
  <rect x="80" y="108" width="1040" height="1" fill="#ffffff" fill-opacity=".25"/>
  <text x="80" y="200" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="${titleSize}" font-weight="700" letter-spacing="-1.7">${text(titleLines, 0, titleLeading)}</text>
  <text x="80" y="${descriptionTop}" fill="#b3b3b9" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="400">${text(descriptionLines, 0, 38)}</text>
  <line x1="80" y1="555" x2="1120" y2="555" stroke="#ffffff" stroke-opacity=".25"/>
  <text x="80" y="592" fill="#00eaf2" font-family="Courier New, monospace" font-size="18" letter-spacing="2.1">SIWE.XYZ</text>
  <text x="1120" y="592" fill="#b3b3b9" font-family="Courier New, monospace" font-size="18" text-anchor="end" letter-spacing="2.1">ERC-4361</text>
</svg>`
}

function wrap(value: string, width: number, maxLines: number) {
  const words = value.replace(/\s+/g, ' ').trim().split(' ')
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word
    if (candidate.length <= width || !line) {
      line = candidate
      continue
    }
    lines.push(line)
    line = word
    if (lines.length === maxLines) break
  }

  if (line && lines.length < maxLines) lines.push(line)
  const consumed = lines.join(' ').length
  if (value.replace(/\s+/g, ' ').trim().length > consumed) {
    lines[lines.length - 1] = `${lines[lines.length - 1].slice(0, -1)}…`
  }
  return lines
}

function text(lines: string[], start: number, lineHeight: number) {
  return lines
    .map((line, index) => `<tspan x="80" dy="${index === 0 ? start : lineHeight}">${escapeXml(line)}</tspan>`)
    .join('')
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]!
  })
}

function mark() {
  return `<rect x="1" y="0" width="5" height="1" rx="0.5"/><rect x="9" y="0" width="2" height="1" rx="0.5"/><rect x="13" y="0" width="2" height="1" rx="0.5"/><rect x="20" y="0" width="2" height="1" rx="0.5"/><rect x="24" y="0" width="5" height="1" rx="0.5"/><rect x="0" y="2" width="3" height="1" rx="0.5"/><rect x="9" y="2" width="2" height="1" rx="0.5"/><rect x="13" y="2" width="2" height="1" rx="0.5"/><rect x="20" y="2" width="2" height="1" rx="0.5"/><rect x="24" y="2" width="2" height="1" rx="0.5"/><rect x="1" y="4" width="5" height="1" rx="0.5"/><rect x="9" y="4" width="2" height="1" rx="0.5"/><rect x="13" y="4" width="2" height="1" rx="0.5"/><rect x="17" y="4" width="1" height="1" rx="0.5"/><rect x="20" y="4" width="2" height="1" rx="0.5"/><rect x="24" y="4" width="4" height="1" rx="0.5"/><rect x="4" y="6" width="3" height="1" rx="0.5"/><rect x="9" y="6" width="2" height="1" rx="0.5"/><rect x="13" y="6" width="2" height="1" rx="0.5"/><rect x="16" y="6" width="3" height="1" rx="0.5"/><rect x="20" y="6" width="2" height="1" rx="0.5"/><rect x="24" y="6" width="2" height="1" rx="0.5"/><rect x="1" y="8" width="5" height="1" rx="0.5"/><rect x="9" y="8" width="2" height="1" rx="0.5"/><rect x="14" y="8" width="3" height="1" rx="0.5"/><rect x="18" y="8" width="3" height="1" rx="0.5"/><rect x="24" y="8" width="5" height="1" rx="0.5"/>`
}
