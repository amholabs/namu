import { Box, Heading, Text } from '@chakra-ui/react'
import { ExecutionResult } from 'graphql'
import { useRouter } from 'next/router'

import MobileLayout from '@/components/layout/MobileLayout'
import { CoreButton } from '@/components/shared'
import { MUTATE_CREATE_PROFILE, QUERY_PROFILE_VIEWER } from '@/lib/constants'
import { useStore } from '@/src/store'

export default function Complete() {
  const router = useRouter()
  const nextPage = (uri: string) => {
    router.push(uri)
  }
  const handleClick = async () => {
    // TODO: Save the complete profile
    nextPage('/onboarding/profile/complete')
  }
  return (
    <MobileLayout>
      <Box justifyContent="start">
        <Heading size="2xl">Registration Complete!</Heading>
        <Text fontSize="sm">Save your profile by tapping your bag</Text>
      </Box>
      {/* eslint-disable-next-line react/no-unescaped-entities */}
      <CoreButton size="sm" clickHandler={handleClick}>
        SAVE
      </CoreButton>
    </MobileLayout>
  )
}
