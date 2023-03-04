import { ReactNode } from 'react'

import * as wagmi from 'wagmi'

interface Props {
  children: ReactNode
  client: any
}

export function WalletConnectProvider(props: Props) {
  return <wagmi.WagmiConfig client={props.client}>{props.children}</wagmi.WagmiConfig>
}
