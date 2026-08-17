/* Blog categories.
 *
 * A post's category is its directory under `src/blog/`, so the URL and the
 * category can never disagree and nothing has to be typed twice. Adding a
 * category means adding a directory, an index page, and an entry here. */

export interface Category {
  slug: string
  label: string
  /** Shown on the category page, under the title. */
  blurb: string
}

export const CATEGORIES: Category[] = [
  {
    slug: 'success-stories',
    label: 'Success stories',
    blurb:
      'What teams actually built on ERC-4361, written up in enough detail to be useful — including the parts they got wrong first.'
  },
  {
    slug: 'standard',
    label: 'The standard',
    blurb:
      'Changes to ERC-4361 and the specifications around it: errata, related ERCs, and what conformance means in practice.'
  },
  {
    slug: 'engineering',
    label: 'Engineering',
    blurb: 'Notes from the libraries, the test vectors, and the OIDC provider.'
  }
]

export function categoryOf(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}
