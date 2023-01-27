import { UrlLinkSocialType } from '@/out/__generated__/graphql'

import { SocialLink } from './constants'

export const DUMMY_SOCIAL_LINKS: SocialLink[] = [
  {
    type: UrlLinkSocialType.Base,
    title: 'SCAN FOR NFT',
    link: 'https://amho.xyz/ethdenver2023/scan',
  },
  {
    type: UrlLinkSocialType.Base,
    title: 'WEBSITE',
    link: 'https://amho.xyz',
  },
  {
    type: UrlLinkSocialType.Instagram,
    title: 'INSTAGRAM',
    link: 'https://twitter.com/amhoatelier',
  },
  {
    type: UrlLinkSocialType.Twitter,
    title: 'TWITTER',
    link: 'https://twitter.com/AMHOLTD',
  },
]

export const DUMMY_TOKEN_DATA = {
  id: 1,
  name: 'AMHO FW23',
}
