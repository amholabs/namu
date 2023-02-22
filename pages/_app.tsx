import './app.css'

import '@fontsource/inter/700.css'

import { useEffect } from 'react'

import { Biconomy } from '@biconomy/mexa'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ComposeClient } from '@composedb/client'
import { ExternalProvider } from '@ethersproject/providers'
import * as ethereum from '@web3modal/ethereum'
import { Web3Modal } from '@web3modal/react'
import type { AppProps } from 'next/app'
import * as wagmi from 'wagmi'
import { goerli, localhost, mainnet, polygon } from 'wagmi/chains'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { Layout } from '@/src/components/layout'
import { useIsMounted } from '@/src/hooks/useIsMounted'
import Fonts from '@/src/lib/Fonts'
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
    // compose: new ComposeClient({ ceramic: process.env.NEXT_PUBLIC_CERAMIC_URL || ceramicUrl, definition }),
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
      heading: `Inter, sans-serif`,
      // heading: `Helvetica Neue Bold, sans-serif`,
      body: `Helvetica Neue, sans-serif`,
    },
    textStyles: {
      '3xl': {
        fontWeight: 'black',
      },
    },
    fontSizes: {
      xs: '12px',
      sm: '14px',
      md: '16px',
      lg: '18px',
      xl: '25px',
      '2xl': '32px',
      '3xl': '40px',
      '4xl': '40px',
      '5xl': '48px',
      '6xl': '64px',
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
          flushed: {
            field: {
              borderColor: 'black',
              focusBorderColor: 'black',
            },
            defaultProps: {
              focusBorderColor: 'black',
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
            borderColor: 'black',
          },
          focusBorderColor: 'black',
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

  const chains = [mainnet, polygon, goerli, localhost]
  const { provider } = wagmi.configureChains(chains, [
    ethereum.walletConnectProvider({ projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID as string }),
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH as string }),
  ])

  useEffect(() => {
    ;(async () => {
      const biconomy = new Biconomy(provider as ExternalProvider, {
        apiKey: process.env.NEXT_PUBLIC_BICONOMY_API_KEY as string,
        debug: true,
        contractAddresses: ['0x793edd160b7a0c4b0ab6ef7e3b3f5fef6c78e49d'], // list of contract address you want to enable gasless on
      })
      await biconomy.init()
    })()
  }, [])

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
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </WalletConnectProvider>
        </ChakraProvider>
      )}
      <Web3Modal themeMode="dark" themeColor="blackWhite" themeBackground="themeColor" projectId={projectId} ethereumClient={ethereumClient} />
    </>
  )
}
