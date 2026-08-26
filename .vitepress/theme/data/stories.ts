/* Featured case studies.
 *
 * Each one exists because signing in with Ethereum did something for the people
 * using the product that another login could not have done. The `claim` is that
 * benefit, stated from their side of the screen — not a summary of the product
 * and not a description of how it was built. Full write-ups live under
 * /blog/success-stories/. */

export interface Story {
  org: string
  /** Logo path under public/. */
  logo: string
  url: string
  link: string
  claim: string
  body: string
}

export const STORIES: Story[] = [
  {
    org: 'networked.art',
    logo: '/stories/networked-art.svg',
    url: 'https://networked.art',
    link: '/blog/success-stories/networked-art',
    claim: 'One account, not two',
    body: 'A marketplace that reads mainnet knows your wallet before it knows you. Signing is what turns the history already attached to your address into your account, so collectors do not start from zero or keep two profiles.'
  },
  {
    org: 'evm.now',
    logo: '/stories/evm-now.svg',
    url: 'https://evm.now',
    link: '/blog/success-stories/evm-now',
    claim: 'Nothing to sign up for',
    body: 'A contract explorer with a paid feature and no accounts. No email, no password, nothing to reset and nothing to breach — you sign once, and what you are entitled to is read from the chain.'
  },
  {
    org: 'Ambire',
    logo: '/stories/ambire.svg',
    url: 'https://www.ambire.com/',
    link: '/blog/success-stories/ambire',
    claim: 'A sign-in screen, not a blob',
    body: 'The wallet recognises a sign-in and lays it out in plain labels, warns you when the site asking is not the site named, and stops asking you to re-sign the same message every day.'
  },
  {
    org: 'OpenRouter',
    logo: '/stories/openrouter.svg',
    url: 'https://openrouter.ai',
    link: '/blog/success-stories/openrouter',
    claim: 'Another way in',
    body: 'OpenRouter lists Sign in with Ethereum beside Google and GitHub, giving more than ten million developers a passwordless login whose proof is a signature, not a password. Wallet-based authentication at the scale of mainstream software.'
  }
]
