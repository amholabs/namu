import { useEffect, useState } from 'react'

import { Center, HStack, Heading, Input, VStack, useToast } from '@chakra-ui/react'
import { useDebounce } from 'usehooks-ts'
import { useContractWrite, useNetwork, usePrepareContractWrite, useWaitForTransaction } from 'wagmi'

import { CoreButton } from '@/components/shared/CoreButton'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { formatKeys, setScanVariables } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

import { abi } from '../../artifacts/contracts/src/mocks/AmhoPBTMock.sol/AmhoPBTMock.json'

export default function Setttings() {
  const toast = useToast()
  const { chain } = useNetwork()
  // eslint-disable-next-line
  const [keys, setKeys] = useState<string[]>([])
  const [numToSeed, setNumToSeed] = useState<number>(0)
  const debounceNumToSeed = useDebounce(numToSeed)

  const { config: seedChipConfig } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'seedChipAddresses',
    args: [keys, debounceNumToSeed],
    enabled: !!keys && !!debounceNumToSeed,
    chainId: chain?.id,
  })

  // eslint-disable-next-line
  const { write: seedWrite, data: seedData } = useContractWrite(seedChipConfig)

  const debounceReq = useDebounce(seedChipConfig.request)

  useEffect(() => {
    console.log(seedChipConfig)
    seedWrite?.()
  }, [debounceReq])

  const { isLoading: isLoadingSeed } = useWaitForTransaction({
    hash: seedData?.hash,
    onSuccess() {
      toast({
        title: 'Seed Success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  // give me a handle input function that takes in a string and sets the state of the input to that string
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNumToSeed(parseInt(e.target.value))
  }

  const handleSeedTokens = async () => {
    await setScanVariables().then((keys) => {
      if (keys) {
        const { keysAddresses } = formatKeys(keys)
        setKeys(keysAddresses)
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
  }

  return (
    <MobileLayout>
      <Center marginTop="1rem" paddingBottom="1rem">
        <Heading textAlign="center">
          <h1>SETTINGS</h1>
        </Heading>
      </Center>
      <VStack spacing={3}>
        <Input onChange={handleInput} placeholder="How many to seed chip with" />
        <CoreButton isLoading={isLoadingSeed} size="sm" clickHandler={handleSeedTokens}>
          SEED CHIPS
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
