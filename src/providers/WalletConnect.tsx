import { EthereumClient, modalConnectors, walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import * as wagmi from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

const chains = [mainnet, polygon]
export function WalletConnectProvider() {
  const { provider } = wagmi.configureChains(chains, [walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string })])
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string

  const wagmiClient = wagmi.createClient({
    autoConnect: true,
    connectors: modalConnectors({ appName: 'AMHO', chains }),
    provider,
  })

  const ethereumClient = new EthereumClient(wagmiClient, chains)

  return (
    <>
      <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
      <wagmi.WagmiConfig client={wagmiClient} />
    </>
  )
}
