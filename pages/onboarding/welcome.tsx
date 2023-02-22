import { useState } from 'react'

import { Box, Button, Heading, Spacer, Text, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { CoreButton } from '@/components/shared/CoreButton'
import { TextButton } from '@/components/shared/TextButton'
import MobileLayout from 'app/MobileLayout'

export default function Congratulations() {
  const router = useRouter()
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false)
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  // eslint-disable-next-line
  const handleClick = () => {
    setLoading(true)
    nextPage('/onboarding/verify')
  }
  return (
    <>
      {/* <Box padding="2rem" height="100vh" width="100%" display="flex" flexDirection="column" flex={1}> */}
      <MobileLayout
        backgroundStyles="linear-gradient(to bottom, rgba(0, 0, 0, 0.69) 0%, rgba(0, 0, 0, 0.5) 100%),"
        backgroundImageUrl="/image/welcome.jpg">
        <Heading color="white" paddingTop="2rem" paddingBottom="1rem" size="3xl" lineHeight={'3rem'}>
          {/* eslint-disable-next-line react/no-unescaped-entities */}
          Welcome.
        </Heading>
        <Spacer />
        <Text fontWeight="bold" fontSize="xl" color="white" paddingBottom="1.5rem">
          Congratulations on your purchase.
        </Text>
        <Text fontWeight="bold" fontSize="xl" color="white">
          {/* eslint-disable-next-line */}
          Let's start setting up your profile.
        </Text>
        <Spacer />
        {/* <Box paddingBottom="1rem" marginTop="auto">
          <Text fontSize="sm">Click NEXT to continue.</Text>
        </Box> */}
        {/* <CoreButton isLoading={loading} size="xs" clickHandler={handleClick} color={'white'}> */}
        <TextButton color="white" size="sm" clickHandler={handleClick}>
          Get Started
        </TextButton>
        {/* </CoreButton> */}
      </MobileLayout>
      {/* </Box> */}
      {/* <MobileLayout></MobileLayout> */}
    </>
  )
}
