import { useEffect, useState } from 'react'

// eslint-disable-next-line import/order

import {
  Center,
  HStack,
  Heading,
  Img,
  Input,
  Modal,
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
import { ethers } from 'ethers'
import { BigNumber } from 'ethers'
// @ts-ignore
import { parseURLParamsWithoutLatch } from 'halo-chip'
import { useRouter } from 'next/router'
import { getSignatureFromScan } from 'pbt-chip-client/kong'
// eslint-disable-next-line import/order
import { useAccount, useContractRead, useNetwork, useProvider, useSignMessage, useSigner, useWaitForTransaction } from 'wagmi'

import { CoreButton } from '@/components/shared/CoreButton'
// import { UrlLinkSocialType } from '@/out/__generated__/graphql'
// import { Profile as ProfileType, Query } from '@/out/__generated__/graphql'
import { OxString } from '@/lib/types'
// import { abi as PBTabi } from '@/out/AmhoPBTMock.sol/AmhoPBTMock.json'
// import { abi as PBTabi } from '@/out/AmhoPBTMock.sol/AmhoPBTMock.json'
import {
  BuildForwardTxRequestParams,
  buildForwardTxRequest,
  getBiconomyForwarderConfig,
  getDataToSignForPersonalSign,
  sendTransaction,
} from '@/scripts/helpers/biconomyForwardHelpers'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { PBTabi } from '@/src/lib/constants'
import { MUTATE_CREATE_PROFILE } from '@/src/lib/constants'
import { DUMMY_SOCIAL_LINKS, DUMMY_TOKEN_DATA } from '@/src/lib/dummy'
import { useStore } from '@/src/store'
import { formatKeys, setScanVariables } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
// import { PBT_ADDRESS } from 'config'

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
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>(undefined)
  const [blockNum, setBlockNumber] = useState<number | null>(null)
  const [nonce, setNonce] = useState<number | null>(null)
  const [dataSigned, setDataSigned] = useState<string | Uint8Array>()

  const {
    data: signMessageData,
    signMessage,
    isSuccess: signMessageSuccess,
  } = useSignMessage({
    message: dataSigned,
  })
  useEffect(() => {
    const initSendTransaction = async () => {
      const hash = await sendTransaction({ userAddress: address, request, sig: signMessageData, signatureType: 'PERSONAL_SIGN' })
      setTxHash(hash)
    }
    signMessageSuccess && initSendTransaction()
  }, [signMessageSuccess])

  const { isSuccess: finalizedTx } = useWaitForTransaction({
    hash: txHash,
  })

  useEffect(() => {
    if (finalizedTx) {
      onClose()
      toast({
        title: 'Mint Success',
        status: 'success',
        isClosable: true,
      })
    }
  }, [finalizedTx])

  const { data: getNonceData, isSuccess: getNonceSuccess } = useContractRead({
    address: process.env.NEXT_PUBLIC_PBT_ADDRESS as OxString,
    abi: PBTabi,
    functionName: 'getNonce',
    overrides: { from: address },
  })

  // const { writeAsync: mintWrite } = useContractWrite({
  //   mode: 'recklesslyUnprepared',
  //   address: process.env.NEXT_PUBLIC_PBT_ADDRESS as OxString,
  //   abi: PBTabi,
  //   functionName: 'mintTokenWithChip',
  //   args: [sig, blockNum, nonce, { gasLimit: 300000 }],
  // })
  useEffect(() => {
    if (getNonceSuccess) {
      const toNum = BigNumber.from(getNonceData)
      console.log(toNum.toNumber())
      setNonce(toNum.toNumber())
    }
  }, [getNonceSuccess])

  useEffect(() => {
    ;(async () => {
      if (sig && blockNum !== 0) {
        // mintWrite?.()
        await buildRequestForGasless(sig)
      }
    })()
  }, [sig])

  useEffect(() => {
    ;(async () => {
      if (dataSigned) {
        await signMessage?.()
      }
    })()
  }, [dataSigned])

  const buildRequestForGasless = async (sigData?: any) => {
    if (sigData && chain && blockNum && nonce) {
      const contractInterface = new ethers.utils.Interface(PBTabi)

      const functionSig = sigData && contractInterface.encodeFunctionData('mintTokenWithChip', [sigData, blockNum, nonce])

      const to = process.env.NEXT_PUBLIC_PBT_ADDRESS as OxString

      let forwarder = await getBiconomyForwarderConfig(chain.id)

      let forwarderContract = new ethers.Contract(forwarder.address, forwarder.abi, signer as ethers.Signer)

      const batchNonce = await forwarderContract.getNonce(address, 0)
      const batchId = 0

      const requestConfig: BuildForwardTxRequestParams = {
        account: address,
        to,
        gasLimitNum: 300000,
        batchId,
        batchNonce,
        data: functionSig,
        deadline: Math.floor(Date.now() / 1000 + 3600),
      }

      const request = await buildForwardTxRequest(requestConfig)

      const dataToSign = await getDataToSignForPersonalSign(request)

      setRequest(request)
      setDataSigned(dataToSign)
    }
  }

  const resetVariables = () => {
    setSig(null)
    setBlockNumber(0)
  }

  const handleMintPrepareStage = async () => {
    const query = router.query
    let keyRaw = ''
    await provider.getBlock('latest').then(async (block) => {
      setBlockNumber(block.number)
      const { keys } = await parseURLParamsWithoutLatch(query)
      if (address) {
        keyRaw = keys[0].key.slice(2)
        const cpKeyRaw = keyRaw
        getSignatureFromScan({
          chipPublicKey: cpKeyRaw,
          address: address,
          hash: block.hash,
          nonce,
        }).then((data: any) => {
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
  }

  const handleMintPrepare = async () => {
    let keyRaw = ''
    await provider.getBlock('latest').then(async (block) => {
      setBlockNumber(block.number)
      await setScanVariables().then((keys) => {
        if (address && keys && nonce) {
          const { hashedKeysAddresses } = formatKeys(keys)
          keyRaw = hashedKeysAddresses[0].slice(2)
          const cpKeyRaw = keyRaw
          getSignatureFromScan({
            chipPublicKey: cpKeyRaw,
            address: address,
            hash: block.hash,
            nonce,
          }).then((data: any) => {
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

  // const [profile, setProfile] = useState<ProfileType>({
  //   id: '',
  //   name: '',
  //   description: '',
  //   walletAddresses: [{ address: '0x0', blockchainNetwork: 'ethereum' }],
  //   image: '',
  // })
  // const compose = useStore.getState().compose

  const handleNavigate = (uri: string) => {
    router.push(uri)
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  // const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setProfile({ ...profile, name: e.target.value })
  // }

  // const handleProfileUpdate = async () => {
  //   const { name } = profile
  //   const output = await compose
  //     .executeQuery(`${MUTATE_CREATE_PROFILE}`, {
  //       i: {
  //         content: {
  //           name,
  //           image: '',
  //           description: '',
  //           walletAddresses: { address: '0x0', blockchainNetwork: 'ethereum' },
  //         },
  //       },
  //     })
  //     .then((res) => {
  //       console.log(res)
  //     })
  //   return output
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
        <Center>
          <VStack>
            <Heading>
              <Input
                textAlign="center"
                variant="unstyled"
                placeholder="Enter Name"
                // value={profile.name}
                value="ENIGMA BAG"
                width="auto"
                // onChange={handleNameChange}
                // onBlur={handleProfileUpdate}
              />
            </Heading>
            <Tag size="lg" variant="solid" color="white" bg="black">
              ETHDENVER 2023
            </Tag>
          </VStack>
        </Center>
        <Center paddingTop="2rem" paddingBottom="2.0rem">
          <HStack spacing="5">
            <WalletConnectCustom />
          </HStack>
        </Center>
        <VStack spacing={3}>
          {DUMMY_SOCIAL_LINKS.map((data, id) => (
            <CoreButton
              size="sm"
              key={id}
              clickHandler={async () => {
                if (data.priority == true) {
                  if (process.env.NODE_ENV === 'development') {
                    await handleMintPrepare()
                  } else {
                    await handleMintPrepareStage()
                  }
                } else {
                  handleNavigate(data.link)
                }
              }}>
              {data.title}
            </CoreButton>
          ))}
          <Center paddingTop="1.0rem" paddingBottom="2.0rem">
            <Text textAlign={'center'} onClick={() => handleNavigate('/settings')} as="sub">
              SETTINGS
            </Text>
          </Center>
        </VStack>
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
