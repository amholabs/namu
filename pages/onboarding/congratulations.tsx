import { Box, Heading, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'

export default function Congratulations() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  return (
    <MobileLayout>
      <Box justifyContent="start">
        <Heading size="2xl">Congratulations on your purchase!</Heading>
      </Box>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text fontSize="3xl">Let's start registration</Text>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <Text fontSize="md">Click "NEXT" to start</Text>
      <CoreButton
        size="sm"
        clickHandler={() => {
          nextPage('/onboarding/tap')
        }}>
        NEXT
      </CoreButton>
    </MobileLayout>
  )
}
