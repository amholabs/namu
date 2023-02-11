import { useEffect, useState } from 'react'

import { Center, HStack, Heading, VStack, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { getSignatureFromScan } from 'pbt-chip-client/kong'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useBlockNumber, useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { CoreButton } from '@/src/components/shared'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { useStore } from '@/src/store'
import { generateSession, loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

import { abi } from '../../artifacts/contracts/src/mocks/AmhoPBTMock.sol/AmhoPBTMock.json'

export default function Setttings() {
  // const addrs = useStore.getState().chipAddresses
  // instantiate a new const by taking the addrs variable which is an array of objects in the format of [{ key1: '0x123', ...rest}, {key2: '0x123', ...rest}] and for each item take the values of key1 and key2 and put it in a new array [key1, key2]
  const { chain } = useNetwork()
  const toast = useToast()
  const { address } = useAccount()
  const [sig, setSig] = useState<string | null>(null)

  const debounceSig = useDebounce(sig)
  const blockNum = useStore.getState().blockNumber

  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'mintTokenWithChip',
    args: [debounceSig, blockNum, { gasLimit: 130000 }],
    enabled: !!debounceSig && !!blockNum,
    chainId: chain?.id,
  })

  const { config: whitelistChipConfig } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'addChipToWhitelist',
    args: [debounceSig, blockNum],
    chainId: chain?.id,
  })

  const { write: mintWrite, data: mintData } = useContractWrite(mintTokenConfig)
  const { write: whitelistWrite, data: whitelistData } = useContractWrite(whitelistChipConfig)

  const { isLoading: isLoadingWhitelist } = useWaitForTransaction({
    hash: whitelistData?.hash,
    onSuccess() {
      toast({
        title: 'Whitelist Success',
        description: 'Seed Success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      mintWrite?.()
    },
  })

  const { isLoading: isLoadingMint } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess() {
      toast({
        title: 'Mint Success',
        description: 'Seed Success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
  })
  // useEffect(() => {
  //   ;(async () => {
  //     if (isSuccessWhitelist) {
  //       toast({
  //         title: 'Whitelist Success',
  //         description: 'Seed Success',
  //         status: 'success',
  //         duration: 5000,
  //         isClosable: true,
  //       })
  //     }
  //   })()
  // }, [isSuccessWhitelist])

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

  const handleMintPrepare = async () => {
    // const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
    // const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`)
    // await provider.getBlock('latest').then((block) => {
    //   setBlockNumber(block.number)
    //   setBlockHash(block.hash)
    // })
    const blockHash = useStore.getState().blockHash
    const keyRaw = useStore.getState().chipHashedAddresses[0].slice(2)
    if (address && keyRaw.length > 0) {
      await getSignatureFromScan({
        chipPublicKey: keyRaw,
        address: address,
        hash: blockHash,
      }).then((data) => {
        if (data) {
          setSig(data)
        }
      })
    } else {
      toast({
        title: 'Error',
        description: 'Address not set',
        status: 'error',
        isClosable: true,
      })
    }
    // encode the newSig to be passed into a smart contract contract expecting the format "bytes calldata"
  }

  const handleSeedTokens = async () => {
    console.log(whitelistChipConfig)
    whitelistWrite?.()
  }

  const handleMintTokens = async () => {
    console.log(mintTokenConfig)
    console.log(address)
    mintWrite?.()
  }

  return (
    <MobileLayout>
      <Center marginTop="1rem" paddingBottom="1rem">
        <Heading textAlign="center">
          <h1>SETTINGS</h1>
        </Heading>
      </Center>
      <VStack spacing={3}>
        <CoreButton size="sm" clickHandler={generateSession}>
          Generate Session
        </CoreButton>
        <CoreButton size="sm" clickHandler={handleMintPrepare}>
          Prepare Chips
        </CoreButton>
        <CoreButton isLoading={isLoadingWhitelist} size="sm" clickHandler={handleSeedTokens}>
          Whitelist Chips
        </CoreButton>
        <CoreButton isLoading={isLoadingMint} size="sm" clickHandler={handleMintTokens}>
          Mint Chips
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
