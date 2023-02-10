import { useEffect, useState } from 'react'

import { Center, HStack, Heading, Image, Tag, Text, VStack, useToast } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { getSignatureFromScan } from 'pbt-chip-client/kong'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useBlockNumber, useContractWrite, useNetwork, usePrepareContractWrite } from 'wagmi'

import { getMintWithChipSig } from '@/lib/actions/chip'
import { CoreButton } from '@/src/components/shared'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { useStore } from '@/src/store'
import { generateSession, loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

import { abi } from '@/out/AmhoPBTMock.sol/AmhoPBTMock.json'

export default function Setttings() {
  // const addrs = useStore.getState().chipAddresses
  // instantiate a new const by taking the addrs variable which is an array of objects in the format of [{ key1: '0x123', ...rest}, {key2: '0x123', ...rest}] and for each item take the values of key1 and key2 and put it in a new array [key1, key2]
  const { chain } = useNetwork()
  const toast = useToast()
  const { address } = useAccount()
  const [sig, setSig] = useState<string | null>(null)
  const [blockNumber, setBlockNumber] = useState<number>(0)
  const [blockHash, setBlockHash] = useState<string>('')

  const debounceSig = useDebounce(sig)
  const debounceBlockNum = useDebounce(blockNumber)
  // const debounceAddrs = useDebounce(addrs)

  const { config: whitelistChipConfig } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'addChipToWhitelist',
    args: [debounceSig, debounceBlockNum],
    enabled: !!debounceSig && !!debounceBlockNum,
    chainId: chain?.id,
  })

  const { config: mintTokenConfig, error: mintError } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'mintTokenWithChip',
    args: [debounceSig, debounceBlockNum],
    enabled: !!debounceSig && !!debounceBlockNum,
    chainId: chain?.id,
  })

  const { isSuccess: whitelistIsSuccess, write: seedWrite } = useContractWrite(whitelistChipConfig)
  const { isSuccess: mintIsSuccess, write: mintWrite } = useContractWrite(mintTokenConfig)

  useEffect(() => {
    ;(async () => {
      if (whitelistIsSuccess) {
        toast({
          title: 'Seed Success',
          description: 'Seed Success',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
      if (mintIsSuccess) {
        toast({
          title: 'Mint Success',
          description: 'Mint Success',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    })()
  }, [whitelistIsSuccess])

  useEffect(() => {
    ;(async () => {
      if (mintIsSuccess) {
        toast({
          title: 'Mint Success',
          description: 'Mint Success',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
      }
    })()
  }, [mintIsSuccess])

  const handleMintPrepare = async () => {
    // const provider = new ethers.providers.JsonRpcProvider(`https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`)
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`)
    await provider.getBlock('latest').then((block) => {
      setBlockNumber(block.number)
      setBlockHash(block.hash)
    })
    const keyRaw = useStore.getState().chipHashedAddresses[0].slice(2)
    if (keyRaw && address) {
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
    seedWrite?.()
  }

  const handleMintTokens = async () => {
    console.log(mintError)
    console.log(mintTokenConfig)
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
