import { useEffect, useState } from 'react'

// eslint-disable-next-line import/order

import { Biconomy } from '@biconomy/mexa'
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
import { ExternalProvider } from '@ethersproject/providers'
import * as ethereum from '@web3modal/ethereum'
import { useWeb3Modal } from '@web3modal/react'
import abi from 'ethereumjs-abi'
import { toBuffer } from 'ethereumjs-util'
import { ethers } from 'ethers'
import { BigNumber } from 'ethers'
// import { ExecutionResult } from 'graphql'
import error from 'next/error'
import { useRouter } from 'next/router'
import { getSignatureFromScan } from 'pbt-chip-client/kong'
import { useDebounce } from 'usehooks-ts'
// eslint-disable-next-line import/order
import {
  useAccount,
  useContract,
  useContractRead,
  useContractWrite,
  useFeeData,
  useNetwork,
  usePrepareContractWrite,
  useProvider,
  useSignMessage,
  useSigner,
  useWaitForTransaction,
} from 'wagmi'

// import { getMintWithChipSig } from '@/lib/actions/chip'
// import { generateNonce, siweLogin } from '@/lib/actions/siweUtils'
import * as wagmi from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'

import { CoreButton } from '@/components/shared/CoreButton'
import { UrlLinkSocialType } from '@/out/__generated__/graphql'
import { Profile as ProfileType, Query } from '@/out/__generated__/graphql'
import { abi as PBTabi } from '@/out/AmhoPBTMock.sol/AmhoPBTMock.json'
import {
  BuildForwardTxRequestParams,
  buildForwardTxRequest,
  getBiconomyForwarderConfig,
  getDataToSignForEIP712,
  getDataToSignForPersonalSign,
  getDomainSeperator,
  helperAttributes,
  sendTransaction,
} from '@/scripts/helpers/biconomyForwardHelpers'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { ETH_CHAINS, MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/src/lib/constants'
import { DUMMY_SOCIAL_LINKS, DUMMY_TOKEN_DATA } from '@/src/lib/dummy'
import { useStore } from '@/src/store'
import { formatKeys, generateSession, loadSession, setScanVariables } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

export default function Profile() {
  const provider = useProvider()
  const router = useRouter()
  const toast = useToast()
  const { data: signer } = useSigner()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { chain } = useNetwork()
  const { address } = useAccount()
  const [request, setRequest] = useState<any>()
  const [sig, setSig] = useState<string | null>(null)
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>()
  const [blockNum, setBlockNumber] = useState<number>(0)
  const [nonce, setNonce] = useState<number>(0)
  const [dataSigned, setDataSigned] = useState<string | Uint8Array>()

  const {
    data: signMessageData,
    isSuccess: signMessageSuccess,
    signMessage,
  } = useSignMessage({
    message: dataSigned,
  })

  const { data: txData } = useWaitForTransaction({
    hash: txHash,
    onSuccess(data) {
      console.log('Success', data)
      onClose()
      toast({
        title: 'Mint Success',
        status: 'success',
        isClosable: true,
      })
    },
  })

  useContractRead({
    address: PBT_ADDRESS,
    abi: PBTabi,
    functionName: 'getNonce',
    overrides: { from: address },
    onSuccess(data) {
      const toNum = BigNumber.from(data)
      console.log(toNum.toNumber())
      setNonce(toNum.toNumber())
    },
  })

  useEffect(() => {
    const initSendTransaction = async () => {
      const txHash = await sendTransaction({ userAddress: address, request, sig: signMessageData, signatureType: 'PERSONAL_SIGN' })
      console.log('txHash: ', txHash)
      // @ts-ignore
      setTxHash(txHash)
    }
    signMessageSuccess && initSendTransaction()
  }, [signMessageSuccess])

  useEffect(() => {
    if (sig && blockNum !== 0) {
      // mintWrite?.()
      buildRequestForGasless()
    }
  }, [sig])

  useEffect(() => {
    ;(async () => {
      if (dataSigned) {
        await signMessage?.()
      }
    })()
  }, [dataSigned])

  useEffect(() => {
    ;(async () => {
      if (txData) {
        console.log(txData)
      }
    })()
  }, [txData])

  const buildRequestForGasless = async () => {
    if (chain) {
      const contractInterface = new ethers.utils.Interface(PBTabi)
      const functionSig = contractInterface.encodeFunctionData('mintTokenWithChip', [sig, blockNum, nonce])

      const to = PBT_ADDRESS

      let forwarder = await getBiconomyForwarderConfig(chain.id)

      let forwarderContract = new ethers.Contract(forwarder.address, forwarder.abi, signer as ethers.Signer)

      console.log('forwarderContract', forwarderContract)

      const batchNonce = await forwarderContract.getNonce(address, 0)
      const batchId = 0

      console.log(batchNonce)
      console.log(batchId)

      const requestConfig: BuildForwardTxRequestParams = {
        account: address,
        to,
        gasLimitNum: 200000,
        batchId,
        batchNonce,
        data: functionSig,
        deadline: Math.floor(Date.now() / 1000 + 3600),
      }

      console.log(JSON.stringify(requestConfig))

      const request = await buildForwardTxRequest(requestConfig)
      console.log('request', request)

      const dataToSign = await getDataToSignForPersonalSign(request)
      console.log('dataToSign', dataToSign)

      setRequest(request)
      setDataSigned(dataToSign)
    }
  }

  // const { config: mintTokenConfig, error } = usePrepareContractWrite({
  //   address: PBT_ADDRESS,
  //   abi: PBTabi,
  //   functionName: 'mintTokenWithChip',
  //   args: [sig, blockNum, nonce, { gasLimit: 300000 }],
  //   enabled: !!sig && !!blockNum && !!nonce,
  //   chainId: chain?.id,
  // })

  const resetVariables = () => {
    setSig(null)
    setBlockNumber(0)
  }
  const handleMintPrepare = async () => {
    let keyRaw = ''
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
  }

  // const { open } = useWeb3Modal()

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

  // const checkConnected = async () => {
  //   const session = await loadSession()
  //   if ((address && status == 'connected') || session) {
  //     return true
  //   } else {
  //     return false
  //   }
  // }

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
              // isLoading={data.type == UrlLinkSocialType.Base && isLoadingMint}
              clickHandler={async () => {
                if (data.type == UrlLinkSocialType.Base) {
                  // write?.()
                  await handleMintPrepare()
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
