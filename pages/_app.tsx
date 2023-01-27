import './app.css'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ComposeClient } from '@composedb/client'
import * as ethereum from '@web3modal/ethereum'
import { walletConnectProvider } from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import type { AppProps } from 'next/app'
import * as wagmi from 'wagmi'
import { mainnet, polygon } from 'wagmi/chains'

import { Layout } from '@/components/layout'
import Fonts from '@/lib/Fonts'
import { useIsMounted } from '@/src/hooks/useIsMounted'
import { WalletConnectProvider } from '@/src/providers/WalletConnect'
import { useStore } from '@/src/store'

import { definition } from '../out/__generated__/runtime'

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()
  let ceramicUrl = 'https://amhocer.tunnelto.dev'

  switch (process.env.NODE_ENV) {
    case 'development':
      ceramicUrl = `${process.env.NEXT_PUBLIC_CERAMIC_URL}`
      break
    case 'test':
      ceramicUrl = `${process.env.NEXT_PUBLIC_CERAMIC_URL}`
      break
    case 'production':
      ceramicUrl = 'https://amho.xyz/'
      break
    default:
      ceramicUrl = 'error: ceramic'
      break
  }

  useStore.setState({
    compose: new ComposeClient({ ceramic: process.env.NEXT_PUBLIC_CERAMIC_URL || ceramicUrl, definition }),
  })

  const breakpoints = {
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '96em',
  }
  const theme = extendTheme({
    config: { initialColorMode: 'light' },
    breakpoints,
    fonts: {
      heading: `Helvetica Neue Bold, sans-serif`,
    },
    borders: {
      none: 0,
      '1px': '1px solid',
      '2px': '2px solid',
      '3px': '3px solid',
      '4px': '4px solid',
      '8px': '8px solid',
    },
    components: {
      color: {
        brand: {
          900: '#000000',
        },
      },
      Card: {
        baseStyle: {
          container: {
            borderRadius: '0px',
            boxShadow: 'none',
          },
        },
      },
      Tag: {
        baseStyle: {
          container: {
            borderRadius: '0px',
          },
        },
      },
      Button: {
        baseStyle: {
          borderRadius: '0px',
        },
      },
      InputLeftAddon: {
        baseStyle: {
          borderRadius: '0px',
          bg: 'transparent',
        },
      },
      Input: {
        variants: {
          unstyled: {
            addon: {
              bg: 'white',
            },
          },
        },
        sizes: {
          lg: {
            field: {
              borderRadius: 'none',
            },
          },
          md: {
            field: {
              borderRadius: 'none',
            },
          },
          sm: {
            field: {
              borderRadius: 'none',
            },
          },
        },
        baseStyle: {
          field: {
            borderColor: 'brand.900',
          },
          focusBorderColor: 'brand.900',
        },
      },
      PinInput: {
        sizes: {
          lg: {
            borderRadius: '0px',
          },
          md: {
            borderRadius: '0px',
          },
          sm: {
            borderRadius: '0px',
          },
          xs: {
            borderRadius: '0px',
          },
        },
      },
    },
  })

  const chains = [mainnet, polygon]
  const { provider } = wagmi.configureChains(chains, [ethereum.walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string })])
  const wagmiClient = wagmi.createClient({
    autoConnect: true,
    connectors: ethereum.modalConnectors({ appName: 'AMHO', chains }),
    provider,
  })
  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID as string
  const ethereumClient = new ethereum.EthereumClient(wagmiClient, chains)

  return (
    <>
      {isMounted && (
        <ChakraProvider theme={theme}>
          <Fonts />
          <WalletConnectProvider client={wagmiClient}>
            <Web3Modal projectId={projectId} ethereumClient={ethereumClient} />
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletConnectProvider>
        </ChakraProvider>
      )}
    </>
  )
}
