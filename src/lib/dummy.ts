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
    link: 'https://instagram.com/amhoatelier',
  },
  {
    type: UrlLinkSocialType.Twitter,
    title: 'FOLLOW ON TWITTER',
    link: 'https://twitter.com/AMHOLTD',
  },
  {
    type: UrlLinkSocialType.Linkedin,
    title: 'FOLLOW ON LINKEDIN',
    link: 'https://www.linkedin.com/company/amho-ltd/',
  },
]

export const DUMMY_TOKEN_DATA = {
  id: 1,
  name: 'ENIGMA FW23',
}
