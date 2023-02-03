import { useEffect, useState } from 'react'

import { Center, HStack, Heading, Image, Input, Tag, Text, VStack } from '@chakra-ui/react'
import { useWeb3Modal } from '@web3modal/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'
import { useAccount } from 'wagmi'

import EnsName from '@/app/EnsName'
import { CoreButton } from '@/components/shared'
import WalletConnectCustom from '@/components/WalletConnectCustom'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/lib/constants'
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

  const handleNavigate = (uri: string) => {
    router.push(uri)
  }

  const handleSettingNavigate = () => {
    const session = loadSession()
    if (session) {
      handleNavigate('/settings')
    }
  }

  // function handling onChange event in input and setting it to address value in profile
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
      <Center marginTop="1rem" paddingBottom="1rem">
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
              handleNavigate(data.link)
            }
          }}>
          {data.title}
        </CoreButton>
      ))}
      <Center>
        <HStack spacing="5" marginTop="1.0rem" marginBottom="1.5rem">
          <WalletConnectCustom />
          <Text textAlign={'center'} onClick={handleSettingNavigate} as="sub">
            SETTINGS
          </Text>
        </HStack>
      </Center>
    </MobileLayout>
  )
}
