import { MagicConnectConnector } from '@everipedia/wagmi-magic-connector'

export const rainbowMagicConnector = ({ chains }: any) => ({
  id: 'magic',
  name: 'Magic',
  iconUrl: 'https://svgshare.com/i/iJK.svg',
  iconBackground: '#fff',
  createConnector: () => {
    const connector = new MagicConnectConnector({
      chains: chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGIC_API_KEY as string,
        magicSdkConfiguration: {
          network: {
            rpcUrl: 'https://eth-goerli.g.alchemy.com/v2/QuXIjDl27_R1B1jug-hHQyxC3UKreLFt',
            chainId: 5,
          },
        },
      },
    })
    return {
      connector,
    }
  },
})
