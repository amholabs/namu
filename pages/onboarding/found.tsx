import { useEffect, useState } from 'react'

import { Avatar, Box, Card, CardBody, Center, Flex, HStack, Heading, Image, Input, Spacer, Text, VStack } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/lib/constants'
import { CoreButton } from '@/src/components/shared'
import { useStore } from '@/src/store'
import { loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'

import { Query } from '../../out/__generated__/graphql'

export default function Found() {
  const compose = useStore.getState().compose
  const router = useRouter()
  const [no, setNo] = useState<boolean>(false)
  const [found, setFound] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  const [image, setImage] = useState<string>('')
  const [desc, setDesc] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [walletAddresses] = useState<{ address: string; blockchainNetwork: 'ethereum' }[]>([{ address: '0x0', blockchainNetwork: 'ethereum' }])

  const submitName = async () => {
    setLoading(true)
    if (found) {
      setLoading(false)
      router.push('/onboarding/profile/complete')
    }
    await createProfile(name, desc, image, walletAddresses[0]).then((result: any) => {
      if (result.data?.createProfile?.document?.name) {
        const loadedName = result.data.createProfile?.document?.name
        useStore.setState({ name: loadedName })
        setLoading(false)
        router.push('/onboarding/profile/complete')
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
        setImage(output.data?.viewer?.profile?.image)
        setDesc(output.data?.viewer?.profile?.description)
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
      <Center padding="3rem">
        <Image boxSize="300px" objectFit="cover" src="/image/bagplaceholder.png" />
      </Center>
      <VStack marginTop="1em" flex="1" spacing="2" align="stretch">
        <Flex>
          <Box>
            <Text>Collection</Text>
          </Box>
          <Spacer />
          <Box>
            <Text>AMHO F/W 2023</Text>
          </Box>
        </Flex>
        <Flex>
          <Box>
            <Text>Previous Owner</Text>
          </Box>
          <Spacer />
          <Box>
            <Text>0xabc...dfg</Text>
          </Box>
        </Flex>
        {/* {found && (
            <Card border="3px">
              <CardBody>
                <HStack spacing="1.5rem">
                  <Avatar bg="gray.900" />
                  <Text>{name}</Text>
                </HStack>
              </CardBody>
            </Card>
          )} */}
      </VStack>
      <Box marginTop="auto">
        {no ? (
          <VStack spacing={5} align="stretch">
            <Input
              onChange={(e) => setName(e.target.value)}
              value={name}
              border="3px"
              size="lg"
              focusBorderColor="brand.900"
              placeholder="What is your name?"
            />
            <CoreButton isLoading={loading} size="xs" clickHandler={submitName}>
              CONFIRM
            </CoreButton>
          </VStack>
        ) : (
          <Flex>
            <Text>New owner detected is 0xabc... you?</Text>
            <Spacer />
            <HStack spacing={5}>
              <Text onClick={submitName} _hover={{ textDecoration: 'underline' }}>
                YES
              </Text>
              <Text onClick={() => setNo(true)} _hover={{ textDecoration: 'underline' }}>
                NO
              </Text>
            </HStack>
          </Flex>
        )}
      </Box>
    </MobileLayout>
  )
}
