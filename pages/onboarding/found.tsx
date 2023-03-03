import { useEffect, useState } from 'react'

import { Avatar, Box, Card, CardBody, Center, Flex, HStack, Heading, Image, Input, Spacer, Text, VStack } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import { CoreButton } from '@/components/shared/CoreButton'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/src/lib/constants'
import { useStore } from '@/src/store'
import { loadSession } from '@/src/utils/scan'
import MobileLayout from 'app/MobileLayout'

// import { Query } from '../../out/__generated__/graphql'

export default function Found() {
  // const compose = useStore.getState().compose
  // const router = useRouter()
  const [no, setNo] = useState<boolean>(false)
  // const [found, setFound] = useState<boolean>(false)
  const [name, setName] = useState<string>('')
  // const [image, setImage] = useState<string>('')
  // const [desc, setDesc] = useState<string>('')
  // const [loading, setLoading] = useState<boolean>(false)
  // const [walletAddresses] = useState<{ address: string; blockchainNetwork: 'ethereum' }[]>([{ address: '0x0', blockchainNetwork: 'ethereum' }])

  // const submitName = async () => {
  //   setLoading(true)
  //   if (found) {
  //     setLoading(false)
  //     router.push('/onboarding/profile/benefits')
  //   }
  //   await createProfile(name, desc, image, walletAddresses[0]).then((result: any) => {
  //     if (result.data?.createProfile?.document?.name) {
  //       const loadedName = result.data.createProfile?.document?.name
  //       useStore.setState({ name: loadedName })
  //       setLoading(false)
  //       router.push('/onboarding/profile/benefits')
  //     }
  //     console.log('results: ', result)
  //   })
  // }

  // useEffect(() => {
  //   ;(async () => {
  //     await loadSession()
  //     // const output = await queryProfile()
  //     if (output.data?.viewer?.profile) {
  //       setName(output.data?.viewer?.profile?.name)
  //       setImage(output.data?.viewer?.profile?.image)
  //       setDesc(output.data?.viewer?.profile?.description)
  //       setFound(true)
  //     } else {
  //     }
  //   })()
  // }, [])

  // TODO: Check if profile exists, if not then create one
  // eslint-disable-next-line
  // const queryProfile = async (): Promise<ExecutionResult<Pick<Query, 'viewer'>>> => {
  //   // const output = compose.executeQuery(QUERY_PROFILE_VIEWER)
  //   // return output
  // }

  // eslint-disable-next-line
  // const createProfile = async (
  //   name: string,
  //   image: string,
  //   description: string,
  //   walletAddresses: { address: string; blockchainNetwork: 'ethereum' }
  // ) => {
  //   const output = await compose.executeQuery(`${MUTATE_CREATE_PROFILE}`, {
  //     i: {
  //       content: {
  //         name,
  //         image,
  //         description,
  //         walletAddresses: walletAddresses,
  //       },
  //     },
  //   })
  //   return output
  // }

  return (
    <MobileLayout>
      <Heading>Enigma Bag</Heading>
      <Text fontWeight="bold">1/41</Text>
      <Center>
        <Image boxSize="200px" objectFit="cover" src="/image/bagplaceholder.png" />
      </Center>
      <VStack marginTop="1em" flex="1" align="stretch">
        <HStack display="flex" spacing={16}>
          <VStack flex="1" alignItems="start">
            <Text as="sub">Collection</Text>
            <Text fontSize="xs">ENIGMA F/W 2023</Text>
          </VStack>
          <VStack flex="1" alignItems="start">
            <Text as="sub">Color</Text>
            <Text fontSize="xs">Dark Black</Text>
          </VStack>
        </HStack>
      </VStack>
      <VStack flex="1" align="stretch">
        <HStack display="flex" spacing={16}>
          <VStack flex="1" alignItems="start">
            <Text as="sub">Models</Text>
            <Text fontSize="xs">@chinachipling</Text>
          </VStack>
          <VStack flex="1" alignItems="start">
            <Text as="sub">Manufacturer</Text>
            <Text fontSize="xs">DLFCTRY</Text>
          </VStack>
        </HStack>
      </VStack>
      <VStack flex="1" align="stretch">
        <HStack display="flex" spacing={16}>
          <VStack flex="1" alignItems="start">
            <Text as="sub">Token Id</Text>
            <Text fontSize="xs">1</Text>
          </VStack>
          <VStack flex="1" alignItems="start">
            <Text as="sub">Owner</Text>
            <Text fontSize="xs">You</Text>
          </VStack>
        </HStack>
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
            {/* <CoreButton isLoading={loading} size="xs" clickHandler={submitName}>
              CONFIRM
            </CoreButton> */}
          </VStack>
        ) : (
          <Flex alignItems="center" marginBottom="3rem">
            <Text fontSize="xs">Owner detected is 0xabc... you?</Text>
            <Spacer />
            <HStack spacing={5}>
              {/* <Text fontSize="sm" onClick={submitName} _hover={{ textDecoration: 'underline' }}>
                YES
              </Text> */}
              <Text fontSize="sm" onClick={() => setNo(true)} _hover={{ textDecoration: 'underline' }}>
                NO
              </Text>
            </HStack>
          </Flex>
        )}
      </Box>
    </MobileLayout>
  )
}
