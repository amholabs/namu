import { arbitrum, goerli, mainnet, optimism, polygon, sepolia } from '@wagmi/chains'
export const SITE_CANONICAL = 'https://amho.xyz'
export const SITE_EMOJI = '⚡'
export const SITE_NAME = 'AMHO'
export const SITE_TITLE = 'AMHO'
export const SITE_DESCRIPTION = 'Disrupting the way we think about fashion and the goods we own.'

export const THEME_INITIAL_COLOR = 'system'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

export const SOCIAL_TWITTER = 'AMHOLTD'
export const SOCIAL_GITHUB = ''

export const APP_CONFIG = {
  canonical: SITE_CANONICAL,
  emoji: SITE_EMOJI,
  title: SITE_TITLE,
  site_name: SITE_NAME,
  description: SITE_DESCRIPTION,
  previewImg: `${SITE_CANONICAL}/preview.jpeg`,
  locale: 'en',
  twitter: SOCIAL_TWITTER,
}

// Override the default Goerli icon so it's not the same as the default Ethereum icon
// @ts-ignore
goerli.iconUrl = '/icons/NetworkEthereumTest.png'

export const ETH_CHAINS = [mainnet, polygon, optimism, arbitrum, goerli]

export const SERVER_SESSION_SETTINGS = {
  cookieName: SITE_NAME,
  password: process.env.SESSION_PASSWORD ?? 'UPDATE_TO_complex_password_at_least_32_characters_long',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
}
