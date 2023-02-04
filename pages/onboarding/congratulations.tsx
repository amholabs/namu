import { useState } from 'react'

import { Box, Heading, Spacer, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { CoreButton } from '@/components/shared'
import MobileLayout from 'app/MobileLayout'

export default function Congratulations() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  const handleClick = () => {
    setLoading(true)
    nextPage('/onboarding/tap')
  }
  return (
    <>
      <Box padding="2rem" height="100vh" width="100%" display="flex" flexDirection="column" flex={1}>
        <Heading paddingBottom="1rem" size="2xl" lineHeight={'3rem'}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Let's start setting up your bag.
        </Heading>
        <Spacer />
        <Box paddingBottom="1rem" marginTop="auto">
          <Text fontSize="sm">Click NEXT to continue.</Text>
        </Box>
        <CoreButton isLoading={loading} size="xs" clickHandler={handleClick}>
          NEXT
        </CoreButton>
      </Box>
      {/* <MobileLayout></MobileLayout> */}
    </>
  )
}
