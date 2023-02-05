import { useState } from 'react'

import { Box, Heading, Text, Toast, useToast } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/app/MobileLayout'
import { CoreButton } from '@/src/components/shared'
import { generateSession } from '@/src/utils/scan'

// const genSession = async () => {
//   await generateSession().then((data) => {
//     queryProfiles()
//     setDID(data.id)
//   })
// }
export default function Verify() {
  const toast = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const handleGenerateSession = async () => {
    setLoading(true)
    try {
      const session = await generateSession()
      if (session) {
        router.push('/onboarding/found')
      } else {
        setLoading(false)
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
      {/* eslint-disable-next-line */}
      <Heading paddingBottom="1rem" size="2xl" lineHeight={'3rem'}>
        FIRST, VERIFY YOUR BAG
      </Heading>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text paddingBottom="1rem" fontSize="sm" marginTop="auto">
        Click VERIFY then tap your bag. It will ask you to tap twice.
      </Text>
      <CoreButton isLoading={loading} size="xs" clickHandler={handleGenerateSession}>
        VERIFY
      </CoreButton>
    </MobileLayout>
  )
}
