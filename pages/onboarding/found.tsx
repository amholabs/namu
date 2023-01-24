import { useState } from 'react'

import { Box, Container, Flex, Heading, Image, Input, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { useStore } from '@/src/store'

export default function Found() {
  const router = useRouter()
  const [name, setName] = useState<string>('')
  const submitName = () => {
    useStore.setState({ name })
    router.push('/onboarding/profile/setup')
  }
  return (
    <MobileLayout>
      <Flex>
        <VStack>
          <Box>
            <Heading marginBottom="0.5em" size="2xl">
              Bag Found
            </Heading>
            <Text fontSize="lg">COLLECTION</Text>
            <Text fontSize="xs" fontWeight="bold">
              AMHO ENIGMA F/W 2023
            </Text>
          </Box>
        </VStack>
        <Box marginLeft={'1em'}>
          <Image boxSize="150px" objectFit="cover" src="/image/bagplaceholder.png" />
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
          <CoreButton isLoading={false} size="sm" clickHandler={submitName}>
            NEXT
          </CoreButton>
        </VStack>
      </Flex>
    </MobileLayout>
  )
}
