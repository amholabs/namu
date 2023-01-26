import { UrlLinkSocialType } from '@/out/__generated__/graphql'

import { SocialLink } from './constants'

export const DUMMY_SOCIAL_LINKS: SocialLink[] = [
  {
    type: UrlLinkSocialType.Base,
    title: 'WEBSITE',
    link: 'https://amho.xyz',
  },
  {
    type: UrlLinkSocialType.Base,
    title: 'JOIN DISCORD',
    link: 'https://discord.com',
  },
  {
    type: UrlLinkSocialType.Base,
    title: 'INSTAGRAM',
    link: 'https://instagram.com',
  },
  {
    type: UrlLinkSocialType.Base,
    title: 'MINT POAP',
    link: 'https://poap.xyz',
  },
]

export const DUMMY_TOKEN_DATA = {
  id: 1,
  name: 'AMHO FW23',
}
