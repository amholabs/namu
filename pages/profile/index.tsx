import { useEffect, useState } from 'react'

// eslint-disable-next-line import/order

import {
  Center,
  HStack,
  Heading,
  Img,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spinner,
  Tag,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/react'
import { ethers } from 'ethers'
import { BigNumber } from 'ethers'
// import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'
import { getSignatureFromScan } from 'pbt-chip-client/kong'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useContractRead, useContractWrite, useNetwork, usePrepareContractWrite, useSignMessage, useWaitForTransaction } from 'wagmi'

// import { getMintWithChipSig } from '@/lib/actions/chip'
// import { generateNonce, siweLogin } from '@/lib/actions/siweUtils'
import { CoreButton } from '@/components/shared/CoreButton'
import { UrlLinkSocialType } from '@/out/__generated__/graphql'
import { Profile as ProfileType, Query } from '@/out/__generated__/graphql'
import { abi } from '@/out/AmhoPBTMock.sol/AmhoPBTMock.json'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/src/lib/constants'
import { DUMMY_SOCIAL_LINKS, DUMMY_TOKEN_DATA } from '@/src/lib/dummy'
import { useStore } from '@/src/store'
import { formatKeys, generateSession, loadSession, setScanVariables } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

import {
  buildForwardTxRequest,
  getBiconomyForwarderConfig,
  getDataToSignForEIP712,
  getDataToSignForPersonalSign,
  getDomainSeperator,
  helperAttributes,
} from '@/scripts/helpers/biconomyForwardHelpers'

export default function Profile() {
  const router = useRouter()
  const toast = useToast()

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { chain } = useNetwork()
  const { address, status } = useAccount()
  const [sig, setSig] = useState<string | null>(null)
  const [blockNum, setBlockNumber] = useState<number>(0)
  const [nonce, setNonce] = useState<number>(0)

  useContractRead({
    address: PBT_ADDRESS,
    abi,
    functionName: 'getNonce',
    overrides: { from: address },
    onSuccess(data) {
      const toNum = BigNumber.from(data)
      console.log(toNum.toNumber())
      setNonce(toNum.toNumber())
    },
  })

  const { config: mintTokenConfig, error } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'mintTokenWithChip',
    args: [sig, blockNum, nonce, { gasLimit: 300000 }],
    enabled: !!sig && !!blockNum && !!nonce,
    chainId: chain?.id,
  })

  // const { writeAsync: mintWrite, data: mintData } = useContractWrite(mintTokenConfig)
  const { write: mintWrite, data: mintData } = useContractWrite({
    mode: 'recklesslyUnprepared',
    address: PBT_ADDRESS,
    abi,
    functionName: 'mintTokenWithChip',
    args: [sig, blockNum, nonce, { gasLimit: 300000 }],
  })

  // const debounceReq = useDebounce(mintTokenConfig.request, 1000)

  useEffect(() => {
    if (sig && blockNum !== 0) {
      mintWrite?.()
    }
  }, [sig])

  // eslint-disable-next-line
  const { isLoading: isLoadingMint } = useWaitForTransaction({
    hash: mintData?.hash,
    onSuccess() {
      toast({
        title: 'Mint Success',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      onClose()
    },
  })

  const resetVariables = () => {
    setSig(null)
    setBlockNumber(0)
  }
  const handleMintPrepare = async () => {
    let keyRaw = ''
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`)
    await provider.getBlock('latest').then(async (block) => {
      setBlockNumber(block.number)
      await setScanVariables().then((keys) => {
        if (address && keys) {
          const { hashedKeysAddresses } = formatKeys(keys)
          keyRaw = hashedKeysAddresses[0].slice(2)
          const cpKeyRaw = keyRaw
          getSignatureFromScan({
            chipPublicKey: cpKeyRaw,
            address: address,
            hash: block.hash,
            nonce,
          }).then((data) => {
            if (data) {
              setSig(data)
              onOpen()
            }
          })
        } else {
          console.log(mintTokenConfig)
          resetVariables()
          toast({
            title: 'Error',
            description: 'Cannot mint. Try again.',
            status: 'error',
            isClosable: true,
          })
        }
      })
    })
    // encode the newSig to be passed into a smart contract contract expecting the format "bytes calldata"
  }

  const { open } = useWeb3Modal()
  const [profile, setProfile] = useState<ProfileType>({
    id: '',
    name: '',
    description: '',
    walletAddresses: [{ address: '0x0', blockchainNetwork: 'ethereum' }],
    image: '',
  })
  const compose = useStore.getState().compose

  const handleNavigate = (uri: string) => {
    router.push(uri)
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, name: e.target.value })
  }

  const handleProfileUpdate = async () => {
    const { name } = profile
    const output = await compose
      .executeQuery(`${MUTATE_CREATE_PROFILE}`, {
        i: {
          content: {
            name,
            image: '',
            description: '',
            walletAddresses: { address: '0x0', blockchainNetwork: 'ethereum' },
          },
        },
      })
      .then((res) => {
        console.log(res)
      })
    return output
  }

  const checkConnected = async () => {
    const session = await loadSession()
    if ((address && status == 'connected') || session) {
      return true
    } else {
      return false
    }
  }

  return (
    <>
      <MobileLayout>
        <Center>
          <Img paddingTop="2.5rem" boxSize="200px" objectFit="cover" src="/image/bagplaceholder.png" />
        </Center>
        <Center>
          <Text fontSize="xs" textAlign="center">
            {DUMMY_TOKEN_DATA.name} #{DUMMY_TOKEN_DATA.id}
          </Text>
        </Center>
        <Center paddingBottom="1rem">
          <VStack>
            <Heading>
              <Input
                textAlign="center"
                variant="unstyled"
                placeholder="Enter Name"
                // value={profile.name}
                value="ENIGMA BAG"
                width="auto"
                onChange={handleNameChange}
                onBlur={handleProfileUpdate}
              />
            </Heading>
            <Tag size="lg" variant="solid" color="white" bg="black">
              ETHDENVER 2023
            </Tag>
          </VStack>
        </Center>
        <VStack spacing={3}>
          {DUMMY_SOCIAL_LINKS.map((data, id) => (
            <CoreButton
              size="sm"
              key={id}
              isLoading={data.type == UrlLinkSocialType.Base && isLoadingMint}
              clickHandler={async () => {
                if (data.type == UrlLinkSocialType.Base && (await checkConnected())) {
                  // write?.()
                  await handleMintPrepare()
                } else if (data.type == UrlLinkSocialType.Base && !(await checkConnected())) {
                  await open()
                } else {
                  handleNavigate(data.link)
                }
              }}>
              {data.title}
            </CoreButton>
          ))}
        </VStack>
        <Center>
          <HStack spacing="5" marginTop="1.0rem" marginBottom="1.5rem">
            <WalletConnectCustom />
            <Text textAlign={'center'} onClick={() => handleNavigate('/settings')} as="sub">
              SETTINGS
            </Text>
            <Text
              textAlign={'center'}
              onClick={() => {
                console.log(mintTokenConfig)
                console.log(error)
                console.log(nonce)
              }}
              as="sub">
              CONSOLE
            </Text>
          </HStack>
        </Center>
      </MobileLayout>
      <Modal onClose={onClose} size={'full'} isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent h="100%">
          <ModalCloseButton />
          <Center h="100%">
            <VStack>
              <Text fontSize="lg">Minting To Your Wallet</Text>
              <Img boxSize="400px" objectFit="cover" src="/image/welcome.jpg" alt="ENIGMA BAG" />
              <Spinner />
            </VStack>
          </Center>
        </ModalContent>
      </Modal>
    </>
  )
}
