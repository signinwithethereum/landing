# siwe.xyz

The site for [Sign-In with Ethereum](https://eips.ethereum.org/EIPS/eip-4361).
One site, five things: the landing page, the documentation, the libraries, the
blog, and the tools.

Built with [VitePress 2](https://vitepress.dev). The docs use the default theme,
because for reference material it is already the best thing available; everything
else is hand-built on top of it.

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # → .vitepress/dist
pnpm preview
pnpm typecheck
```

Node 22.12 or newer. VitePress 2 dropped Node 20 but ships no `engines` field, so
nothing will warn you.

## What lives where

```
.vitepress/
  config.ts              site config, nav, sidebar
  rss.ts                 feed.rss, generated in buildEnd
  theme/
    index.ts             registers every global component
    Layout.vue           default theme + our slots
    style/               tokens.css, base.css, vp.css, fonts.css
    components/          the landing sections, the tools, the mark
    data/                ecosystem, libraries, stories, categories, posts loader
    lib/siwe/            the ERC-4361 parser, linter and fixer
    lib/example.ts       the one example message the whole site shares
    mark/                the brand engine, vendored — see below
src/
  index.md               the landing page
  docs/                  the documentation
  blog/                  posts, one directory per category
  ecosystem/  tools/  brand.md
  public/                fonts, og.png, favicon, the three case-study marks
scripts/og.html          the source of og.png — `pnpm og` re-renders it
```

## Two things that are copied on purpose

**The mark engine.** `.vitepress/theme/mark/scanlines.js` and `icon.js` are
byte-for-byte copies from
[signinwithethereum/brand-experiments](https://github.com/signinwithethereum/brand-experiments).
Do not edit them here — change them there and copy again, so the site and the
brand repository cannot drift. `mark/index.ts` is the only local file: it types
the engine and loads it on the client.

**The validator.** `.vitepress/theme/lib/siwe/` is the linter that shipped on
docs.siwe.xyz, moved across unchanged. It was written as framework-free
TypeScript, so all of it ported; only the interface is new. Its Jest suites
(~1,500 lines) were left behind in the old repository and are worth bringing over.

## Adding things

**An ecosystem entry** — one object in `.vitepress/theme/data/ecosystem.ts`. No
logo: third-party marks arrive in mixed polarity and a wall of 90 of them says
less than 90 legible names. Add a `note` if there is something specific to say.

**A blog post** — a markdown file in `src/blog/<category>/`. The category comes
from the directory, so the URL and the category cannot disagree. Frontmatter
needs `title`, `date` and `description`; the byline is rendered by the layout.

**A blog category** — a directory, an `index.md` holding
`<BlogIndex category="the-slug" />`, and an entry in `data/categories.ts`. A
category with no posts is hidden rather than shown with a zero.

**A docs page** — a markdown file under `src/docs/`, plus a sidebar entry in
`.vitepress/config.ts`. Internal links are absolute and extensionless
(`/docs/quickstart/`), and `ignoreDeadLinks` is off, so a wrong one fails the
build rather than shipping.

## Design

Everything comes off the mark. It is a 31 × 9 grid with ink on rows 0, 2, 4, 6
and 8 — so the cell is the unit, section dividers are two hairlines a cell apart
(an ink row and its gap, at page scale), and there are exactly four colour roles.

The tokens are named `--canvas`, `--field`, `--ink` and `--accent` on purpose:
those are the four names the mark engine reads, so a mark inherits whatever
palette it sits in with no mapping layer. A `.screen` panel rebinds them to the
screen palette and a mark inside one follows automatically.

`--accent` is `#7f00f6` in both themes and is for fills. `--accent-ui` is the
readable sibling per theme — 7.4:1 on white, 7.6:1 on black — and is what carries
text and links.

Geist Sans for prose, Geist Mono for labels, values, code and anything a machine
wrote. Both variable, both self-hosted. See [`/brand`](https://siwe.xyz/brand).

## Deploying

Static build → nginx → Kamal, the same shape as the two sites this replaces.

```sh
cp .env.production.example .env.production   # fill it in; it is gitignored
cp .kamal/secrets.example .kamal/secrets

pnpm kamal:setup     # first time
pnpm kamal:deploy
pnpm kamal:logs
```

`config/deploy.yml` claims `siwe.xyz`, `www.siwe.xyz` **and
`docs.siwe.xyz`** — the documentation moved into `/docs/` here, and `nginx.conf`
301s every old docs path to its new home. Point the `docs` hostname at this
container and the old links keep working. If `docs.siwe.xyz` stays on its own
host instead, that host needs the same redirect block.

Do not commit `.env.production`. The repository this replaces committed its deploy
host and registry username.

## Licence

MIT. The mark and the wordmark are covered by the brand guidance at `/brand`.
