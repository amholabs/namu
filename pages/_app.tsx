import './app.css'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ComposeClient } from '@composedb/client'
import type { AppProps } from 'next/app'

import { Layout } from '@/components/layout'
import Fonts from '@/lib/Fonts'
import { useIsMounted } from '@/src/hooks/useIsMounted'
import { RainbowKitProvider } from '@/src/providers/RainbowKit'

import { definition } from '../out/__generated__/runtime'

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()
  const compose = new ComposeClient({ ceramic: process.env.NEXT_CERAMIC_URL || 'http://localhost:7007', definition })
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
      Button: {
        baseStyle: {
          borderRadius: '0px',
        },
      },
      Input: {
        baseStyle: {
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

  return (
    <>
      {isMounted && (
        <ChakraProvider theme={theme}>
          <Fonts />
          <RainbowKitProvider>
            <Layout>
              <Component {...pageProps} compose={compose} />
            </Layout>
          </RainbowKitProvider>
        </ChakraProvider>
      )}
    </>
  )
}
