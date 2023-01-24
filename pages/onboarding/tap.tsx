import { Box, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { generateSession } from '@/src/utils/scan'

CoreButton
export default function Tap() {
  const router = useRouter()
  const handleGenerateSession = async () => {
    const session = await generateSession()
    if (session) {
      router.push('/onboarding/found')
    }
    console.log(session)
  }
  return (
    <MobileLayout>
      <Box justifyContent="start">
        <Heading size="2xl">Tap your bag</Heading>
      </Box>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text fontSize="3xl">Click "Tap" then tap your bag</Text>
      <Text fontSize="md">It will ask you to scan twice</Text>
      <CoreButton size="sm" clickHandler={handleGenerateSession}>
        TAP
      </CoreButton>
    </MobileLayout>
  )
}
