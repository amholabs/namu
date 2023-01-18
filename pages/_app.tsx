import './app.css'

import { ChakraProvider } from '@chakra-ui/react'
import type { AppProps } from 'next/app'

import { Layout } from 'components/layout'
import { useIsMounted } from 'hooks/useIsMounted'
import { RainbowKitProvider } from 'providers/RainbowKit'

export default function App({ Component, pageProps }: AppProps) {
  const isMounted = useIsMounted()

  return (
    <>
      {isMounted && (
        <ChakraProvider>
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
