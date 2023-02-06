import { Box, Heading, Text, VStack } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import { CoreButton } from '@/src/components/shared'
import MobileLayout from 'app/MobileLayout'

export default function Complete() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  const handleClick = async () => {
    // TODO: Save the complete profile
    nextPage('/profile')
  }
  return (
    <MobileLayout>
      <Heading size="2xl">Registration Complete!</Heading>
      <VStack marginTop="auto" spacing={5} marginBottom={5}>
        <Text fontSize="sm">Save your profile by tapping your bag</Text>
        {/* eslint-disable-next-line react/no-unescaped-entities */}
      </VStack>
      <CoreButton size="sm" clickHandler={handleClick}>
        SAVE
      </CoreButton>
    </MobileLayout>
  )
}
