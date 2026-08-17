import { createContentLoader } from 'vitepress'

export interface Post {
  title: string
  url: string
  description: string
  /** Directory under blog/, or undefined for a post sitting at the top level. */
  category?: string
  author?: string
  date: { iso: string; time: number; label: string }
}

declare const data: Post[]
export { data }

export default createContentLoader<Post[]>('blog/**/*.md', {
  globOptions: { ignore: ['**/index.md', '**/_*.md'] },
  transform(raw): Post[] {
    return raw
      .filter((p) => !p.frontmatter.draft && p.frontmatter.title)
      .map(({ url, frontmatter }) => ({
        title: frontmatter.title,
        url,
        description: frontmatter.description ?? '',
        category: categoryFromUrl(url),
        author: frontmatter.author,
        date: formatDate(frontmatter.date)
      }))
      .sort((a, b) => b.date.time - a.date.time)
  }
})

/* `/blog/success-stories/ambire` -> `success-stories`. A post directly under
 * /blog/ has no category. */
function categoryFromUrl(url: string): string | undefined {
  const parts = url.split('/').filter(Boolean)
  return parts.length > 2 ? parts[1] : undefined
}

function formatDate(raw: string | Date | undefined): Post['date'] {
  /* Noon UTC so the rendered day is the same either side of the date line. */
  const date = raw ? new Date(raw) : new Date(0)
  date.setUTCHours(12, 0, 0, 0)
  return {
    iso: date.toISOString().slice(0, 10),
    time: +date,
    label: date.toLocaleDateString('en-GB', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    })
  }
}
