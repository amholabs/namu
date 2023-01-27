import { UrlLinkSocialType } from '@/out/__generated__/graphql'

import { SocialLink } from './constants'

export const DUMMY_SOCIAL_LINKS: SocialLink[] = [
  {
    type: UrlLinkSocialType.Base,
    title: 'SCAN FOR NFT',
    link: 'https://amho.xyz/ethdenver2023/scan',
  },
  {
    type: UrlLinkSocialType.Instagram,
    title: 'FOLLOW ON INSTAGRAM',
    link: 'https://twitter.com/amhoatelier',
  },
  {
    type: UrlLinkSocialType.Twitter,
    title: 'FOLLOW ON TWITTER',
    link: 'https://twitter.com/AMHOLTD',
  },
  {
    type: UrlLinkSocialType.Signal,
    title: 'LEARN MORE',
    link: 'https://amho.xyz',
  },
]

export const DUMMY_TOKEN_DATA = {
  id: 1,
  name: 'AMHO FW23',
}
