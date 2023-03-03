/* eslint-disable unused-imports/no-unused-vars */
import { arbitrum, goerli, hardhat, mainnet, optimism, polygon, sepolia } from '@wagmi/chains'

// import { UrlLink, UrlLinkInput } from '@/out/__generated__/graphql'

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// Application
// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
export const SITE_CANONICAL = 'https://amho.xyz'
export const SITE_EMOJI = ''
export const SITE_NAME = 'AMHO'
export const SITE_TITLE = 'AMHO ATELIER'
export const SITE_DESCRIPTION = 'Fashion house building crypto-native luxury goods.'
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

export const ETH_CHAINS = [mainnet, polygon, optimism, goerli]
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

export const PBTabi = [
  {
    inputs: [
      {
        internalType: 'string',
        name: 'name_',
        type: 'string',
      },
      {
        internalType: 'string',
        name: 'symbol_',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'supply_',
        type: 'uint256',
      },
      {
        internalType: 'address',
        name: 'trustedForwarder_',
        type: 'address',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [],
    name: 'ArrayLengthMismatch',
    type: 'error',
  },
  {
    inputs: [],
    name: 'BlockNumberTooOld',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ChipHasReachedMaxSlots',
    type: 'error',
  },
  {
    inputs: [],
    name: 'ChipHasReachedMaxSupply',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidBlockNumber',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidChipAddress',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidNonce',
    type: 'error',
  },
  {
    inputs: [],
    name: 'InvalidSignature',
    type: 'error',
  },
  {
    inputs: [],
    name: 'NoMintedTokenForChip',
    type: 'error',
  },
  {
    inputs: [],
    name: 'UpdatingChipForUnsetChipMapping',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'approved',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'ApprovalForAll',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'oldChipAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newChipAddress',
        type: 'address',
      },
    ],
    name: 'PBTChipRemapping',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'chipAddress',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'PBTMint',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    name: '_nonceToAddress',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getApproved',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'index',
        type: 'uint256',
      },
    ],
    name: 'getAvailableRemainingTokens',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getMaxBlockhashValidWindow',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'pure',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'addr',
        type: 'address',
      },
    ],
    name: 'getTokenData',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'floatSupply',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'chipAddress',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'set',
            type: 'bool',
          },
        ],
        internalType: 'struct AmhoPBT.TokenData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signatureFromChip',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'blockNumberUsedInSig',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'getTokenDataForChipSignature',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'tokenId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: 'floatSupply',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'chipAddress',
            type: 'address',
          },
          {
            internalType: 'bool',
            name: 'set',
            type: 'bool',
          },
        ],
        internalType: 'struct AmhoPBT.TokenData',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
    ],
    name: 'isApprovedForAll',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'payload',
        type: 'bytes',
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes',
      },
    ],
    name: 'isChipSignatureForToken',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'forwarder',
        type: 'address',
      },
    ],
    name: 'isTrustedForwarder',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'mint',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signatureFromChip',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'blockNumberUsedInSig',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'mintTokenWithChip',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'bytes',
        name: 'data',
        type: 'bytes',
      },
    ],
    name: 'safeTransferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'chipAddresses',
        type: 'address[]',
      },
      {
        internalType: 'uint256',
        name: 'floatSupply',
        type: 'uint256',
      },
    ],
    name: 'seedChipAddresses',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'operator',
        type: 'address',
      },
      {
        internalType: 'bool',
        name: 'approved',
        type: 'bool',
      },
    ],
    name: 'setApprovalForAll',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
      {
        internalType: 'string',
        name: '_tokenURI',
        type: 'string',
      },
    ],
    name: 'setTokenURI',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceId',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'chipAddress',
        type: 'address',
      },
    ],
    name: 'tokenIdFor',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signatureFromChip',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'blockNumberUsedInSig',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'transferTokenWithChip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'bytes',
        name: 'signatureFromChip',
        type: 'bytes',
      },
      {
        internalType: 'uint256',
        name: 'blockNumberUsedInSig',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'useSafeTransferFrom',
        type: 'bool',
      },
      {
        internalType: 'uint256',
        name: 'nonce',
        type: 'uint256',
      },
    ],
    name: 'transferTokenWithChip',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address[]',
        name: 'chipAddressesOld',
        type: 'address[]',
      },
      {
        internalType: 'address[]',
        name: 'chipAddressesNew',
        type: 'address[]',
      },
    ],
    name: 'updateChips',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'useNonce',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
]
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

// export type SocialLink = Omit<UrlLinkInput, 'profileId'> & {}
