import { Text } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'

import { truncateAddress } from './shared'

export default function WalletConnectCustom() {
  const { open } = useWeb3Modal()
  const { address, isConnecting, status } = useAccount()

  async function onOpen() {
    await open()
  }

  return (
    <Text size="xs" as="sub" fontWeight="normal" onClick={onOpen}>
      {isConnecting ? 'LOADING...' : status == 'connected' ? truncateAddress(address) : 'CONNECT'}
    </Text>
  )
}
