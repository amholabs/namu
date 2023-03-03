import { Text } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/react'
import { useAccount } from 'wagmi'

import { truncateAddress } from './shared/CoreButton'

export default function WalletConnectCustom() {
  const { open } = useWeb3Modal()
  const { address, status } = useAccount()

  // useEffect to wait for status to change to 'connected'

  async function onOpen() {
    await open()
  }

  return (
    <Text size="xs" as="sub" fontWeight="normal" onClick={onOpen}>
      {status === 'connecting' ? 'LOADING...' : status == 'connected' && address ? truncateAddress(address) : 'CONNECT'}
    </Text>
  )
}
