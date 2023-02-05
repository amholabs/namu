'use client'

import { useStore } from '@/src/store'
export default function UrlLinkWrapper({ children }: { children: React.ReactNode }) {
  useStore.setState({ urlLinks: [''], authenticatedUser: '0x0' })
  return <>{children}</>
}
