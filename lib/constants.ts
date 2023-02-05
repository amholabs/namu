/* eslint-disable unused-imports/no-unused-vars */
import { arbitrum, goerli, hardhat, mainnet, optimism, polygon, sepolia } from '@wagmi/chains'

import { UrlLink, UrlLinkInput } from '@/out/__generated__/graphql'

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Application
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
export const SITE_CANONICAL = 'https://amho.xyz'
export const SITE_EMOJI = ''
export const SITE_NAME = 'AMHO'
export const SITE_TITLE = 'AMHO ATELIER'
export const SITE_DESCRIPTION = 'Fashion house building crypto native luxury goods.'
export const SOCIAL_TWITTER = 'AMHOLTD'
export const SOCIAL_GITHUB = ''

export const APP_CONFIG = {
  canonical: SITE_CANONICAL,
  emoji: SITE_EMOJI,
  title: SITE_TITLE,
  site_name: SITE_NAME,
  description: SITE_DESCRIPTION,
  previewImg: `${SITE_CANONICAL}/preview.png`,
  locale: 'en',
  twitter: SOCIAL_TWITTER,
}

export const DEPLOY_URL =
  'https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fturbo-eth%2Ftemplate-web3-app&project-name=TurboETH&repository-name=turbo-eth&demo-title=TurboETH&env=NEXT_PUBLIC_ALCHEMY_API_KEY,NEXTAUTH_SECRET&envDescription=How%20to%20get%20these%20env%20variables%3A&envLink=https%3A%2F%2Fgithub.com%2Fturbo-eth%2Ftemplate-web3-app%2Fblob%2Fmain%2F.env.example'

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Design
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
export const THEME_INITIAL_COLOR = 'system'
export const THEME_CONFIG = {
  initialColorMode: THEME_INITIAL_COLOR,
}

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Blockchain
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Override the default Goerli icon so it's not the same as the default Ethereum icon

// @ts-ignore
goerli.iconUrl = '/icons/NetworkEthereumTest.svg'
// @ts-ignore
sepolia.iconUrl = '/icons/NetworkEthereumTest.svg'

export const ETH_CHAINS = [mainnet, polygon, optimism, arbitrum, goerli]
export const ETH_CHAINS_PROD = [mainnet, polygon, optimism, arbitrum]
export const ETH_CHAINS_TEST = [mainnet, polygon, optimism, arbitrum, goerli, sepolia, hardhat]

export const QUERY_PROFILE_VIEWER = `
query {
  viewer {
    isViewer
    profile {
      id
      name
    }
  }
}
`
export const QUERY_URLLINK_VIEWER = `
query {
  viewer {
    urlLinkList(first:10) {
      edges {
        node {
          title
          link
        }
      }
    }
  }
}
`

export const MUTATE_CREATE_PROFILE = `
    mutation CreateProfile($i: CreateProfileInput!) {
      createProfile(input: $i) {
        document {
          name
          image
          description
          walletAddresses {
            address
            blockchainNetwork
          }
        }
      }
    }`

export const MUTATE_UPDATE_PROFILE = `
mutation UpdateProfile($i: UpdateProfileInput!) {
  updateProfile(input: $i) {
    document {
      name
      image
      description
      walletAddresses {
        address
        blockchainNetwork
      }
    }
  }
}
`
export const MUTATE_CREATE_URLLINK = `
mutation CreateUrlLink($i: CreateUrlLinkInput!) {
  createUrlLink(input: $i) {
    document {
      type
      title
      link
      profileId
    }
  }
}
`

export const MUTATE_UPDATE_URLLINK = `
mutation UpdateUrlLink($i: UpdateUrlLinkInput!) {
  updateUrlLink(input: $i) {
    document {
      type
      title
      link
    }
  }
}`

// BASE = 'BASE',
// ETH = 'ETH',
// BTC = 'BTC',
// VENMO = 'VENMO',
// CASHAPP = 'CASHAPP',
// PAYPAL = 'PAYPAL',
// EMAIL = 'EMAIL',
// BANDCAMP = 'BANDCAMP',
// LINKEDIN = 'LINKEDIN',
// CLUBHOUSE = 'CLUBHOUSE',
// GITHUB = 'GITHUB',
// SUBSTACK = 'SUBSTACK',
// TELEGRAM = 'TELEGRAM',
// SIGNAL = 'SIGNAL',
// TWITCH = 'TWITCH',
// PATREON = 'PATREON',
// CAMEO = 'CAMEO',
// SPOTIFY = 'SPOTIFY',
// AMAZON = 'AMAZON',
// APPLEMUSIC = 'APPLEMUSIC',
// SNAPCHAT = 'SNAPCHAT',
// INSTAGRAM = 'INSTAGRAM',
// FACEBOOK = 'FACEBOOK',
// TWITTER = 'TWITTER',
// TIKTOK = 'TIKTOK',
// SOUNDCLOUD = 'SOUNDCLOUD',
// YOUTUBE = 'YOUTUBE',
// PINTEREST = 'PINTEREST',

export type SocialLink = Omit<UrlLinkInput, 'profileId'> & {}
