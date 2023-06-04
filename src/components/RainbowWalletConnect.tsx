import * as React from 'react'

import { Flex } from '@chakra-ui/react'
import { ConnectButton } from '@rainbow-me/rainbowkit'

// interface WalletConnectProps {
//   className?: string
// }

export const WalletConnect = () => {
  return (
    // <Flex>
    <ConnectButton
      showBalance={false}
      accountStatus={{
        smallScreen: 'avatar',
        largeScreen: 'avatar',
      }}
      chainStatus={{
        smallScreen: 'icon',
        largeScreen: 'icon',
      }}
    />
    // </Flex>
  )
}

export default WalletConnect
