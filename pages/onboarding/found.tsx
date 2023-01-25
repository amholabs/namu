import { useEffect, useState } from 'react'

import { Box, Flex, Heading, Image, Input, Text, VStack } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/lib/constants'
import { useStore } from '@/src/store'
import { loadSession } from '@/src/utils/scan'
import { Query } from 'out/__generated__/graphql'

export default function Found() {
  const compose = useStore.getState().compose
  const router = useRouter()
  const [name, setName] = useState<string>('default name')
  // const [image, setImage] = useState<string>('default image')
  // const [description, setDescription] = useState<string>('default description')
  const [loading, setLoading] = useState<boolean>(false)
  const [walletAddresses] = useState<{ address: string; blockchainNetwork: 'ethereum' }[]>([
    { address: '0x0', blockchainNetwork: 'ethereum' },
  ])

  const submitName = async () => {
    setLoading(true)
    await createProfile(name, 'desc', 'asd', walletAddresses[0]).then(() => {
      setLoading(false)
      useStore.setState({ name })
      router.push('/onboarding/profile/setup')
    })
  }

  useEffect(() => {
    // eslint-disable-next-line prettier/prettier
    ;(async () => {
      await loadSession()
      const output = await queryProfile()
      if (output.data?.viewer?.profile) {
        setName(output.data?.viewer?.profile?.name)
        // setImage(output.data?.viewer?.profile?.image)
        // setDescription(output.data?.viewer?.profile?.description)
      } else {
        console.log(output)
      }
    })()
  }, [])

  // TODO: Check if profile exists, if not then create one
  // eslint-disable-next-line
  const queryProfile = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
    const output = compose.executeQuery(QUERY_PROFILE_VIEWER)
    return output
  }

  // eslint-disable-next-line
  const createProfile = async (
    name: string,
    image: string,
    description: string,
    walletAddresses: { address: string; blockchainNetwork: 'ethereum' }
  ) => {
    const output = await compose.executeQuery(`${MUTATE_CREATE_PROFILE}`, {
      i: {
        content: {
          name,
          image,
          description,
          walletAddresses: walletAddresses,
        },
      },
    })
    console.log(output)
  }

  return (
    <MobileLayout>
      <Flex>
        <VStack>
          <Box>
            <Heading marginBottom="0.5em" size="md">
              BAG FOUND
            </Heading>
            <Text fontSize="sm">COLLECTION</Text>
            <Text fontSize="xs" fontWeight="bold">
              AMHO ENIGMA F/W 2023
            </Text>
          </Box>
        </VStack>
        <Box marginLeft={'1em'}>
          <Image boxSize="120px" objectFit="cover" src="/image/bagplaceholder.png" />
        </Box>
      </Flex>
      <Flex>
        <VStack marginTop="1em" flex="1" spacing="4" align="stretch">
          {/* <Box>
            <Text fontSize="lg">What is your name?</Text>
          </Box> */}
          <Box>
            <Input onChange={(e) => setName(e.target.value)} border="2px" size="lg" focusBorderColor="brand.900" placeholder="What is your name?" />
          </Box>
          <CoreButton isLoading={loading} size="xs" clickHandler={submitName}>
            NEXT
          </CoreButton>
          <h1>{name}</h1>
        </VStack>
      </Flex>
    </MobileLayout>
  )
}
