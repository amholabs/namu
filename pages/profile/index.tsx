import { useEffect, useState } from 'react'

// eslint-disable-next-line import/order
import { Center, HStack, Heading, Image, Input, Tag, Text, VStack, useToast } from '@chakra-ui/react'

import { useWeb3Modal } from '@web3modal/react'
import { ethers } from 'ethers'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'
import { useDebounce } from 'usehooks-ts'
import { useAccount, useContractWrite, useNetwork, usePrepareContractWrite, useSignMessage } from 'wagmi'

import { getMintWithChipSig } from '@/lib/actions/chip'
import { siweLogin } from '@/lib/actions/siweUtils'
import { UrlLinkSocialType } from '@/out/__generated__/graphql'
import { Profile as ProfileType, Query } from '@/out/__generated__/graphql'
import { CoreButton } from '@/src/components/shared'
import WalletConnectCustom from '@/src/components/WalletConnectCustom'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/src/lib/constants'
import { DUMMY_SOCIAL_LINKS, DUMMY_TOKEN_DATA } from '@/src/lib/dummy'
import { useStore } from '@/src/store'
import { loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'
import { PBT_ADDRESS } from 'config'

import { abi } from '@/out/AmhoPBTMock.sol/AmhoPBTMock.json'

export default function Profile() {
  const router = useRouter()
  const toast = useToast()
  const { address, status } = useAccount()
  const [sig, setSig] = useState<string | null>(null)
  const [blockNumber, setBlockNumber] = useState<number>(0)

  const debounceSig = useDebounce(sig, 1000)
  const debounceBlockNum = useDebounce(blockNumber, 1000)

  const { chain } = useNetwork()
  const { open } = useWeb3Modal()
  const { signMessageAsync } = useSignMessage()
  const { config } = usePrepareContractWrite({
    address: PBT_ADDRESS,
    abi,
    functionName: 'mintTokenWithChip',
    args: [debounceSig, debounceBlockNum],
    enabled: !!debounceSig && !!debounceBlockNum,
    chainId: chain?.id,
  })
  const { write } = useContractWrite(config)
  const [profile, setProfile] = useState<ProfileType>({
    id: '',
    name: '',
    description: '',
    walletAddresses: [{ address: '0x0', blockchainNetwork: 'ethereum' }],
    image: '',
  })
  const compose = useStore.getState().compose
  const queryProfile = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
    const output = compose.executeQuery(QUERY_PROFILE_VIEWER)
    return output
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSettingClick = async () => {
    const provider = new ethers.providers.JsonRpcProvider(`https://eth-goerli.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY_goeETH}`)
    const blockNum = await provider.getBlock('latest').then((block) => block.number)
    const blockHash = await provider.getBlock('latest').then((block) => block.hash)
    setBlockNumber(blockNum)
    if (address) {
      // WHY
      const newSig = await getMintWithChipSig(address, blockHash)
      // encode the newSig to be passed into a smart contract contract expecting the format "bytes calldata"
      if (newSig) {
        setSig(newSig)
      } else {
        toast({
          title: 'Scanning Failed. Try again.',
          status: 'error',
          isClosable: true,
        })
      }
    }
  }

  const handleNavigate = (uri: string) => {
    router.push(uri)
  }

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleCreateMessage = async () => {
    try {
      await siweLogin({ address, chain, signMessageAsync })
    } catch (error) {
      console.error(error)
    }
  }

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

  useEffect(() => {
    ;(async () => {
      const wait = await checkConnected()
      if (wait) {
        await loadSession()
        useStore.setState({ address })
        const output = await queryProfile()
        console.log(output)
        if (output.data?.viewer?.profile) {
          setProfile(output.data?.viewer?.profile)
        }
      }
    })()
  }, [status])
  return (
    <MobileLayout>
      <Center>
        <Image paddingTop="2.5rem" boxSize="200px" objectFit="cover" src="/image/bagplaceholder.png" />
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
              value={profile.name}
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
            clickHandler={async () => {
              if (data.type == UrlLinkSocialType.Base && (await checkConnected())) {
                write?.()
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
          {/* <Text textAlign={'center'} onClick={handleSettingNavigate} as="sub"> */}
          <Text textAlign={'center'} onClick={() => handleNavigate('/settings')} as="sub">
            SETTINGS
          </Text>
        </HStack>
      </Center>
    </MobileLayout>
  )
}
