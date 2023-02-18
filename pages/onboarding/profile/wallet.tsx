import { HStack, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/app/MobileLayout'
import { TextButton } from '@/components/shared/TextButton'

export default function Wallet() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  return (
    <>
      <MobileLayout>
        <Heading marginTop="auto">Crypto Wallet?</Heading>
        <HStack paddingTop={2}>
          <Text onClick={() => {}} as="u" fontWeight="bold">
            Connect
          </Text>
          <Text as="span">Your Wallet</Text>
        </HStack>
        <TextButton clickHandler={() => nextPage('/onboarding/profile/username')}>Next</TextButton>
      </MobileLayout>
    </>
  )
}
