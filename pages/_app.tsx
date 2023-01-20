import './app.css'

import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

import { Layout } from '@/components/layout'
import { useIsMounted } from '@/src/hooks/useIsMounted'
import { RainbowKitProvider } from '@/src/providers/RainbowKit'

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()
  const theme = extendTheme({
    components: {
      Button: {
        baseStyle: {
          borderRadius: '0px',
        },
      },
    },
  })

  return (
    <>
      {isMounted && (
        <ChakraProvider theme={theme}>
          <RainbowKitProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </RainbowKitProvider>
        </ChakraProvider>
      )}
    </>
  )
}
