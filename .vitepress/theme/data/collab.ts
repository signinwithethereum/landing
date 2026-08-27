/* Shared lockup helpers for success-story marks.
 *
 * Resolve order: frontmatter `logo`, then the story's known mark, then
 * /integrators/{slug}.svg. */

import { MARKS } from './marks'
import { STORIES } from './stories'

export function storySlug(path: string): string {
  const rel = path.replace(/\\/g, '/').replace(/\/$/, '')
  const needle = 'blog/success-stories/'
  const i = rel.indexOf(needle)
  if (i < 0 || rel.endsWith('index.md')) return ''
  return rel.slice(i + needle.length).replace(/\.md$/, '')
}

export function logoForStory(slug: string, frontmatterLogo?: unknown): string {
  if (typeof frontmatterLogo === 'string' && frontmatterLogo) return frontmatterLogo
  if (!slug) return ''
  const story = STORIES.find((x) => x.link.replace(/\/$/, '').endsWith('/' + slug))
  if (story?.org && MARKS[story.org]) return MARKS[story.org]
  if (story?.logo) return story.logo
  return `/integrators/${slug}.svg`
}

export function orgForStory(slug: string): string {
  return STORIES.find((x) => x.link.replace(/\/$/, '').endsWith('/' + slug))?.org ?? slug
}
