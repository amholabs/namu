import { useEffect, useState } from 'react'

import { Center, HStack, Heading, VStack, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { getSignatureFromScan } from 'pbt-chip-client/kong'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useBlockNumber, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { CoreButton } from '@/components/shared/CoreButton'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { useStore } from '@/src/store'
import { generateSession, loadSession, scan, setScanVariables } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

import { abi } from '../../artifacts/contracts/src/mocks/AmhoPBTMock.sol/AmhoPBTMock.json'

export default function Setttings() {
  // const addrs = useStore.getState().chipAddresses
  // instantiate a new const by taking the addrs variable which is an array of objects in the format of [{ key1: '0x123', ...rest}, {key2: '0x123', ...rest}] and for each item take the values of key1 and key2 and put it in a new array [key1, key2]
  const toast = useToast()
  const { chain } = useNetwork()
  // eslint-disable-next-line
  const { address } = useAccount()
  // eslint-disable-next-line
  const [sig, setSig] = useState<string | null>(null)
  // eslint-disable-next-line
  const [blockNum, setBlockNumber] = useState<number>(0)

  const { config: whitelistChipConfig } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'addChipToWhitelist',
    args: [sig, blockNum],
    enabled: !!sig && !!blockNum,
    chainId: chain?.id,
  })

  // eslint-disable-next-line
  const { write: whitelistWrite, data: whitelistData } = useContractWrite(whitelistChipConfig)

  const debounceReq = useDebounce(whitelistChipConfig.request)
  useEffect(() => {
    whitelistWrite?.()
  }, [debounceReq])

  const { isLoading: isLoadingWhitelist } = useWaitForTransaction({
    hash: whitelistData?.hash,
    onSuccess() {
      toast({
        title: 'Whitelist Success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      // handleMintTokens()
    },
  })

  // useEffect(() => {
  //   ;(async () => {
  //     if (sig) {
  //     }
  //   })()
  // }, [sig])

  // useEffect(() => {
  //   ;(async () => {
  //     if (isSuccessMint) {
  //       toast({
  //         title: 'Mint Success',
  //         description: 'Mint Success',
  //         status: 'success',
  //         duration: 5000,
  //         isClosable: true,
  //       })
  //     }
  //   })()
  // }, [])
  const handleWhitelistToken = async () => {
    // console.log(whitelistChipConfig)
    // whitelistWrite?.()
    let keyRaw = ''
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`)
    await provider.getBlock('latest').then(async (block) => {
      setBlockNumber(block.number)
      await setScanVariables().then((keys) => {
        const hashedKeysAddresses = keys.map((key) => Object.values(key)[0])
        keyRaw = hashedKeysAddresses[0].slice(2)
        if (address) {
          const cpKeyRaw = keyRaw
          getSignatureFromScan({
            chipPublicKey: cpKeyRaw,
            address: address,
            hash: block.hash,
          }).then((data) => {
            if (data) {
              console.log(data)
              setSig(data)
            }
          })
        } else {
          toast({
            title: 'Please connect wallet',
            description: 'Please connect wallet',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      })
    })
  }

  return (
    <MobileLayout>
      <Center marginTop="1rem" paddingBottom="1rem">
        <Heading textAlign="center">
          <h1>SETTINGS</h1>
        </Heading>
      </Center>
      <VStack spacing={3}>
        <CoreButton isLoading={isLoadingWhitelist} size="sm" clickHandler={handleWhitelistToken}>
          Whitelist Chips
        </CoreButton>
      </VStack>
      <Center>
        <HStack spacing="5" marginTop="1.0rem" marginBottom="1.5rem">
          <WalletConnectCustom />
        </HStack>
      </Center>
    </MobileLayout>
  )
}
