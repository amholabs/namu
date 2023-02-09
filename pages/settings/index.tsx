import { useEffect, useState } from 'react'

import { Center, HStack, Heading, Image, Tag, Text, VStack, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'

import { getMintWithChipSig } from '@/lib/actions/chip'
import { abi } from '@/out/PBTSimpleMock.sol/PBTSimpleMock.json'
import { CoreButton } from '@/src/components/shared'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { useStore } from '@/src/store'
import { generateSession, loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'

export default function Setttings() {
  const addrs = useStore.getState().chipAddresses
  // instantiate a new const by taking the addrs variable which is an array of objects in the format of [{ key1: '0x123', ...rest}, {key2: '0x123', ...rest}] and for each item take the values of key1 and key2 and put it in a new array [key1, key2]
  const { chain } = useNetwork()
  const toast = useToast()
  const { address } = useAccount()
  const [sig, setSig] = useState<string | null>(null)
  const [blockNumber, setBlockNumber] = useState<number>(0)

  const debounceSig = useDebounce(sig)
  const debounceBlockNum = useDebounce(blockNumber)
  const debounceAddrs = useDebounce(addrs)

  const { config: seedChipConfig } = usePrepareContractWrite({
    address: '0xE8a1883eD8F54B4b08CCfebd46adCeD2AcB96028',
    abi,
    functionName: 'seedChipToTokenMapping',
    args: [debounceAddrs, [0, 1], false],
    enabled: !!addrs,
    chainId: chain?.id,
  })

  const { config: mintTokenConfig } = usePrepareContractWrite({
    address: '0xE8a1883eD8F54B4b08CCfebd46adCeD2AcB96028',
    abi,
    functionName: 'mintTokenWithChip',
    args: [debounceSig, debounceBlockNum],
    enabled: !!debounceSig && !!debounceBlockNum,
    chainId: chain?.id,
  })

  const { write: seedWrite } = useContractWrite(seedChipConfig)
  const { write: mintWrite } = useContractWrite(mintTokenConfig)

  useEffect(() => {
    ;(async () => {})()
  }, [])

  const handleMintPrepare = async () => {
    // const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`)
    const blockNum = await provider.getBlock('latest').then((block) => block.number)
    const blockHash = await provider.getBlock('latest').then((block) => block.hash)
    setBlockNumber(blockNum)
    if (address) {
      await getMintWithChipSig(address, blockHash).then((data) => {
        setSig(data || null)
      })
      // encode the newSig to be passed into a smart contract contract expecting the format "bytes calldata"
      if (sig) {
        return
      } else {
        toast({
          title: 'Scanning Failed. Try again.',
          status: 'error',
          isClosable: true,
        })
      }
    }
  }

  const handleMintTokens = async () => {
    console.log(debounceSig, debounceBlockNum)
    mintWrite?.()
  }

  const handleSeedTokens = async () => {
    const keys = useStore.getState().chipAddresses
    console.log(keys)
    if (address) {
      seedWrite?.()
    }
    console.log('failed to seed tokens')
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
        <CoreButton size="sm" clickHandler={handleSeedTokens}>
          Seed Chips
        </CoreButton>
        <CoreButton size="sm" clickHandler={handleMintPrepare}>
          Prepare Chips
        </CoreButton>
        <CoreButton size="sm" clickHandler={handleMintTokens}>
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
