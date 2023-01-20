import { useStore } from '@/src/store'

export default function UrlLink() {
  useStore.setState({ urlLinks: ['https://www.google.com'], authenticatedUser: '0x0' })
  return <div>UrlLinkContainer</div>
}
