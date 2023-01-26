import { useEffect, useState } from 'react'

import { Avatar, Box, Card, CardBody, Flex, HStack, Heading, Image, Input, Skeleton, SkeletonCircle, Text, VStack } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import { CoreButton } from '@/components/shared'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/lib/constants'
import { useStore } from '@/src/store'
import { loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'

import { Query } from '../../out/__generated__/graphql'

export default function Found() {
  const compose = useStore.getState().compose
  const router = useRouter()
  const [found, setFound] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [walletAddresses] = useState<{ address: string; blockchainNetwork: 'ethereum' }[]>([{ address: '0x0', blockchainNetwork: 'ethereum' }])

  const submitName = async () => {
    setLoading(true)
    if (found) {
      setLoading(false)
      router.push('/onboarding/profile/setup')
    }
    await createProfile(name, 'desc', 'asd', walletAddresses[0]).then((result: any) => {
      if (result.data.createProfile?.document?.name) {
        const loadedName = result.data.createProfile?.document?.name
        useStore.setState({ name: loadedName })
        setLoading(false)
        router.push('/onboarding/profile/setup')
      }
      console.log('results: ', result)
    })
  }

  useEffect(() => {
    ;(async () => {
      await loadSession()
      const output = await queryProfile()
      if (output.data?.viewer?.profile) {
        setName(output.data?.viewer?.profile?.name)
        setFound(true)
      } else {
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
    return output
  }

  return (
    <MobileLayout>
      <Flex>
        <VStack>
          <Box>
            <Heading marginBottom="0.5em" size="md">
              BAG DETECTED
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
        <VStack marginTop="1em" flex="1" spacing="2" align="stretch">
          {found && (
            <Card border="3px">
              <CardBody>
                <HStack spacing="1.5rem">
                  <Avatar bg="gray.900" />
                  <Text>{name}</Text>
                </HStack>
              </CardBody>
            </Card>
          )}
          <Box>
            {!found && (
              <Input
                onChange={(e) => setName(e.target.value)}
                value={name}
                border="2px"
                size="lg"
                focusBorderColor="brand.900"
                placeholder="What is your name?"
              />
            )}
          </Box>
          <CoreButton isLoading={loading} size="xs" clickHandler={submitName}>
            NEXT
          </CoreButton>
        </VStack>
      </Flex>
    </MobileLayout>
  )
}
