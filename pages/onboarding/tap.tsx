import { useState } from 'react'

import { Box, Heading, Text, Toast, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { generateSession } from '@/src/utils/scan'

// const genSession = async () => {
//   await generateSession().then((data) => {
//     queryProfiles()
//     setDID(data.id)
//   })
// }
export default function Tap() {
  const toast = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleGenerateSession = async () => {
    setLoading(true)
    try {
      const session = await generateSession()
      if (session) {
        setLoading(false)
        router.push('/onboarding/found')
      } else {
        toast({
          title: 'Scanning Failed. Try again.',
          status: 'error',
          isClosable: true,
        })
      }
    } catch (error) {}
  }
  return (
    <MobileLayout>
      <Box justifyContent="start">
        {/* eslint-disable-next-line */}
        <Heading paddingBottom="0.5rem" size="md">
          FIRST, VERIFY YOUR BAG
        </Heading>
      </Box>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text paddingBottom="1rem" fontSize="sm">
        Click VERIFY then tap your bag. It will ask you to tap twice.
      </Text>
      <CoreButton isLoading={loading} size="xs" clickHandler={handleGenerateSession}>
        VERIFY
      </CoreButton>
    </MobileLayout>
  )
}
