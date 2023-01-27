import { ReactNode } from 'react'

import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import * as wagmi from 'wagmi'

interface Props {
  children: ReactNode
  client: any
}

export function WalletConnectProvider(props: Props) {
  return <wagmi.WagmiConfig client={props.client}>{props.children}</wagmi.WagmiConfig>
}
