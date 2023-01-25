import { useState } from 'react'

import { Box, Heading, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'

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
    <MobileLayout>
      <Box paddingBottom="1rem" justifyContent="start">
        <Heading paddingBottom="1rem" size="md">
          CONGRATULATIONS ON YOUR NEW PURCHASE!
        </Heading>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
        <Text fontSize="sm">Let's start registration. Click NEXT to continue.</Text>
      </Box>
      <CoreButton isLoading={loading} size="xs" clickHandler={handleClick}>
        NEXT
      </CoreButton>
    </MobileLayout>
  )
}
