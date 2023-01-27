import { useEffect, useState } from 'react'

import { Center, HStack, Heading, Image, Text, VStack, Tag } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import { CoreButton } from '@/components/shared'
import WalletConnectCustom from '@/components/WalletConnectCustom'
import { QUERY_PROFILE_VIEWER } from '@/lib/constants'
import { DUMMY_SOCIAL_LINKS, DUMMY_TOKEN_DATA } from '@/lib/dummy'
import { UrlLinkSocialType } from '@/out/__generated__/graphql'
import { Profile as ProfileType, Query } from '@/out/__generated__/graphql'
import { useStore } from '@/src/store'
import { scan } from '@/src/utils/scan'
import { loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'

export default function Profile() {
  const router = useRouter()
  const { address, status } = useAccount()
  const { open } = useWeb3Modal()
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
  const handleClick = (uri: string) => {
    router.push(uri)
  }

  const checkConnected = async () => {
    if (address && status == 'connected') {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    ;(async () => {
      await loadSession()
      const output = await queryProfile()
      if (output.data?.viewer?.profile) {
        setProfile(output.data?.viewer?.profile)
      }
    })()
  }, [])
  if (!profile) return null
  return (
    <MobileLayout>
      <Center>
        <Text fontSize="xs" textAlign="center" marginTop="1.5rem">
          {DUMMY_TOKEN_DATA.name} #{DUMMY_TOKEN_DATA.id}
        </Text>
      </Center>
      <Center>
        <Image boxSize="200px" objectFit="cover" src="/image/bagplaceholder.png" />
      </Center>
      <Center marginTop="1rem" paddingBottom="1rem">
        <VStack>
          <Heading textAlign="center">
            <h1>{profile.name}</h1>
          </Heading>
          <Tag size="lg" variant="solid" color="white" bg="black">
            AT ETHDENVER 2023
          </Tag>
        </VStack>
      </Center>
      {DUMMY_SOCIAL_LINKS.map((data, id) => (
        <CoreButton
          size="sm"
          key={id}
          clickHandler={async () => {
            if (data.type == UrlLinkSocialType.Base && (await checkConnected())) {
              await scan()
            } else if (data.type == UrlLinkSocialType.Base && !(await checkConnected())) {
              await open()
            } else {
              handleClick(data.link)
            }
          }}>
          {data.title}
        </CoreButton>
      ))}
      <Center>
        <HStack spacing="5" marginTop="1.0rem" marginBottom="1.5rem">
          <WalletConnectCustom />
          <Text textAlign={'center'} onClick={scan} as="sub">
            SETTINGS
          </Text>
        </HStack>
      </Center>
    </MobileLayout>
  )
}
