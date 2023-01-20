import './app.css'

import { ChakraProvider } from '@chakra-ui/react'
import { useIsMounted } from 'hooks/useIsMounted'
import type { AppProps } from 'next/app'
import { RainbowKitProvider } from 'providers/RainbowKit'

import { Layout } from '@/components/layout'

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
